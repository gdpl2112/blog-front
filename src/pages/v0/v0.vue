<style scoped>
/* =============================================
   控制台：左侧目录 + 右侧正文
   ============================================= */

.console {
  display: grid;
  grid-template-columns: 216px minmax(0, 1fr);
  gap: var(--gap-7);
  align-items: start;
  padding-top: var(--gap-4);
}

.console-nav {
  position: sticky;
  top: calc(var(--nav-h) + 24px);
  border-top: 1px solid var(--rule-2);
  padding-top: var(--gap-3);
}

.console-label {
  margin: 0 0 var(--gap-3);
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  letter-spacing: 0.18em;
  color: var(--ink-3);
}

.console-item {
  display: flex;
  align-items: baseline;
  gap: 10px;
  padding: 9px 0;
  font-size: var(--text-sm);
  color: var(--ink-2);
  text-decoration: none;
  border-bottom: 1px solid var(--rule);
  transition: color var(--dur) var(--ease);
}

.console-item:hover {
  color: var(--ink);
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

.console-item.active {
  color: var(--seal);
  font-weight: 600;
  border-bottom-color: var(--seal);
}

.console-item.active .idx {
  color: var(--seal);
}

.console-group {
  border-bottom: 1px solid var(--rule);
}

.console-group-label {
  padding: 12px 0 4px;
  color: var(--ink-3);
  font-size: var(--text-2xs);
  letter-spacing: 0.12em;
}

.console-group-title {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  width: 100%;
  padding: 9px 0;
  border: 0;
  background: transparent;
  color: var(--ink-2);
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.console-group-title::after {
  content: '＋';
  color: var(--ink-3);
  font-size: var(--text-xs);
}

.console-group[open] .console-group-title::after {
  content: '－';
}

.console-group-items {
  padding-left: 26px;
}

.console-group-items .console-item {
  border-bottom: 0;
}

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
    display: flex;
    flex-wrap: wrap;
    gap: 0 var(--gap-4);
    border-bottom: 1px solid var(--rule);
    padding-bottom: var(--gap-2);
  }

  .console-label {
    width: 100%;
    margin-bottom: var(--gap-2);
  }

  .console-item {
    border-bottom: 0;
    padding: 6px 0;
  }

  .console-main {
    padding: var(--gap-4);
  }
}
</style>

<template>
  <div class="console ink-in">
    <aside class="console-nav">
      <p class="console-label">控制台</p>
      <div class="console-group-label">基础</div>
      <RouterLink to="/v0/info" class="console-item" active-class="active">
        <span class="idx">01</span> 账号设置
      </RouterLink>
      <RouterLink to="/v0/articles" class="console-item" active-class="active">
        <span class="idx">02</span> 文章管理
      </RouterLink>
      <div class="console-group-label">能力</div>
      <RouterLink to="/v0/aox" class="console-item" active-class="active">
        <span class="idx">03</span> 接口管理
      </RouterLink>
      <RouterLink to="/v0/app" class="console-item" active-class="active">
        <span class="idx">04</span> 应用管理
      </RouterLink>
      <div class="console-group-label">工具</div>
      <details class="console-group" :open="toolsOpen">
        <summary class="console-group-title">展开工具</summary>
        <div class="console-group-items">
          <RouterLink to="/v0/pnote" class="console-item" active-class="active">
            <span class="idx">05</span> 密码本
          </RouterLink>
          <RouterLink v-if="roles.includes('admin')" to="/v0/adminv2" class="console-item" active-class="active">
            <span class="idx">08</span> 卡密维护
          </RouterLink>
        </div>
      </details>
      <template v-if="roles.includes('admin')">
        <div class="console-group-label">管理</div>
        <RouterLink to="/v0/adminv0" class="console-item" active-class="active">
          <span class="idx">06</span> 帖子维护
        </RouterLink>
        <RouterLink to="/v0/adminv1" class="console-item" active-class="active">
          <span class="idx">07</span> 一言维护
        </RouterLink>
        <RouterLink to="/v0/adminai" class="console-item" active-class="active">
          <span class="idx">09</span> AI 配置
        </RouterLink>
      </template>
    </aside>

    <main class="console-main">
      <RouterView />
    </main>
  </div>
</template>

<script lang="ts" setup>
import {RouterLink, RouterView, useRoute} from 'vue-router'
import {computed, onMounted, ref} from "vue";
import service from "@/axios";
import Cookie from "js-cookie";

const roles = ref(['user'])
const route = useRoute()
const toolsOpen = computed(() => ['/v0/pnote', '/v0/adminv2'].includes(route.path))
onMounted(() => {
  if (sessionStorage.getItem('admin-token') && !Cookie.get('token') && !Cookie.get('authorization')) {
    roles.value = ['admin']
    return
  }
  service.get("/auth/role").then((res: any) => { roles.value = res })
})
</script>
