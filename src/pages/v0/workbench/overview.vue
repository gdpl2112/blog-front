<style scoped>
/* =============================================
   工作台 · 概览：指标 → 模块目录 → 最近访问
   ============================================= */

/* ---- 顶部状态条 ---- */
.wb-strip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--gap-4);
  flex-wrap: wrap;
  margin-bottom: var(--gap-5);
}

.wb-greet {
  margin: 0;
  font-size: var(--text-sm);
  color: var(--ink-2);
  letter-spacing: 0.02em;
}

.wb-greet .sep {
  margin: 0 8px;
  color: var(--ink-3);
}

.wb-greet .date {
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  letter-spacing: 0.08em;
  color: var(--ink-3);
}

.wb-quick {
  display: flex;
  gap: var(--gap-2);
}

/* ---- 指标 ---- */
.metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(148px, 1fr));
  gap: var(--gap-3);
}

.metric {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1px;
  padding: 13px 15px 12px;
  border: 1px solid var(--glass-line);
  border-radius: var(--r-md);
  background: var(--glass-thin);
  text-decoration: none;
  overflow: hidden;
  transition: transform var(--dur) var(--ease), border-color var(--dur) var(--ease),
    background var(--dur) var(--ease), box-shadow var(--dur) var(--ease);
}

.metric::before {
  content: '';
  position: absolute;
  inset: 0 0 auto 0;
  height: 2px;
  background: linear-gradient(90deg, var(--seal), rgba(192, 57, 43, 0));
  opacity: 0;
  transition: opacity var(--dur) var(--ease);
}

.metric:hover {
  transform: translateY(-2px);
  border-color: rgba(192, 57, 43, 0.28);
  background: var(--glass);
  box-shadow: 0 16px 32px -26px rgba(30, 38, 54, 0.55);
  text-decoration: none;
}

.metric:hover::before {
  opacity: 1;
}

.metric-ico {
  position: absolute;
  top: 12px;
  right: 13px;
  font-size: 12px;
  color: var(--ink-3);
  opacity: 0.65;
  transition: color var(--dur) var(--ease), opacity var(--dur) var(--ease);
}

.metric:hover .metric-ico {
  color: var(--seal);
  opacity: 1;
}

.metric-num {
  font-family: var(--font-display);
  font-size: 30px;
  line-height: 1.15;
  color: var(--ink);
  font-variant-numeric: tabular-nums;
}

.metric-name {
  font-size: var(--text-sm);
  color: var(--ink-2);
  letter-spacing: 0.04em;
}

.metric-hint {
  margin-top: 3px;
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  letter-spacing: 0.04em;
  color: var(--ink-3);
}

/* ---- 目录头 ---- */
.catalog {
  margin-top: var(--gap-7);
}

.catalog-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--gap-4);
  flex-wrap: wrap;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--rule-2);
}

.catalog-head h2 {
  margin: 0;
  font-size: var(--text-md);
  letter-spacing: 0.06em;
}

.search {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 32px;
  padding: 0 10px;
  border: 1px solid var(--glass-line-2);
  border-radius: 9px;
  background: var(--paper-2);
  color: var(--ink-3);
  transition: border-color var(--dur) var(--ease), box-shadow var(--dur) var(--ease);
}

.search:focus-within {
  border-color: rgba(192, 57, 43, 0.35);
  box-shadow: 0 0 0 3px var(--seal-wash);
}

.search i {
  font-size: 12px;
}

.search input {
  width: 176px;
  border: 0;
  background: transparent;
  outline: none;
  font-family: inherit;
  font-size: var(--text-sm);
  color: var(--ink);
}

.search input::placeholder {
  color: var(--ink-3);
}

.search input::-webkit-search-cancel-button {
  filter: grayscale(1);
  opacity: 0.5;
}

.search kbd {
  padding: 1px 5px;
  border: 1px solid var(--rule);
  border-radius: 4px;
  background: var(--paper-2);
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.06em;
  color: var(--ink-3);
}

/* ---- 分组：左侧标签栏 + 右侧卡片网格 ---- */
.group {
  display: grid;
  grid-template-columns: 92px minmax(0, 1fr);
  gap: var(--gap-4);
  align-items: start;
  padding: var(--gap-4) 0;
}

.group + .group {
  border-top: 1px solid var(--rule);
}

.group-meta {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding-top: 2px;
}

.group-label {
  font-size: var(--text-sm);
  letter-spacing: 0.08em;
  color: var(--ink);
}

.group-note {
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  letter-spacing: 0.04em;
  color: var(--ink-3);
  line-height: 1.5;
}

/* ---- 模块卡 ---- */
.mods {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--gap-3);
}

.mod {
  display: flex;
  flex-direction: column;
  min-height: 118px;
  padding: 13px 14px 11px;
  border: 1px solid var(--glass-line);
  border-radius: var(--r-md);
  background: var(--glass-thin);
  text-decoration: none;
  transition: transform var(--dur) var(--ease), border-color var(--dur) var(--ease),
    background var(--dur) var(--ease), box-shadow var(--dur) var(--ease);
}

.mod:hover {
  transform: translateY(-2px);
  border-color: rgba(192, 57, 43, 0.3);
  background: var(--glass);
  box-shadow: 0 18px 36px -28px rgba(30, 38, 54, 0.6);
  text-decoration: none;
}

.mod-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mod-idx {
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  letter-spacing: 0.14em;
  color: var(--ink-3);
}

.mod-arrow {
  font-size: 12px;
  color: var(--ink-3);
  transition: color var(--dur) var(--ease), transform var(--dur) var(--ease);
}

.mod:hover .mod-arrow {
  color: var(--seal);
  transform: translate(2px, -2px);
}

.mod-name {
  margin-top: 8px;
  font-size: var(--text-base);
  font-weight: 600;
  letter-spacing: 0.03em;
  color: var(--ink);
}

.mod-desc {
  flex: 1;
  margin: 3px 0 0;
  font-size: var(--text-xs);
  line-height: 1.65;
  color: var(--ink-3);
}

.mod-meta {
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px solid var(--rule);
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  letter-spacing: 0.06em;
  color: var(--ink-3);
}

.mod:hover .mod-meta {
  color: var(--ink-2);
}

/* ---- 空态 ---- */
.empty {
  padding: var(--gap-7) var(--gap-4);
  text-align: center;
  color: var(--ink-3);
}

.empty strong {
  display: block;
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--ink-2);
}

.empty span {
  display: block;
  margin-top: 6px;
  font-size: var(--text-sm);
}

/* ---- 最近访问 ---- */
.recent {
  margin-top: var(--gap-7);
}

.recent-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--gap-3);
  padding-bottom: 8px;
  border-bottom: 1px solid var(--rule);
  margin-bottom: var(--gap-3);
}

.recent-clear {
  border: 0;
  background: none;
  padding: 0;
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  letter-spacing: 0.06em;
  color: var(--ink-3);
  cursor: pointer;
  transition: color var(--dur) var(--ease);
}

.recent-clear:hover {
  color: var(--seal);
}

.recent-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--gap-2);
}

.recent-chip {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 28px;
  padding: 0 12px;
  border: 1px solid var(--glass-line-2);
  border-radius: var(--r-full);
  background: var(--glass-thin);
  font-size: var(--text-xs);
  color: var(--ink-2);
  text-decoration: none;
  transition: color var(--dur) var(--ease), border-color var(--dur) var(--ease),
    background var(--dur) var(--ease);
}

.recent-chip .n {
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.1em;
  color: var(--ink-3);
}

.recent-chip:hover {
  color: var(--seal);
  border-color: rgba(192, 57, 43, 0.3);
  background: var(--seal-wash);
  text-decoration: none;
}

@media (max-width: 640px) {
  .search input {
    width: 120px;
  }

  .group {
    grid-template-columns: 1fr;
    gap: var(--gap-2);
  }

  .group-meta {
    flex-direction: row;
    align-items: baseline;
    gap: 8px;
  }

  .mods {
    grid-template-columns: 1fr;
  }

  .mod {
    min-height: 0;
  }
}
</style>

<template>
  <div class="wb-body">
    <!-- 状态条：问候 + 日期 + 快捷动作 -->
    <div class="wb-strip">
      <p class="wb-greet">
        {{ greeting }}，{{ userInfo.nickname || '朋友' }}
        <span class="sep">·</span>
        <span class="date">{{ dateText }}</span>
      </p>
      <div class="wb-quick">
        <RouterLink to="/upload" class="btn btn--sm btn--seal">写文章</RouterLink>
        <RouterLink to="/" class="btn btn--sm">回主页</RouterLink>
      </div>
    </div>

    <!-- 指标：可点击直达对应模块 -->
    <section class="metrics" aria-label="账户指标">
      <RouterLink v-for="item in metrics" :key="item.key" :to="item.to" class="metric">
        <i :class="['bi', item.icon, 'metric-ico']"></i>
        <span class="metric-num">{{ item.value ?? '—' }}</span>
        <span class="metric-name">{{ item.name }}</span>
        <span class="metric-hint">{{ item.hint }}</span>
      </RouterLink>
    </section>

    <!-- 模块目录 -->
    <section class="catalog">
      <div class="catalog-head">
        <h2>模块目录</h2>
        <label class="search">
          <i class="bi bi-search"></i>
          <input ref="searchRef" v-model="keyword" type="search" placeholder="搜索模块或功能" aria-label="搜索模块" />
          <kbd>{{ shortcutHint }}</kbd>
        </label>
      </div>

      <div v-for="group in filteredGroups" :key="group.id" class="group">
        <div class="group-meta">
          <span class="group-label">{{ group.label }}</span>
          <span class="group-note">{{ group.note }}</span>
        </div>
        <div class="mods">
          <RouterLink
            v-for="item in group.modules"
            :key="item.id"
            :to="item.path"
            class="mod"
            @click="remember(item)"
          >
            <span class="mod-top">
              <span class="mod-idx">{{ item.index }}</span>
              <i class="bi bi-arrow-up-right mod-arrow"></i>
            </span>
            <span class="mod-name">{{ item.name }}</span>
            <span class="mod-desc">{{ item.desc }}</span>
            <span class="mod-meta">{{ metaOf(item) }}</span>
          </RouterLink>
        </div>
      </div>

      <div v-if="filteredGroups.length === 0" class="empty">
        <strong>没有匹配的模块</strong>
        <span>换个关键词试试，或清空搜索框。</span>
      </div>
    </section>

    <!-- 最近访问 -->
    <section v-if="recent.length > 0" class="recent">
      <div class="recent-head">
        <span class="group-label">最近访问</span>
        <button class="recent-clear" type="button" @click="clearRecent">清空</button>
      </div>
      <div class="recent-list">
        <RouterLink v-for="item in recent" :key="item.id" :to="item.path" class="recent-chip">
          <span class="n">{{ item.index }}</span>{{ item.name }}
        </RouterLink>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import {computed, inject, onBeforeUnmount, onMounted, reactive, ref, watch} from 'vue'
import {RouterLink} from 'vue-router'
import service, {userInfo} from '@/axios'
import {CONSOLE_ROLES} from '../context'
import {consoleGroups, isAdmin, visibleModules, type ConsoleModule, type StatKey} from '../modules'

const roles = inject(CONSOLE_ROLES, ref(['user']))
const admin = computed(() => isAdmin(roles.value))

/* ---------------- 问候与日期 ---------------- */

const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 6) return '夜深了'
  if (h < 11) return '上午好'
  if (h < 14) return '中午好'
  if (h < 18) return '下午好'
  return '晚上好'
})

const dateText = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
}).format(new Date())

/* ---------------- 指标 ---------------- */

/** 未取到数据前保持 null，界面显示占位符而不是 0，避免误导 */
const stats = reactive<Record<StatKey, number | null>>({
  articles: null, favorites: null, privates: null, apis: null, apps: null, pnotes: null, cards: null, tasks: null
})

const UNITS: Record<StatKey, string> = {
  articles: '篇', favorites: '篇', privates: '篇', apis: '个', apps: '个', pnotes: '条', cards: '张', tasks: '个'
}

/** 列表型接口直接按数组长度计数 */
function loadCount(url: string, key: StatKey) {
  return service.get(url)
    .then((res: any) => { stats[key] = Array.isArray(res) ? res.length : null })
    .catch(() => { stats[key] = null })
}

/** 卡密走分页接口，取 total 字段 */
function loadCardTotal() {
  return service.get('/adm/card/list?ps=1&p=1')
    .then((res: any) => { stats.cards = typeof res?.total === 'number' ? res.total : null })
    .catch(() => { stats.cards = null })
}

const metrics = computed(() => {
  const list = [
    {
      key: 'articles',
      name: '文章',
      icon: 'bi-journal-text',
      to: '/v0/articles',
      value: stats.articles,
      hint: `收藏 ${stats.favorites ?? '—'} · 私密 ${stats.privates ?? '—'}`
    },
    {key: 'apis', name: '接口', icon: 'bi-hdd-network', to: '/v0/aox', value: stats.apis, hint: '对外公开'},
    {key: 'apps', name: '应用', icon: 'bi-box-seam', to: '/v0/app', value: stats.apps, hint: '第三方授权'},
    {key: 'pnotes', name: '密码本', icon: 'bi-key', to: '/v0/workbench/pnote', value: stats.pnotes, hint: '工具 · 悬停即改'},
    {key: 'tasks', name: '定时任务', icon: 'bi-clock-history', to: '/v0/workbench/task', value: stats.tasks, hint: '工具 · 脚本调度'},
  ]
  if (admin.value) {
    list.push({key: 'cards', name: '卡密', icon: 'bi-shield-lock', to: '/v0/workbench/cardkey', value: stats.cards, hint: '工具 · 兑换管理'})
  }
  return list
})

/* ---------------- 模块目录与搜索 ---------------- */

const keyword = ref('')
const searchRef = ref<HTMLInputElement>()

/** 快捷键提示按平台显示，实际监听同时兼容 Ctrl 与 ⌘ */
const isMac = /Mac|iPhone|iPad/i.test(navigator.platform || navigator.userAgent)
const shortcutHint = isMac ? '⌘K' : 'Ctrl K'

const filteredGroups = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  const pool = visibleModules(roles.value).filter(m => m.group !== 'overview')
  const hit = (m: ConsoleModule) => !kw || [m.name, m.desc, ...m.keywords].join(' ').toLowerCase().includes(kw)
  return consoleGroups
    .filter(g => g.id !== 'overview')
    .map(g => ({...g, modules: pool.filter(m => m.group === g.id && hit(m))}))
    .filter(g => g.modules.length > 0)
})

/** 卡片底部说明：有实时数量就显示数量，否则退回模块自带的说明 */
function metaOf(m: ConsoleModule) {
  if (m.stat && stats[m.stat] !== null) return `${stats[m.stat]} ${UNITS[m.stat]}`
  return m.hint || ''
}

/* ---------------- 最近访问 ---------------- */

const RECENT_KEY = 'kweb:console:recent'
const recentIds = ref<string[]>(readRecent())

function readRecent(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY)
    const list = raw ? JSON.parse(raw) : []
    return Array.isArray(list) ? list.filter((id: unknown) => typeof id === 'string') : []
  } catch {
    return []
  }
}

function remember(m: ConsoleModule) {
  recentIds.value = [m.id, ...recentIds.value.filter(id => id !== m.id)].slice(0, 6)
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(recentIds.value))
  } catch {
    /* 隐私模式下写入失败不影响使用 */
  }
}

function clearRecent() {
  recentIds.value = []
  try {
    localStorage.removeItem(RECENT_KEY)
  } catch {
    /* 同上 */
  }
}

/** 只展示当前角色仍有权限访问的模块 */
const recent = computed(() => {
  const pool = visibleModules(roles.value)
  return recentIds.value
    .map(id => pool.find(m => m.id === id))
    .filter((m): m is ConsoleModule => Boolean(m))
})

/* ---------------- 快捷键 ---------------- */

function onKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    searchRef.value?.focus()
  }
}

onMounted(async () => {
  window.addEventListener('keydown', onKeydown)

  const tasks: Promise<unknown>[] = [
    loadCount('/notice/myall', 'articles'),
    loadCount('/notice/favorites', 'favorites'),
    loadCount('/notice/privates', 'privates'),
    loadCount('/api/ls', 'apis'),
    loadCount('/auth/app/info', 'apps'),
    loadCount('/api/pwdnote', 'pnotes'),
    loadCount('/api/task/list', 'tasks'),
  ]

  // 任一指标失败不影响其余指标渲染
  await Promise.allSettled(tasks)
})

/** 角色由父层异步请求，管理员身份确认后再补拉卡密总数 */
watch(admin, (isAdmin) => {
  if (isAdmin) loadCardTotal()
}, {immediate: true})

onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>
