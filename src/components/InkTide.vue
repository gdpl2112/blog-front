<template>
  <div ref="rootRef" class="tide" aria-hidden="true">
    <div class="tide__sky"></div>
    <div class="tide__stars"></div>
    <div class="tide__floor"></div>
    <div class="tide__depth">
      <span v-for="layer in 7" :key="layer" class="tide__plane" :style="{'--layer': layer}"></span>
      <div class="tide__mirror-hall">
        <span class="tide__mirror tide__mirror--left"></span>
        <span class="tide__mirror tide__mirror--right"></span>
        <span class="tide__mirror tide__mirror--top"></span>
        <span class="tide__mirror tide__mirror--bottom"></span>
      </div>
      <div class="tide__prism">
        <span class="tide__prism-face tide__prism-face--front"></span>
        <span class="tide__prism-face tide__prism-face--back"></span>
        <span class="tide__prism-face tide__prism-face--left"></span>
        <span class="tide__prism-face tide__prism-face--right"></span>
        <span class="tide__prism-glow"></span>
      </div>
      <span class="tide__orbit tide__orbit--a"></span>
      <span class="tide__orbit tide__orbit--b"></span>
    </div>
    <canvas ref="canvasRef" class="tide__canvas"></canvas>
    <div class="tide__cursor"></div>
    <div class="tide__vignette"></div>
  </div>
</template>

<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref} from 'vue'
import {bindPointerBackdrop} from '@/utils/backgroundPointer'

/**
 * ?????? CSS ??????????????? canvas ???????
 * ??? 3D ??????????????? reduced-motion ??????
 */

const rootRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const LINE_COUNT = 24
const FRAME_INTERVAL = 1000 / 30

interface LightLine { phase: number; speed: number; amplitude: number; y: number }

let ctx: CanvasRenderingContext2D | null = null
let width = 0
let height = 0
let dpr = 1
let frame = 0
let lastFrame = 0
let visible = true
let reduced = false
let detachPointer = () => {}
let resizeObserver: ResizeObserver | null = null
let themeObserver: MutationObserver | null = null
let reducedMedia: MediaQueryList | null = null
let visibilityHandler = () => {}
let reducedHandler = () => {}
const lines: LightLine[] = []

function seedLines() {
  lines.length = 0
  for (let index = 0; index < LINE_COUNT; index += 1) {
    lines.push({
      phase: index * 0.61,
      speed: 0.55 + (index % 5) * 0.1,
      amplitude: 5 + (index % 4) * 4,
      y: 0.47 + index / LINE_COUNT * 0.45,
    })
  }
}

function resize() {
  const canvas = canvasRef.value
  const root = rootRef.value
  if (!canvas || !root) return
  width = root.clientWidth
  height = root.clientHeight
  dpr = Math.min(window.devicePixelRatio || 1, 1.6)
  canvas.width = Math.floor(width * dpr)
  canvas.height = Math.floor(height * dpr)
  ctx = canvas.getContext('2d')
  ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)
  seedLines()
  draw(0)
}

function draw(time: number) {
  if (!ctx || !width || !height) return
  const nx = Number.parseFloat(getComputedStyle(rootRef.value!).getPropertyValue('--pointer-nx')) || 0
  const ny = Number.parseFloat(getComputedStyle(rootRef.value!).getPropertyValue('--pointer-ny')) || 0
  ctx.clearRect(0, 0, width, height)
  ctx.save()
  ctx.globalCompositeOperation = 'screen'
  ctx.lineCap = 'round'

  for (const [index, line] of lines.entries()) {
    const y = height * line.y + Math.sin(time * 0.001 * line.speed + line.phase) * 5
    ctx.beginPath()
    for (let step = -18; step <= 18; step += 1) {
      const x = step / 18 * width * 1.25 - width * 0.125
      const wave = Math.sin(step * 0.52 + time * 0.001 * line.speed + line.phase) * line.amplitude
      const px = x + nx * (index + 2) * 3
      const py = y + wave + ny * (index < 10 ? -6 : 8)
      if (step === -18) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.strokeStyle = index % 5 === 0 ? 'rgba(244, 190, 118, 0.15)' : 'rgba(142, 231, 222, 0.12)'
    ctx.lineWidth = index % 5 === 0 ? 1.2 : 0.7
    ctx.stroke()
  }
  ctx.restore()
}

function animate(time: number) {
  frame = 0
  if (!visible || reduced) return
  if (time - lastFrame >= FRAME_INTERVAL) {
    lastFrame = time
    draw(time)
  }
  frame = requestAnimationFrame(animate)
}

function start() {
  if (!frame && visible && !reduced) frame = requestAnimationFrame(animate)
}

function stop() {
  if (frame) cancelAnimationFrame(frame)
  frame = 0
}

onMounted(() => {
  reducedMedia = window.matchMedia('(prefers-reduced-motion: reduce)')
  reduced = reducedMedia.matches
  resize()
  resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(rootRef.value!)
  visibilityHandler = () => {
    visible = document.visibilityState === 'visible'
    if (visible) start()
    else stop()
  }
  document.addEventListener('visibilitychange', visibilityHandler)
  reducedHandler = () => {
    reduced = reducedMedia?.matches ?? false
    if (reduced) stop()
    else start()
  }
  reducedMedia.addEventListener('change', reducedHandler)
  themeObserver = new MutationObserver(() => draw(performance.now()))
  themeObserver.observe(document.documentElement, {attributes: true, attributeFilter: ['data-theme']})
  detachPointer = bindPointerBackdrop(rootRef)
  start()
})

onBeforeUnmount(() => {
  stop()
  resizeObserver?.disconnect()
  themeObserver?.disconnect()
  reducedMedia?.removeEventListener('change', reducedHandler)
  document.removeEventListener('visibilitychange', visibilityHandler)
  detachPointer()
})
</script>

<style scoped>
.tide {
  position: fixed;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
  contain: paint;
  perspective: 1100px;
  background: var(--td-sky-1);
  --pointer-x: 50vw;
  --pointer-y: 50vh;
  --pointer-nx: 0;
  --pointer-ny: 0;
}

.tide__sky {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(30% 30% at 58% 42%, rgba(var(--td-glow), var(--td-glow-a)), transparent 72%),
    radial-gradient(64% 38% at 50% 86%, rgba(var(--td-horizon), var(--td-horizon-a)), transparent 75%),
    linear-gradient(180deg, var(--td-sky-1) 0%, var(--td-sky-2) 55%, var(--td-water-1) 100%);
}

.tide__stars {
  position: absolute;
  inset: 0 0 32%;
  opacity: 0.62;
  background-image:
    radial-gradient(circle at 18% 22%, rgba(var(--td-star), .72) 0 1px, transparent 1.5px),
    radial-gradient(circle at 33% 13%, rgba(var(--td-star), .4) 0 1px, transparent 1.5px),
    radial-gradient(circle at 71% 19%, rgba(var(--td-star), .6) 0 1px, transparent 1.5px),
    radial-gradient(circle at 85% 34%, rgba(var(--td-star), .36) 0 1px, transparent 1.5px),
    radial-gradient(circle at 9% 48%, rgba(var(--td-star), .4) 0 1px, transparent 1.5px);
}

.tide__floor {
  position: absolute;
  left: -12%;
  right: -12%;
  bottom: -22%;
  height: 62%;
  transform: perspective(600px) rotateX(66deg) translateZ(-30px) translate3d(calc(var(--pointer-nx) * -10px), calc(var(--pointer-ny) * -5px), 0);
  transform-origin: center bottom;
  background:
    linear-gradient(rgba(var(--td-grid), .18) 1px, transparent 1px),
    linear-gradient(90deg, rgba(var(--td-grid), .12) 1px, transparent 1px);
  background-size: 60px 38px;
  -webkit-mask-image: linear-gradient(180deg, transparent, #000 36%, #000 82%, transparent);
  mask-image: linear-gradient(180deg, transparent, #000 36%, #000 82%, transparent);
  opacity: 0.42;
}

.tide__depth {
  position: absolute;
  left: 50%;
  top: 49%;
  width: min(70vw, 760px);
  aspect-ratio: 1.25;
  transform-style: preserve-3d;
  transform: translate(-50%, -50%) rotateX(calc(58deg + var(--pointer-ny) * -4deg)) rotateZ(calc(-8deg + var(--pointer-nx) * 3deg));
  transition: transform 600ms var(--ease);
}

.tide__plane {
  position: absolute;
  inset: calc(var(--layer) * 4%);
  border: 1px solid rgba(var(--td-edge), calc(.12 + var(--layer) * .018));
  clip-path: polygon(50% 0, 91% 24%, 100% 70%, 68% 100%, 20% 90%, 0 42%);
  transform: translateZ(calc(var(--layer) * -22px)) rotate(calc(var(--layer) * 4deg));
  box-shadow: inset 0 0 30px rgba(var(--td-tide), .04), 0 0 28px rgba(var(--td-tide), .04);
  opacity: calc(1 - var(--layer) * .08);
}

.tide__plane:nth-child(odd) { border-color: rgba(var(--td-warm), .16); }
.tide__plane:nth-child(3n) { transform: translateZ(calc(var(--layer) * -22px)) rotate(calc(var(--layer) * -3deg)); }

.tide__prism {
  position: absolute;
  left: 50%;
  top: 47%;
  width: 150px;
  height: 210px;
  transform-style: preserve-3d;
  transform: translate(-50%, -50%) translateZ(110px) rotateZ(18deg) rotateX(4deg);
  filter: drop-shadow(0 26px 28px rgba(0, 0, 0, .22));
}

.tide__prism-face {
  position: absolute;
  inset: 0;
  clip-path: polygon(50% 0, 100% 21%, 84% 88%, 50% 100%, 16% 88%, 0 21%);
  background: linear-gradient(135deg, rgba(var(--td-prism-a), .76), rgba(var(--td-prism-b), .18) 48%, rgba(var(--td-warm), .36));
  border: 1px solid rgba(var(--td-edge), .46);
  box-shadow: inset 22px 0 40px rgba(255, 255, 255, .08), inset -22px 0 40px rgba(0, 0, 0, .24);
}

.tide__prism-face--back { transform: translateZ(-24px) scale(.72); opacity: .36; filter: blur(3px); }
.tide__prism-glow { position: absolute; inset: 18%; border-radius: 50%; background: rgba(var(--td-warm), .32); filter: blur(26px); transform: translateZ(16px); animation: prism-glow 8s ease-in-out infinite; }

.tide__orbit {
  position: absolute;
  left: 50%;
  top: 48%;
  width: 310px;
  height: 92px;
  margin: -46px 0 0 -155px;
  border: 1px solid rgba(var(--td-tide), .44);
  border-radius: 50%;
  transform: translateZ(150px) rotateX(74deg) rotateZ(-22deg);
  box-shadow: 0 0 24px rgba(var(--td-tide), .16), inset 0 0 20px rgba(var(--td-tide), .1);
}

.tide__orbit--b { width: 430px; height: 126px; margin: -63px 0 0 -215px; transform: translateZ(74px) rotateX(74deg) rotateZ(32deg); border-color: rgba(var(--td-warm), .24); }

.tide__canvas,
.tide__cursor,
.tide__vignette { position: absolute; inset: 0; width: 100%; height: 100%; }
.tide__canvas { opacity: .88; transform: translate3d(calc(var(--pointer-nx) * 5px), calc(var(--pointer-ny) * 2px), 0); }
.tide__cursor { opacity: 0; background: radial-gradient(180px 140px at var(--pointer-x) var(--pointer-y), rgba(var(--td-pointer), .22), transparent 72%); mix-blend-mode: screen; transition: opacity 220ms var(--ease); }
.tide.is-pointing .tide__cursor { opacity: 1; }
.tide__vignette { background: radial-gradient(120% 100% at 50% 44%, transparent 28%, rgba(var(--td-vignette), var(--td-vignette-a)) 100%); }


.tide__mirror-hall {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
  pointer-events: none;
}

.tide__mirror {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 220px;
  height: 330px;
  margin: -165px 0 0 -110px;
  overflow: hidden;
  border: 1px solid rgba(var(--td-edge), .48);
  clip-path: polygon(50% 0, 100% 14%, 86% 92%, 50% 100%, 14% 92%, 0 14%);
  background:
    linear-gradient(120deg, rgba(var(--td-prism-a), .38), transparent 34% 58%, rgba(var(--td-warm), .22)),
    repeating-linear-gradient(136deg, transparent 0 14px, rgba(var(--td-edge), .1) 15px 16px, transparent 17px 36px);
  box-shadow: inset 0 0 34px rgba(var(--td-edge), .12), 0 0 32px rgba(var(--td-tide), .08);
  -webkit-box-reflect: below 14px linear-gradient(transparent 0 54%, rgba(var(--td-tide), .12));
  backdrop-filter: blur(3px) saturate(130%);
  -webkit-backdrop-filter: blur(3px) saturate(130%);
  opacity: .7;
}

.tide__mirror--left { transform: translate3d(-254px, -22px, 36px) rotateY(62deg) rotateZ(-10deg); }
.tide__mirror--right { transform: translate3d(254px, -22px, 36px) rotateY(-62deg) rotateZ(10deg); }
.tide__mirror--top { transform: translate3d(0, -220px, -20px) rotateX(-62deg) rotateZ(180deg) scale(.72); opacity: .42; }
.tide__mirror--bottom { transform: translate3d(0, 220px, -32px) rotateX(62deg) scale(.82); opacity: .34; }

.tide__prism-face--left { transform: translateX(-23px) rotateY(-28deg); transform-origin: right center; opacity: .7; }
.tide__prism-face--right { transform: translateX(23px) rotateY(28deg); transform-origin: left center; opacity: .62; }

.tide__depth {
  transform: translate(-50%, -50%)
    rotateX(calc(58deg + var(--pointer-ny) * -14deg))
    rotateY(calc(var(--pointer-nx) * 18deg))
    rotateZ(calc(-8deg + var(--pointer-nx) * 5deg))
    translate3d(calc(var(--pointer-nx) * -22px), calc(var(--pointer-ny) * -16px), 0);
  transition: transform 180ms cubic-bezier(.2, .8, .2, 1);
}

.tide__prism {
  transform: translate(-50%, -50%) translate3d(calc(var(--pointer-nx) * -26px), calc(var(--pointer-ny) * -22px), calc(110px + var(--pointer-ny) * -16px))
    rotateY(calc(var(--pointer-nx) * -26deg)) rotateX(calc(4deg + var(--pointer-ny) * -14deg)) rotateZ(18deg);
  transition: transform 160ms cubic-bezier(.2, .8, .2, 1);
}

.tide__cursor {
  background:
    radial-gradient(7px 7px at var(--pointer-x) var(--pointer-y), rgba(var(--td-pointer), .98), transparent 70%),
    radial-gradient(190px 150px at var(--pointer-x) var(--pointer-y), rgba(var(--td-pointer), .34), transparent 66%),
    linear-gradient(90deg, transparent calc(var(--pointer-x) - 1px), rgba(var(--td-pointer), .16) var(--pointer-x), transparent calc(var(--pointer-x) + 1px)),
    linear-gradient(0deg, transparent calc(var(--pointer-y) - 1px), rgba(var(--td-pointer), .12) var(--pointer-y), transparent calc(var(--pointer-y) + 1px));
}

.tide__cursor::after {
  content: '';
  position: absolute;
  left: var(--pointer-x);
  top: var(--pointer-y);
  width: 80px;
  height: 80px;
  margin: -40px 0 0 -40px;
  border: 1px solid rgba(var(--td-pointer), .34);
  border-radius: 50%;
  box-shadow: 0 0 22px rgba(var(--td-pointer), .2), inset 0 0 16px rgba(var(--td-pointer), .12);
}


@keyframes prism-glow { 0%, 100% { opacity: .62; transform: translateZ(16px) scale(.92); } 50% { opacity: 1; transform: translateZ(30px) scale(1.08); } }

@media (max-width: 720px) {
  .tide__depth { width: 108vw; top: 51%; }
  .tide__prism { width: 110px; height: 154px; }
  .tide__orbit { width: 230px; height: 70px; margin-left: -115px; margin-top: -35px; }
  .tide__orbit--b { width: 310px; margin-left: -155px; }
}

@media (prefers-reduced-motion: reduce) {
  .tide__depth { transform: translate(-50%, -50%) rotateX(58deg) rotateZ(-8deg); }
  .tide__prism { transform: translate(-50%, -50%) translateZ(110px) rotateZ(18deg) rotateX(4deg); }
  .tide__floor, .tide__canvas { transform: none; }
  .tide__prism-glow { animation: none; }
}
</style>
