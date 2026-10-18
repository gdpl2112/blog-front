<style scoped>
/* =============================================
   首页：抬头 + 今日一句 + 文章账页
   ============================================= */

.home {
  padding-top: var(--gap-5);
}

/* ---------- 抬头 ---------- */

.masthead {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: var(--gap-7);
  align-items: start;
  padding-bottom: var(--gap-7);
}

.masthead-name {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-weight: 600;
  letter-spacing: 0.14em;
  line-height: 1.1;
  margin: 0 0 var(--gap-4);
  color: var(--ink);
}

.masthead-lede {
  max-width: 26em;
  margin: 0 0 var(--gap-4);
  font-size: var(--text-base);
  line-height: 1.95;
  color: var(--ink-2);
}

.masthead-date {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: 0.12em;
  color: var(--ink-3);
}

.masthead-date::before {
  content: '';
  width: 26px;
  height: 1px;
  background: var(--rule-2);
}

/* ---------- 今日一句 ---------- */

.quote {
  position: relative;
  padding: var(--gap-6) var(--gap-6) var(--gap-5);
  background: var(--glass);
  border: 1px solid var(--glass-line);
  border-radius: var(--r-lg);
  box-shadow: var(--glass-shadow), var(--glass-inner);
  backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-sat));
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-sat));
  cursor: pointer;
  transition: background var(--dur) var(--ease), box-shadow var(--dur) var(--ease), transform var(--dur) var(--ease);
}

.quote:hover {
  background: var(--glass-strong);
  transform: translateY(-2px);
}

/* 文章清单整块托在玻璃上 */
.archive-panel {
  padding: var(--gap-3) var(--gap-6) var(--gap-4);
}

.quote-stamp {
  position: absolute;
  top: var(--gap-5);
  right: var(--gap-5);
  opacity: 0.9;
}

.quote-text {
  margin: 0 0 var(--gap-4);
  padding-right: var(--gap-7);
  font-family: var(--font-display);
  font-size: clamp(19px, 2.1vw, 24px);
  font-weight: 600;
  line-height: 1.75;
  letter-spacing: 0.02em;
  color: var(--ink);
}

.quote-source {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--gap-3);
  font-size: var(--text-sm);
  color: var(--ink-2);
}

.quote-source em {
  font-style: normal;
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  letter-spacing: 0.14em;
  color: var(--ink-3);
}

/* ---------- 章节头 ---------- */

.archive-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--gap-4);
  padding: var(--gap-3) 0 var(--gap-3);
  border-bottom: 1px solid var(--rule-2);
  margin-bottom: 0;
}

.archive-head h2 {
  font-size: var(--text-lg);
  letter-spacing: 0.06em;
}

.archive-head .count {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: 0.06em;
  color: var(--ink-3);
}

/* ---------- 文章行 ---------- */

.entry {
  display: grid;
  grid-template-columns: 74px 104px minmax(0, 1fr) auto;
  align-items: center;
  gap: var(--gap-5);
  padding: var(--gap-5) 0;
  border-bottom: 1px solid var(--rule);
  cursor: pointer;
  transition: background var(--dur) var(--ease);
}

.entry:hover {
  background: var(--glass-thin);
}

.entry-date {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.04em;
  color: var(--ink-3);
  align-self: start;
  padding-top: 4px;
}

.entry-date b {
  display: block;
  font-size: 15px;
  font-weight: 500;
  color: var(--ink-2);
  letter-spacing: 0.02em;
}

.entry-thumb {
  width: 104px;
  height: 70px;
  object-fit: cover;
  border-radius: 8px;
  filter: grayscale(1) contrast(0.95);
  transition: filter 320ms var(--ease);
  background: var(--paper-2);
}

.entry:hover .entry-thumb {
  filter: none;
}

.entry-thumb--none {
  display: grid;
  place-items: center;
  color: var(--ink-3);
  font-size: 15px;
  border: 1px solid var(--rule);
  filter: none;
}

.entry-main {
  min-width: 0;
}

.entry-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-display);
  font-size: var(--text-md);
  font-weight: 600;
  line-height: 1.5;
  letter-spacing: 0.02em;
  color: var(--ink);
  margin: 0 0 6px;
  transition: color var(--dur) var(--ease);
}

.entry:hover .entry-title {
  color: var(--seal);
}

.entry-title .pinned {
  flex-shrink: 0;
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  font-weight: 400;
  letter-spacing: 0.1em;
  color: var(--seal);
  border: 1px solid currentColor;
  padding: 1px 5px;
  line-height: 1.4;
}

.entry-summary {
  margin: 0;
  font-size: var(--text-sm);
  line-height: 1.8;
  color: var(--ink-2);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.entry-author {
  font-size: var(--text-xs);
  color: var(--ink-3);
  margin-right: 10px;
}

.entry-stats {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 3px;
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--ink-3);
  letter-spacing: 0.04em;
  white-space: nowrap;
}

/* ---------- 分页 ---------- */

.pager {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--gap-4);
  padding-top: var(--gap-5);
}

.pager-info {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: 0.1em;
  color: var(--ink-3);
}

.pager-btns {
  display: flex;
  gap: var(--gap-2);
}

/* ---------- 骨架 ---------- */

.skeleton-row {
  display: grid;
  grid-template-columns: 74px minmax(0, 1fr) 60px;
  gap: var(--gap-5);
  padding: var(--gap-5) 0;
  border-bottom: 1px solid var(--rule);
}

.sk-bar {
  height: 12px;
  background: rgba(21, 26, 34, 0.07);
  border-radius: 8px;
  animation: sk-pulse 1.6s ease-in-out infinite;
}

.sk-bar.wide { width: 62%; height: 16px; }
.sk-bar.mid { width: 44%; }
.sk-bar.short { width: 22%; }

[data-theme="dark"] .sk-bar {
  background: rgba(255, 255, 255, 0.09);
}

@keyframes sk-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

@media (max-width: 900px) {
  .masthead {
    grid-template-columns: 1fr;
    gap: var(--gap-5);
  }

  .entry {
    grid-template-columns: 58px minmax(0, 1fr);
    gap: var(--gap-4);
    align-items: start;
  }

  .entry-thumb,
  .entry-stats {
    display: none;
  }

  .entry-date {
    padding-top: 2px;
  }

  .entry-date b {
    font-size: 13px;
  }

  .entry-title {
    font-size: var(--text-base);
  }

  .skeleton-row {
    grid-template-columns: 58px minmax(0, 1fr);
  }
}
</style>

<template>
  <div class="home ink-in">
    <!-- 抬头 -->
    <section class="masthead">
      <div>
        <h2 class="masthead-name">若<h3 style="display:inline">生</h3></h2>
        <p class="masthead-lede">
          不系之舟，逐梦之客；指尖代码，心中星河。
        </p>
        <div class="masthead-date">{{ today }}</div>
      </div>

      <!-- 今日一句 -->
      <div class="quote" @click="copyTextElement('#dayyan_div')" title="点击复制这一句">
        <span class="seal seal--sm quote-stamp">言</span>
        <p id="dayyan_div" class="quote-text">「{{ dayyan.line }}」</p>
        <div class="quote-source">
          <span>—— {{ dayyan.from }}</span>
          <em>点击复制</em>
        </div>
      </div>
    </section>

    <!-- 文章账页 -->
    <section class="panel archive-panel">
      <div class="archive-head">
        <h2>文章</h2>
        <span class="count">{{ pageLabel }}</span>
      </div>

      <!-- 载入 -->
      <div v-if="isLoading" aria-hidden="true">
        <div v-for="i in 3" :key="i" class="skeleton-row">
          <div class="sk-bar short"></div>
          <div>
            <div class="sk-bar wide" style="margin-bottom:10px;"></div>
            <div class="sk-bar mid"></div>
          </div>
          <div class="sk-bar short"></div>
        </div>
      </div>

      <!-- 空 -->
      <div v-else-if="data.length === 0" class="empty">
        <h3>这一页还是空的</h3>
        <p>等下一篇写出来，它会出现在这里。</p>
      </div>

      <!-- 列表 -->
      <div v-else>
        <article
          v-for="d in data"
          :key="d.id"
          class="entry"
          @click="routerTo(d.id)"
        >
          <div class="entry-date">
            <b>{{ dayOf(d.time) }}</b>
            {{ yearOf(d.time) }}
          </div>

          <img v-if="d.icon" class="entry-thumb" :src="d.icon" :alt="d.title" loading="lazy" />
          <div v-else class="entry-thumb entry-thumb--none">
            <i class="bi bi-file-earmark-text"></i>
          </div>

          <div class="entry-main">
            <h3 class="entry-title">
              {{ d.title }}
              <span v-if="d.sort > 0" class="pinned">置顶</span>
            </h3>
            <p v-if="d.summary" class="entry-summary">{{ d.summary }}</p>
            <p v-else class="entry-summary" style="color: var(--ink-3);">（这篇没有写摘要）</p>
          </div>

          <div class="entry-stats">
            <span>{{ d.views }} 阅</span>
            <span>{{ d.comments || 0 }} 评</span>
          </div>
        </article>
      </div>
    </section>

    <!-- 分页 -->
    <div v-if="!isLoading && rawdata.pages > 1" class="pager">
      <span class="pager-info">{{ pad(pn) }} / {{ pad(rawdata.pages) }}</span>
      <div class="pager-btns">
        <button class="btn btn--sm" :disabled="pup <= 0" @click="showPageDatas(pn - 1)">
          <i class="bi bi-arrow-left"></i> 上一页
        </button>
        <button class="btn btn--sm" :disabled="pdown <= 0" @click="showPageDatas(pn + 1)">
          下一页 <i class="bi bi-arrow-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import service from "@/axios";
import {computed, onMounted, ref} from "vue";
import {copyTextElement, formatMsgTime} from "@/utils/utils";
import router from "@/router";
import {ElMessage} from "element-plus";

let rawdata = ref({current: 1, pages: 1, records: []})
let data = ref([{id: 0, title: '', icon: '', summary: '', time: 0, views: 0, comments: 0,sort: 0}])
let pup = ref(0)
let pdown = ref(1)
let pn = ref(1)
let isLoading = ref(true)

let dayyan = ref({line: "生活不止眼前的苟且，还有诗和远方", from: "未知"})

// 抬头处的当日日期（等宽显示）
const today = new Date().toLocaleDateString('zh-CN', {year: 'numeric', month: '2-digit', day: '2-digit'}).replace(/\//g, '.')

const pageLabel = computed(() => {
  if (isLoading.value) return '载入中'
  const total = (rawdata.value as any).total
  return total ? `共 ${total} 篇` : `第 ${pn.value} 页`
})

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function dayOf(t: number) {
  const d = new Date(Number(t))
  return `${pad(d.getMonth() + 1)}.${pad(d.getDate())}`
}

function yearOf(t: number) {
  return new Date(Number(t)).getFullYear()
}

async function showPageDatas(p: number) {
  if (p < 1 || (rawdata.value.pages && p > rawdata.value.pages)) return;
  isLoading.value = true;
  try {
    const response = await service.get(`/notice/gets?pageNum=${p}`);
    rawdata.value = response as any;
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
  const promises = [await loadDayyan(), await showPageDatas(1)];
  await Promise.allSettled(promises);
});

async function loadDayyan() {
  try {
    const response = await service.get("/api/get/dayYan");
    dayyan.value = response as any;
  } catch (err) {
    dayyan.value = {line: "生活不止眼前的苟且，还有诗和远方", from: "未知"};
  }
}
</script>
