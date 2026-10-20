<template>
  <div ref="rootRef" class="city" aria-hidden="true">
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
        <linearGradient id="ct-mid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style="stop-color: var(--ct-mid-1)"/>
          <stop offset="1" style="stop-color: var(--ct-mid-2)"/>
        </linearGradient>
        <linearGradient id="ct-ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style="stop-color: var(--ct-ground-1)"/>
          <stop offset="1" style="stop-color: var(--ct-ground-2)"/>
        </linearGradient>
        <linearGradient id="ct-neon" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style="stop-color: rgba(var(--ct-neon-cyan), 1)"/>
          <stop offset="0.48" style="stop-color: rgba(var(--ct-neon-violet), 0.8)"/>
          <stop offset="1" style="stop-color: rgba(var(--ct-neon-violet), 0)"/>
        </linearGradient>
        <linearGradient id="ct-beam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style="stop-color: rgba(var(--ct-neon-cyan), 0)"/>
          <stop offset="0.55" style="stop-color: rgba(var(--ct-neon-cyan), 0.2)"/>
          <stop offset="1" style="stop-color: rgba(var(--ct-neon-violet), 0.6)"/>
        </linearGradient>
        <linearGradient id="ct-reflect" x1="0" y1="760" x2="0" y2="900" gradientUnits="userSpaceOnUse">
          <stop offset="0" style="stop-color: var(--ct-window-lit)"/>
          <stop offset="1" style="stop-color: var(--ct-window-lit); stop-opacity: 0"/>
        </linearGradient>
        <linearGradient id="ct-horizon-neon" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" style="stop-color: rgba(var(--ct-neon-cyan), 0)"/>
          <stop offset="0.28" style="stop-color: rgba(var(--ct-neon-cyan), 0.7)"/>
          <stop offset="0.52" style="stop-color: rgba(var(--ct-neon-violet), 0.5)"/>
          <stop offset="0.74" style="stop-color: rgba(var(--ct-neon-cyan), 0.7)"/>
          <stop offset="1" style="stop-color: rgba(var(--ct-neon-cyan), 0)"/>
        </linearGradient>
        <linearGradient id="ct-traffic-warm" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" style="stop-color: rgba(var(--ct-traffic-warm), 0)"/>
          <stop offset="0.5" style="stop-color: rgba(var(--ct-traffic-warm), 0.9)"/>
          <stop offset="1" style="stop-color: rgba(var(--ct-traffic-warm), 0)"/>
        </linearGradient>
        <linearGradient id="ct-traffic-cool" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" style="stop-color: rgba(var(--ct-traffic-cool), 0)"/>
          <stop offset="0.5" style="stop-color: rgba(var(--ct-traffic-cool), 0.9)"/>
          <stop offset="1" style="stop-color: rgba(var(--ct-traffic-cool), 0)"/>
        </linearGradient>
        <linearGradient id="ct-traffic-magenta" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" style="stop-color: rgba(var(--ct-traffic-magenta), 0)"/>
          <stop offset="0.5" style="stop-color: rgba(var(--ct-traffic-magenta), 0.9)"/>
          <stop offset="1" style="stop-color: rgba(var(--ct-traffic-magenta), 0)"/>
        </linearGradient>
        <filter id="ct-soft" x="-30%" y="-120%" width="160%" height="340%">
          <feGaussianBlur stdDeviation="24"/>
        </filter>
        <filter id="ct-glow" x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation="5"/>
        </filter>
        <linearGradient id="ct-scan-band" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" style="stop-color: #000"/>
          <stop offset="0.26" style="stop-color: #000"/>
          <stop offset="0.5" style="stop-color: #fff"/>
          <stop offset="0.74" style="stop-color: #000"/>
          <stop offset="1" style="stop-color: #000"/>
        </linearGradient>
        <mask id="ct-scan-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="1600" height="900">
          <rect ref="scanBandRef" x="-400" y="0" width="300" height="900" fill="url(#ct-scan-band)"/>
        </mask>
        <clipPath id="ct-ground-clip">
          <rect x="0" y="752" width="1600" height="148"/>
        </clipPath>
        <clipPath v-for="building in buildings" :id="`ct-clip-${building.id}`" :key="building.id">
          <path :d="building.d"/>
        </clipPath>
      </defs>

      <ellipse class="city__dome" cx="802" cy="748" rx="940" ry="236" filter="url(#ct-soft)"/>

      <g class="city__starfield">
        <circle
          v-for="star in skyStars"
          :key="star.key"
          class="city__star"
          :cx="star.x"
          :cy="star.y"
          :r="star.r"
          :style="{
            '--ct-star-delay': star.delay,
            '--ct-star-dur': star.duration,
            '--ct-star-peak': star.peak,
          }"
        />
      </g>

      <g class="city__clouds">
        <g class="city__cloud city__cloud--a" filter="url(#ct-soft)">
          <ellipse cx="286" cy="286" rx="250" ry="52"/>
          <ellipse cx="452" cy="312" rx="168" ry="40"/>
          <ellipse cx="136" cy="318" rx="132" ry="34"/>
        </g>
        <g class="city__cloud city__cloud--b" filter="url(#ct-soft)">
          <ellipse cx="1152" cy="244" rx="216" ry="42"/>
          <ellipse cx="1326" cy="272" rx="150" ry="32"/>
        </g>
      </g>

      <path class="city__far" d="M0 900V730H60V700H95V665H130V710H180V650H220V690H270V635H315V680H355V700H410V645H455V685H510V620H560V670H620V690H680V630H735V675H790V650H845V700H900V625H955V680H1010V650H1070V610H1125V660H1185V700H1230V645H1280V685H1335V630H1385V670H1440V640H1495V690H1555V655H1600V900Z"/>
      <ellipse class="city__haze city__haze--far" cx="820" cy="708" rx="880" ry="72"/>

      <g class="city__mid-layer">
        <path class="city__mid" :d="midPath"/>
        <g class="city__mid-windows">
          <rect
            v-for="spot in midWindows"
            :key="spot.key"
            class="mid-window"
            :class="{'mid-window--cool': spot.cool}"
            :x="spot.x"
            :y="spot.y"
            :width="spot.width"
            :height="spot.height"
          />
        </g>
        <line class="city__mid-neon" x1="1243" y1="636" x2="1281" y2="636"/>
      </g>

      <g class="city__towers">
        <g v-for="building in buildings" :key="building.id">
          <path class="tower__body" :class="`tower__body--${building.tone}`" :d="building.d"/>
          <g :clip-path="`url(#ct-clip-${building.id})`">
            <rect
              v-for="room in building.windows"
              :key="room.key"
              class="tower__window"
              :class="[`tower__window--${room.state}`, {'tower__window--cool': room.cool}]"
              :x="room.x"
              :y="room.y"
              :width="room.width"
              :height="room.height"
              rx="1"
              :style="{'--ct-delay': room.delay}"
            />
            <rect
              v-if="building.neon"
              class="tower__neon"
              :x="building.x + building.w - 2.4"
              :y="building.y"
              :width="2.4"
              :height="GROUND_Y - building.y"
            />
          </g>
          <path class="tower__outline" :d="building.d"/>
          <line
            v-if="building.roofLine"
            class="tower__roof-neon"
            :x1="building.roofLine.x1"
            :x2="building.roofLine.x2"
            :y1="building.roofLine.y"
            :y2="building.roofLine.y"
          />
          <template v-if="building.mastX">
            <line
              class="tower__mast"
              :x1="building.mastX"
              :y1="building.y"
              :x2="building.mastX"
              :y2="building.y - 48"
            />
            <circle
              class="tower__beacon"
              :cx="building.mastX"
              :cy="building.y - 52"
              r="3"
              :style="{'--ct-beacon-delay': building.beaconDelay}"
            />
          </template>
          <g v-if="building.beam" class="tower__beam">
            <rect
              class="tower__beam-halo"
              :x="building.beam.x - building.beam.width / 2"
              :y="building.beam.top"
              :width="building.beam.width"
              :height="building.y - building.beam.top"
              filter="url(#ct-glow)"
            />
            <rect
              class="tower__beam-core"
              :x="building.beam.x - 0.8"
              :y="building.beam.top"
              width="1.6"
              :height="building.y - building.beam.top"
            />
          </g>
        </g>
      </g>

      <g class="city__halo">
        <ellipse class="halo__ring" cx="583" cy="286" rx="98" ry="24"/>
        <ellipse class="halo__ring halo__ring--inner" cx="583" cy="286" rx="74" ry="17"/>
      </g>

      <g class="city__scan-wire" mask="url(#ct-scan-mask)">
        <g v-for="building in buildings" :key="`wire-${building.id}`">
          <path class="scan-wire__outline" :d="building.d"/>
          <g :clip-path="`url(#ct-clip-${building.id})`">
            <line
              v-for="floor in building.floors"
              :key="floor.key"
              class="scan-wire__floor"
              :x1="floor.x1"
              :x2="floor.x2"
              :y1="floor.y"
              :y2="floor.y"
            />
          </g>
        </g>
      </g>

      <ellipse class="city__haze city__haze--near" cx="760" cy="752" rx="1020" ry="82"/>
      <rect class="city__ground" x="0" y="752" width="1600" height="148"/>

      <g class="city__grid" clip-path="url(#ct-ground-clip)">
        <line
          v-for="line in gridLines"
          :key="line.key"
          class="grid__line"
          x1="0"
          :y1="line.y"
          x2="1600"
          :y2="line.y"
          :style="{'--ct-grid-o': line.opacity}"
        />
        <line
          v-for="ray in gridRays"
          :key="ray.key"
          class="grid__ray"
          x1="800"
          y1="752"
          :x2="ray.x"
          y2="900"
          :style="{'--ct-grid-o': ray.opacity}"
        />
      </g>

      <ellipse
        v-if="beamPool"
        class="city__beam-pool"
        :cx="beamPool.x"
        cy="766"
        rx="64"
        ry="9"
        filter="url(#ct-glow)"
      />

      <g class="city__traffic" clip-path="url(#ct-ground-clip)">
        <rect
          v-for="trail in trails"
          :key="trail.key"
          class="traffic__streak"
          :class="[`traffic__streak--${trail.tone}`, `traffic__streak--${trail.direction}`]"
          x="0"
          :y="trail.y"
          :width="trail.width"
          height="2.6"
          rx="1.3"
          :style="{
            '--ct-traffic-dur': trail.duration,
            '--ct-traffic-delay': trail.delay,
            '--ct-traffic-o': trail.opacity,
          }"
        />
      </g>

      <path class="city__reflection" :d="reflectionPath"/>
      <path class="city__horizon" d="M0 752H1600"/>
      <g class="city__horizon-glow">
        <path class="city__horizon-neon-halo" d="M0 752H1600"/>
        <path class="city__horizon-neon" d="M0 752H1600"/>
      </g>
    </svg>
    <div class="city__scan"></div>
    <div class="city__scanner">
      <span class="scanner__beam"></span>
      <span class="scanner__reticle"></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref} from 'vue'

type TowerTone = 'glass' | 'stone' | 'dusk'
type WindowState = 'off' | 'on' | 'cycle'
type TrafficTone = 'warm' | 'cool' | 'magenta'
type TrafficDirection = 'left' | 'right'

interface TowerBeam {
    x: number
    top: number
    width: number
}

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
    neon?: boolean
    roof?: [number, number]
    beam?: TowerBeam
}

interface WindowRect {
    key: string
    x: number
    y: number
    width: number
    height: number
    state: WindowState
    cool: boolean
    delay: string
}

interface FloorLine {
    key: string
    x1: number
    x2: number
    y: number
}

interface Building extends TowerSpec {
    windows: WindowRect[]
    floors: FloorLine[]
    roofLine?: { x1: number; x2: number; y: number }
    beaconDelay: string
}

interface SkyStar {
    key: string
    x: number
    y: number
    r: number
    delay: string
    duration: string
    peak: number
}

interface MidSpec {
    x: number
    w: number
    top: number
    cap?: number
}

interface MidWindow {
    key: string
    x: number
    y: number
    width: number
    height: number
    cool: boolean
}

interface TrafficTrail {
    key: string
    y: number
    width: number
    tone: TrafficTone
    direction: TrafficDirection
    duration: string
    delay: string
    opacity: number
}

const rootRef = ref<HTMLElement | null>(null)
const scanBandRef = ref<SVGRectElement | null>(null)
const GROUND_Y = 752
const SCAN_BAND_WIDTH = 300
const SCAN_IDLE_MS = 4200
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
    {id: 'harbor', d: 'M40 900V690H70V640H135V670H185V900Z', x: 40, y: 640, w: 145, rows: 6, cols: 5, tone: 'stone', seed: 1, mastX: 100},
    {id: 'blue-hour', d: 'M195 900V470H300V900Z', x: 195, y: 470, w: 105, rows: 10, cols: 4, tone: 'glass', seed: 2, neon: true, roof: [198, 298]},
    {id: 'setback', d: 'M320 900V660H365V610H430V640H495V900Z', x: 320, y: 610, w: 175, rows: 7, cols: 6, tone: 'dusk', seed: 3},
    {id: 'crown', d: 'M520 900V470H548V380H617V430H645V900Z', x: 520, y: 380, w: 125, rows: 13, cols: 4, tone: 'glass', seed: 4, mastX: 583, roof: [549, 616], beam: {x: 583, top: 72, width: 26}},
    {id: 'terraces', d: 'M670 900V620H710V560H785V600H840V900Z', x: 670, y: 560, w: 170, rows: 8, cols: 6, tone: 'stone', seed: 5, mastX: 760},
    {id: 'slender', d: 'M860 900V450H970V900Z', x: 860, y: 450, w: 110, rows: 11, cols: 4, tone: 'glass', seed: 6, mastX: 915, neon: true, roof: [863, 967]},
    {id: 'midtown', d: 'M995 900V650H1040V590H1105V640H1165V900Z', x: 995, y: 590, w: 170, rows: 7, cols: 6, tone: 'dusk', seed: 7, mastX: 1072},
    {id: 'stack', d: 'M1185 900V520H1215V490H1305V550H1335V900Z', x: 1185, y: 490, w: 120, rows: 10, cols: 4, tone: 'stone', seed: 8, mastX: 1260},
    {id: 'anchor', d: 'M1360 900V460H1395V330H1475V390H1530V900Z', x: 1360, y: 330, w: 170, rows: 15, cols: 5, tone: 'glass', seed: 9, mastX: 1436, neon: true, roof: [1398, 1472]},
    {id: 'east', d: 'M1520 900V660H1550V610H1605V900Z', x: 1520, y: 610, w: 85, rows: 7, cols: 3, tone: 'dusk', seed: 10},
]

function mulberry32(seed: number) {
    let a = seed >>> 0
    return function random() {
        a = (a + 0x6d2b79f5) | 0
        let t = Math.imul(a ^ (a >>> 15), 1 | a)
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}

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
                cool: state !== 'off' && (row * 3 + col * 5 + tower.seed) % 7 === 0,
                delay,
            })
        }
    }

    return rooms
}

const midSpecs: MidSpec[] = [
    {x: 6, w: 58, top: 672},
    {x: 120, w: 46, top: 640},
    {x: 240, w: 62, top: 690, cap: 14},
    {x: 370, w: 44, top: 620},
    {x: 470, w: 56, top: 668},
    {x: 610, w: 50, top: 645, cap: 18},
    {x: 720, w: 58, top: 690},
    {x: 830, w: 46, top: 655},
    {x: 950, w: 54, top: 700},
    {x: 1100, w: 60, top: 665, cap: 12},
    {x: 1240, w: 44, top: 635},
    {x: 1380, w: 54, top: 690},
    {x: 1500, w: 46, top: 650},
]

function midBuildingPath(spec: MidSpec) {
    const cap = spec.cap ?? 0
    if (cap > 0) {
        return `M${spec.x} 900V${spec.top + cap}H${spec.x + 11}V${spec.top}H${spec.x + spec.w}V900Z`
    }
    return `M${spec.x} 900V${spec.top}H${spec.x + spec.w}V900Z`
}

const midPath = midSpecs.map(midBuildingPath).join('')

function makeMidWindows(): MidWindow[] {
    const rand = mulberry32(0x51f0a3)
    const spots: MidWindow[] = []

    for (const spec of midSpecs) {
        const cols = Math.max(1, Math.floor((spec.w - 18) / 11))
        const rows = Math.max(1, Math.floor((GROUND_Y - spec.top - 18) / 13))
        for (let row = 0; row < rows; row += 1) {
            for (let col = 0; col < cols; col += 1) {
                if (rand() > 0.26) continue
                spots.push({
                    key: `mid-${spec.x}-${row}-${col}`,
                    x: spec.x + 14 + col * 11,
                    y: spec.top + 12 + row * 13,
                    width: 2.6,
                    height: 3.4,
                    cool: rand() < 0.32,
                })
            }
        }
    }

    return spots
}

function makeSkyStars(): SkyStar[] {
    const rand = mulberry32(0x2c9277)
    const stars: SkyStar[] = []
    let guard = 0

    while (stars.length < 58 && guard < 500) {
        guard += 1
        const x = 24 + rand() * 1552
        const y = 22 + rand() * 432
        if (Math.hypot(x - 1248, y - 153) < 175) continue
        if (Math.hypot(x - 583, y - 286) < 118) continue
        stars.push({
            key: `sky-${stars.length}`,
            x: Number(x.toFixed(1)),
            y: Number(y.toFixed(1)),
            r: Number((0.5 + rand() * 1.2).toFixed(2)),
            delay: `${(-rand() * 16).toFixed(2)}s`,
            duration: `${(3.4 + rand() * 4.6).toFixed(2)}s`,
            peak: Number((0.32 + rand() * 0.62).toFixed(2)),
        })
    }

    return stars
}

const trails: TrafficTrail[] = [
    {key: 'lane-1', y: 772, width: 130, tone: 'cool', direction: 'right', duration: '27s', delay: '-5s', opacity: 0.55},
    {key: 'lane-2', y: 790, width: 196, tone: 'warm', direction: 'left', duration: '22s', delay: '-13s', opacity: 0.7},
    {key: 'lane-3', y: 810, width: 156, tone: 'magenta', direction: 'right', duration: '31s', delay: '-21s', opacity: 0.5},
    {key: 'lane-4', y: 834, width: 236, tone: 'cool', direction: 'left', duration: '18s', delay: '-8s', opacity: 0.62},
    {key: 'lane-5', y: 866, width: 268, tone: 'warm', direction: 'right', duration: '25s', delay: '-17s', opacity: 0.55},
]

const gridLines = [764, 778, 796, 818, 844, 874].map((y, index) => ({
    key: `grid-h-${index}`,
    y,
    opacity: 0.32 + index * 0.12,
}))

const gridRays = [-780, -320, 120, 500, 880, 1260, 1680, 2160].map((x, index) => ({
    key: `grid-r-${index}`,
    x,
    opacity: 0.18 + (index % 3) * 0.07,
}))

function makeFloors(tower: TowerSpec): FloorLine[] {
    const step = (GROUND_Y - tower.y) / Math.max(1, tower.rows)
    const lines: FloorLine[] = []
    for (let index = 1; index < tower.rows; index += 1) {
        lines.push({
            key: `${tower.id}-floor-${index}`,
            x1: tower.x,
            x2: tower.x + tower.w,
            y: tower.y + step * index,
        })
    }
    return lines
}

const buildings: Building[] = towerSpecs.map((tower) => ({
    ...tower,
    windows: makeWindows(tower),
    floors: makeFloors(tower),
    roofLine: tower.roof ? {x1: tower.roof[0], x2: tower.roof[1], y: tower.y + 0.8} : undefined,
    beaconDelay: `${(-(tower.seed * 0.53) % 3.2).toFixed(2)}s`,
}))

const midWindows = makeMidWindows()
const skyStars = makeSkyStars()
const beamPool = towerSpecs.find((tower) => tower.beam)?.beam ?? null

if (import.meta.env.DEV) {
    console.assert(buildings.length === 10 && buildings.every((item) => item.windows.length > 0) && midWindows.length > 0, 'city skyline layers')
}

let scanFrame = 0
let scanIdleTimer = 0
let scanX = 0
let scanY = 0
let scanEnabled = false

function applyScan() {
    scanFrame = 0
    const root = rootRef.value
    const band = scanBandRef.value
    if (!root || !band) return
    root.classList.add('is-scanning')
    root.style.setProperty('--scan-x', `${scanX}px`)
    root.style.setProperty('--scan-y', `${scanY}px`)
    const matrix = band.ownerSVGElement?.getScreenCTM()
    if (!matrix) return
    const point = new DOMPoint(scanX, scanY).matrixTransform(matrix.inverse())
    band.setAttribute('x', String(point.x - SCAN_BAND_WIDTH / 2))
}

function hideScan() {
    if (scanFrame) {
        cancelAnimationFrame(scanFrame)
        scanFrame = 0
    }
    window.clearTimeout(scanIdleTimer)
    scanIdleTimer = 0
    rootRef.value?.classList.remove('is-scanning')
}

function onPointerMove(event: PointerEvent) {
    if (!scanEnabled || event.pointerType === 'touch') return
    scanX = event.clientX
    scanY = event.clientY
    if (!scanFrame) scanFrame = requestAnimationFrame(applyScan)
    window.clearTimeout(scanIdleTimer)
    scanIdleTimer = window.setTimeout(hideScan, SCAN_IDLE_MS)
}

function onPointerOut(event: PointerEvent) {
    if (!event.relatedTarget) hideScan()
}

onMounted(() => {
    scanEnabled = window.matchMedia('(hover: hover) and (pointer: fine)').matches
        && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!scanEnabled) return
    window.addEventListener('pointermove', onPointerMove, {passive: true})
    window.addEventListener('pointerout', onPointerOut)
    window.addEventListener('blur', hideScan)
})

onBeforeUnmount(() => {
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerout', onPointerOut)
    window.removeEventListener('blur', hideScan)
    hideScan()
})
</script>

<style scoped>
/* 蓝调都市 · 冷霓虹：三层楼群压在地平线上，冷光只描边，不照亮整座城。 */
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

.city__scene {
    position: absolute;
    inset: 0;
    display: block;
    width: 100%;
    height: 100%;
}

.city__scan {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: repeating-linear-gradient(180deg,
    rgba(var(--ct-scan), var(--ct-scan-a)) 0 1px,
    transparent 1px 4px);
}

.city__scan::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg,
    transparent 34%,
    rgba(var(--ct-neon-cyan), calc(var(--ct-scan-a) * 2.6)) 50%,
    transparent 66%);
    animation: ct-scan 18s linear infinite;
}

.city__scanner {
    position: absolute;
    inset: 0;
    opacity: 0;
    pointer-events: none;
    transition: opacity 240ms var(--ease);
}

.city.is-scanning .city__scanner {
    opacity: 1;
}

.scanner__beam {
    position: absolute;
    left: var(--scan-x, 50vw);
    top: 0;
    bottom: 0;
    width: 1px;
    background: linear-gradient(180deg,
    rgba(var(--ct-neon-cyan), 0) 0%,
    rgba(var(--ct-neon-cyan), 0.18) 34%,
    rgba(var(--ct-neon-cyan), 0.6) 74%,
    rgba(var(--ct-neon-cyan), 0.14) 100%);
    box-shadow:
        0 0 14px rgba(var(--ct-neon-cyan), 0.4),
        0 0 44px rgba(var(--ct-neon-cyan), 0.16);
}

.scanner__beam::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: -90px;
    width: 180px;
    background: linear-gradient(90deg,
    rgba(var(--ct-neon-cyan), 0),
    rgba(var(--ct-neon-cyan), 0.05) 30%,
    rgba(var(--ct-neon-cyan), 0.11) 50%,
    rgba(var(--ct-neon-cyan), 0.05) 70%,
    rgba(var(--ct-neon-cyan), 0));
}

.scanner__reticle {
    position: absolute;
    left: var(--scan-x, 50vw);
    top: var(--scan-y, 50vh);
    width: 18px;
    height: 18px;
    margin: -9px 0 0 -9px;
    border: 1px solid rgba(var(--ct-neon-cyan), 0.5);
    border-radius: 50%;
    box-shadow:
        0 0 12px rgba(var(--ct-neon-cyan), 0.25),
        inset 0 0 6px rgba(var(--ct-neon-cyan), 0.12);
}

.scanner__reticle::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    width: 2px;
    height: 2px;
    margin: -1px 0 0 -1px;
    border-radius: 50%;
    background: rgba(var(--ct-neon-cyan), 0.9);
    box-shadow: 0 0 6px rgba(var(--ct-neon-cyan), 0.75);
}

.city__dome {
    fill: rgba(var(--ct-glow), var(--ct-dome-a));
    animation: ct-dome 18s ease-in-out infinite;
}

.city__star {
    fill: rgba(var(--ct-star), var(--ct-star-a));
    opacity: var(--ct-star-peak);
    animation: ct-twinkle var(--ct-star-dur, 5s) ease-in-out infinite;
    animation-delay: var(--ct-star-delay, 0s);
}

.city__cloud {
    fill: rgba(var(--ct-cloud), var(--ct-cloud-a));
    will-change: transform;
}

.city__cloud--a {
    animation: ct-cloud-a 168s ease-in-out infinite alternate;
}

.city__cloud--b {
    animation: ct-cloud-b 128s ease-in-out infinite alternate;
}

.city__far {
    fill: url(#ct-far);
    opacity: var(--ct-far-a);
}

.city__mid {
    fill: url(#ct-mid);
    opacity: var(--ct-mid-a);
}

.mid-window {
    fill: var(--ct-window-lit);
    opacity: 0.34;
}

.mid-window--cool {
    fill: var(--ct-window-cool);
    opacity: 0.22;
}

.city__mid-neon {
    stroke: rgba(var(--ct-neon-cyan), 0.8);
    stroke-width: 1.3;
    opacity: var(--ct-neon-a);
    filter: drop-shadow(0 0 5px rgba(var(--ct-neon-cyan), 0.5));
}

.city__haze {
    fill: rgba(var(--ct-haze), var(--ct-haze-a));
    filter: blur(34px);
    animation: ct-haze 58s ease-in-out infinite alternate;
}

.city__haze--far {
    opacity: 0.62;
    animation-duration: 76s;
    animation-delay: -18s;
}

.city__haze--near {
    opacity: 0.38;
    animation-duration: 44s;
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

.tower__window--cool {
    fill: var(--ct-window-cool);
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

.tower__neon {
    fill: url(#ct-neon);
    opacity: calc(var(--ct-neon-a) * 0.6);
}

.tower__roof-neon {
    stroke: rgba(var(--ct-neon-cyan), 0.85);
    stroke-width: 1.6;
    vector-effect: non-scaling-stroke;
    opacity: calc(var(--ct-neon-a) * 0.8);
    filter: drop-shadow(0 0 4px rgba(var(--ct-neon-cyan), 0.55));
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
    animation-delay: var(--ct-beacon-delay, 0s);
}

.tower__beam {
    mix-blend-mode: screen;
}

.tower__beam-halo {
    fill: url(#ct-beam);
    opacity: calc(var(--ct-neon-a) * 0.7);
    animation: ct-beam 11s ease-in-out infinite;
}

.tower__beam-core {
    fill: url(#ct-beam);
    opacity: calc(var(--ct-neon-a) * 0.9);
}

.city__halo {
    filter: drop-shadow(0 0 7px rgba(var(--ct-neon-cyan), 0.3));
}

.halo__ring {
    fill: none;
    stroke: rgba(var(--ct-neon-cyan), 0.7);
    stroke-width: 1.2;
    stroke-dasharray: 22 12;
    opacity: var(--ct-neon-a);
    animation: ct-halo 24s linear infinite;
}

.halo__ring--inner {
    stroke: rgba(var(--ct-neon-violet), 0.55);
    stroke-width: 1;
    stroke-dasharray: 3 12;
    animation-duration: 15s;
    animation-direction: reverse;
}

.city__scan-wire {
    opacity: 0;
    transition: opacity 220ms var(--ease);
}

.city.is-scanning .city__scan-wire {
    opacity: 1;
}

.scan-wire__outline {
    fill: none;
    stroke: rgba(var(--ct-neon-cyan), 0.95);
    stroke-width: 1.4;
    vector-effect: non-scaling-stroke;
    filter: drop-shadow(0 0 4px rgba(var(--ct-neon-cyan), 0.45));
}

.scan-wire__floor {
    stroke: rgba(var(--ct-neon-cyan), 0.5);
    stroke-width: 0.9;
    stroke-dasharray: 5 5;
    vector-effect: non-scaling-stroke;
}

.city__ground {
    fill: url(#ct-ground);
}

.city__grid {
    animation: ct-grid 16s ease-in-out infinite;
}

.city__grid line {
    stroke: rgba(var(--ct-grid), var(--ct-grid-a));
    stroke-width: 1;
    stroke-opacity: var(--ct-grid-o, 1);
    vector-effect: non-scaling-stroke;
}

.grid__ray {
    stroke-dasharray: 3 7;
}

.city__beam-pool {
    fill: rgba(var(--ct-neon-cyan), 0.6);
    opacity: calc(var(--ct-neon-a) * 0.5);
    animation: ct-pool 11s ease-in-out infinite;
}

.city__traffic {
    opacity: var(--ct-traffic-a);
}

.traffic__streak {
    opacity: var(--ct-traffic-o, 0.6);
    animation-duration: var(--ct-traffic-dur, 24s);
    animation-delay: var(--ct-traffic-delay, 0s);
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    will-change: transform;
}

.traffic__streak--warm {
    fill: url(#ct-traffic-warm);
}

.traffic__streak--cool {
    fill: url(#ct-traffic-cool);
}

.traffic__streak--magenta {
    fill: url(#ct-traffic-magenta);
}

.traffic__streak--right {
    animation-name: ct-traffic-right;
}

.traffic__streak--left {
    animation-name: ct-traffic-left;
}

.city__reflection {
    fill: none;
    stroke: url(#ct-reflect);
    stroke-width: 3;
    stroke-linecap: round;
    opacity: var(--ct-reflect-a);
    filter: blur(4px);
    animation: ct-shimmer 9s ease-in-out infinite;
}

.city__horizon {
    fill: none;
    stroke: var(--ct-horizon);
    stroke-width: 1;
    vector-effect: non-scaling-stroke;
}

.city__horizon-glow {
    mix-blend-mode: screen;
}

.city__horizon-neon-halo {
    fill: none;
    stroke: rgba(var(--ct-neon-cyan), 0.35);
    stroke-width: 7;
    filter: blur(6px);
}

.city__horizon-neon {
    fill: none;
    stroke: url(#ct-horizon-neon);
    stroke-width: 1.3;
    vector-effect: non-scaling-stroke;
    opacity: calc(var(--ct-neon-a) * 0.6);
}

@keyframes ct-dome {
    0%, 100% { opacity: 0.72; }
    50% { opacity: 1; }
}

@keyframes ct-twinkle {
    0%, 100% { opacity: calc(var(--ct-star-peak) * 0.24); }
    50% { opacity: var(--ct-star-peak); }
}

@keyframes ct-cloud-a {
    from { transform: translate3d(-26px, 0, 0); }
    to { transform: translate3d(48px, 7px, 0); }
}

@keyframes ct-cloud-b {
    from { transform: translate3d(24px, 0, 0); }
    to { transform: translate3d(-36px, -9px, 0); }
}

@keyframes ct-haze {
    from { transform: translate3d(-16px, 2px, 0); }
    to { transform: translate3d(20px, -4px, 0); }
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

@keyframes ct-beam {
    0%, 100% { opacity: calc(var(--ct-neon-a) * 0.4); }
    50% { opacity: calc(var(--ct-neon-a) * 0.78); }
}

@keyframes ct-halo {
    to { stroke-dashoffset: -340; }
}

@keyframes ct-grid {
    0%, 100% { opacity: 0.55; }
    50% { opacity: 1; }
}

@keyframes ct-pool {
    0%, 100% { opacity: calc(var(--ct-neon-a) * 0.28); }
    50% { opacity: calc(var(--ct-neon-a) * 0.58); }
}

@keyframes ct-traffic-right {
    from { transform: translateX(-340px); }
    to { transform: translateX(1940px); }
}

@keyframes ct-traffic-left {
    from { transform: translateX(1660px); }
    to { transform: translateX(-360px); }
}

@keyframes ct-shimmer {
    0%, 100% { opacity: calc(var(--ct-reflect-a) * 0.6); }
    50% { opacity: var(--ct-reflect-a); }
}

@keyframes ct-scan {
    0% { transform: translateY(-58%); opacity: 0; }
    12% { opacity: 1; }
    88% { opacity: 1; }
    100% { transform: translateY(58%); opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
    .city__star,
    .city__cloud,
    .city__haze,
    .city__dome,
    .city__reflection,
    .city__grid,
    .halo__ring,
    .tower__beam-halo,
    .city__beam-pool,
    .city__scan::after {
        animation: none;
    }

    .city__star {
        opacity: var(--ct-star-peak);
    }

    .city__scan::after,
    .city__scanner,
    .city__scan-wire,
    .city__traffic {
        display: none;
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
