<template>
  <div ref="rootRef" class="galaxy" aria-hidden="true">
    <!-- 1. 天幕：纸色 / 深空的静态打底 -->
    <div class="galaxy__sky"></div>

    <!-- 2. 恒星：亮色下像附近有一颗星在照明；暗色不点亮 -->
    <div class="galaxy__sun">
      <span class="sun__glow"></span>
      <span class="sun__core"></span>
    </div>

    <!-- 3. 静态星场：散星 + 银河带星 + 亮星，按种子一次性烘焙 -->
    <canvas ref="starCanvasRef" class="galaxy__stars"></canvas>

    <!-- 4. 引力透镜层：悬停时把黑洞周围的星点重绘成被拉弯的弧 -->
    <canvas ref="lensCanvasRef" class="galaxy__lens"></canvas>

    <!-- 5. 动态星场：呼吸星与流星，逐帧清空重画 -->
    <canvas ref="fxCanvasRef" class="galaxy__fx"></canvas>

    <!-- 6. 黑洞：鼠标悬浮处的事件视界 + 光子环 + 吸积盘 -->
    <div class="galaxy__hole">
      <span class="hole__halo"></span>
      <span class="hole__starlight"></span>
      <span class="hole__disk"></span>
      <span class="hole__sphere"></span>
      <span class="hole__ring"></span>
    </div>

    <!-- 7. 暗角：收住四边，避免大屏上显得发灰 -->
    <div class="galaxy__vignette"></div>
  </div>
</template>

<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref, watch} from 'vue'

/**
 * 银河底衬（纯 canvas + CSS，不依赖视频、图片或第三方库）
 *
 * 分层：
 *  1) sky     —— 静态渐变打底；亮色是纸色天幕，暗色是深空；
 *  2) sun     —— 亮色专属的恒星：一团暖光 + 一枚带十字光芒的星，把暗色星空照亮；
 *                暗色下收起，只留很暗的星光；
 *  3) stars   —— 静态层：散星、银河带星、带十字星芒的亮星，按 seed 一次性烘焙到 canvas；
 *                窗口尺寸 / 主题 / 种子变化时才重画；
 *  4) lens    —— 引力透镜层：悬停时把黑洞周围 140px 内的星点按薄透镜映射错位重排；
 *  5) fx      —— 动态层：呼吸星与流星，逐帧清空重画（数量少，开销可控）；
 *  6) hole    —— 鼠标悬浮处的黑洞：事件视界、光子环、吸积盘，纯 CSS；
 *  7) vignette—— 暗角。
 *
 * 主题：
 *  - 亮色仍是暗色星空，但被一颗近距离恒星照亮（暖光 + 亮星），不是全白纸面；
 *  - 暗色把光收掉：只留很暗的星光，让黑洞成为视觉中心；
 *  - 切主题时读一次 CSS 令牌重烘焙，并对各层 canvas 做一次淡入淡出，避免闪跳。
 *  - 被「应用到全站」的那一份会带上 .galaxy--site，亮色下另取一套「纸底墨星」，
 *    原因见 design-tokens.css。
 *
 * 性能：
 *  - 静态星场只烘焙一次；悬停时只重绘黑洞周围被 mask 挖掉的几百颗星；
 *  - 逐帧层只画 64 颗呼吸星与最多 1~2 颗流星；
 *  - 页面不可见时停帧；prefers-reduced-motion 下只保留静态一帧；
 *  - 各层 canvas 的像素总量设上限：星场 DPR 最多 2，透镜与 fx 最多 1.5，
 *    4K 屏上也不会为了背景吃掉过多显存；
 *  - 黑洞是纯 CSS 图层，鼠标移动只写两个坐标变量；没指过来时吸积盘暂停自转；
 *  - 触屏（hover: none）不绑定指针，黑洞与视差都不出现。
 */

const props = withDefaults(defineProps<{ seed?: number }>(), {seed: 20261018})
const emit = defineEmits<{(e: 'stats', payload: {stars: number; seed: number}): void}>()

const rootRef = ref<HTMLElement | null>(null)
const starCanvasRef = ref<HTMLCanvasElement | null>(null)
const lensCanvasRef = ref<HTMLCanvasElement | null>(null)
const fxCanvasRef = ref<HTMLCanvasElement | null>(null)

/* ---------- 可调参数 ---------- */

const TAU = Math.PI * 2
const FRAME_INTERVAL = 1000 / 60 // fx 层很轻，按 60fps 跑；120Hz 屏会自然降到 60
const BAND_ANGLE = (-17 * Math.PI) / 180 // 银河带与水平线的夹角
const BAND_CY = 0.42 // 银河带中心在视口中的纵向比例
const DPR_CAP = 2
const STAR_PIXEL_BUDGET = 12_000_000 // 静态星场 canvas 的最大像素量
const FIELD_DENSITY = 1300 // 每多少平方像素一颗散星
const BAND_DENSITY = 900 // 每多少平方像素一颗银河带星
const FIELD_MIN = 360
const FIELD_MAX = 1700
const BAND_MIN = 560
const BAND_MAX = 2600
const TWINKLE_COUNT = 64
const LENS_EINSTEIN_R = 52 // 黑洞的爱因斯坦半径（px）
const LENS_MASK_R = 140 // 星场被透镜接管的半径（与 CSS mask 的尺寸保持一致）
const LENS_SRC_R = 140 // 参与重绘的源星范围
const METEOR_GAP_MIN = 7000
const METEOR_GAP_RANGE = 9000

/* ---------- 类型 ---------- */

type RGB = [number, number, number]

interface Palette {
    star: RGB
    cool: RGB
    warm: RGB
    starAlpha: number
    meteor: RGB
    meteorAlpha: number
}

interface TwinkleStar {
    x: number
    y: number
    r: number
    color: RGB
    alpha: number
    phase: number
    speed: number
    sway: number
}

interface Meteor {
    x: number
    y: number
    vx: number
    vy: number
    len: number
    life: number
    age: number
    width: number
}

/** 静态星点：透镜层要用同一份数据把黑洞附近的星重画成弧 */
interface StarPoint {
    x: number
    y: number
    r: number
    color: RGB
    alpha: number
    bright: boolean
}

/* ---------- 运行状态 ---------- */

let starCtx: CanvasRenderingContext2D | null = null
let lensCtx: CanvasRenderingContext2D | null = null
let fxCtx: CanvasRenderingContext2D | null = null

let palette: Palette = {
    star: [226, 236, 255],
    cool: [150, 190, 255],
    warm: [255, 220, 180],
    starAlpha: 0.95,
    meteor: [238, 246, 255],
    meteorAlpha: 0.9,
}
let paletteSignature = ''

let vw = 0
let vh = 0
let dpr = 1
let twinkles: TwinkleStar[] = []
let meteors: Meteor[] = []
let stars: StarPoint[] = []

let rafId = 0
let lastTick = 0
let timeSec = 0
let visible = true
let reduced = false
let hoverNone = false

let targetX = 0
let targetY = 0
let starX = 0
let starY = 0

let holeX = 0
let holeY = 0
let pointing = false
let lensOpacity = 0
let lensActive = false

let nextMeteorAt = 0
let resizeTimer = 0
let themeTimer = 0
let mediaReduced: MediaQueryList | null = null
let mediaHover: MediaQueryList | null = null
let themeObserver: MutationObserver | null = null

/* ---------- 工具 ---------- */

function clamp(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value))
}

/** 固定种子的伪随机：同一个 seed 永远得到同一片星空 */
function mulberry32(seed: number) {
    let a = seed >>> 0
    return function random() {
        a = (a + 0x6d2b79f5) | 0
        let t = Math.imul(a ^ (a >>> 15), 1 | a)
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}

/** Box-Muller：把均匀随机转成标准正态，用来做银河带两侧的软衰减 */
function gauss(rand: () => number) {
    const u = Math.max(1e-6, rand())
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * rand())
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

function readPalette(): Palette {
    // 读自己的根元素：全站那一份靠 .galaxy--site 覆盖令牌，documentElement 上读不到
    const cs = getComputedStyle(rootRef.value ?? document.documentElement)
    return {
        star: parseRGB(cs.getPropertyValue('--gx-star'), [226, 236, 255]),
        cool: parseRGB(cs.getPropertyValue('--gx-star-cool'), [150, 190, 255]),
        warm: parseRGB(cs.getPropertyValue('--gx-star-warm'), [255, 220, 180]),
        starAlpha: parseNumber(cs.getPropertyValue('--gx-star-a'), 0.95),
        meteor: parseRGB(cs.getPropertyValue('--gx-meteor'), [238, 246, 255]),
        meteorAlpha: parseNumber(cs.getPropertyValue('--gx-meteor-a'), 0.9),
    }
}

function signatureOf(p: Palette) {
    return [
        p.star.join(','), p.cool.join(','), p.warm.join(','), p.starAlpha,
        p.meteor.join(','), p.meteorAlpha,
    ].join('|')
}

function pickColor(rand: () => number): RGB {
    const p = rand()
    if (p < 0.07) return palette.warm
    if (p < 0.27) return palette.cool
    return palette.star
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
    const rawRatio = window.devicePixelRatio || 1
    // 像素预算兜底：4K 屏上 DPR 会收敛到 1.2 左右，避免背景 canvas 过大
    const budgetRatio = Math.sqrt(STAR_PIXEL_BUDGET / (vw * vh))
    dpr = clamp(Math.min(rawRatio, DPR_CAP, budgetRatio), 1, DPR_CAP)
    starCtx = sizeCanvas(starCanvasRef.value, dpr)
    // 透镜层带一点柔化反而更像被引力拉过的光，1.5 倍足够
    lensCtx = sizeCanvas(lensCanvasRef.value, Math.min(1.5, dpr))
    // fx 层只画柔光与流星，1.5 倍足够，能省一半以上像素
    fxCtx = sizeCanvas(fxCanvasRef.value, Math.min(1.5, dpr))
}

/* ---------- 烘焙静态星场 ---------- */

function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, rand: () => number, dim = 1) {
    const radius = 0.35 + rand() * 0.95
    const bright = Math.pow(rand(), 2.7)
    const color = pickColor(rand)
    const alpha = palette.starAlpha * (0.16 + 0.84 * bright) * dim
    if (alpha < 0.02) return

    stars.push({x, y, r: radius, color, alpha, bright: false})

    ctx.fillStyle = rgba(color, alpha)
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, TAU)
    ctx.fill()

    // 稍大的星点补一圈很淡的外晕，让星"发亮"而不是一颗硬点
    if (radius > 1 && alpha > 0.3) {
        ctx.fillStyle = rgba(color, alpha * 0.13)
        ctx.beginPath()
        ctx.arc(x, y, radius * 3.1, 0, TAU)
        ctx.fill()
    }
}

function drawRay(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    length: number,
    angle: number,
    color: RGB,
    alpha: number,
) {
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(angle)
    const gradient = ctx.createLinearGradient(-length, 0, length, 0)
    gradient.addColorStop(0, rgba(color, 0))
    gradient.addColorStop(0.5, rgba(color, alpha))
    gradient.addColorStop(1, rgba(color, 0))
    ctx.strokeStyle = gradient
    ctx.lineWidth = 0.7
    ctx.beginPath()
    ctx.moveTo(-length, 0)
    ctx.lineTo(length, 0)
    ctx.stroke()
    ctx.restore()
}

function drawBrightStar(ctx: CanvasRenderingContext2D, x: number, y: number, rand: () => number) {
    const radius = 0.9 + rand() * 1
    const color = pickColor(rand)
    const alpha = palette.starAlpha * (0.75 + rand() * 0.25)
    const glowRadius = radius * (7 + rand() * 4)

    stars.push({x, y, r: radius, color, alpha, bright: true})

    const glow = ctx.createRadialGradient(x, y, 0, x, y, glowRadius)
    glow.addColorStop(0, rgba(color, alpha * 0.42))
    glow.addColorStop(0.32, rgba(color, alpha * 0.12))
    glow.addColorStop(1, rgba(color, 0))
    ctx.fillStyle = glow
    ctx.beginPath()
    ctx.arc(x, y, glowRadius, 0, TAU)
    ctx.fill()

    ctx.fillStyle = rgba(color, Math.min(1, alpha + 0.08))
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, TAU)
    ctx.fill()

    // 十字星芒：真实长焦拍亮星时最容易被认出的细节
    const ray = radius * (7 + rand() * 6)
    drawRay(ctx, x, y, ray, 0, color, alpha * 0.5)
    drawRay(ctx, x, y, ray * 0.85, Math.PI / 2, color, alpha * 0.42)
}

function drawBrightStars(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    unit: number,
    sigmaMain: number,
    sigmaHalo: number,
    rand: () => number,
) {
    const count = Math.round(clamp((vw * vh) / 240000, 7, 15))
    const cos = Math.cos(BAND_ANGLE)
    const sin = Math.sin(BAND_ANGLE)
    for (let i = 0; i < count; i++) {
        const along = (rand() * 2 - 1) * 0.55 * unit
        const lateral = gauss(rand) * (rand() < 0.7 ? sigmaMain : sigmaHalo) * 0.75
        drawBrightStar(
            ctx,
            cx + cos * along - sin * lateral,
            cy + sin * along + cos * lateral,
            rand,
        )
    }
    return count
}

function bake() {
    resizeCanvases()
    palette = readPalette()
    paletteSignature = signatureOf(palette)

    const ctx = starCtx
    if (!ctx) return
    ctx.clearRect(0, 0, vw, vh)
    stars = []

    const rand = mulberry32(props.seed)
    const area = vw * vh
    const fieldCount = Math.round(clamp(area / FIELD_DENSITY, FIELD_MIN, FIELD_MAX))
    const bandCount = Math.round(clamp(area / BAND_DENSITY, BAND_MIN, BAND_MAX))
    const unit = Math.max(vw, vh) // 与 CSS 里的 vmax 对应
    const cx = vw * 0.5
    const cy = vh * BAND_CY
    const cos = Math.cos(BAND_ANGLE)
    const sin = Math.sin(BAND_ANGLE)
    const sigmaMain = Math.min(vw, vh) * 0.1
    const sigmaHalo = Math.min(vw, vh) * 0.19

    // 1) 均匀散星：铺满整个天幕，给银河带做背景
    for (let i = 0; i < fieldCount; i++) {
        drawStar(ctx, rand() * vw, rand() * vh, rand)
    }

    // 2) 银河带：沿倾斜中轴高斯分布；两成聚成小团，模拟星协与亮区
    const clusters: {along: number; lateral: number}[] = []
    for (let i = 0; i < 7; i++) {
        clusters.push({
            along: (rand() * 2 - 1) * 0.5 * unit,
            lateral: gauss(rand) * sigmaMain * 0.4,
        })
    }
    for (let i = 0; i < bandCount; i++) {
        let along: number
        let lateral: number
        if (rand() < 0.2) {
            const cluster = clusters[Math.floor(rand() * clusters.length)]
            along = cluster.along + gauss(rand) * unit * 0.014
            lateral = cluster.lateral + gauss(rand) * sigmaMain * 0.55
        } else {
            along = (rand() < 0.55 ? gauss(rand) * 0.3 : (rand() * 2 - 1) * 0.62) * unit
            lateral = gauss(rand) * (rand() < 0.62 ? sigmaMain : sigmaHalo)
        }
        drawStar(
            ctx,
            cx + cos * along - sin * lateral,
            cy + sin * along + cos * lateral,
            rand,
            0.66,
        )
    }

    // 3) 亮星：带十字星芒的少数主角
    const brightCount = drawBrightStars(ctx, cx, cy, unit, sigmaMain, sigmaHalo, rand)

    // 5) 呼吸星：不烘焙进静态层，交给 fx 层做亮度变化
    twinkles = []
    for (let i = 0; i < TWINKLE_COUNT; i++) {
        let x: number
        let y: number
        if (rand() < 0.75) {
            const along = (rand() * 2 - 1) * 0.5 * unit
            const lateral = gauss(rand) * sigmaMain
            x = cx + cos * along - sin * lateral
            y = cy + sin * along + cos * lateral
        } else {
            x = rand() * vw
            y = rand() * vh
        }
        twinkles.push({
            x,
            y,
            r: 0.5 + rand() * 1.15,
            color: pickColor(rand),
            alpha: palette.starAlpha * (0.45 + rand() * 0.5),
            phase: rand() * TAU,
            speed: 0.7 + rand() * 2.1,
            sway: 0.35 + rand() * 0.5,
        })
    }

    emit('stats', {stars: fieldCount + bandCount + brightCount + TWINKLE_COUNT, seed: props.seed})

    // 减少动态时也要有一帧可看的呼吸星
    if (reduced) drawFx(0)
    updateLens()
}

/* ---------- 动态层：呼吸星 / 流星 ---------- */

function createMeteor(): Meteor {
    const direction = Math.random() < 0.5 ? 1 : -1
    const speed = 520 + Math.random() * 340
    return {
        x: vw * (0.1 + Math.random() * 0.8),
        y: vh * (0.04 + Math.random() * 0.34),
        vx: direction * speed * (0.9 + Math.random() * 0.25),
        vy: speed * (0.55 + Math.random() * 0.3),
        len: 130 + Math.random() * 220,
        life: 0.85 + Math.random() * 0.5,
        age: 0,
        width: 1.1 + Math.random() * 1.2,
    }
}

function updateMeteors(dt: number) {
    for (let i = meteors.length - 1; i >= 0; i--) {
        const meteor = meteors[i]
        meteor.age += dt
        meteor.x += meteor.vx * dt
        meteor.y += meteor.vy * dt
        if (meteor.age >= meteor.life) meteors.splice(i, 1)
    }
}

function drawMeteor(ctx: CanvasRenderingContext2D, meteor: Meteor) {
    const progress = clamp(meteor.age / meteor.life, 0, 1)
    const fade = Math.sin(Math.PI * progress)
    if (fade <= 0.01) return

    const speed = Math.hypot(meteor.vx, meteor.vy) || 1
    const dirX = meteor.vx / speed
    const dirY = meteor.vy / speed
    const tailX = meteor.x - dirX * meteor.len
    const tailY = meteor.y - dirY * meteor.len
    const alpha = palette.meteorAlpha * fade

    const trail = ctx.createLinearGradient(tailX, tailY, meteor.x, meteor.y)
    trail.addColorStop(0, rgba(palette.meteor, 0))
    trail.addColorStop(0.6, rgba(palette.meteor, alpha * 0.28))
    trail.addColorStop(1, rgba(palette.meteor, alpha))
    ctx.strokeStyle = trail
    ctx.lineWidth = meteor.width
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(tailX, tailY)
    ctx.lineTo(meteor.x, meteor.y)
    ctx.stroke()

    // 头部一点光晕，避免流星看起来像一根断线
    const glowRadius = meteor.width * 5
    const glow = ctx.createRadialGradient(meteor.x, meteor.y, 0, meteor.x, meteor.y, glowRadius)
    glow.addColorStop(0, rgba(palette.meteor, alpha * 0.7))
    glow.addColorStop(1, rgba(palette.meteor, 0))
    ctx.fillStyle = glow
    ctx.beginPath()
    ctx.arc(meteor.x, meteor.y, glowRadius, 0, TAU)
    ctx.fill()
}

/* ---------- 引力透镜 ---------- */

/** 把 mask 的可见度（0 隐藏 / 1 显示）用 smoothstep 近似出来 */
function smoothstep(value: number, min: number, max: number) {
    if (max <= min) return value < min ? 0 : 1
    const t = clamp((value - min) / (max - min), 0, 1)
    return t * t * (3 - 2 * t)
}

/**
 * 把黑洞周围的星点按引力透镜映射重新画到透镜层：
 * 源半径 β → 像半径 θ = (β + √(β² + 4R_E²)) / 2。
 * β 越小，θ/β 越大，星点被拉成切线方向的弧，在爱因斯坦环附近最明显。
 * 静态星层同时被 CSS mask 挖掉同一半径范围；mask 的可见度
 * 与这里 edge 的隐藏比例互补，所以交界处亮度基本连续。
 */
function renderLens() {
    const ctx = lensCtx
    const el = rootRef.value
    if (!ctx || !el) return

    ctx.clearRect(0, 0, vw, vh)

    const lx = holeX - starX
    const ly = holeY - starY
    el.style.setProperty('--gx-lens-x', `${lx.toFixed(1)}px`)
    el.style.setProperty('--gx-lens-y', `${ly.toFixed(1)}px`)

    const mix = lensOpacity

    for (const star of stars) {
        const dx = star.x - lx
        const dy = star.y - ly
        const beta = Math.hypot(dx, dy)
        if (beta > LENS_SRC_R || beta < 0.001) continue

        // 源星在 mask 里被隐藏的比例；透镜层用同样的比例把它补回来
        const edge = 1 - smoothstep(beta, LENS_MASK_R * 0.82, LENS_MASK_R)
        if (edge <= 0.002) continue
        const alpha = star.alpha * edge
        if (alpha < 0.01) continue

        const sqrtTerm = Math.sqrt(beta * beta + 4 * LENS_EINSTEIN_R * LENS_EINSTEIN_R)
        const thetaLens = (beta + sqrtTerm) / 2
        const theta = beta + (thetaLens - beta) * mix
        const angle = Math.atan2(dy, dx)
        const px = lx + Math.cos(angle) * theta
        const py = ly + Math.sin(angle) * theta
        // 只做位置的错位与一点点放大，不画任何线段/弧线：
        // 视觉上是背后星点被引力推开，并在光子环附近挤成双像。
        const magnification = theta / Math.max(beta, 1)
        const radius = star.r * (1 + Math.min(1.1, (magnification - 1) * 0.35))

        if (star.bright) {
            const glowRadius = Math.max(8, star.r * 9)
            const glow = ctx.createRadialGradient(px, py, 0, px, py, glowRadius)
            glow.addColorStop(0, rgba(star.color, alpha * 0.3))
            glow.addColorStop(1, rgba(star.color, 0))
            ctx.fillStyle = glow
            ctx.beginPath()
            ctx.arc(px, py, glowRadius, 0, TAU)
            ctx.fill()
        }

        ctx.fillStyle = rgba(star.color, alpha)
        ctx.beginPath()
        ctx.arc(px, py, radius, 0, TAU)
        ctx.fill()

        // 强引力透镜的第二像：在主像对面、靠近光子环的位置再出现一次。
        // 全是点，不画线；两圈错位的星点让"光线被拉弯"更容易看出来。
        const innerRadius = ((sqrtTerm - beta) / 2) * mix
        if (innerRadius > 16) {
            const ix = lx + Math.cos(angle + Math.PI) * innerRadius
            const iy = ly + Math.sin(angle + Math.PI) * innerRadius
            ctx.fillStyle = rgba(star.color, alpha * 0.5)
            ctx.beginPath()
            ctx.arc(ix, iy, radius * 0.85, 0, TAU)
            ctx.fill()
        }
    }
}

function clearLens() {
    lensCtx?.clearRect(0, 0, vw, vh)
    rootRef.value?.classList.remove('is-lensing')
}

/** 进入 / 退出透镜状态；淡出时先把弯折收回原位，再撤掉静态层的 mask */
function updateLens() {
    const el = rootRef.value
    if (!el) return
    // 恒星（亮色）与黑洞的距离：越近，恒星被弯折出的光环越亮
    const starX0 = vw * 0.68
    const starY0 = vh * 0.30
    const starDist = vh > 0 ? Math.hypot(holeX - starX0, holeY - starY0) : 9999
    const starWarp = clamp(1 - starDist / 260, 0, 1)
    el.style.setProperty('--gx-star-lens', (starWarp * starWarp).toFixed(3))
    const active = pointing || lensOpacity > 0.03
    if (active) {
        el.classList.add('is-lensing')
        lensActive = true
        renderLens()
    } else if (lensActive) {
        lensActive = false
        clearLens()
    }
}

function drawFx(dt: number) {
    const ctx = fxCtx
    if (!ctx) return
    ctx.clearRect(0, 0, vw, vh)

    for (const star of twinkles) {
        const wave = 0.5 + 0.5 * Math.sin(timeSec * star.speed + star.phase)
        const alpha = star.alpha * (1 - star.sway + star.sway * wave)
        if (alpha < 0.006) continue
        ctx.fillStyle = rgba(star.color, alpha)
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.r, 0, TAU)
        ctx.fill()
        if (star.r > 0.95) {
            ctx.fillStyle = rgba(star.color, alpha * 0.14)
            ctx.beginPath()
            ctx.arc(star.x, star.y, star.r * 3.4, 0, TAU)
            ctx.fill()
        }
    }

    if (!reduced) updateMeteors(dt)
    for (const meteor of meteors) drawMeteor(ctx, meteor)
}

function maybeSpawnMeteor(now: number) {
    if (reduced || !visible || now < nextMeteorAt) return
    meteors.push(createMeteor())
    nextMeteorAt = now + METEOR_GAP_MIN + Math.random() * METEOR_GAP_RANGE
}

/* ---------- 指针视差 / 黑洞 ---------- */

/** 星场随指针做很轻的视差；黑洞本身钉在鼠标上，不走插值 */
function stepParallax(dt: number) {
    const ease = 1 - Math.pow(1 - 0.12, dt * 60)
    const nx = vw ? targetX / vw - 0.5 : 0
    const ny = vh ? targetY / vh - 0.5 : 0

    starX += (-nx * 9 - starX) * ease
    starY += (-ny * 6 - starY) * ease

    const el = rootRef.value
    if (!el) return
    el.style.setProperty('--gx-star-x', `${starX.toFixed(2)}px`)
    el.style.setProperty('--gx-star-y', `${starY.toFixed(2)}px`)
}

/** 黑洞钉在鼠标位置：跟手越紧，越像空间被压出一个洞 */
function paintHole(x: number, y: number) {
    holeX = x
    holeY = y
    const el = rootRef.value
    if (!el) return
    el.style.setProperty('--gx-hole-x', `${x.toFixed(1)}px`)
    el.style.setProperty('--gx-hole-y', `${y.toFixed(1)}px`)
}

/* ---------- 主循环 ---------- */

function frame(now: number) {
    rafId = requestAnimationFrame(frame)
    if (!lastTick) {
        lastTick = now
        return
    }
    // 高刷屏按 60fps 封顶；120Hz 下每两帧画一次
    if (now - lastTick < FRAME_INTERVAL - 2) return

    const dt = Math.min(0.05, (now - lastTick) / 1000)
    lastTick = now
    timeSec += dt
    const lensTarget = pointing ? 1 : 0
    lensOpacity += (lensTarget - lensOpacity) * (1 - Math.pow(1 - 0.16, dt * 60))

    maybeSpawnMeteor(now)
    stepParallax(dt)
    drawFx(dt)
    updateLens()
}

function start() {
    if (reduced || rafId) return
    lastTick = 0
    nextMeteorAt = performance.now() + 3200
    rafId = requestAnimationFrame(frame)
}

function stop() {
    if (rafId) cancelAnimationFrame(rafId)
    rafId = 0
}

/* ---------- 事件 ---------- */

function onPointerMove(event: PointerEvent) {
    targetX = event.clientX
    targetY = event.clientY
    pointing = true
    paintHole(event.clientX, event.clientY)
    rootRef.value?.classList.add('is-pointing')
    // 减少动态时没有主循环，直接补一帧给黑洞与透镜映射
    if (reduced) {
        lensOpacity = 1
        drawFx(0)
        updateLens()
    }
}

/** 指针离开视口：黑洞淡出，视差缓缓回中 */
function onPointerLeave() {
    targetX = vw * 0.5
    targetY = vh * 0.5
    pointing = false
    rootRef.value?.classList.remove('is-pointing')
    if (reduced) {
        lensOpacity = 0
        drawFx(0)
        updateLens()
    }
}

function onVisibility() {
    visible = document.visibilityState === 'visible'
    if (visible && !reduced) start()
    else stop()
}

function onReducedChange() {
    reduced = !!mediaReduced?.matches
    if (reduced) {
        stop()
        meteors = []
        lensOpacity = pointing ? 1 : 0
        drawFx(0)
        updateLens()
    } else if (visible) {
        start()
    }
}

function onResize() {
    window.clearTimeout(resizeTimer)
    resizeTimer = window.setTimeout(() => {
        bake()
        if (reduced) {
            drawFx(0)
            updateLens()
        }
    }, 180)
}

/** 切主题：先让 canvas 淡出，重烘焙后淡回，避免星点颜色硬切 */
function onThemeChange() {
    const el = rootRef.value
    if (!el) return
    // App 在 onMounted 里会把 data-theme 设成与默认相同的值，也会触发一次观察；
    // 只有令牌真的变了才重烘焙，避免首屏无谓地闪一下。
    if (signatureOf(readPalette()) === paletteSignature) return
    el.classList.add('is-swapping')
    window.clearTimeout(themeTimer)
    themeTimer = window.setTimeout(() => {
        bake()
        window.setTimeout(() => el.classList.remove('is-swapping'), 40)
    }, 140)
}

watch(() => props.seed, () => {
    bake()
    if (reduced) drawFx(0)
})

let detach = () => {}

onMounted(() => {
    vw = Math.max(1, window.innerWidth)
    vh = Math.max(1, window.innerHeight)
    targetX = vw * 0.5
    targetY = vh * 0.5

    mediaReduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    mediaHover = window.matchMedia('(hover: none)')
    reduced = mediaReduced.matches
    hoverNone = mediaHover.matches

    bake()

    if (!hoverNone) {
        window.addEventListener('pointermove', onPointerMove, {passive: true})
        window.addEventListener('pointerleave', onPointerLeave, {passive: true})
    }
    window.addEventListener('resize', onResize, {passive: true})
    document.addEventListener('visibilitychange', onVisibility)
    mediaReduced.addEventListener('change', onReducedChange)

    themeObserver = new MutationObserver(onThemeChange)
    themeObserver.observe(document.documentElement, {attributes: true, attributeFilter: ['data-theme']})

    detach = () => {
        window.removeEventListener('pointermove', onPointerMove)
        window.removeEventListener('pointerleave', onPointerLeave)
        window.removeEventListener('resize', onResize)
        document.removeEventListener('visibilitychange', onVisibility)
        mediaReduced?.removeEventListener('change', onReducedChange)
        themeObserver?.disconnect()
    }

    if (reduced) drawFx(0)
    else start()
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
   银河底衬：固定铺满视口，永远在最底层
   与 Backdrop.vue 相同的约定 —— z-index: -1，body 保持透明
   ============================================================ */

.galaxy {
    position: fixed;
    inset: 0;
    z-index: -1;
    overflow: hidden;
    pointer-events: none;
    contain: paint;
    background: var(--gx-base-2);
    --gx-star-x: 0px;
    --gx-star-y: 0px;
    --gx-hole-x: 50vw;
    --gx-hole-y: 50vh;
}

/* ---------- 1. 天幕 ---------- */

.galaxy__sky {
    position: absolute;
    inset: 0;
    background:
        radial-gradient(56% 44% at 68% 30%,
        rgba(var(--gx-sky-glow), var(--gx-sky-glow-a)) 0%,
        rgba(var(--gx-sky-glow), 0) 72%),
        linear-gradient(166deg, var(--gx-base-1) 0%, var(--gx-base-2) 100%);
}

/* ---------- 2. 恒星（仅亮色：像附近有一颗星在照着） ---------- */

.galaxy__sun {
    position: absolute;
    inset: 0;
    opacity: 1;
    pointer-events: none;
    transition: opacity 320ms var(--ease);
}

/* 暗色：收掉这颗恒星，只留很暗的星光 */
[data-theme="dark"] .galaxy__sun {
    opacity: 0;
}

/* 恒星不直接被挖洞：黑洞贴近时，它被弯折成一个暖色光环（见 .hole__starlight） */

.sun__glow {
    position: absolute;
    left: 68%;
    top: 30%;
    width: 46vmax;
    height: 46vmax;
    margin: -23vmax 0 0 -23vmax;
    border-radius: 50%;
    background: radial-gradient(circle at center,
    rgba(var(--gx-sun), 0.5) 0%,
    rgba(var(--gx-sun), 0.2) 24%,
    rgba(var(--gx-sun), 0.06) 50%,
    rgba(var(--gx-sun), 0) 74%);
}

.sun__core {
    position: absolute;
    left: 68%;
    top: 30%;
    width: 6px;
    height: 6px;
    margin: -3px 0 0 -3px;
    border-radius: 50%;
    background: rgba(var(--gx-sun-ink), 0.92);
    box-shadow:
        0 0 15px 4px rgba(var(--gx-sun), 0.9),
        0 0 60px 18px rgba(var(--gx-sun), 0.32);
}

.sun__core::before,
.sun__core::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
}

.sun__core::before {
    width: 190px;
    height: 1px;
    margin: -0.5px 0 0 -95px;
    background: linear-gradient(90deg,
    rgba(var(--gx-sun-ink), 0) 0%,
    rgba(var(--gx-sun-ink), 0.5) 50%,
    rgba(var(--gx-sun-ink), 0) 100%);
}

.sun__core::after {
    width: 1px;
    height: 190px;
    margin: -95px 0 0 -0.5px;
    background: linear-gradient(180deg,
    rgba(var(--gx-sun-ink), 0) 0%,
    rgba(var(--gx-sun-ink), 0.42) 50%,
    rgba(var(--gx-sun-ink), 0) 100%);
}

/* ---------- 3~5. 星场 / 透镜 / 动态层 ---------- */

.galaxy__stars,
.galaxy__lens,
.galaxy__fx {
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 100%;
    height: 100%;
    transform: translate3d(var(--gx-star-x), var(--gx-star-y), 0);
    transition: opacity 260ms var(--ease);
}

/* 切主题时先淡出，重烘焙后再淡回 */
.galaxy.is-swapping .galaxy__stars,
.galaxy.is-swapping .galaxy__lens,
.galaxy.is-swapping .galaxy__fx {
    opacity: 0.22;
}

/* 透镜进行时：静态星层在黑洞周围挖一个软边圆洞，
   被弯折的星点交给 .galaxy__lens 重画，避免两层重复 */
.galaxy.is-lensing .galaxy__stars {
    -webkit-mask-image: radial-gradient(circle 140px at var(--gx-lens-x, 50vw) var(--gx-lens-y, 50vh),
    transparent 0%,
    transparent 82%,
    rgba(0, 0, 0, 0.45) 94%,
    #000 100%);
    mask-image: radial-gradient(circle 140px at var(--gx-lens-x, 50vw) var(--gx-lens-y, 50vh),
    transparent 0%,
    transparent 82%,
    rgba(0, 0, 0, 0.45) 94%,
    #000 100%);
}

/* ---------- 7. 黑洞（跟随鼠标） ---------- */

.galaxy__hole {
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 0;
    transform: translate3d(var(--gx-hole-x), var(--gx-hole-y), 0);
    opacity: 0;
    transition: opacity 280ms var(--ease);
    will-change: transform, opacity;
}

.galaxy.is-pointing .galaxy__hole {
    opacity: 1;
}

.hole__starlight {
    position: absolute;
    left: 0;
    top: 0;
    width: 160px;
    height: 160px;
    margin: -80px 0 0 -80px;
    border-radius: 50%;
    background: radial-gradient(circle at center,
    rgba(var(--gx-sun), 0) 52%,
    rgba(var(--gx-sun), 0.38) 62%,
    rgba(var(--gx-sun), 0.16) 69%,
    rgba(var(--gx-sun), 0.04) 76%,
    rgba(var(--gx-sun), 0) 84%);
    filter: blur(2.4px);
    opacity: var(--gx-star-lens, 0);
}

/* 暗色没有那颗恒星，也就不需要它的透镜环 */
[data-theme="dark"] .hole__starlight {
    display: none;
}

.hole__halo {
    position: absolute;
    left: 0;
    top: 0;
    width: 240px;
    height: 240px;
    margin: -120px 0 0 -120px;
    border-radius: 50%;
    background: radial-gradient(circle at center,
    rgba(var(--gx-hole-glow), 0.2) 0%,
    rgba(var(--gx-hole-glow), 0.07) 36%,
    rgba(var(--gx-hole-glow), 0) 70%);
}

.hole__disk {
    position: absolute;
    left: 0;
    top: 0;
    width: 292px;
    height: 84px;
    margin: -42px 0 0 -146px;
    border-radius: 50%;
    overflow: hidden;
    transform: rotate(-13deg);
    opacity: 0.9;
    -webkit-mask-image: radial-gradient(closest-side,
    transparent 18%,
    rgba(0, 0, 0, 0.35) 30%,
    #000 44%,
    rgba(0, 0, 0, 0.7) 66%,
    transparent 90%);
    mask-image: radial-gradient(closest-side,
    transparent 18%,
    rgba(0, 0, 0, 0.35) 30%,
    #000 44%,
    rgba(0, 0, 0, 0.7) 66%,
    transparent 90%);
}

.hole__disk::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    width: 170%;
    height: 170%;
    margin: -85% 0 0 -85%;
    border-radius: 50%;
    background: repeating-conic-gradient(from 8deg,
    rgba(var(--gx-hole-disk), 0) 0deg 9deg,
    rgba(var(--gx-hole-disk), 0.8) 20deg 33deg,
    rgba(var(--gx-hole-disk-2), 0.55) 39deg 47deg,
    rgba(var(--gx-hole-disk), 0) 57deg 72deg);
    animation: hole-spin 26s linear infinite;
    animation-play-state: paused;
}

.galaxy.is-pointing .hole__disk::before {
    animation-play-state: running;
}

@keyframes hole-spin {
    to { transform: rotate(360deg); }
}


.hole__sphere {
    position: absolute;
    left: 0;
    top: 0;
    width: 58px;
    height: 58px;
    margin: -29px 0 0 -29px;
    border-radius: 50%;
    background: radial-gradient(circle at center,
    #000 0 56%,
    rgba(2, 4, 8, 0.98) 68%,
    rgba(2, 4, 8, 0.72) 84%,
    rgba(2, 4, 8, 0) 100%);
    box-shadow: 0 0 30px 8px rgba(0, 0, 0, 0.35);
}


.hole__ring {
    position: absolute;
    left: 0;
    top: 0;
    width: 68px;
    height: 68px;
    margin: -34px 0 0 -34px;
    border-radius: 50%;
    border: 2px solid rgba(var(--gx-hole-ring), 0.78);
    box-shadow:
        0 0 12px rgba(var(--gx-hole-ring), 0.5),
        inset 0 0 8px rgba(var(--gx-hole-ring), 0.28);
    filter: blur(0.4px);
    opacity: 0.92;
}

/* ---------- 8. 暗角 ---------- */

.galaxy__vignette {
    position: absolute;
    inset: 0;
    background: radial-gradient(120% 100% at 50% 44%,
    rgba(var(--gx-vignette), 0) 34%,
    rgba(var(--gx-vignette), var(--gx-vignette-a)) 100%);
}

/* ---------- 降级 ---------- */

@media (prefers-reduced-motion: reduce) {
    .hole__disk::before {
        animation: none;
    }
}

@media (hover: none) {
    .galaxy__hole {
        display: none;
    }
}
</style>
