<template>
  <div ref="pageRef" class="fx-page">
    <!-- 背景舞台：当前效果以 fixed 图层铺满视口 -->
    <Galaxy v-if="activeId === 'galaxy'" :seed="seed" @stats="onGalaxyStats" />
    <City v-else-if="activeId === 'city'" />
    <InkTide v-else-if="activeId === 'ink-tide'" />
    <!-- 背景室是「看背景」的场合：展签就浮在背景上，所以关掉阅读降透明 -->
    <Gravity v-else-if="activeId === 'gravity'" :protect="false" @stats="onGravityStats" />
    <Landscape v-else />

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
        <p v-else-if="activeId === 'gravity' && gravityStats" class="fx-stats mono">
          粒子 {{ gravityCount }}，curl noise 流场
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
          切换明暗主题，每副背景都另有一套天色；点「应用到全站」后，除背景室外所有页面都会使用当前效果。
        </p>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onBeforeUnmount, onMounted, ref, watch} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import City from '@/components/City.vue'
import Galaxy from '@/components/Galaxy.vue'
import Gravity from '@/components/Gravity.vue'
import Landscape from '@/components/Landscape.vue'
import InkTide from '@/components/InkTide.vue'
import {globalBackground, setGlobalBackground, type BackgroundId} from '@/utils/background'
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
    id: BackgroundId
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
        id: 'landscape',
        name: '山水',
        note: '站点当前：户外风景，天亮与天黑',
        detail: '一叶扁舟停在湖上，三重山脊由淡到浓，山影落进水里。亮色主题是天亮：冷青天幕、地平线暖光、初升的日；暗色主题是天黑：深蓝天幕、低垂的月、星子与萤火。雾带极慢横移，水面波光各自明灭。',
        swatch: 'radial-gradient(30% 34% at 66% 44%, rgba(255,250,238,.98) 0 24%, rgba(255,214,150,.6) 44%, rgba(255,214,150,0) 100%), radial-gradient(64% 30% at 26% 62%, rgba(140,158,184,.85) 0 80%, rgba(140,158,184,0) 100%), radial-gradient(88% 32% at 80% 64%, rgba(112,128,150,.85) 0 76%, rgba(112,128,150,0) 100%), radial-gradient(4% 4% at 30% 74%, rgba(30,38,52,.85) 0 100%, rgba(30,38,52,0) 100%), linear-gradient(180deg, #dbe7f6 0%, #f7e6cb 64%, #cbdcea 100%)',
        isNew: true,
    },
    {
        id: 'galaxy',
        name: '银河',
        note: '实时星场：恒星、流星与黑洞',
        detail: '银河带由更密的星点组成，偶尔有流星划过。亮色主题像被一颗近距离的恒星照亮，暗色主题只留很暗的星光。鼠标停留处会出现一枚黑洞，周围的星点会被引力错位重排。同一颗种子能复现同一片星空。应用到全站后，它在亮色下会换成纸底墨星，免得深色正文读不清。',
        swatch: 'radial-gradient(2px 2px at 22% 28%, rgba(255,255,255,.95) 0, rgba(255,255,255,0) 70%), radial-gradient(1.6px 1.6px at 46% 18%, rgba(216,230,255,.9) 0, rgba(216,230,255,0) 70%), radial-gradient(1.4px 1.4px at 36% 62%, rgba(255,232,198,.8) 0, rgba(255,232,198,0) 70%), radial-gradient(1.6px 1.6px at 78% 74%, rgba(226,236,255,.85) 0, rgba(226,236,255,0) 70%), radial-gradient(58% 54% at 68% 30%, rgba(255,196,120,.45) 0%, rgba(255,196,120,0) 62%), radial-gradient(circle at 42% 58%, #000 0 4px, rgba(255,176,104,.9) 5px 6px, rgba(255,176,104,0) 8px), linear-gradient(160deg, #0a1020 0%, #02040a 100%)',
        isNew: true,
    },
    {
        id: 'city',
        name: '城市',
        note: '现代天际线，窗灯错峰明灭',
        detail: '一组现代高楼沿地平线展开，玻璃楼与石材楼交叠成立体天际线。亮色主题是清晨蓝调，少量窗户开始亮灯；暗色主题转入夜晚，暖光窗户成组亮起、熄灭，楼顶信标间歇闪烁。',
        swatch: 'radial-gradient(2px 2px at 22% 50%, #ffd18a 0 80%, transparent 90%), radial-gradient(2px 2px at 44% 68%, #ffd18a 0 80%, transparent 90%), radial-gradient(2px 2px at 72% 42%, #ffd18a 0 80%, transparent 90%), linear-gradient(90deg, transparent 0 8%, #31495f 8% 15%, transparent 15% 20%, #22384d 20% 28%, transparent 28% 33%, #2b4357 33% 46%, transparent 46% 51%, #1c3142 51% 68%, transparent 68% 72%, #31495f 72% 90%, transparent 90%), linear-gradient(180deg, #a9c2d5 0%, #ecd2ae 66%, #101a24 66% 100%)',
        isNew: true,
    },
    {
        id: 'ink-tide',
        name: '折光深渊',
        note: '深海折光，轻量三维空间',
        detail: '一个深海中心折出一座浮空晶体，外围是逐层后退的几何光面和细潮线。鼠标移动时，不同深度的光面会产生轻微景深差，像一件悬在海面上方的折光标本。亮色偏青瓷和银绿，暗色则沉入黑曜蓝。',
        swatch: 'radial-gradient(50% 72% at 50% 72%, rgba(121, 224, 214, .5), transparent 60%), linear-gradient(132deg, transparent 0 28%, rgba(232, 255, 244, .9) 29% 31%, transparent 32% 42%), linear-gradient(48deg, transparent 0 43%, rgba(237, 177, 103, .8) 44% 46%, transparent 47% 58%), linear-gradient(160deg, #123243 0%, #0a1a2a 100%)',
        isNew: true,
    },
    {
        id: 'gravity',
        name: '引力场',
        note: 'GPU 流场粒子：curl noise 与鼠标引力',
        detail: '上万颗粒子在 curl noise 流场里漂移：流场取标量势的旋度，散度为零，粒子只换位置、从不堆积。鼠标 200px 内是引力源，移动越快扰动越强，静止 1.5s 后流场自己抹平痕迹；点击落下一圈涟漪，波前把粒子推开。暗色是深空，青蓝与紫的粒子加法叠加、流速越快越亮；亮色是晨雾，靛蓝浮尘普通混合、透明度压到 0.15~0.35。切换主题时颜色与行为在 800ms 内插值，并重铸出一次全屏涟漪；粒子位置存在浮点纹理里走 GPU 迭代，CPU 每帧只提交一次绘制。',
        swatch: 'radial-gradient(1.5px 1.5px at 26% 34%, rgba(110,231,255,.95) 0, rgba(110,231,255,0) 70%), radial-gradient(1.5px 1.5px at 45% 58%, rgba(167,139,250,.9) 0, rgba(167,139,250,0) 70%), radial-gradient(1.5px 1.5px at 62% 28%, rgba(110,231,255,.8) 0, rgba(110,231,255,0) 70%), radial-gradient(1.5px 1.5px at 74% 66%, rgba(167,139,250,.85) 0, rgba(167,139,250,0) 70%), radial-gradient(1.4px 1.4px at 36% 78%, rgba(110,231,255,.7) 0, rgba(110,231,255,0) 70%), radial-gradient(48% 44% at 52% 48%, rgba(110,231,255,.22) 0, rgba(110,231,255,0) 70%), linear-gradient(160deg, #0a1020 0%, #05060a 100%)',
        isNew: true,
    },
]

const cases = CASES
const DEFAULT_ID: BackgroundId = 'landscape'

const route = useRoute()
const router = useRouter()

const pageRef = ref<HTMLElement | null>(null)
const validIds: string[] = CASES.map((item) => item.id)

function normalizeId(raw: unknown): BackgroundId {
    const value = Array.isArray(raw) ? raw[0] : raw
    const id = typeof value === 'string' ? value : ''
    return validIds.includes(id) ? (id as BackgroundId) : DEFAULT_ID
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

// 引力场的展签上写实际粒子数：它随视口与 DPR 自适应，值得让访客看见
const gravityStats = ref<{particles: number} | null>(null)
const gravityCount = computed(() => (gravityStats.value ? gravityStats.value.particles.toLocaleString('zh-CN') : ''))
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

function selectCase(id: BackgroundId) {
    if (id === activeId.value) return
    activeId.value = id
    if (id !== 'galaxy') stats.value = null
    if (id !== 'gravity') gravityStats.value = null
}

function onGalaxyStats(payload: GalaxyStats) {
    stats.value = payload
}

function onGravityStats(payload: {particles: number}) {
    gravityStats.value = payload
}

/** 把当前效果设为全站背景：银河连同种子一起记住，山水不带种子 */
function applyGlobal() {
    if (isGlobal.value) return
    if (activeId.value === 'galaxy') {
        setGlobalBackground('galaxy', seed.value)
        toast('银河已设为全站背景', 'success', 3200)
        return
    }
    setGlobalBackground(activeId.value)
    toast(`${activeCase.value.name}已设为全站背景`, 'success')
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
