<style scoped>
.authc-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}

.authc-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-8);
  max-width: 440px;
  width: 100%;
  text-align: center;
  box-shadow: var(--shadow-md);
}

.authc-card h2 {
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0 0 var(--space-2);
  color: var(--color-text-primary);
}

.authc-card p {
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  margin: var(--space-2) 0 var(--space-6);
}

.authc-perms {
  text-align: left;
  background: var(--color-bg-soft);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  margin-bottom: var(--space-6);
}

.authc-perms li {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  margin-bottom: var(--space-1);
  line-height: 1.6;
}

.authc-actions {
  display: flex;
  gap: var(--space-3);
  justify-content: center;
}
</style>

<template>
  <div class="authc-page">
    <div v-if="!isLoggedIn" class="authc-card">
      <h2>需要登录</h2>
      <p>请先登录后再进行应用授权</p>
    </div>

    <div v-else class="authc-card">
      <h2>授权确认</h2>
      <p>应用 "{{ appName }}" 请求访问您的账户</p>

      <div class="authc-perms">
        <p style="font-weight:600;margin:0 0 8px;font-size:0.85rem;color:var(--color-text-primary);">请求权限：</p>
        <ul style="margin:0;padding-left:20px;">
          <li>访问您的基本资料</li>
          <li>读取您的文章信息</li>
        </ul>
        <p v-if="appDesc" style="margin:8px 0 0;font-size:0.8rem;color:var(--color-text-tertiary);">{{ appDesc }}</p>
      </div>

      <div class="authc-actions">
        <button class="btn-modern btn-modern-primary" :disabled="authorizing" @click="handleAuthorize">
          {{ authorizing ? '授权中...' : '同意授权' }}
        </button>
        <button class="btn-modern" @click="handleCancel">取消</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {toast} from '@/utils/utils'
import service, {login_state} from '@/axios'

const authorizing = ref(false)
const isLoggedIn = ref(false)
const appName = ref('第三方应用')
const appDesc = ref('')
const router = useRouter()
const route = useRoute()
const appId = ref('')
const redirectUri = ref('')

onMounted(() => {
  const query = route.query
  appId.value = query.app_id as string || ''
  redirectUri.value = query.redirect_uri as string || ''
  if (appId.value) {
    service.get("/auth/app/info/app?app_id=" + appId.value).then((res: any) => {
      appName.value = res.app_name; appDesc.value = res.app_desc
    })
  }
  isLoggedIn.value = login_state.value
  if (!appId.value || !redirectUri.value) {
    toast('缺少必要的授权参数', 'error')
    router.push('/')
  }
  if (!login_state.value) {
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
