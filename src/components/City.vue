<template>
  <div ref="rootRef" class="city" aria-hidden="true">
    <div class="city__stars"></div>
    <svg
      class="city__scene"
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMax slice"
    >
      <defs>
        <linearGradient id="ct-glass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" style="stop-color: var(--ct-glass-1)"/>
          <stop offset="0.58" style="stop-color: var(--ct-glass-2)"/>
          <stop offset="1" style="stop-color: var(--ct-glass-3)"/>
        </linearGradient>
        <linearGradient id="ct-stone" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" style="stop-color: var(--ct-stone-1)"/>
          <stop offset="0.62" style="stop-color: var(--ct-stone-2)"/>
          <stop offset="1" style="stop-color: var(--ct-stone-3)"/>
        </linearGradient>
        <linearGradient id="ct-dusk" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" style="stop-color: var(--ct-dusk-1)"/>
          <stop offset="0.58" style="stop-color: var(--ct-dusk-2)"/>
          <stop offset="1" style="stop-color: var(--ct-dusk-3)"/>
        </linearGradient>
        <linearGradient id="ct-far" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" style="stop-color: var(--ct-far-1)"/>
          <stop offset="1" style="stop-color: var(--ct-far-2)"/>
        </linearGradient>
        <linearGradient id="ct-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style="stop-color: var(--ct-ground-1)"/>
          <stop offset="1" style="stop-color: var(--ct-ground-2)"/>
        </linearGradient>
        <clipPath v-for="building in buildings" :id="`ct-clip-${building.id}`" :key="building.id">
          <path :d="building.d"/>
        </clipPath>
      </defs>

      <path class="city__far" d="M0 900V730H60V700H95V665H130V710H180V650H220V690H270V635H315V680H355V700H410V645H455V685H510V620H560V670H620V690H680V630H735V675H790V650H845V700H900V625H955V680H1010V650H1070V610H1125V660H1185V700H1230V645H1280V685H1335V630H1385V670H1440V640H1495V690H1555V655H1600V900Z"/>
      <ellipse class="city__haze city__haze--far" cx="820" cy="708" rx="880" ry="72"/>

      <g class="city__towers">
        <g v-for="building in buildings" :key="building.id">
          <path class="tower__body" :class="`tower__body--${building.tone}`" :d="building.d"/>
          <g :clip-path="`url(#ct-clip-${building.id})`">
            <rect
              v-for="room in building.windows"
              :key="room.key"
              class="tower__window"
              :class="`tower__window--${room.state}`"
              :x="room.x"
              :y="room.y"
              :width="room.width"
              :height="room.height"
              rx="1"
              :style="{'--ct-delay': room.delay}"
            />
          </g>
          <path class="tower__outline" :d="building.d"/>
          <template v-if="building.mastX">
            <line
              class="tower__mast"
              :x1="building.mastX"
              :y1="building.y"
              :x2="building.mastX"
              :y2="building.y - 48"
            />
            <circle class="tower__beacon" :cx="building.mastX" :cy="building.y - 52" r="3"/>
          </template>
        </g>
      </g>

      <ellipse class="city__haze city__haze--near" cx="760" cy="752" rx="1020" ry="82"/>
      <rect class="city__ground" x="0" y="752" width="1600" height="148"/>
      <path class="city__reflection" :d="reflectionPath"/>
      <path class="city__horizon" d="M0 752H1600"/>
    </svg>
    <div class="city__cursor"></div>
  </div>
</template>

<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref} from 'vue'
import {bindPointerBackdrop} from '@/utils/backgroundPointer'

type TowerTone = 'glass' | 'stone' | 'dusk'
type WindowState = 'off' | 'on' | 'cycle'

interface TowerSpec {
    id: string
    d: string
    x: number
    y: number
    w: number
    rows: number
    cols: number
    tone: TowerTone
    seed: number
    mastX?: number
}

interface WindowRect {
    key: string
    x: number
    y: number
    width: number
    height: number
    state: WindowState
    delay: string
}

interface Building extends TowerSpec {
    windows: WindowRect[]
}

const rootRef = ref<HTMLElement | null>(null)
const GROUND_Y = 752
const reflectionPath = [
    'M96 766V844',
    'M176 766V818',
    'M282 766V834',
    'M392 766V808',
    'M540 766V850',
    'M646 766V822',
    'M782 766V842',
    'M920 766V812',
    'M1054 766V836',
    'M1208 766V816',
    'M1370 766V846',
    'M1512 766V824',
].join('')

const towerSpecs: TowerSpec[] = [
    {id: 'harbor', d: 'M40 900V690H70V640H135V670H185V900Z', x: 40, y: 640, w: 145, rows: 6, cols: 5, tone: 'stone', seed: 1},
    {id: 'blue-hour', d: 'M195 900V470H300V900Z', x: 195, y: 470, w: 105, rows: 10, cols: 4, tone: 'glass', seed: 2},
    {id: 'setback', d: 'M320 900V660H365V610H430V640H495V900Z', x: 320, y: 610, w: 175, rows: 7, cols: 6, tone: 'dusk', seed: 3},
    {id: 'crown', d: 'M520 900V470H548V380H617V430H645V900Z', x: 520, y: 380, w: 125, rows: 13, cols: 4, tone: 'glass', seed: 4, mastX: 583},
    {id: 'terraces', d: 'M670 900V620H710V560H785V600H840V900Z', x: 670, y: 560, w: 170, rows: 8, cols: 6, tone: 'stone', seed: 5},
    {id: 'slender', d: 'M860 900V450H970V900Z', x: 860, y: 450, w: 110, rows: 11, cols: 4, tone: 'glass', seed: 6, mastX: 915},
    {id: 'midtown', d: 'M995 900V650H1040V590H1105V640H1165V900Z', x: 995, y: 590, w: 170, rows: 7, cols: 6, tone: 'dusk', seed: 7},
    {id: 'stack', d: 'M1185 900V520H1215V490H1305V550H1335V900Z', x: 1185, y: 490, w: 120, rows: 10, cols: 4, tone: 'stone', seed: 8},
    {id: 'anchor', d: 'M1360 900V460H1395V330H1475V390H1530V900Z', x: 1360, y: 330, w: 170, rows: 15, cols: 5, tone: 'glass', seed: 9, mastX: 1436},
    {id: 'east', d: 'M1520 900V660H1550V610H1605V900Z', x: 1520, y: 610, w: 85, rows: 7, cols: 3, tone: 'dusk', seed: 10},
]

function makeWindows(tower: TowerSpec): WindowRect[] {
    const paddingX = 10
    const paddingTop = 10
    const usableW = tower.w - paddingX * 2
    const usableH = GROUND_Y - tower.y - 18
    const cellW = usableW / tower.cols
    const cellH = usableH / tower.rows
    const rooms: WindowRect[] = []

    for (let row = 0; row < tower.rows; row += 1) {
        for (let col = 0; col < tower.cols; col += 1) {
            const roll = (row * 7 + col * 11 + tower.seed * 5) % 13
            if (roll === 0 || roll === 4) continue

            const state: WindowState = roll % 5 === 1
                ? 'cycle'
                : roll % 3 === 0
                    ? 'on'
                    : 'off'
            const delay = `${(-(tower.seed * 0.61 + row * 0.23 + col * 0.17) % 12).toFixed(2)}s`

            rooms.push({
                key: `${tower.id}-${row}-${col}`,
                x: tower.x + paddingX + col * cellW + cellW * 0.18,
                y: tower.y + paddingTop + row * cellH + cellH * 0.2,
                width: cellW * 0.54,
                height: cellH * 0.3,
                state,
                delay,
            })
        }
    }

    return rooms
}

const buildings: Building[] = towerSpecs.map((tower) => ({
    ...tower,
    windows: makeWindows(tower),
}))

if (import.meta.env.DEV) {
    console.assert(buildings.length === 10 && buildings.every((item) => item.windows.length > 0), 'city skyline windows')
}

let detachPointer = () => {
}

onMounted(() => {
    detachPointer = bindPointerBackdrop(rootRef)
})

onBeforeUnmount(() => {
    detachPointer()
})
</script>

<style scoped>
/* 蓝调都市：天空留白、三层立面、稀疏窗灯，城市只从地平线向上生长。 */
.city {
    position: fixed;
    inset: 0;
    z-index: -1;
    overflow: hidden;
    pointer-events: none;
    contain: paint;
    --ct-ground: 18%;
    --ct-cycle: 9s;
    --ct-delay: 0s;
    --pointer-x: 50vw;
    --pointer-y: 50vh;
    --pointer-nx: 0;
    --pointer-ny: 0;
    background:
        radial-gradient(circle at 78% 17%,
        var(--ct-orb-ink) 0 0.8%,
        var(--ct-orb) 1.15%,
        rgba(var(--ct-glow), var(--ct-glow-a)) 2.4%,
        rgba(var(--ct-glow), 0) 12%),
        radial-gradient(76% 44% at 68% 78%,
        rgba(var(--ct-glow), var(--ct-glow-a)) 0%,
        rgba(var(--ct-glow), 0) 72%),
        linear-gradient(180deg, var(--ct-sky-1) 0%, var(--ct-sky-2) 62%, var(--ct-sky-3) 100%);
}

.city::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(122% 100% at 50% 42%,
    rgba(var(--ct-vignette), 0) 38%,
    rgba(var(--ct-vignette), var(--ct-vignette-a)) 100%);
}

.city__stars {
    position: absolute;
    inset: 0 0 24%;
    background-image:
        radial-gradient(circle at 10% 22%, rgba(var(--ct-star), var(--ct-star-a)) 0 1px, transparent 1.5px),
        radial-gradient(circle at 24% 12%, rgba(var(--ct-star), var(--ct-star-a)) 0 1px, transparent 1.5px),
        radial-gradient(circle at 42% 25%, rgba(var(--ct-star), var(--ct-star-a)) 0 1px, transparent 1.5px),
        radial-gradient(circle at 57% 8%, rgba(var(--ct-star), var(--ct-star-a)) 0 1.2px, transparent 1.8px),
        radial-gradient(circle at 72% 20%, rgba(var(--ct-star), var(--ct-star-a)) 0 1px, transparent 1.5px),
        radial-gradient(circle at 92% 10%, rgba(var(--ct-star), var(--ct-star-a)) 0 1px, transparent 1.5px);
}

.city__scene {
    position: absolute;
    inset: 0;
    display: block;
    width: 100%;
    height: 100%;
}

.city__cursor {
    position: absolute;
    inset: 0;
    opacity: 0;
    pointer-events: none;
    mix-blend-mode: screen;
    transition: opacity 220ms var(--ease);
    background:
        radial-gradient(150px 150px at var(--pointer-x, 50vw) var(--pointer-y, 50vh),
        rgba(var(--ct-window-glow), var(--ct-pointer-a)) 0%,
        rgba(var(--ct-window-glow), 0) 72%),
        linear-gradient(180deg,
        transparent calc(var(--pointer-y, 50vh) - 44px),
        rgba(var(--ct-window-glow), var(--ct-pointer-line-a)) var(--pointer-y, 50vh),
        transparent calc(var(--pointer-y, 50vh) + 44px));
    -webkit-mask-image: linear-gradient(180deg, transparent 18%, #000 52%, #000 90%, transparent 100%);
    mask-image: linear-gradient(180deg, transparent 18%, #000 52%, #000 90%, transparent 100%);
}

.city.is-pointing .city__cursor {
    opacity: 1;
}

.city__far {
    fill: url(#ct-far);
    opacity: var(--ct-far-a);
    will-change: transform;
    transform: translate3d(calc(var(--pointer-nx, 0) * 6px), calc(var(--pointer-ny, 0) * 3px), 0);
}

.city__towers {
    will-change: transform;
    transform: translate3d(calc(var(--pointer-nx, 0) * 12px), calc(var(--pointer-ny, 0) * 5px), 0);
}

.city__haze {
    fill: rgba(var(--ct-haze), var(--ct-haze-a));
    filter: blur(34px);
}

.city__haze--far {
    opacity: 0.62;
}

.city__haze--near {
    opacity: 0.38;
}

.tower__body--glass {
    fill: url(#ct-glass);
}

.tower__body--stone {
    fill: url(#ct-stone);
}

.tower__body--dusk {
    fill: url(#ct-dusk);
}

.tower__outline {
    fill: none;
    stroke: var(--ct-edge);
    stroke-width: 1.2;
    vector-effect: non-scaling-stroke;
}

.tower__window {
    fill: var(--ct-window-off);
    fill-opacity: var(--ct-window-base-a);
    shape-rendering: crispEdges;
}

.tower__window--on,
.tower__window--cycle {
    fill: var(--ct-window-lit);
}

.tower__window--on {
    opacity: var(--ct-lit-max);
}

.tower__window--cycle {
    opacity: var(--ct-lit-min);
    will-change: opacity;
    animation: ct-window-switch var(--ct-cycle) steps(1, end) infinite;
    animation-delay: var(--ct-delay);
}

.tower__mast {
    stroke: var(--ct-mast);
    stroke-width: 2;
    vector-effect: non-scaling-stroke;
}

.tower__beacon {
    fill: var(--ct-beacon);
    filter: drop-shadow(0 0 4px color-mix(in srgb, var(--ct-beacon) 62%, transparent));
    animation: ct-beacon 3.2s steps(1, end) infinite;
}

.city__ground {
    fill: url(#ct-ground);
}

.city__reflection {
    fill: none;
    stroke: var(--ct-window-lit);
    stroke-width: 3;
    stroke-linecap: round;
    opacity: var(--ct-reflect-a);
    filter: blur(4px);
}

.city__horizon {
    fill: none;
    stroke: var(--ct-horizon);
    stroke-width: 1;
    vector-effect: non-scaling-stroke;
}

@keyframes ct-window-switch {
    0%, 18% { opacity: var(--ct-lit-max); }
    19%, 38% { opacity: var(--ct-lit-min); }
    39%, 72% { opacity: var(--ct-lit-max); }
    73%, 84% { opacity: var(--ct-lit-min); }
    85%, 100% { opacity: var(--ct-lit-max); }
}

@keyframes ct-beacon {
    0%, 46% { opacity: 0.18; }
    47%, 100% { opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
    .city__far,
    .city__towers {
        transform: none;
    }

    .tower__window--cycle {
        opacity: var(--ct-lit-min);
        animation: none;
    }

    .tower__beacon {
        animation: none;
    }
}
</style>
