<style scoped>
/* =============================================
   工作台：模块外壳（标题 + 页签 + 子页面）
   ============================================= */

.wb-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--gap-5);
  flex-wrap: wrap;
  border-bottom: 1px solid var(--rule-2);
  margin-bottom: var(--gap-6);
}

.wb-title {
  min-width: 0;
  padding-bottom: 12px;
}

.wb-kicker {
  margin: 0 0 6px;
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  letter-spacing: 0.2em;
  color: var(--ink-3);
}

.wb-title h1 {
  margin: 0;
  font-size: var(--text-xl);
  letter-spacing: 0.04em;
  line-height: 1.2;
}

.wb-sub {
  margin: 6px 0 0;
  font-size: var(--text-xs);
  line-height: 1.7;
  color: var(--ink-3);
  max-width: 46em;
}

/* ---- 页签 ---- */
.wb-tabs {
  display: flex;
  align-items: flex-end;
  gap: var(--gap-5);
  flex-shrink: 0;
}

.wb-tab {
  position: relative;
  padding: 0 0 10px;
  font-size: var(--text-sm);
  letter-spacing: 0.04em;
  color: var(--ink-3);
  text-decoration: none;
  white-space: nowrap;
  transition: color var(--dur) var(--ease);
}

.wb-tab::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 2px;
  background: var(--seal);
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform var(--dur) var(--ease);
}

.wb-tab:hover {
  color: var(--ink);
  text-decoration: none;
}

.wb-tab.active {
  color: var(--seal);
}

.wb-tab.active::after {
  transform: scaleX(1);
}

@media (max-width: 720px) {
  .wb-head {
    align-items: flex-start;
    flex-direction: column;
    gap: var(--gap-2);
  }

  .wb-tabs {
    width: 100%;
    gap: var(--gap-4);
    overflow-x: auto;
    scrollbar-width: none;
    padding-bottom: 0;
  }

  .wb-tabs::-webkit-scrollbar {
    display: none;
  }

  .wb-tab {
    padding-bottom: 9px;
  }
}
</style>

<template>
  <div class="wb ink-in">
    <header class="wb-head">
      <div class="wb-title">
        <p class="wb-kicker">WORKBENCH · 工作台</p>
        <h1>{{ title }}</h1>
        <p v-if="sub" class="wb-sub">{{ sub }}</p>
      </div>

      <nav class="wb-tabs" aria-label="工作台模块">
        <RouterLink to="/v0/workbench" class="wb-tab" exact-active-class="active">概览</RouterLink>
        <RouterLink to="/v0/workbench/pnote" class="wb-tab" active-class="active">密码本</RouterLink>
        <RouterLink to="/v0/workbench/task" class="wb-tab" active-class="active">定时任务</RouterLink>
        <RouterLink v-if="admin" to="/v0/workbench/cardkey" class="wb-tab" active-class="active">卡密维护</RouterLink>
      </nav>
    </header>

    <RouterView />
  </div>
</template>

<script lang="ts" setup>
import {computed, inject, ref} from 'vue'
import {RouterLink, RouterView, useRoute} from 'vue-router'
import {CONSOLE_ROLES} from '../context'
import {isAdmin} from '../modules'

const route = useRoute()
const roles = inject(CONSOLE_ROLES, ref(['user']))
const admin = computed(() => isAdmin(roles.value))

/** 标题与说明随子路由切换，保持模块内只有一处主标题 */
const title = computed(() => (route.meta.title as string) || '工作台')
const sub = computed(() => (route.meta.sub as string) || '')
</script>
