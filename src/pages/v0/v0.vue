<style scoped>
.v0-layout {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: var(--space-6);
  min-height: 60vh;
}

.v0-sidebar {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-3);
  height: fit-content;
  position: sticky;
  top: calc(var(--nav-height) + var(--space-6) + var(--space-4));
}

.v0-sidebar-title {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: var(--space-2) var(--space-3);
  margin-bottom: var(--space-1);
}

.v0-menu-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: 10px 12px;
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  text-decoration: none;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.v0-menu-item:hover {
  background: var(--color-accent-soft);
  color: var(--color-accent);
}

.v0-menu-item.active {
  background: var(--color-accent);
  color: white;
}

.v0-content {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  min-height: 400px;
}

@media (max-width: 768px) {
  .v0-layout {
    grid-template-columns: 1fr;
  }
  .v0-sidebar {
    position: static;
  }
}
</style>

<template>
  <div class="v0-layout">
    <aside class="v0-sidebar">
      <div class="v0-sidebar-title">个人中心</div>
      <RouterLink to="/v0/info" class="v0-menu-item" active-class="active">
        <i class="bi bi-gear"></i> 账号设置
      </RouterLink>
      <RouterLink to="/v0/articles" class="v0-menu-item" active-class="active">
        <i class="bi bi-file-text"></i> 文章管理
      </RouterLink>
      <RouterLink to="/v0/aox" class="v0-menu-item" active-class="active">
        <i class="bi bi-grid-3x3-gap"></i> API管理
      </RouterLink>
      <RouterLink to="/v0/app" class="v0-menu-item" active-class="active">
        <i class="bi bi-window-stack"></i> 应用管理
      </RouterLink>
      <RouterLink to="/v0/pnote" class="v0-menu-item" active-class="active">
        <i class="bi bi-journal-text"></i> 密码本
      </RouterLink>
      <RouterLink v-if="roles.includes('admin')" to="/v0/adminv0" class="v0-menu-item" active-class="active">
        <i class="bi bi-file-earmark-post"></i> 帖子管理
      </RouterLink>
      <RouterLink v-if="roles.includes('admin')" to="/v0/adminv1" class="v0-menu-item" active-class="active">
        <i class="bi bi-chat-square-quote"></i> 一言管理
      </RouterLink>
    </aside>
    <main class="v0-content">
      <RouterView />
    </main>
  </div>
</template>

<script lang="ts" setup>
import {RouterLink, RouterView} from 'vue-router'
import {onMounted, ref} from "vue";
import service from "@/axios";

const roles = ref(['user'])
onMounted(() => {
  service.get("/auth/role").then((res: any) => { roles.value = res })
})
</script>
