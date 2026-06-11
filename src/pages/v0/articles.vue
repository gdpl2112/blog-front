<style scoped>
.articles-section h3 {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0 0 var(--space-4);
  color: var(--color-text-primary);
}

.article-group {
  background: var(--color-bg-soft);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-3);
}

.article-group-header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--color-text-primary);
  transition: all var(--transition-fast);
  border-radius: var(--radius-md);
}

.article-group-header:hover {
  background: var(--color-accent-soft);
}

.article-group-header i {
  transition: transform var(--transition-fast);
}

.article-group-header.open i {
  transform: rotate(90deg);
}

.article-list {
  padding: var(--space-2) var(--space-4) var(--space-3);
}

.article-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
  margin-bottom: 2px;
}

.article-item:hover {
  background: var(--color-bg-card);
}

.article-item-title {
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--color-text-primary);
}

.article-item-time {
  font-size: 0.75rem;
  color: var(--color-text-tertiary);
}
</style>

<template>
  <div class="articles-section">
    <h3>文章管理</h3>

    <div class="article-group">
      <div class="article-group-header" :class="{open: open1}" @click="open1 = !open1">
        <i class="bi bi-chevron-right"></i> 我发布的 <span style="font-size:0.75rem;color:var(--color-text-tertiary);font-weight:400;">({{ datas.length }})</span>
      </div>
      <div v-if="open1" class="article-list">
        <div v-for="e in datas" :key="e.id" class="article-item" @click="toArticle(e.id)">
          <span class="article-item-title">{{ e.title }}</span>
          <span class="article-item-time">{{ e.time }}</span>
        </div>
      </div>
    </div>

    <div class="article-group">
      <div class="article-group-header" :class="{open: open2}" @click="open2 = !open2">
        <i class="bi bi-chevron-right"></i> 我收藏的 <span style="font-size:0.75rem;color:var(--color-text-tertiary);font-weight:400;">({{ dataw.length }})</span>
      </div>
      <div v-if="open2" class="article-list">
        <div v-for="e in dataw" :key="e.id" class="article-item" @click="toArticle(e.id)">
          <span class="article-item-title">{{ e.title }}</span>
          <span class="article-item-time">{{ e.time }}</span>
        </div>
      </div>
    </div>

    <div class="article-group">
      <div class="article-group-header" :class="{open: open3}" @click="open3 = !open3">
        <i class="bi bi-chevron-right"></i> 仅自己可见 <span style="font-size:0.75rem;color:var(--color-text-tertiary);font-weight:400;">({{ datap.length }})</span>
      </div>
      <div v-if="open3" class="article-list">
        <div v-for="e in datap" :key="e.id" class="article-item" @click="toArticle(e.id)">
          <span class="article-item-title">{{ e.title }}</span>
          <span class="article-item-time">{{ e.time }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import service from "@/axios";
import {ref} from "vue";
import router from "@/router";

const open1 = ref(true)
const open2 = ref(true)
const open3 = ref(true)

let datas = ref([])
let dataw = ref([])
let datap = ref([])

service.get("/notice/myall").then((res: any) => { datas.value = res })
service.get("/notice/favorites").then((res: any) => { dataw.value = res })
service.get("/notice/privates").then((res: any) => { datap.value = res })

function toArticle(id: number) { router.push({path: '/article', query: {id: id}}) }
</script>
