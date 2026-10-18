<style scoped>
/* =============================================
   授权确认：一张待签的授权纸
   ============================================= */

.authc {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - var(--nav-h) - 260px);
  padding: var(--gap-6) 0;
}

.authc-sheet {
  width: 100%;
  max-width: 470px;
  border: 1px solid var(--glass-line);
  border-radius: var(--r-lg);
  background: var(--glass);
  box-shadow: var(--glass-shadow), var(--glass-inner);
  backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-sat));
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-sat));
  padding: var(--gap-6);
}

.authc-top {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: var(--gap-4);
  border-bottom: 1px solid var(--rule);
  margin-bottom: var(--gap-5);
}

.authc-top h2 {
  font-family: var(--font-display);
  font-size: var(--text-md);
  font-weight: 600;
  letter-spacing: 0.06em;
  margin: 0;
}

.authc-top p {
  margin: 2px 0 0;
  font-size: var(--text-xs);
  color: var(--ink-3);
}

.authc-app {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: var(--ink);
  margin: 0 0 var(--gap-2);
  word-break: break-all;
}

.authc-desc {
  margin: 0 0 var(--gap-5);
  font-size: var(--text-sm);
  line-height: 1.8;
  color: var(--ink-2);
}

.authc-perms {
  border-top: 1px solid var(--rule);
  margin-bottom: var(--gap-5);
}

.perm-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 0;
  border-bottom: 1px solid var(--rule);
  font-size: var(--text-sm);
  color: var(--ink-2);
}

.perm-row i {
  font-size: 12px;
  color: var(--seal);
}

.authc-actions {
  display: flex;
  gap: var(--gap-2);
}

.authc-actions .btn {
  flex: 1;
}

.authc-note {
  margin: var(--gap-4) 0 0;
  font-size: var(--text-2xs);
  line-height: 1.8;
  color: var(--ink-3);
  letter-spacing: 0.02em;
}
</style>

<template>
  <div class="authc ink-in">
    <!-- 未登录 -->
    <div v-if="!isLoggedIn" class="authc-sheet">
      <div class="authc-top">
        <span class="seal seal--sm">权</span>
        <div>
          <h2>需要先登录</h2>
          <p>授权前请确认当前账号</p>
        </div>
      </div>
      <p class="authc-desc">这个应用希望读取你的账号信息，登录之后才能继续。</p>
      <div class="authc-actions">
        <RouterLink to="/login" class="btn btn--solid">去登录</RouterLink>
      </div>
    </div>

    <!-- 已登录 -->
    <div v-else class="authc-sheet">
      <div class="authc-top">
        <span class="seal seal--sm">权</span>
        <div>
          <h2>授权确认</h2>
          <p>请核对下方信息</p>
        </div>
      </div>

      <p class="authc-app">{{ appName }}</p>
      <p v-if="appDesc" class="authc-desc">{{ appDesc }}</p>

      <div class="authc-perms">
        <div class="perm-row"><i class="bi bi-check2"></i> 读取你的基本资料</div>
        <div class="perm-row"><i class="bi bi-check2"></i> 读取你发布的文章信息</div>
      </div>

      <div class="authc-actions">
        <button class="btn" @click="handleCancel">取消</button>
        <button class="btn btn--solid" :disabled="authorizing" @click="handleAuthorize">
          {{ authorizing ? '授权中…' : '同意授权' }}
        </button>
      </div>

      <p class="authc-note">同意后你会被带回应用。你随时可以收回授权。</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import {RouterLink, useRoute, useRouter} from 'vue-router'
import {toast} from '@/utils/utils'
import service, {loadUser} from '@/axios'

const authorizing = ref(false)
const isLoggedIn = ref(false)
const appName = ref('第三方应用')
const appDesc = ref('')
const router = useRouter()
const route = useRoute()
const appId = ref('')
const redirectUri = ref('')

onMounted(async () => {
  const query = route.query
  appId.value = query.app_id as string || ''
  redirectUri.value = query.redirect_uri as string || ''
  if (appId.value) {
    service.get("/auth/app/info/app?app_id=" + appId.value).then((res: any) => {
      appName.value = res.app_name; appDesc.value = res.app_desc
    })
  }
  if (!appId.value || !redirectUri.value) {
    toast('缺少必要的授权参数', 'error')
    router.push('/')
    return
  }

  isLoggedIn.value = await loadUser()
  if (!isLoggedIn.value) {
    toast('请先登录', 'error')
    router.push('/login?redirect_uri=' + redirectUri.value + '&app_id=' + appId.value)
  }
})

const handleAuthorize = () => {
  if (!appId.value || !redirectUri.value) { toast('缺少必要的授权参数', 'error'); return }
  authorizing.value = true
  service.post('/auth/app/authorize?type=u&app_id=' + appId.value + '&redirect_uri=' + redirectUri.value)
    .then((res: any) => {
      if (res.code === 200) { toast('授权成功', 'success'); setTimeout(() => { window.location.href = res.data }, 1000) }
      else { toast(res.msg || '授权失败', 'error') }
    }).catch((err: any) => { toast(err.msg || '授权失败', 'error') })
    .finally(() => { authorizing.value = false })
}

const handleCancel = () => { toast('授权已取消', 'info'); router.push('/') }
</script>
