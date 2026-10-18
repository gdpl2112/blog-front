<template>
  <div ref="pageRef" class="fx-page">
    <!-- 背景舞台：当前效果以 fixed 图层铺满视口 -->
    <Galaxy v-if="activeId === 'galaxy'" :seed="seed" @stats="onGalaxyStats" />
    <Backdrop v-else />

    <div class="fx-layout">
      <section class="fx-deck ink-in" aria-label="背景效果选择">
        <h1 class="fx-title">背景室</h1>
        <p class="fx-lede">这里只陈列背景。选一个效果，让它占满整页。</p>

        <div class="fx-list" role="group" aria-label="背景效果">
          <button
            v-for="item in cases"
            :key="item.id"
            type="button"
            class="fx-item"
            :class="{'is-active': item.id === activeId}"
            :aria-pressed="item.id === activeId"
            @click="selectCase(item.id)"
          >
            <span class="fx-swatch" :style="{background: item.swatch}" aria-hidden="true"></span>
            <span class="fx-item-body">
              <span class="fx-item-name">
                {{ item.name }}
                <span v-if="item.isNew" class="fx-new">新</span>
              </span>
              <span class="fx-item-note">{{ item.note }}</span>
            </span>
            <span v-if="item.id === activeId" class="fx-item-state">
              {{ item.id === globalBackground ? '展示中 · 全站' : '展示中' }}
            </span>
            <span v-else-if="item.id === globalBackground" class="fx-item-state fx-item-state--muted">全站背景</span>
          </button>
        </div>

        <p class="fx-detail">{{ activeCase.detail }}</p>

        <p v-if="activeId === 'galaxy' && stats" class="fx-stats mono">
          星点 {{ statStars }}，种子 {{ seed }}
        </p>

        <div class="fx-actions">
          <button
            type="button"
            class="btn btn--solid"
            :disabled="isGlobal"
            :title="isGlobal ? '当前效果已经是全站背景' : '把这个效果设为全站背景'"
            @click="applyGlobal"
          >
            {{ isGlobal ? '已是全站背景' : '应用到全站' }}
          </button>
          <button v-if="activeId === 'galaxy'" type="button" class="btn" @click="reseed">重新铺星</button>
          <button v-if="canFullscreen" type="button" class="btn" @click="toggleFullscreen">
            {{ isFullscreen ? '退出全屏' : '全屏观看' }}
          </button>
          <button type="button" class="btn btn--ghost" @click="copyLink">复制链接</button>
        </div>

        <p class="fx-hint">
          鼠标停在背景上会出现黑洞，周围星点会被弯折；切换明暗主题，亮色是恒星近距离照亮，暗色只留很暗的星光。
          点「应用到全站」后，除背景室外所有页面都会使用当前效果；银河是深色底衬，只在深色主题下接管全站，亮色主题仍保留琉璃底衬。
        </p>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onBeforeUnmount, onMounted, ref, watch} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import Backdrop from '@/components/Backdrop.vue'
import Galaxy from '@/components/Galaxy.vue'
import {globalBackground, setGlobalBackground} from '@/utils/background'
import {setTheme, theme} from '@/utils/theme'
import {toast} from '@/utils/utils'

/**
 * 背景室（/effects）：把背景当作展品逐个切换观看。
 *
 * 设计：
 *  - 背景是全幅舞台，前景只留一张左下角的玻璃「展签」，不抢戏；
 *  - 当前效果直接以 fixed 图层铺满视口，切换效果就是换一层背景；
 *  - 选中的效果写进 ?fx= 查询参数，复制链接即可单独展示某个效果；
 *  - 全屏对准页面根节点，进入后站点顶栏、页脚都退场，只剩背景与展签。
 *
 * 注意：本页路由 meta 里带 hideBackdrop，App.vue 会关掉全站底衬，
 * 由本页自己挂载所选效果，避免两层背景叠在一起。
 */

interface FxCase {
    id: string
    name: string
    note: string
    detail: string
    swatch: string
    isNew?: boolean
}

interface GalaxyStats {
    stars: number
    seed: number
}

// 缩略图用固定渐变：它代表效果本体，不随站点明暗切换
const CASES: FxCase[] = [
    {
        id: 'galaxy',
        name: '银河',
        note: '实时星场：恒星、流星与黑洞',
        detail: '银河带由更密的星点组成，偶尔有流星划过。亮色主题像被一颗近距离的恒星照亮，暗色主题只留很暗的星光。鼠标停留处会出现一枚黑洞，周围的星点会被引力错位重排。同一颗种子能复现同一片星空。',
        swatch: 'radial-gradient(2px 2px at 22% 28%, rgba(255,255,255,.95) 0, rgba(255,255,255,0) 70%), radial-gradient(1.6px 1.6px at 46% 18%, rgba(216,230,255,.9) 0, rgba(216,230,255,0) 70%), radial-gradient(1.4px 1.4px at 36% 62%, rgba(255,232,198,.8) 0, rgba(255,232,198,0) 70%), radial-gradient(1.6px 1.6px at 78% 74%, rgba(226,236,255,.85) 0, rgba(226,236,255,0) 70%), radial-gradient(58% 54% at 68% 30%, rgba(255,196,120,.45) 0%, rgba(255,196,120,0) 62%), radial-gradient(circle at 42% 58%, #000 0 4px, rgba(255,176,104,.9) 5px 6px, rgba(255,176,104,0) 8px), linear-gradient(160deg, #0a1020 0%, #02040a 100%)',
        isNew: true,
    },
    {
        id: 'backdrop',
        name: '琉璃底衬',
        note: '站点当前：柔光、稿纸格与光尘',
        detail: '站点正在使用的底衬：四团超慢色片、稿纸格与跟随指针的光尘，逐帧节流后保持低开销。',
        swatch: 'radial-gradient(70% 70% at 22% 24%, rgba(126,158,255,.75) 0%, rgba(126,158,255,0) 70%), radial-gradient(64% 64% at 80% 28%, rgba(246,166,148,.6) 0%, rgba(246,166,148,0) 70%), radial-gradient(70% 70% at 58% 92%, rgba(104,208,176,.5) 0%, rgba(104,208,176,0) 72%), radial-gradient(70% 70% at 16% 82%, rgba(168,140,246,.45) 0%, rgba(168,140,246,0) 72%), linear-gradient(160deg, #eef4fc 0%, #dae5f5 100%)',
    },
]

const cases = CASES
const DEFAULT_ID = 'galaxy'

const route = useRoute()
const router = useRouter()

const pageRef = ref<HTMLElement | null>(null)
const validIds = CASES.map((item) => item.id)

function normalizeId(raw: unknown) {
    const value = Array.isArray(raw) ? raw[0] : raw
    const id = typeof value === 'string' ? value : ''
    return validIds.includes(id) ? id : DEFAULT_ID
}

function normalizeSeed(raw: unknown): number | null {
    const value = Array.isArray(raw) ? raw[0] : raw
    const parsed = typeof value === 'string' ? Number(value) : Number.NaN
    if (!Number.isFinite(parsed) || parsed <= 0) return null
    return Math.floor(parsed)
}

const activeId = ref(normalizeId(route.query.fx))
const activeCase = computed(() => CASES.find((item) => item.id === activeId.value) ?? CASES[0])
const isGlobal = computed(() => globalBackground.value === activeId.value)
const seed = ref(normalizeSeed(route.query.seed) ?? 20261018)
const stats = ref<GalaxyStats | null>(null)
const statStars = computed(() => (stats.value ? stats.value.stars.toLocaleString('zh-CN') : ''))
const canFullscreen = Boolean(document.fullscreenEnabled)
const isFullscreen = ref(Boolean(document.fullscreenElement))

/** 把当前效果与种子写回 URL；其他查询参数保持原样 */
function syncQuery() {
    const query: Record<string, string> = {}
    for (const [key, raw] of Object.entries(route.query)) {
        if (key === 'fx' || key === 'seed') continue
        if (typeof raw === 'string') query[key] = raw
        else if (Array.isArray(raw)) {
            const first = raw.find((item) => typeof item === 'string')
            if (typeof first === 'string') query[key] = first
        }
    }
    query.fx = activeId.value
    if (activeId.value === 'galaxy') query.seed = String(seed.value)

    const same = Object.keys(query).length === Object.keys(route.query).length
        && Object.entries(query).every(([key, value]) => route.query[key] === value)
    if (!same) {
        router.replace({query}).catch(() => {
        })
    }
}

// 选择效果、重新铺星都同步到地址栏，链接可以被单独收藏或分享
watch([activeId, seed], syncQuery)

// 浏览器前进/后退、手改 query 时，舞台跟着走
watch(() => route.query.fx, (fx) => {
    const id = normalizeId(fx)
    if (id !== activeId.value) activeId.value = id
})

watch(() => route.query.seed, (raw) => {
    const next = normalizeSeed(raw)
    if (next === null) {
        // 银河道下手动删掉 seed 时补回来；底衬效果本来就不带 seed，不用管
        if (activeId.value === 'galaxy') syncQuery()
        return
    }
    if (next !== seed.value) seed.value = next
})

function selectCase(id: string) {
    if (id === activeId.value) return
    activeId.value = id
    if (id !== 'galaxy') stats.value = null
}

function onGalaxyStats(payload: GalaxyStats) {
    stats.value = payload
}

/** 把当前效果设为全站背景：银河只记深色主题的种子，并顺手切到深色 */
function applyGlobal() {
    if (isGlobal.value) return
    if (activeId.value === 'galaxy') {
        setGlobalBackground('galaxy', seed.value)
        const wasLight = theme.value === 'light'
        if (wasLight) setTheme('dark')
        toast(wasLight
            ? '银河已设为全站背景，并切到深色主题；亮色主题下仍显示琉璃底衬'
            : '银河已设为全站背景', 'success', 3200)
        return
    }
    setGlobalBackground('backdrop')
    toast('已把琉璃底衬设为全站背景', 'success')
}

/** 换一个种子就换一片星空；同一片星空可从种子复现 */
function reseed() {
    seed.value = 1000 + Math.floor(Math.random() * 900000)
}

async function toggleFullscreen() {
    if (!document.fullscreenEnabled) {
        toast('当前浏览器不支持页面全屏', 'warning')
        return
    }
    try {
        if (document.fullscreenElement) {
            await document.exitFullscreen()
        } else {
            await pageRef.value?.requestFullscreen()
        }
    } catch {
        toast('全屏切换失败', 'warning')
    }
}

function onFullscreenChange() {
    isFullscreen.value = Boolean(document.fullscreenElement)
}

async function copyLink() {
    const query: Record<string, string> = {fx: activeId.value}
    if (activeId.value === 'galaxy') query.seed = String(seed.value)
    const href = window.location.origin + router.resolve({path: '/effects', query}).href
    try {
        if (!navigator.clipboard) throw new Error('clipboard unavailable')
        await navigator.clipboard.writeText(href)
        toast('链接已复制', 'success')
    } catch {
        toast('复制失败，请从地址栏复制', 'warning')
    }
}

onMounted(() => {
    // 首次进入时把默认效果与种子补进 URL，保证地址栏里的链接可复现
    syncQuery()
    document.addEventListener('fullscreenchange', onFullscreenChange)
    isFullscreen.value = Boolean(document.fullscreenElement)
})

onBeforeUnmount(() => {
    document.removeEventListener('fullscreenchange', onFullscreenChange)
    // 离开页面时手动退出全屏，避免浏览器停留在已卸载的节点上
    if (document.fullscreenElement === pageRef.value) {
        document.exitFullscreen().catch(() => {
        })
    }
})
</script>

<style scoped>
/* =============================================
   背景室：全幅背景舞台 + 左下角一张玻璃展签
   ============================================= */

.fx-page {
  position: relative;
  min-height: calc(100vh - var(--nav-h) - var(--gap-6));
  display: flex;
  align-items: flex-end;
  padding: var(--gap-7) 0 var(--gap-6);
}

.fx-layout {
  display: flex;
  justify-content: flex-start;
  width: 100%;
}

/* ---------- 展签 ---------- */

.fx-deck {
  width: min(438px, 100%);
  padding: var(--gap-6);
  background: var(--glass-strong);
  border: 1px solid var(--glass-line);
  border-radius: var(--r-lg);
  box-shadow: var(--glass-shadow), var(--glass-inner);
  backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-sat));
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-sat));
}

.fx-title {
  margin: 0 0 var(--gap-2);
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 600;
  letter-spacing: 0.16em;
  line-height: 1.2;
}

.fx-lede {
  margin: 0 0 var(--gap-5);
  color: var(--ink-2);
  font-size: var(--text-sm);
  line-height: 1.9;
}

/* ---------- 效果列表 ---------- */

.fx-list {
  border-top: 1px solid var(--rule);
}

.fx-item {
  display: grid;
  grid-template-columns: 42px minmax(0, 1fr) auto;
  align-items: center;
  gap: var(--gap-3);
  width: 100%;
  padding: var(--gap-3) 0;
  border: 0;
  border-bottom: 1px solid var(--rule);
  background: none;
  color: var(--ink);
  font-family: var(--font-sans);
  text-align: left;
  cursor: pointer;
  appearance: none;
  transition: color var(--dur) var(--ease);
}

.fx-item:focus-visible {
  outline: 2px solid var(--focus-ring);
  outline-offset: 2px;
  border-radius: 6px;
}

.fx-item:hover .fx-item-name {
  color: var(--seal);
}

.fx-swatch {
  display: block;
  width: 42px;
  height: 42px;
  border: 1px solid var(--glass-line-2);
  border-radius: 10px;
  box-shadow: var(--glass-inner);
  transition: box-shadow var(--dur) var(--ease);
}

.fx-item.is-active .fx-swatch {
  box-shadow: 0 0 0 2px var(--seal), var(--glass-inner);
}

.fx-item-body {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.fx-item-name {
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-family: var(--font-display);
  font-size: var(--text-md);
  font-weight: 600;
  letter-spacing: 0.06em;
  transition: color var(--dur) var(--ease);
}

.fx-new {
  padding: 1px 5px;
  border-radius: 4px;
  background: var(--seal-wash);
  color: var(--seal);
  font-family: var(--font-sans);
  font-size: var(--text-2xs);
  font-weight: 500;
  letter-spacing: 0.06em;
  line-height: 1.4;
}

.fx-item-note {
  overflow: hidden;
  color: var(--ink-3);
  font-size: var(--text-xs);
  line-height: 1.6;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.fx-item-state {
  color: var(--seal);
  font-size: var(--text-xs);
  letter-spacing: 0.04em;
  white-space: nowrap;
}

.fx-item-state--muted {
  color: var(--ink-3);
}

.fx-actions .btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

/* ---------- 当前效果说明 ---------- */

.fx-detail {
  margin: var(--gap-4) 0 0;
  color: var(--ink-2);
  font-size: var(--text-sm);
  line-height: 1.95;
}

.fx-stats {
  margin: var(--gap-2) 0 0;
  color: var(--ink-3);
  font-size: var(--text-2xs);
  letter-spacing: 0.05em;
}

.fx-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--gap-2);
  margin-top: var(--gap-5);
}

.fx-hint {
  margin: var(--gap-4) 0 0;
  color: var(--ink-3);
  font-size: var(--text-xs);
  line-height: 1.8;
}

/* ---------- 全屏：只留背景与展签 ---------- */

.fx-page:fullscreen {
  min-height: 100vh;
  background: transparent;
}

/* 全屏后站点壳层退场，内容要自己回到站点的版心宽度 */
.fx-page:fullscreen .fx-layout {
  width: 100%;
  max-width: var(--w-page);
  margin: 0 auto;
  padding: 0 var(--pad-x);
}

.fx-page::backdrop {
  background: #05070d;
}

/* ---------- 移动端 ---------- */

@media (max-width: 720px) {
  .fx-page {
    padding: var(--gap-5) 0 var(--gap-4);
  }

  .fx-deck {
    width: 100%;
    padding: var(--gap-5);
  }

  .fx-title {
    font-size: var(--text-xl);
  }

  .fx-item {
    grid-template-columns: 38px minmax(0, 1fr) auto;
  }

  .fx-swatch {
    width: 38px;
    height: 38px;
  }
}
</style>
