<style scoped>
/* =============================================
   404：这一页没有留下痕迹
   ============================================= */

.not-found {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: var(--gap-7);
  align-items: center;
  min-height: calc(100vh - var(--nav-h) - 260px);
  padding: clamp(24px, 4vw, 48px);
  background: var(--glass);
  border: 1px solid var(--glass-line);
  border-radius: var(--r-lg);
  box-shadow: var(--glass-shadow), var(--glass-inner);
  backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-sat));
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-sat));
}

.nf-text h1 {
  font-family: var(--font-display);
  font-size: clamp(30px, 4vw, 44px);
  font-weight: 600;
  letter-spacing: 0.06em;
  line-height: 1.4;
  margin: 0 0 var(--gap-4);
}

.nf-text p {
  margin: 0 0 var(--gap-6);
  max-width: 30em;
  font-size: var(--text-sm);
  line-height: 1.9;
  color: var(--ink-2);
}

.nf-actions {
  display: flex;
  gap: var(--gap-2);
  flex-wrap: wrap;
}

.nf-num {
  position: relative;
  font-family: var(--font-display);
  font-size: clamp(120px, 20vw, 240px);
  font-weight: 600;
  line-height: 0.85;
  letter-spacing: -0.02em;
  color: var(--ink);
  padding-right: var(--gap-4);
  border-right: 1px solid var(--rule);
  user-select: none;
}

.nf-num .seal {
  position: absolute;
  right: 3px;
  bottom: 6px;
}

@media (max-width: 760px) {
  .not-found {
    grid-template-columns: 1fr;
    gap: var(--gap-5);
  }

  .nf-num {
    order: -1;
    border-right: 0;
    border-bottom: 1px solid var(--rule);
    padding: 0 0 var(--gap-4);
    font-size: 120px;
  }
}
</style>

<template>
  <div class="not-found ink-in">
    <div class="nf-text">
      <h1>这页没有留下痕迹</h1>
      <p>
        地址可能写错了，或者这篇文章已经被删掉。回到文章目录，或者去接口那边看看。
      </p>
      <div class="nf-actions">
        <RouterLink to="/" class="btn btn--solid">回到文章</RouterLink>
        <RouterLink to="/apis" class="btn">看看接口</RouterLink>
      </div>
    </div>

    <div class="nf-num">
      404
      <span class="seal seal--sm">空</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import {RouterLink} from 'vue-router'
</script>
