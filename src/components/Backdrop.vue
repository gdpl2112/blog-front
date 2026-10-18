<template>
  <div ref="rootRef" class="backdrop" aria-hidden="true">
    <!-- 1. 打底：一层近乎静止的冷调渐变，给所有玻璃一个统一的折射底 -->
    <div class="backdrop__wash"></div>

    <!-- 2. 漂移色片：四团大尺度柔光，周期 120~200s，慢到"几秒看不出在动" -->
    <div class="backdrop__sheets">
      <span class="sheet sheet--a"></span>
      <span class="sheet sheet--b"></span>
      <span class="sheet sheet--c"></span>
      <span class="sheet sheet--d"></span>
    </div>

    <!-- 3. 稿纸格：站点是写字的地方，格线随指针做极轻微视差 -->
    <div class="backdrop__grid"></div>

    <!-- 4. 光束：两束斜向柔光缓慢扫过，soft-light 叠在色片上 -->
    <div class="backdrop__beams">
      <span class="beam beam--a"></span>
      <span class="beam beam--b"></span>
    </div>

    <!-- 5. 光尘：canvas 粒子，越靠近指针越亮（被光吸引的尘埃） -->
    <canvas ref="canvasRef" class="backdrop__dust"></canvas>

    <!-- 6. 聚光收暗：离指针越远越暗，让光标处"被凸显" -->
    <div class="backdrop__focus"></div>

    <!-- 7. 指针光池（零延迟）+ 滞后镜面高光 -->
    <div class="backdrop__spot"></div>
    <div class="backdrop__sheen"></div>

    <!-- 8. 暗角：收边，避免四角过亮显得廉价 -->
    <div class="backdrop__vignette"></div>
  </div>
</template>

<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref} from 'vue'

/**
 * 站点动态底衬（纯 CSS + canvas，不含任何视频/图片资源）
 *
 * 四层结构：
 *  1) wash   —— 静态渐变打底；
 *  2) sheets —— 4 团超大柔光色片，走 transform 关键帧（合成器动画，不触发重排）；
 *  3) grid   —— 稿纸格线，随指针做 ≤10px 的视差；
 *  4) dust   —— canvas 光尘粒子，指针附近变亮并被轻微吸向指针。
 *
 * 性能约束：
 *  - 主循环统一节流到 ~40fps，且页面不可见（切标签页/最小化）时立即停止取帧；
 *  - 粒子数量按视口面积自适应，上限 92，DPR 上限 2；
 *  - 颜色全部读自 CSS 令牌（--bd-dust / --bd-dust-warm / --bd-dust-alpha），
 *    切主题时不重建粒子，而是对颜色做 600ms 插值，避免"闪一下"。
 *
 * 降级：
 *  - prefers-reduced-motion：所有关键帧停止，光尘只静态绘制一帧；
 *  - hover: none（触屏）：不启动指针跟随，光尘按自然漂流运行。
 */

const rootRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

/* ---------- 可调参数 ---------- */

const FRAME_MS = 1000 / 40 // 目标帧间隔（约 40fps）
const DUST_MIN = 34
const DUST_MAX = 92
const DUST_DENSITY = 24000 // 每多少平方像素一颗尘
const LIGHT_R = 280 // 指针光照半径（px）
const SPOT_EASE = 0.2 // 光池跟随速度
const SHEEN_EASE = 0.09 // 镜面高光滞后程度
const PALETTE_MS = 600 // 切主题时颜色过渡时长
const TAU = Math.PI * 2

/* ---------- 粒子 ---------- */

interface Mote {
    x: number
    y: number
    z: number // 0 远 / 1 近，用于尺寸、亮度、跟随力度
    r: number
    vx: number
    vy: number
    sway: number
    swayPhase: number
    warm: boolean // 冷尘 / 暖尘，少量暖尘让画面不发灰
}

const motes: Mote[] = []

/* ---------- 运行状态 ---------- */

interface Palette {
    dust: [number, number, number]
    warm: [number, number, number]
    alpha: number
}

let rafId = 0
let ctx: CanvasRenderingContext2D | null = null
let vw = 0
let vh = 0
let dpr = 1
let lastTick = 0
let visible = true
let reduced = false

let pointerOn = false
let targetX = 0
let targetY = 0
let spotX = 0
let spotY = 0
let sheenX = 0
let sheenY = 0
let gridX = 0
let gridY = 0
let spotHue = 232

/** 当前渲染用色（在 from → to 之间插值） */
let palFrom: Palette = {dust: [0, 0, 0], warm: [0, 0, 0], alpha: 0}
let palTo: Palette = {dust: [0, 0, 0], warm: [0, 0, 0], alpha: 0}
let palT = 1

/* ---------- 主题取色 ---------- */

/** 把 "38, 52, 78" 解析成三元组；异常值兜底为深灰，避免 NaN 传染到绘制 */
function parseRGB(raw: string, fallback: [number, number, number]): [number, number, number] {
    const parts = raw.split(',').map((v) => parseFloat(v))
    if (parts.length < 3 || parts.some((v) => Number.isNaN(v))) return fallback
    return [parts[0], parts[1], parts[2]]
}

function readPalette(): Palette {
    const cs = getComputedStyle(document.documentElement)
    const alpha = parseFloat(cs.getPropertyValue('--bd-dust-alpha'))
    return {
        dust: parseRGB(cs.getPropertyValue('--bd-dust'), [40, 50, 70]),
        warm: parseRGB(cs.getPropertyValue('--bd-dust-warm'), [150, 110, 70]),
        alpha: Number.isFinite(alpha) && alpha > 0 ? alpha : 0.32,
    }
}

/** 切主题：保留当前插值结果作为起点，向新主题色过渡，避免粒子瞬间变色 */
function refreshPalette(instant = false) {
    const next = readPalette()
    if (instant) {
        palFrom = next
        palTo = next
        palT = 1
        return
    }
    palFrom = mixPalette(palFrom, palTo, easeOut(palT))
    palTo = next
    palT = 0
}

function easeOut(t: number) {
    return 1 - Math.pow(1 - t, 3)
}

function mix(a: number, b: number, t: number) {
    return a + (b - a) * t
}

function mixRGB(a: [number, number, number], b: [number, number, number], t: number): [number, number, number] {
    return [mix(a[0], b[0], t), mix(a[1], b[1], t), mix(a[2], b[2], t)]
}

function mixPalette(a: Palette, b: Palette, t: number): Palette {
    return {
        dust: mixRGB(a.dust, b.dust, t),
        warm: mixRGB(a.warm, b.warm, t),
        alpha: mix(a.alpha, b.alpha, t),
    }
}

/* ---------- 尺寸与粒子 ---------- */

function createMote(randomY: boolean): Mote {
    const z = Math.random()
    return {
        x: Math.random() * vw,
        y: randomY ? Math.random() * vh : vh + 24 + Math.random() * 40,
        z,
        r: 0.55 + z * 1.35,
        vx: (Math.random() - 0.5) * 7,
        vy: -(5 + z * 12), // 尘往上升：越近的越快，形成深度感
        sway: 2 + z * 7,
        swayPhase: Math.random() * TAU,
        warm: Math.random() < 0.22,
    }
}

/** 重建/裁剪粒子集合；尺寸变化时尽量保留原有粒子，只在数量不足时补 */
function syncMotes() {
    const target = Math.round(Math.min(DUST_MAX, Math.max(DUST_MIN, (vw * vh) / DUST_DENSITY)))
    while (motes.length > target) motes.pop()
    while (motes.length < target) motes.push(createMote(true))
    for (const m of motes) {
        m.x = Math.min(m.x, vw + 40)
        m.y = Math.min(m.y, vh + 40)
    }
}

function resize() {
    const canvas = canvasRef.value
    if (!canvas) return
    vw = window.innerWidth
    vh = window.innerHeight
    dpr = Math.min(2, window.devicePixelRatio || 1)
    canvas.width = Math.round(vw * dpr)
    canvas.height = Math.round(vh * dpr)
    canvas.style.width = `${vw}px`
    canvas.style.height = `${vh}px`
    ctx = canvas.getContext('2d')
    ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)
    syncMotes()
}

/* ---------- 渲染 ---------- */

function paintPointer() {
    const el = rootRef.value
    if (!el) return
    el.style.setProperty('--px', `${spotX}px`)
    el.style.setProperty('--py', `${spotY}px`)
    el.style.setProperty('--hx', `${sheenX}px`)
    el.style.setProperty('--hy', `${sheenY}px`)
    el.style.setProperty('--gx', `${gridX.toFixed(2)}px`)
    el.style.setProperty('--gy', `${gridY.toFixed(2)}px`)
    el.style.setProperty('--spot-hue', spotHue.toFixed(1))
}

/**
 * 光池位置的色相：横向从靛蓝(202°)走到玫红(310°)，纵向再做 ±13° 微调。
 * 不用整圈色相轮 —— 那样会跑出站点的冷调体系，看起来像配色器在随机跳。
 */
function hueAt(x: number, y: number): number {
    const nx = vw ? x / vw : 0.5
    const ny = vh ? y / vh : 0.5
    return 202 + nx * 108 + (ny - 0.5) * 26
}

/**
 * 把光池钉到指针处。
 * 这里刻意不插值：指针事件本身已按帧节流，直接写 CSS 变量可以让光池
 * 严格贴着光标走，任何平滑都会产生"光在追鼠标"的拖沓感。
 * 只有镜面高光（--hx/--hy）保留插值，用来制造玻璃厚度。
 */
function applySpot() {
    spotX = targetX
    spotY = targetY
    spotHue = hueAt(targetX, targetY)
    const el = rootRef.value
    if (!el) return
    el.style.setProperty('--px', `${targetX}px`)
    el.style.setProperty('--py', `${targetY}px`)
    el.style.setProperty('--spot-hue', spotHue.toFixed(1))
}

function step(dt: number) {
    // 镜面高光明显滞后：它要"拖"在光池后面，形成折射感
    const kSheen = 1 - Math.pow(1 - SHEEN_EASE, dt * 60)
    const kGrid = 1 - Math.pow(1 - SPOT_EASE, dt * 60)
    sheenX += (targetX - sheenX) * kSheen
    sheenY += (targetY - sheenY) * kSheen

    // 稿纸格视差：幅度很小，只为让静态格线"活"一点
    const nx = vw ? spotX / vw - 0.5 : 0
    const ny = vh ? spotY / vh - 0.5 : 0
    gridX += (-nx * 12 - gridX) * kGrid
    gridY += (-ny * 12 - gridY) * kGrid

    paintPointer()
}

function stepMotes(dt: number) {
    for (const m of motes) {
        m.swayPhase += dt * (0.35 + m.z * 0.55)
        m.x += (m.vx + Math.sin(m.swayPhase) * m.sway) * dt
        m.y += m.vy * dt

        if (pointerOn) {
            const dx = spotX - m.x
            const dy = spotY - m.y
            const dist = Math.hypot(dx, dy)
            if (dist < LIGHT_R && dist > 0.5) {
                // 越近、越"前"的尘被吸得越明显，但仍保持缓慢，不出现"扑向鼠标"的廉价感
                const k = Math.pow(1 - dist / LIGHT_R, 2) * (26 + 54 * m.z) * dt
                m.x += (dx / dist) * k
                m.y += (dy / dist) * k
            }
        }

        // 环绕：从底部升出、从顶部消失，不会出现"粒子用完了"的断层
        if (m.y < -30) {
            m.y = vh + 24
            m.x = Math.random() * vw
        } else if (m.y > vh + 60) {
            m.y = -20
        }
        if (m.x < -44) m.x = vw + 44
        else if (m.x > vw + 44) m.x = -44
    }
}

function drawMotes() {
    if (!ctx) return
    const pal = mixPalette(palFrom, palTo, easeOut(palT))
    ctx.clearRect(0, 0, vw, vh)

    for (const m of motes) {
        const near = pointerOn ? Math.max(0, 1 - Math.hypot(spotX - m.x, spotY - m.y) / LIGHT_R) : 0
        const depth = 0.32 + 0.68 * m.z
        const a = Math.min(0.78, pal.alpha * depth * (0.55 + near * 1.15))
        const [r, g, b] = m.warm ? pal.warm : pal.dust

        // 外晕：让尘"发光"而不是一颗硬点
        ctx.beginPath()
        ctx.fillStyle = `rgba(${r | 0}, ${g | 0}, ${b | 0}, ${(a * 0.2).toFixed(3)})`
        ctx.arc(m.x, m.y, m.r * 3.4, 0, TAU)
        ctx.fill()

        // 尘核
        ctx.beginPath()
        ctx.fillStyle = `rgba(${r | 0}, ${g | 0}, ${b | 0}, ${a.toFixed(3)})`
        ctx.arc(m.x, m.y, m.r, 0, TAU)
        ctx.fill()
    }
}

function frame(time: number) {
    rafId = requestAnimationFrame(frame)
    if (!lastTick) {
        lastTick = time
        return
    }
    if (time - lastTick < FRAME_MS) return

    const dt = Math.min(0.06, (time - lastTick) / 1000)
    lastTick = time

    if (palT < 1) palT = Math.min(1, palT + (dt * 1000) / PALETTE_MS)

    step(dt)
    stepMotes(dt)
    drawMotes()
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

/* ---------- 指针 ---------- */

function onPointerMove(e: PointerEvent) {
    pointerOn = true
    targetX = e.clientX
    targetY = e.clientY
    applySpot()
}

function onPointerLeave() {
    pointerOn = false
}

/** 按下时光池提亮：给"点到了"一个背景层的反馈，比缩放更不容易被误读为卡顿 */
function onPointerDown() {
    rootRef.value?.classList.add('is-pressed')
}

function onPointerUp() {
    rootRef.value?.classList.remove('is-pressed')
}

/* ---------- 生命周期 ---------- */

let mediaReduced: MediaQueryList | null = null
let mediaHover: MediaQueryList | null = null
let themeObserver: MutationObserver | null = null
let resizeObserver: ResizeObserver | null = null
let detach = () => {}

function onMediaChange() {
    reduced = !!mediaReduced?.matches
    if (reduced) {
        stop()
        // 静态一帧：仍保留光尘质感，只是不再流动
        drawMotes()
    } else if (visible) {
        start()
    }
}

function onVisibility() {
    visible = document.visibilityState === 'visible'
    if (visible) start()
    else stop()
}

onMounted(() => {
    resize()
    refreshPalette(true)
    drawMotes()

    mediaReduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    mediaHover = window.matchMedia('(hover: none)')
    reduced = mediaReduced.matches

    // 触屏没有悬停指针，光池/高光层由 CSS 隐藏，也不绑定指针逻辑
    const withPointer = !mediaHover.matches && !reduced
    if (withPointer) {
        targetX = spotX = sheenX = window.innerWidth * 0.52
        targetY = spotY = sheenY = window.innerHeight * 0.3
        spotHue = hueAt(targetX, targetY)
        applySpot()
        paintPointer()
        window.addEventListener('pointermove', onPointerMove, {passive: true})
        window.addEventListener('pointerleave', onPointerLeave, {passive: true})
        window.addEventListener('pointerdown', onPointerDown, {passive: true})
        window.addEventListener('pointerup', onPointerUp, {passive: true})
    }

    window.addEventListener('resize', resize, {passive: true})
    document.addEventListener('visibilitychange', onVisibility)
    mediaReduced.addEventListener('change', onMediaChange)

    // 主题切换后重新取色（App.vue 改的是 html[data-theme]）
    themeObserver = new MutationObserver(() => refreshPalette())
    themeObserver.observe(document.documentElement, {attributes: true, attributeFilter: ['data-theme']})

    if (typeof ResizeObserver !== 'undefined' && rootRef.value) {
        resizeObserver = new ResizeObserver(() => resize())
        resizeObserver.observe(rootRef.value)
    }

    detach = () => {
        window.removeEventListener('resize', resize)
        window.removeEventListener('pointermove', onPointerMove)
        window.removeEventListener('pointerleave', onPointerLeave)
        window.removeEventListener('pointerdown', onPointerDown)
        window.removeEventListener('pointerup', onPointerUp)
        document.removeEventListener('visibilitychange', onVisibility)
        mediaReduced?.removeEventListener('change', onMediaChange)
        themeObserver?.disconnect()
        resizeObserver?.disconnect()
    }

    if (!reduced) start()
})

onBeforeUnmount(() => {
    stop()
    detach()
})
</script>

<style scoped>
/* ============================================================
   底衬容器：固定铺满视口，永远在最底层
   注意：必须保持 z-index: -1 且 body 不能有背景色（见 design-tokens.css）
   ============================================================ */

.backdrop {
    position: fixed;
    inset: 0;
    z-index: -1;
    overflow: hidden;
    pointer-events: none;
    contain: paint;
    --px: 52vw;
    --py: 30vh;
    --hx: 52vw;
    --hy: 30vh;
    --gx: 0px;
    --gy: 0px;
    /* 光池色相：默认取主题令牌，指针移动后由 JS 覆盖为按坐标算出的值 */
    --spot-hue: var(--bd-spot-h);
}

/* ---------- 1. 打底 ---------- */

.backdrop__wash {
    position: absolute;
    inset: 0;
    background:
        radial-gradient(120% 90% at 50% -10%, var(--bd-haze) 0%, rgba(255, 255, 255, 0) 62%),
        linear-gradient(168deg, var(--bd-base-1) 0%, var(--bd-base-2) 100%);
}

/* ---------- 2. 漂移色片 ---------- */

.backdrop__sheets {
    position: absolute;
    inset: -14%;
}

.sheet {
    position: absolute;
    border-radius: 50%;
    transform: translate3d(0, 0, 0);
    will-change: transform;
}

.sheet--a {
    top: -16%;
    left: -14%;
    width: 82vmax;
    height: 82vmax;
    background: radial-gradient(circle at center,
    rgba(var(--bd-sheet-1), var(--bd-sheet-1-a)) 0%,
    rgba(var(--bd-sheet-1), calc(var(--bd-sheet-1-a) * 0.58)) 42%,
    rgba(var(--bd-sheet-1), 0) 78%);
    animation: drift-a 168s cubic-bezier(0.4, 0, 0.6, 1) infinite alternate;
}

.sheet--b {
    top: -20%;
    right: -16%;
    width: 70vmax;
    height: 70vmax;
    background: radial-gradient(circle at center,
    rgba(var(--bd-sheet-2), var(--bd-sheet-2-a)) 0%,
    rgba(var(--bd-sheet-2), calc(var(--bd-sheet-2-a) * 0.58)) 42%,
    rgba(var(--bd-sheet-2), 0) 76%);
    animation: drift-b 196s cubic-bezier(0.4, 0, 0.6, 1) infinite alternate;
}

.sheet--c {
    bottom: -20%;
    right: -14%;
    width: 78vmax;
    height: 78vmax;
    background: radial-gradient(circle at center,
    rgba(var(--bd-sheet-3), var(--bd-sheet-3-a)) 0%,
    rgba(var(--bd-sheet-3), calc(var(--bd-sheet-3-a) * 0.58)) 42%,
    rgba(var(--bd-sheet-3), 0) 78%);
    animation: drift-c 142s cubic-bezier(0.4, 0, 0.6, 1) infinite alternate;
}

.sheet--d {
    bottom: -18%;
    left: -16%;
    width: 74vmax;
    height: 74vmax;
    background: radial-gradient(circle at center,
    rgba(var(--bd-sheet-4), var(--bd-sheet-4-a)) 0%,
    rgba(var(--bd-sheet-4), calc(var(--bd-sheet-4-a) * 0.58)) 42%,
    rgba(var(--bd-sheet-4), 0) 76%);
    animation: drift-d 214s cubic-bezier(0.4, 0, 0.6, 1) infinite alternate;
}

/* 四条轨迹错开方向与周期：避免四团光"同频整体晃" */
@keyframes drift-a {
    0% { transform: translate3d(0, 0, 0) scale(1); }
    50% { transform: translate3d(3.4vw, 2.6vh, 0) scale(1.05); }
    100% { transform: translate3d(-1.6vw, 4.4vh, 0) scale(0.975); }
}

@keyframes drift-b {
    0% { transform: translate3d(0, 0, 0) scale(1.03); }
    55% { transform: translate3d(-2.8vw, 3.4vh, 0) scale(0.97); }
    100% { transform: translate3d(-5vw, -1.4vh, 0) scale(1.045); }
}

@keyframes drift-c {
    0% { transform: translate3d(0, 0, 0) scale(1); }
    45% { transform: translate3d(-3.6vw, -2.4vh, 0) scale(1.06); }
    100% { transform: translate3d(1.8vw, -4.6vh, 0) scale(0.98); }
}

@keyframes drift-d {
    0% { transform: translate3d(0, 0, 0) scale(0.985); }
    52% { transform: translate3d(4.2vw, -2vh, 0) scale(1.04); }
    100% { transform: translate3d(1.2vw, -3.6vh, 0) scale(1.005); }
}

/* ---------- 3. 稿纸格 ---------- */

.backdrop__grid {
    position: absolute;
    inset: -8%;
    background-image:
        linear-gradient(to right, var(--bd-grid) 1px, transparent 1px),
        linear-gradient(to bottom, var(--bd-grid) 1px, transparent 1px);
    background-size: 76px 76px;
    transform: translate3d(var(--gx), var(--gy), 0);
    /* 只在中上部可见，四周淡出：既有纸感，又不会在边缘切出生硬网格 */
    -webkit-mask-image: radial-gradient(130% 110% at 50% 18%, #000 0%, rgba(0, 0, 0, 0.45) 52%, transparent 84%);
    mask-image: radial-gradient(130% 110% at 50% 18%, #000 0%, rgba(0, 0, 0, 0.45) 52%, transparent 84%);
}

/* ---------- 4. 光束 ---------- */

.backdrop__beams {
    position: absolute;
    inset: -24%;
    mix-blend-mode: soft-light;
    opacity: 0.9;
}

.beam {
    position: absolute;
    top: -20%;
    height: 150%;
    background: linear-gradient(90deg, transparent 0%, var(--bd-beam) 46%, transparent 100%);
    will-change: transform;
    /* 光束是旋转过的长条，若不止住上下两端，旋转后会露出两条硬边 */
    -webkit-mask-image: linear-gradient(to bottom, transparent 0%, #000 26%, #000 74%, transparent 100%);
    mask-image: linear-gradient(to bottom, transparent 0%, #000 26%, #000 74%, transparent 100%);
}

.beam--a {
    left: 4%;
    width: 26vmax;
    transform: rotate(15deg);
    animation: beam-a 118s ease-in-out infinite alternate;
}

.beam--b {
    right: 8%;
    width: 15vmax;
    opacity: 0.7;
    transform: rotate(15deg);
    animation: beam-b 152s ease-in-out infinite alternate;
}

@keyframes beam-a {
    0% { transform: rotate(15deg) translate3d(-6vw, 0, 0); }
    100% { transform: rotate(15deg) translate3d(9vw, 0, 0); }
}

@keyframes beam-b {
    0% { transform: rotate(15deg) translate3d(4vw, 0, 0); }
    100% { transform: rotate(15deg) translate3d(-8vw, 0, 0); }
}

/* ---------- 5. 光尘 ---------- */

.backdrop__dust {
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    /* 光尘相当淡：它负责"空气感"，不该被当成前景元素 */
    opacity: 0.9;
}

/* ---------- 6. 聚光收暗 ---------- */

.backdrop__focus {
    position: absolute;
    inset: 0;
    /* 以指针为圆心：中心完全透明，越往外越收暗，内容区因此被"顶"到光里 */
    background: radial-gradient(circle 48vmax at var(--px) var(--py),
    transparent 0%,
    transparent 42%,
    var(--bd-focus) 100%);
}

/* ---------- 7. 指针光池与高光 ---------- */

.backdrop__spot {
    position: absolute;
    top: 0;
    left: 0;
    width: 58vmax;
    height: 58vmax;
    margin: -29vmax 0 0 -29vmax;
    border-radius: 50%;
    transform: translate3d(var(--px), var(--py), 0);
    opacity: 0.9;
    transition: opacity 220ms var(--ease);
    /* 暖芯压在上层：光标处偏暖，外围转成随坐标变化的冷调色相，像光穿过琉璃后的色散 */
    background:
        radial-gradient(circle at center,
        rgba(var(--bd-spot-warm), var(--bd-spot-warm-a)) 0%,
        rgba(var(--bd-spot-warm), 0) 44%),
        radial-gradient(circle at center,
        hsla(var(--spot-hue), var(--bd-spot-s), var(--bd-spot-l), var(--bd-spot-a)) 0%,
        hsla(var(--spot-hue), var(--bd-spot-s), var(--bd-spot-l), 0) 66%);
    will-change: transform;
}

.backdrop.is-pressed .backdrop__spot {
    opacity: 1;
}

.backdrop__sheen {
    position: absolute;
    top: 0;
    left: 0;
    width: 30vmax;
    height: 30vmax;
    margin: -15vmax 0 0 -15vmax;
    border-radius: 50%;
    transform: translate3d(var(--hx), var(--hy), 0);
    background: radial-gradient(circle at center,
    rgba(255, 255, 255, 0.5) 0%,
    rgba(255, 255, 255, 0.14) 34%,
    rgba(255, 255, 255, 0) 64%);
    mix-blend-mode: soft-light;
    will-change: transform;
}

[data-theme="dark"] .backdrop__sheen {
    background: radial-gradient(circle at center,
    rgba(186, 212, 255, 0.34) 0%,
    rgba(186, 212, 255, 0.1) 36%,
    rgba(186, 212, 255, 0) 66%);
    mix-blend-mode: screen;
}

/* ---------- 7. 暗角 ---------- */

.backdrop__vignette {
    position: absolute;
    inset: 0;
    background: radial-gradient(122% 100% at 50% 42%, transparent 38%, var(--bd-vignette) 100%);
}

/* ---------- 降级 ---------- */

/* 触屏无悬停指针：光池、高光、聚光全部不参与绘制 */
@media (hover: none) {
    .backdrop__spot,
    .backdrop__sheen,
    .backdrop__focus {
        display: none;
    }
}

/* 减少动态：保留静态质感，移除所有运动与跟随 */
@media (prefers-reduced-motion: reduce) {
    .sheet,
    .beam {
        animation: none;
    }

    .backdrop__spot,
    .backdrop__sheen,
    .backdrop__focus {
        display: none;
    }
}
</style>
