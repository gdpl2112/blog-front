<template>
  <div ref="rootRef" class="scene" aria-hidden="true">
    <!-- 1. 天幕：上下渐变 + 压在地平线上的暖光 -->
    <div class="scene__sky"></div>

    <!-- 2. 日 / 月：亮色是初升的日，暗色是低垂的月，被山脊遮住下缘 -->
    <div class="scene__orb"></div>

    <!-- 3. 水面：映天色的渐变 + 日/月落进水里的倒影柱 -->
    <div class="scene__water"></div>

    <!-- 4. 静层：星、三重山脊，以及山脊在水里的倒影 -->
    <canvas ref="stillRef" class="scene__still"></canvas>

    <!-- 5. 雾带：两条极慢横移的柔光，压在山腰上 -->
    <div class="scene__mist">
      <span class="mist mist--a"></span>
      <span class="mist mist--b"></span>
    </div>

    <!-- 6. 动层：扁舟（随波轻晃）、水面波光、浮尘 / 萤火 -->
    <canvas ref="fxRef" class="scene__fx"></canvas>

    <!-- 7. 暗角 -->
    <div class="scene__vignette"></div>
  </div>
</template>

<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref} from 'vue'

/**
 * 户外风景底衬（纯 canvas + CSS，不含任何视频/图片资源）
 *
 * 一副山水，两时天色：
 *  - 亮色「天亮」：冷青天幕、地平线暖光、初升的日、湖上薄雾、淡墨远山；
 *  - 暗色「天黑」：深蓝天幕、低垂的月、星子、暖色萤火、浓墨近山。
 *  两副天色都由 CSS 令牌（--ls-*）给出，切主题只是换一组值，
 *  所以同一份画法在两种主题下都成立，也保证正文的深浅字各自读得清。
 *
 * 分层（自下而上）：
 *  1) sky     —— 天幕渐变 + 地平线暖光；
 *  2) orb     —— 日/月本体与光晕，压在静层之下，于是"从山后升起"；
 *  3) water   —— 水面渐变与倒影柱；
 *  4) still   —— 静层 canvas：星、三重山脊、山脊倒影，按固定种子烘焙一次；
 *  5) mist    —— 两条极慢横移的雾带；
 *  6) fx      —— 动层 canvas：扁舟轻晃、水面波光、浮尘 / 萤火；
 *  7) vignette—— 暗角。
 *
 * 几何：水平线位置只由 CSS 的 --ls-water-y 定义，山脊、倒影、波光都按它对齐，
 * canvas 侧读同一个值，避免两条线错位。
 *
 * 性能：静层只烘焙一次（窗口尺寸 / 主题变化才重画）；动层节流到 30fps，
 * 每帧只画一叶舟、几十条波光与二十来只萤火；页面不可见时停帧；
 * 静层 DPR 上限 2（带像素预算），动层 1.5。
 *
 * 降级：prefers-reduced-motion 下只画静态一帧。
 */

const rootRef = ref<HTMLElement | null>(null)
const stillRef = ref<HTMLCanvasElement | null>(null)
const fxRef = ref<HTMLCanvasElement | null>(null)

/* ---------- 可调参数 ---------- */

const TAU = Math.PI * 2
const FRAME_INTERVAL = 1000 / 30 // 动层按 30fps 跑，山水本来就慢
const SEED = 20261018 // 固定种子：同一片山水，每次进来都一样
const DPR_CAP = 2
const PIXEL_BUDGET = 12_000_000 // 静层 canvas 的像素上限

const BOAT_X = 0.44 // 扁舟横向位置：落在日/月倒影柱左边，与展签错开
const BOAT_DY = 0.085 // 扁舟落在水平线以下的纵向比例

const STAR_DENSITY = 26000
const STAR_MIN = 90
const STAR_MAX = 420

const SHIMMER_MIN = 26
const SHIMMER_MAX = 64

const MOTE_MIN = 14
const MOTE_MAX = 34
const MOTE_DENSITY = 52000

/**
 * 三重山脊：mean 是山脊平均高度（从水平线往上，占视口高度的比例），
 * amp 是起伏幅度，mirror 是它落进水里的倒影浓度。
 * 远山淡而平、近山浓而陡，靠这三点拉开纵深。
 */
const RIDGES = [
    {mean: 0.19, amp: 0.075, steps: 32, alpha: 0.55, mirror: 0.14},
    {mean: 0.13, amp: 0.085, steps: 64, alpha: 0.72, mirror: 0.2},
    {mean: 0.07, amp: 0.05, steps: 64, alpha: 0.88, mirror: 0.28},
]

/* ---------- 类型 ---------- */

type RGB = [number, number, number]

interface Palette {
    star: RGB
    starAlpha: number
    ridges: RGB[]
    ridgeAlpha: number
    mist: RGB
    water: RGB
    waterAlpha: number
    ink: RGB
    inkAlpha: number
    mote: RGB
    moteAlpha: number
}

interface Shimmer {
    x: number
    y: number
    w: number
    phase: number
    speed: number
}

interface Mote {
    x: number
    y: number
    r: number
    vx: number
    vy: number
    phase: number
    speed: number
    sway: number
}

/* ---------- 运行状态 ---------- */

let stillCtx: CanvasRenderingContext2D | null = null
let fxCtx: CanvasRenderingContext2D | null = null

let palette: Palette = {
    star: [232, 240, 255],
    starAlpha: 0,
    ridges: [[178, 194, 214], [140, 158, 184], [112, 128, 150]],
    ridgeAlpha: 1,
    mist: [255, 255, 255],
    water: [255, 255, 255],
    waterAlpha: 0.7,
    ink: [30, 38, 52],
    inkAlpha: 0.75,
    mote: [255, 240, 210],
    moteAlpha: 0.35,
}
let paletteSignature = ''

let ridgePaths: number[][] = []
let shimmer: Shimmer[] = []
let motes: Mote[] = []

let vw = 0
let vh = 0
let dpr = 1
let waterY = 0.64
let rafId = 0
let lastTick = 0
let timeSec = 0
let visible = true
let reduced = false
let resizeTimer = 0
let themeTimer = 0
let themeObserver: MutationObserver | null = null

/* ---------- 小工具 ---------- */

function clamp(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value))
}

/** 固定种子的伪随机：同一片山水，任何时候都长一样 */
function mulberry32(seed: number) {
    let a = seed >>> 0
    return function random() {
        a = (a + 0x6d2b79f5) | 0
        let t = Math.imul(a ^ (a >>> 15), 1 | a)
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}

function parseRGB(raw: string, fallback: RGB): RGB {
    const parts = raw.split(',').map((value) => parseFloat(value))
    if (parts.length < 3 || parts.some((value) => Number.isNaN(value))) return fallback
    return [parts[0], parts[1], parts[2]]
}

function parseNumber(raw: string, fallback: number) {
    const value = parseFloat(raw)
    return Number.isFinite(value) ? value : fallback
}

function rgba(color: RGB, alpha: number) {
    const a = clamp(alpha, 0, 1).toFixed(3)
    return `rgba(${color[0] | 0}, ${color[1] | 0}, ${color[2] | 0}, ${a})`
}

/** 两色相混，用来把远山往雾色里推 */
function mix(a: RGB, b: RGB, t: number): RGB {
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
}

/* ---------- 取色 ---------- */

/** 读自己的根元素：令牌就挂在 .scene 上（含 --ls-water-y），documentElement 上读不全 */
function readStyle(): CSSStyleDeclaration {
    return getComputedStyle(rootRef.value ?? document.documentElement)
}

function readPalette(): Palette {
    const cs = readStyle()
    return {
        star: parseRGB(cs.getPropertyValue('--ls-star'), [232, 240, 255]),
        starAlpha: parseNumber(cs.getPropertyValue('--ls-star-a'), 0),
        ridges: [1, 2, 3].map((i) => parseRGB(cs.getPropertyValue(`--ls-ridge-${i}`), [120, 140, 166])),
        ridgeAlpha: parseNumber(cs.getPropertyValue('--ls-ridge-a'), 1),
        mist: parseRGB(cs.getPropertyValue('--ls-mist'), [255, 255, 255]),
        water: parseRGB(cs.getPropertyValue('--ls-water'), [255, 255, 255]),
        waterAlpha: parseNumber(cs.getPropertyValue('--ls-water-a'), 0.7),
        ink: parseRGB(cs.getPropertyValue('--ls-ink'), [30, 38, 52]),
        inkAlpha: parseNumber(cs.getPropertyValue('--ls-ink-a'), 0.75),
        mote: parseRGB(cs.getPropertyValue('--ls-mote'), [255, 240, 210]),
        moteAlpha: parseNumber(cs.getPropertyValue('--ls-mote-a'), 0.35),
    }
}

function signatureOf(p: Palette) {
    return [p.star.join(','), p.starAlpha, p.ridges.map((c) => c.join(',')).join('/'), p.ridgeAlpha,
        p.ink.join(','), p.inkAlpha, p.mote.join(','), p.moteAlpha].join('|')
}

/* ---------- 尺寸 ---------- */

function sizeCanvas(canvas: HTMLCanvasElement | null, ratio: number) {
    if (!canvas) return null
    canvas.width = Math.round(vw * ratio)
    canvas.height = Math.round(vh * ratio)
    const ctx = canvas.getContext('2d')
    ctx?.setTransform(ratio, 0, 0, ratio, 0, 0)
    return ctx
}

function resizeCanvases() {
    vw = Math.max(1, window.innerWidth)
    vh = Math.max(1, window.innerHeight)
    const raw = window.devicePixelRatio || 1
    // 像素预算兜底：4K 屏上 DPR 会收敛到 1.2 左右，避免背景 canvas 过大
    const budget = Math.sqrt(PIXEL_BUDGET / (vw * vh))
    dpr = clamp(Math.min(raw, DPR_CAP, budget), 1, DPR_CAP)
    stillCtx = sizeCanvas(stillRef.value, dpr)
    fxCtx = sizeCanvas(fxRef.value, Math.min(1.5, dpr))
}

/* ---------- 山脊 ---------- */

/** 一维中点位移：迭代越深，山脊的细节越碎，粗糙度固定 0.52 时最像远山 */
function ridgePoints(rand: () => number, steps: number): number[] {
    let points = [rand() * 2 - 1, rand() * 2 - 1]
    let amp = 1
    while (points.length < steps + 1) {
        const next: number[] = []
        for (let i = 0; i < points.length; i++) {
            next.push(points[i])
            if (i < points.length - 1) {
                next.push((points[i] + points[i + 1]) / 2 + (rand() * 2 - 1) * amp)
            }
        }
        points = next
        amp *= 0.52
    }
    return points
}

/** 山脊轮廓：底边贴着水平线闭合，于是山从水里长出来 */
function ridgePath(ctx: CanvasRenderingContext2D, points: number[], spec: typeof RIDGES[number], wy: number) {
    const mean = spec.mean * vh
    const amp = spec.amp * vh
    ctx.beginPath()
    ctx.moveTo(0, wy)
    for (let i = 0; i < points.length; i++) {
        ctx.lineTo((i / (points.length - 1)) * vw, wy - mean + points[i] * amp)
    }
    ctx.lineTo(vw, wy)
    ctx.closePath()
}

/**
 * 画一重山：山尖混进雾色、山脚落到本色，就是水墨里的远近。
 * 倒影用同一套点、把画布翻过来再画一遍，浓度靠 scale 压。
 */
function drawRidge(
    ctx: CanvasRenderingContext2D,
    points: number[],
    spec: typeof RIDGES[number],
    wy: number,
    color: RGB,
    scale: number,
) {
    const top = wy - (spec.mean + spec.amp) * vh
    const gradient = ctx.createLinearGradient(0, top, 0, wy)
    const alpha = spec.alpha * palette.ridgeAlpha * scale
    gradient.addColorStop(0, rgba(mix(color, palette.mist, 0.6), alpha * 0.7))
    gradient.addColorStop(1, rgba(color, alpha))
    ridgePath(ctx, points, spec, wy)
    ctx.fillStyle = gradient
    ctx.fill()
}

/* ---------- 静层烘焙 ---------- */

function drawStars(ctx: CanvasRenderingContext2D, rand: () => number, wy: number) {
    if (palette.starAlpha < 0.02) return
    const count = Math.round(clamp((vw * vh) / STAR_DENSITY, STAR_MIN, STAR_MAX))
    for (let i = 0; i < count; i++) {
        const bright = Math.pow(rand(), 2.4)
        ctx.fillStyle = rgba(palette.star, palette.starAlpha * (0.2 + 0.8 * bright))
        ctx.beginPath()
        ctx.arc(rand() * vw, rand() * wy * 0.9, 0.35 + rand() * 0.8, 0, TAU)
        ctx.fill()
    }
}

function bake() {
    waterY = clamp(parseNumber(readStyle().getPropertyValue('--ls-water-y'), 64) / 100, 0.2, 0.9)
    palette = readPalette()
    paletteSignature = signatureOf(palette)
    resizeCanvases()

    const ctx = stillCtx
    if (!ctx) return
    const wy = vh * waterY
    const rand = mulberry32(SEED)
    ctx.clearRect(0, 0, vw, vh)

    drawStars(ctx, rand, wy)

    ridgePaths = RIDGES.map((spec) => ridgePoints(rand, spec.steps))
    RIDGES.forEach((spec, i) => drawRidge(ctx, ridgePaths[i], spec, wy, palette.ridges[i], 1))

    // 倒影：翻到水平线以下再画一遍，只有近处的山映得清楚
    ctx.save()
    ctx.beginPath()
    ctx.rect(0, wy, vw, vh - wy)
    ctx.clip()
    ctx.translate(0, wy * 2)
    ctx.scale(1, -1)
    RIDGES.forEach((spec, i) => drawRidge(ctx, ridgePaths[i], spec, wy, palette.ridges[i], spec.mirror))
    ctx.restore()
}

/* ---------- 动层 ---------- */

function buildShimmer(rand: () => number, wy: number) {
    shimmer = []
    const count = Math.round(clamp(vw / 26, SHIMMER_MIN, SHIMMER_MAX))
    for (let i = 0; i < count; i++) {
        shimmer.push({
            x: rand() * vw,
            y: wy + 6 + rand() * Math.max(1, vh - wy - 12),
            w: 8 + rand() * 56,
            phase: rand() * TAU,
            speed: 0.35 + rand() * 0.7,
        })
    }
}

function buildMotes(rand: () => number) {
    motes = []
    const count = Math.round(clamp((vw * vh) / MOTE_DENSITY, MOTE_MIN, MOTE_MAX))
    for (let i = 0; i < count; i++) {
        motes.push({
            x: rand() * vw,
            y: rand() * vh,
            r: 0.7 + rand() * 1.3,
            vx: 4 + rand() * 10,
            vy: -(3 + rand() * 9),
            phase: rand() * TAU,
            speed: 0.5 + rand() * 1.6,
            sway: 6 + rand() * 14,
        })
    }
}

/** 一叶扁舟：船身 + 乌篷 + 一支竹篙；倒影是同一个形状翻过来压扁 */
function boatShape(ctx: CanvasRenderingContext2D, w: number, h: number) {
    ctx.fillStyle = rgba(palette.ink, palette.inkAlpha)
    ctx.beginPath()
    ctx.moveTo(-w / 2, 0)
    ctx.quadraticCurveTo(0, h * 1.25, w / 2, 0)
    ctx.quadraticCurveTo(0, h * 0.42, -w / 2, 0)
    ctx.closePath()
    ctx.fill()
    ctx.beginPath()
    ctx.arc(-w * 0.06, -h * 0.1, w * 0.2, Math.PI, 0)
    ctx.closePath()
    ctx.fill()
    ctx.strokeStyle = rgba(palette.ink, palette.inkAlpha * 0.85)
    ctx.lineWidth = Math.max(1, w * 0.022)
    ctx.beginPath()
    ctx.moveTo(w * 0.2, -h * 1.5)
    ctx.lineTo(w * 0.34, h * 0.2)
    ctx.stroke()
}

function drawBoat(ctx: CanvasRenderingContext2D, wy: number, t: number) {
    const scale = clamp(vw * 0.00006, 0.6, 1.25)
    const w = 54 * scale
    const h = 11 * scale
    ctx.save()
    ctx.translate(vw * BOAT_X, wy + vh * BOAT_DY + Math.sin(t * 0.9) * 1.6)
    ctx.rotate(Math.sin(t * 0.9 + 0.6) * 0.05)
    ctx.save()
    ctx.scale(1, -0.5)
    ctx.globalAlpha = 0.22
    boatShape(ctx, w, h)
    ctx.restore()
    ctx.globalAlpha = 1
    boatShape(ctx, w, h)
    ctx.restore()
}

/** 波光：近水平线密、近岸稀，每条各自明灭 */
function drawShimmer(ctx: CanvasRenderingContext2D, t: number) {
    for (const line of shimmer) {
        const k = 0.5 + 0.5 * Math.sin(t * line.speed + line.phase)
        const alpha = palette.waterAlpha * (0.12 + 0.6 * k * k)
        if (alpha < 0.02) continue
        ctx.fillStyle = rgba(palette.water, alpha)
        ctx.fillRect(line.x + Math.sin(t * 0.4 + line.phase) * 6, line.y, line.w, 1)
    }
}

function updateMotes(dt: number) {
    for (const mote of motes) {
        mote.x += mote.vx * dt
        mote.y += mote.vy * dt
        if (mote.x > vw + 20) mote.x = -20
        if (mote.y < -20) mote.y = vh + 20
    }
}

/** 浮尘 / 萤火：一圈很淡的光晕 + 一枚亮点，暗色下就是湖边的萤火 */
function drawMotes(ctx: CanvasRenderingContext2D, t: number) {
    for (const mote of motes) {
        const flicker = 0.35 + 0.65 * Math.pow(0.5 + 0.5 * Math.sin(t * mote.speed + mote.phase), 2)
        const alpha = palette.moteAlpha * flicker
        if (alpha < 0.02) continue
        const x = mote.x + Math.sin(t * 0.6 + mote.phase) * mote.sway
        ctx.fillStyle = rgba(palette.mote, alpha * 0.28)
        ctx.beginPath()
        ctx.arc(x, mote.y, mote.r * 3.2, 0, TAU)
        ctx.fill()
        ctx.fillStyle = rgba(palette.mote, alpha)
        ctx.beginPath()
        ctx.arc(x, mote.y, mote.r, 0, TAU)
        ctx.fill()
    }
}

function drawFx(dt: number) {
    const ctx = fxCtx
    if (!ctx) return
    timeSec += dt
    ctx.clearRect(0, 0, vw, vh)
    const wy = vh * waterY
    drawBoat(ctx, wy, timeSec)
    drawShimmer(ctx, timeSec)
    updateMotes(dt)
    drawMotes(ctx, timeSec)
}

/* ---------- 主循环 ---------- */

function frame(now: number) {
    rafId = requestAnimationFrame(frame)
    if (!lastTick) {
        lastTick = now
        return
    }
    // 高刷屏按 30fps 封顶；120Hz 下每四帧画一次
    if (now - lastTick < FRAME_INTERVAL - 2) return
    const dt = Math.min(0.06, (now - lastTick) / 1000)
    lastTick = now
    drawFx(dt)
}

function start() {
    if (reduced || rafId) return
    lastTick = 0
    rafId = requestAnimationFrame(frame)
}

function stop() {
    if (rafId) cancelAnimationFrame(rafId)
    rafId = 0
}

/* ---------- 事件 ---------- */

function onVisibility() {
    visible = document.visibilityState === 'visible'
    if (visible && !reduced) start()
    else stop()
}

function onReducedChange() {
    reduced = !!mediaReduced?.matches
    if (reduced) {
        stop()
        drawFx(0)
    } else if (visible) {
        start()
    }
}

function onResize() {
    window.clearTimeout(resizeTimer)
    resizeTimer = window.setTimeout(() => {
        bake()
        if (reduced) drawFx(0)
    }, 180)
}

/** 切主题：先让 canvas 淡出，重烘焙后淡回，避免天色硬切 */
function onThemeChange() {
    const el = rootRef.value
    if (!el) return
    // App 在 onMounted 里会把 data-theme 设成与默认相同的值，也会触发一次观察；
    // 只有令牌真的变了才重烘焙，避免首屏无谓地闪一下
    if (signatureOf(readPalette()) === paletteSignature) return
    el.classList.add('is-swapping')
    window.clearTimeout(themeTimer)
    themeTimer = window.setTimeout(() => {
        bake()
        window.setTimeout(() => el.classList.remove('is-swapping'), 40)
    }, 140)
}

let mediaReduced: MediaQueryList | null = null
let detach = () => {}

onMounted(() => {
    mediaReduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    reduced = mediaReduced.matches

    bake()
    if (reduced) drawFx(0)

    window.addEventListener('resize', onResize, {passive: true})
    document.addEventListener('visibilitychange', onVisibility)
    mediaReduced.addEventListener('change', onReducedChange)

    // 主题切换后重新取色（App.vue 改的是 html[data-theme]）
    themeObserver = new MutationObserver(onThemeChange)
    themeObserver.observe(document.documentElement, {attributes: true, attributeFilter: ['data-theme']})

    detach = () => {
        window.removeEventListener('resize', onResize)
        document.removeEventListener('visibilitychange', onVisibility)
        mediaReduced?.removeEventListener('change', onReducedChange)
        themeObserver?.disconnect()
    }

    if (!reduced) start()
})

onBeforeUnmount(() => {
    stop()
    detach()
    window.clearTimeout(resizeTimer)
    window.clearTimeout(themeTimer)
})
</script>

<style scoped>
/* ============================================================
   山水底衬：固定铺满视口，永远在最底层
   与 Galaxy.vue 相同的约定 —— z-index: -1，body 保持透明
   ============================================================ */

.scene {
    position: fixed;
    inset: 0;
    z-index: -1;
    overflow: hidden;
    pointer-events: none;
    contain: paint;
    background: var(--ls-sky-1);
    /* 水平线：canvas 侧也读这一个值，别在两处各写一遍 */
    --ls-water-y: 64%;
}

/* ---------- 1. 天幕 ---------- */

.scene__sky {
    position: absolute;
    inset: 0;
    background:
        radial-gradient(72% 40% at var(--ls-orb-x) var(--ls-water-y),
        rgba(var(--ls-glow), var(--ls-glow-a)) 0%,
        rgba(var(--ls-glow), 0) 72%),
        linear-gradient(180deg, var(--ls-sky-1) 0%, var(--ls-sky-2) var(--ls-water-y));
}

/* ---------- 2. 日 / 月 ---------- */

.scene__orb {
    position: absolute;
    left: var(--ls-orb-x);
    top: var(--ls-orb-y);
    width: var(--ls-orb-size);
    height: var(--ls-orb-size);
    margin: calc(var(--ls-orb-size) / -2) 0 0 calc(var(--ls-orb-size) / -2);
    border-radius: 50%;
    background: radial-gradient(circle at center,
    rgba(var(--ls-sun-ink), 0.98) 0 46%,
    rgba(var(--ls-sun), 0.86) 62%,
    rgba(var(--ls-sun), 0) 100%);
    box-shadow:
        0 0 48px 14px rgba(var(--ls-sun), 0.34),
        0 0 180px 70px rgba(var(--ls-sun), 0.16);
    transition: opacity 320ms var(--ease), background 320ms var(--ease);
}

/* ---------- 3. 水面 ---------- */

.scene__water {
    position: absolute;
    left: 0;
    right: 0;
    top: var(--ls-water-y);
    bottom: 0;
    background:
        radial-gradient(20% 100% at var(--ls-orb-x) 0%,
        rgba(var(--ls-sun), var(--ls-reflect-a)) 0%,
        rgba(var(--ls-sun), 0) 76%),
        linear-gradient(180deg, var(--ls-water-2) 0%, var(--ls-water-1) 100%);
}

/* ---------- 4~6. 静层 / 雾带 / 动层 ---------- */

.scene__still,
.scene__fx {
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 100%;
    height: 100%;
    transition: opacity 260ms var(--ease);
}

/* 切主题时先淡出，重烘焙后再淡回 */
.scene.is-swapping .scene__still,
.scene.is-swapping .scene__fx {
    opacity: 0.2;
}

.scene__mist {
    position: absolute;
    inset: 0;
}

.mist {
    position: absolute;
    left: -30%;
    width: 160%;
    background: radial-gradient(50% 50% at 50% 50%,
    rgba(var(--ls-mist), var(--ls-mist-a)) 0%,
    rgba(var(--ls-mist), 0) 72%);
    will-change: transform;
}

.mist--a {
    top: calc(var(--ls-water-y) - 17vh);
    height: 18vh;
    animation: mist-drift 96s ease-in-out infinite alternate;
}

.mist--b {
    top: calc(var(--ls-water-y) - 8vh);
    height: 12vh;
    opacity: 0.7;
    animation: mist-drift 140s ease-in-out infinite alternate-reverse;
}

@keyframes mist-drift {
    from { transform: translate3d(-5%, 0, 0); }
    to { transform: translate3d(5%, 0, 0); }
}

/* ---------- 7. 暗角 ---------- */

.scene__vignette {
    position: absolute;
    inset: 0;
    background: radial-gradient(122% 100% at 50% 44%,
    rgba(var(--ls-vignette), 0) 36%,
    rgba(var(--ls-vignette), var(--ls-vignette-a)) 100%);
}

/* ---------- 降级 ---------- */

@media (prefers-reduced-motion: reduce) {
    .mist {
        animation: none;
    }
}
</style>
