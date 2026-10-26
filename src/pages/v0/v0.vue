<style scoped>
/* =============================================
   个人中心：左侧目录 + 右侧正文
   ============================================= */

.console {
  display: grid;
  grid-template-columns: 232px minmax(0, 1fr);
  gap: var(--gap-7);
  align-items: start;
  padding-top: var(--gap-4);
}

.console-nav {
  position: sticky;
  top: calc(var(--nav-h) + 24px);
  max-height: calc(100vh - var(--nav-h) - 48px);
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 16px 16px 18px;
  border: 1px solid var(--glass-line);
  border-radius: var(--r-lg);
  /* 底衬是照片/画布，导航列自己也要有一层玻璃，文字才不会被背景吃掉 */
  background: var(--glass-strong);
  box-shadow: 0 20px 44px -36px rgba(30, 38, 54, 0.5), var(--glass-inner);
  backdrop-filter: blur(20px) saturate(160%);
  -webkit-backdrop-filter: blur(20px) saturate(160%);
  scrollbar-width: thin;
}

.console-label {
  margin: 0 0 var(--gap-4);
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  letter-spacing: 0.2em;
  color: var(--ink-3);
}

/* ---- 身份块 ---- */
.who {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: var(--gap-4);
  border-bottom: 1px solid var(--rule-2);
}

.who-avatar {
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  border-radius: 9px;
  object-fit: cover;
  border: 1px solid var(--rule);
}

.who-avatar--fallback {
  display: grid;
  place-items: center;
  border: 0;
  background: linear-gradient(160deg, #cf4433 0%, var(--seal) 55%, #a82f22 100%);
  color: #fff;
  font-family: var(--font-display);
  font-size: 16px;
  line-height: 1;
  box-shadow: 0 6px 16px -8px rgba(192, 57, 43, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.who-meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.who-name {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--ink);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.who-id {
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  letter-spacing: 0.04em;
  color: var(--ink-3);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ---- 分组导航 ---- */
.console-links {
  display: block;
}

.console-group-label {
  margin: 0;
  padding: 15px 0 3px;
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  letter-spacing: 0.18em;
  color: var(--ink-3);
}

.console-item {
  display: flex;
  align-items: baseline;
  gap: 10px;
  padding: 8px 0;
  font-size: var(--text-sm);
  color: var(--ink-2);
  text-decoration: none;
  border-bottom: 1px solid var(--rule);
  transition: color var(--dur) var(--ease), padding-left var(--dur) var(--ease);
}

.console-item:hover {
  color: var(--ink);
  padding-left: 3px;
  text-decoration: none;
}

.console-item .idx {
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  color: var(--ink-3);
  letter-spacing: 0.06em;
  width: 16px;
  flex-shrink: 0;
}

.console-item .name {
  flex: 1;
  min-width: 0;
}

.console-item.active {
  color: var(--seal);
  font-weight: 600;
  border-bottom-color: rgba(192, 57, 43, 0.35);
}

.console-item.active .idx {
  color: var(--seal);
}

/* ---- 正文 ---- */
.console-main {
  min-width: 0;
  padding: clamp(18px, 2.6vw, 30px);
  background: var(--glass);
  border: 1px solid var(--glass-line);
  border-radius: var(--r-lg);
  box-shadow: var(--glass-shadow), var(--glass-inner);
  backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-sat));
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-sat));
}

@media (max-width: 860px) {
  .console {
    grid-template-columns: 1fr;
    gap: var(--gap-5);
  }

  .console-nav {
    position: static;
    max-height: none;
    overflow: visible;
    padding: 14px;
  }

  .who {
    border-bottom: 0;
    padding-bottom: 0;
  }

  .console-links {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0 var(--gap-4);
    margin-top: var(--gap-3);
    padding-top: var(--gap-3);
    border-top: 1px solid var(--rule);
  }

  /* 窄屏省掉分组标题，靠 01–10 的编号维持顺序感 */
  .console-group-label {
    display: none;
  }

  .console-item {
    border-bottom: 0;
    padding: 7px 0;
  }

  .console-main {
    padding: var(--gap-4);
  }
}
</style>

<template>
  <div class="console ink-in">
    <aside class="console-nav">
      <p class="console-label">个人中心</p>

      <div class="who">
        <img v-if="userInfo.icon" :src="userInfo.icon" alt="" class="who-avatar" />
        <span v-else class="who-avatar who-avatar--fallback">{{ initial }}</span>
        <div class="who-meta">
          <span class="who-name">{{ userInfo.nickname || '未登录' }}</span>
          <span class="who-id">@{{ userInfo.userId || '—' }}</span>
        </div>
      </div>

      <nav class="console-links" aria-label="个人中心导航">
        <template v-for="group in groups" :key="group.id">
          <p class="console-group-label">{{ group.label }}</p>
          <RouterLink
            v-for="item in group.modules"
            :key="item.id"
            :to="item.path"
            class="console-item"
            active-class="active"
          >
            <span class="idx">{{ item.index }}</span>
            <span class="name">{{ item.name }}</span>
          </RouterLink>
        </template>
      </nav>
    </aside>

    <main class="console-main">
      <RouterView />
    </main>
  </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, provide, ref} from 'vue'
import {RouterLink, RouterView} from 'vue-router'
import Cookie from 'js-cookie'
import service, {userInfo} from '@/axios'
import {navGroups} from './modules'
import {CONSOLE_ROLES} from './context'

/** 角色由本层统一请求并注入，工作台与概览页直接消费 */
const roles = ref<string[]>(['user'])
provide(CONSOLE_ROLES, roles)

const groups = computed(() => navGroups(roles.value))

/** 无头像时用昵称首字代替，避免出现破图 */
const initial = computed(() => (userInfo.value.nickname || '若').slice(0, 1))

onMounted(() => {
  // 手动管理口令场景：只带 admin-token 而不带登录 Cookie 时，直接按管理员渲染
  if (sessionStorage.getItem('admin-token') && !Cookie.get('token') && !Cookie.get('authorization')) {
    roles.value = ['admin']
    return
  }
  service.get('/auth/role').then((res: any) => {
    roles.value = Array.isArray(res) ? res : ['user']
  }).catch(() => {
    roles.value = ['user']
  })
})
</script>
