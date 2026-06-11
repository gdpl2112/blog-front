<style scoped>
.home-page {
  max-width: 860px;
  margin: 0 auto;
}

/* Daily quote section */
.quote-card {
  position: relative;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-8) var(--space-6);
  margin-bottom: var(--space-8);
  overflow: hidden;
  transition: all var(--transition-base);
  cursor: pointer;
}

.quote-card:hover {
  border-color: var(--color-accent-soft);
  box-shadow: var(--shadow-md);
}

.quote-card::before {
  content: '"';
  position: absolute;
  top: -10px;
  left: var(--space-4);
  font-size: 5rem;
  line-height: 1;
  color: var(--color-accent-soft);
  font-family: var(--font-serif, Georgia, serif);
  pointer-events: none;
}

.quote-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-tertiary);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: var(--space-3);
}

.quote-text {
  font-size: 1.2rem;
  font-weight: 500;
  color: var(--color-text-primary);
  line-height: 1.7;
  margin: 0 0 var(--space-2);
  padding-left: var(--space-4);
}

.quote-source {
  font-size: 0.85rem;
  color: var(--color-text-tertiary);
  margin: 0;
}

/* Post list */
.posts-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.post-card {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: var(--space-5);
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-5);
  cursor: pointer;
  transition: all var(--transition-base);
  position: relative;
}

.post-card:hover {
  border-color: var(--color-accent-soft);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.post-card:active {
  transform: translateY(0);
}

.post-image-wrap {
  position: relative;
  border-radius: var(--radius-sm);
  overflow: hidden;
  aspect-ratio: 16 / 10;
  background: var(--color-bg-soft);
}

.post-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.post-card:hover .post-image {
  transform: scale(1.05);
}

.sticky-badge {
  position: absolute;
  top: var(--space-2);
  right: var(--space-2);
  z-index: 2;
  background: linear-gradient(135deg, var(--color-accent), #8b5cf6);
  color: white;
  padding: 2px 10px;
  font-size: 0.7rem;
  font-weight: 700;
  border-radius: var(--radius-full);
}

.post-body {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
}

.post-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 var(--space-2);
  line-height: 1.4;
  letter-spacing: -0.01em;
  transition: color var(--transition-fast);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.post-card:hover .post-title {
  color: var(--color-accent);
}

.post-meta {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: 0.85rem;
  color: var(--color-text-tertiary);
  margin-bottom: var(--space-3);
}

.post-meta-dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--color-text-tertiary);
}

.post-author {
  font-weight: 600;
  color: var(--color-text-secondary);
}

.post-summary {
  font-size: 0.88rem;
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin: 0 0 var(--space-3);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-stats {
  display: flex;
  align-items: center;
  gap: var(--space-5);
  font-size: 0.8rem;
  color: var(--color-text-tertiary);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: var(--space-1);
}

.stat-item i {
  font-size: 0.9rem;
}

/* Pagination */
.pagination-wrap {
  display: flex;
  justify-content: center;
  margin-top: var(--space-10);
}

.pagination-modern {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  list-style: none;
  margin: 0;
  padding: 0;
}

.page-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
  padding: 0 12px;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.page-btn:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.page-btn.active {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: white;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Empty & loading */
.empty-state {
  text-align: center;
  padding: var(--space-16) var(--space-6);
  color: var(--color-text-tertiary);
}

.empty-state h3 {
  font-weight: 600;
  margin: 0 0 var(--space-2);
  color: var(--color-text-secondary);
}

.empty-state p {
  margin: 0;
}

@media (max-width: 640px) {
  .post-card {
    grid-template-columns: 1fr;
    gap: var(--space-3);
  }

  .post-image-wrap {
    aspect-ratio: 16 / 9;
  }

  .quote-text {
    font-size: 1rem;
  }
}
</style>

<template>
  <div class="home-page">
    <!-- Daily quote -->
    <div class="quote-card" @click="copyTextElement('#dayyan_div')" title="点击复制">
      <div class="quote-label">每日一言</div>
      <p id="dayyan_div" class="quote-text">“ {{ dayyan.line }} ”</p>
      <p class="quote-source">— {{ dayyan.from }} —</p>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="empty-state">
      <div class="loading-ring" style="margin:0 auto 12px;"></div>
      <p>加载中...</p>
    </div>

    <!-- Empty -->
    <div v-else-if="data.length === 0" class="empty-state">
      <h3>暂无帖子</h3>
      <p>当前没有可用的帖子内容</p>
    </div>

    <!-- Post list -->
    <div v-else class="posts-list">
      <article
        v-for="d in data"
        :key="d.id"
        class="post-card"
        @click="routerTo(d.id)"
      >
        <div class="post-image-wrap">
          <img
            v-if="d.icon"
            class="post-image"
            :src="d.icon"
            :alt="d.title"
          />
          <div v-else class="post-image" style="display:flex;align-items:center;justify-content:center;background:var(--color-accent-soft);color:var(--color-accent);font-size:2rem;">
            <i class="bi bi-file-text"></i>
          </div>
          <div v-if="d.sort > 0" class="sticky-badge">置顶</div>
        </div>
        <div class="post-body">
          <h3 class="post-title">{{ d.title }}</h3>
          <div class="post-meta">
            <span class="post-author">{{ d.authorName }}</span>
            <span class="post-meta-dot"></span>
            <span>{{ getF(d.time) }}</span>
          </div>
          <p v-if="d.summary" class="post-summary">{{ d.summary }}</p>
          <div class="post-stats">
            <div class="stat-item">
              <i class="bi bi-eye"></i>
              <span>{{ d.views }}</span>
            </div>
            <div class="stat-item">
              <i class="bi bi-chat-dots"></i>
              <span>{{ d.comments || 0 }}</span>
            </div>
            <div class="stat-item">
              <i class="bi bi-heart"></i>
              <span>{{ d.likes || 0 }}</span>
            </div>
          </div>
        </div>
      </article>
    </div>

    <!-- Pagination -->
    <div v-if="!isLoading && rawdata.pages > 1" class="pagination-wrap">
      <ul class="pagination-modern">
        <li>
          <button class="page-btn" :disabled="pup <= 0" @click="showPageDatas(pn - 1)">
            <i class="bi bi-chevron-left"></i>
          </button>
        </li>
        <li v-if="pup > 0">
          <button class="page-btn" @click="showPageDatas(pn - 1)">{{ pn - 1 }}</button>
        </li>
        <li>
          <button class="page-btn active">{{ pn }}</button>
        </li>
        <li v-if="pdown > 0">
          <button class="page-btn" @click="showPageDatas(pn + 1)">{{ pn + 1 }}</button>
        </li>
        <li>
          <button class="page-btn" :disabled="pdown <= 0" @click="showPageDatas(pn + 1)">
            <i class="bi bi-chevron-right"></i>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import service from "@/axios";
import {onMounted, ref} from "vue";
import {copyTextElement, formatMsgTime} from "@/utils/utils";
import router from "@/router";
import {ElMessage} from "element-plus";

let rawdata = ref({current: 1, pages: 1, records: []})
let data = ref([])
let pup = ref(null)
let pdown = ref(null)
let pn = ref(1)
let isLoading = ref(false)

let dayyan = ref({line: "每日一言内容", from: "来源"})

async function showPageDatas(p: number) {
  if (p < 1 || (rawdata.value.pages && p > rawdata.value.pages)) return;
  isLoading.value = true;
  try {
    const response = await service.get(`/notice/gets?pageNum=${p}`);
    rawdata.value = response;
    pn.value = p;
    pup.value = rawdata.value.current - 1;
    pdown.value = rawdata.value.current + 1;
    pdown.value = pdown.value > rawdata.value.pages ? -1 : pdown.value;
    data.value = rawdata.value.records || [];
  } catch (err) {
    ElMessage.error('加载失败，请稍后重试');
  } finally {
    isLoading.value = false;
  }
}

function getF(t: number): string {
  return formatMsgTime(t);
}

function routerTo(id: number) {
  if (!id) return;
  router.push({path: '/article', query: {id: id}});
}

onMounted(async () => {
  const promises = [loadDayyan(), showPageDatas(1)];
  await Promise.allSettled(promises);
});

async function loadDayyan() {
  try {
    const response = await service.get("/api/get/dayYan");
    dayyan.value = response;
  } catch (err) {
    dayyan.value = {line: "生活不止眼前的苟且，还有诗和远方", from: "未知"};
  }
}
</script>
