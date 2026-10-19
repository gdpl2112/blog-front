<template>
  <div ref="rootRef" class="gravity" aria-hidden="true">
    <div class="gravity__base"></div>
    <div class="gravity__grid"></div>
    <div class="gravity__field">
      <canvas ref="canvasRef" class="gravity__canvas"></canvas>
    </div>
    <div ref="flashRef" class="gravity__flash"></div>
    <div class="gravity__vignette"></div>
  </div>
</template>

<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref} from 'vue'

/**
 * 引力场：GPGPU 流场粒子背景（原生 WebGL2，零依赖）。
 *
 * 核心结构：
 *  1. 粒子状态存在浮点纹理里（xy = 位置 px，zw = 速度 px/s），两张纹理 + 两个 FBO
 *     乒乓迭代；CPU 每帧只提交一次 draw，不做逐粒子计算。
 *  2. 流场用二维 curl noise —— 标量势的旋度，散度恒为零，粒子沿流线换位而不堆积，
 *     这是"流体的高级感"的来源；纯随机运动会显得廉价。
 *  3. 指针引力、点击涟漪、滚动能量、闲置呼吸都只是往速度场里追加冲量或改系数，
 *     不改变主循环结构。
 *  4. 颜色全部走 --gv-* 令牌；主题切换时在 800ms 内逐帧插值调色板，并在中点切换
 *     混合模式（暗色加法发光 ↔ 亮色普通透明），同时触发一次全屏涟漪，像空间被重铸。
 *
 * 边界：
 *  · 减少动态（prefers-reduced-motion）：关闭扰动与涟漪，只留极缓漂移，首屏不炸开；
 *  · 页面不可见时停帧；窗口失焦/指针离开时引力归零；
 *  · 悬停正文（READ_SELECTOR）时整层降到 30% 透明度，绝不干扰阅读；
 *  · canvas 与根节点都是 pointer-events: none，不阻塞任何正文交互。
 */

const emit = defineEmits(['stats'])

/**
 * protect：悬停正文时是否把粒子层压到 30%。
 * 背景室自己是「看背景」的场合，展签就在背景上，所以那边关掉这项保护。
 */
const props = withDefaults(defineProps<{protect?: boolean}>(), {protect: true})

const rootRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const flashRef = ref<HTMLElement | null>(null)

/* ============================================================
   常量
   ============================================================ */

const THEME_FADE = 800          // 主题插值时长（ms），与要求一致
const INTRO_MS = 1500           // 首屏炸开时长
const IDLE_MS = 60000           // 无操作多久进入呼吸态
const RIPPLE_LIFE = 1.2         // 涟漪存活（s）
const RIPPLE_SLOTS = 4          // 同时存在的涟漪上限（与 shader 里的数组长度一致）
const POINTER_RADIUS = 200      // 引力半径（px）
const READ_SELECTOR = [
    'article', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'blockquote', 'pre', 'table',
    '.article-body', '.comment-body', '.fx-deck', '.prose', '.md-body',
].join(', ')

type RGB = [number, number, number]

interface Palette {
    a: RGB
    b: RGB
    tint: RGB
}

interface Ripple {
    x: number
    y: number
    born: number
    strength: number
}

/* ============================================================
   GLSL
   ============================================================ */

/** 全屏三角形带：用 gl_VertexID 生成，不占用任何 VBO */
const FULLSCREEN_VS = `#version 300 es
precision highp float;
precision highp int;
void main() {
  vec2 corner = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(corner * 2.0 - 1.0, 0.0, 1.0);
}`

/** 初始化：按像素索引撒点，位置铺满视口，速度归零 */
const INIT_FS = `#version 300 es
precision highp float;
precision highp int;

uniform vec2 uResolution;
uniform vec2 uMapSize;
uniform float uSeed;

out vec4 outState;

float hash11(float n) {
  return fract(sin(n * 12.9898 + uSeed) * 43758.5453);
}

void main() {
  float id = gl_FragCoord.x + gl_FragCoord.y * uMapSize.x;
  vec2 rnd = vec2(hash11(id * 1.13), hash11(id * 2.71 + 19.0));
  vec2 pos = (rnd - 0.5) * uResolution;
  outState = vec4(pos, 0.0, 0.0);
}`

/** 模拟：curl noise 流场 + 指针斥力 + 涟漪冲量，半隐式积分后写回位置纹理 */
const SIM_FS = `#version 300 es
precision highp float;
precision highp int;

uniform sampler2D uState;
uniform vec2 uMapSize;
uniform vec2 uResolution;
uniform float uTime;
uniform float uDt;
uniform vec2 uPointer;
uniform float uPointerForce;
uniform float uPointerRadius;
uniform vec4 uRipples[4];
uniform float uEnergy;
uniform float uIdle;
uniform float uMotion;

out vec4 outState;

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash12(i), hash12(i + vec2(1.0, 0.0)), u.x),
    mix(hash12(i + vec2(0.0, 1.0)), hash12(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

/* 标量势：两个八度的值噪声，随时间缓慢漂移 */
float potential(vec2 p, float t) {
  return noise(p * 0.0016 + vec2(t * 0.032, -t * 0.024))
       + 0.45 * noise(p * 0.0041 - vec2(t * 0.050, t * 0.037));
}

/* 二维 curl：势的旋度散度为零，粒子只会沿流线换位，永不堆积 */
vec2 curl(vec2 p, float t) {
  const float e = 24.0;
  float dx = potential(p + vec2(e, 0.0), t) - potential(p - vec2(e, 0.0), t);
  float dy = potential(p + vec2(0.0, e), t) - potential(p - vec2(0.0, e), t);
  vec2 grad = vec2(dx, dy) / (2.0 * e);
  return vec2(grad.y, -grad.x);
}

void main() {
  ivec2 coord = ivec2(gl_FragCoord.xy);
  int cols = int(uMapSize.x);
  if (coord.x >= cols || coord.y >= int(uMapSize.y)) {
    outState = vec4(0.0);
    return;
  }

  float id = float(coord.y * cols + coord.x);
  vec4 state = texelFetch(uState, coord, 0);
  vec2 pos = state.xy;
  vec2 vel = state.zw;
  float rnd = hash12(vec2(id, 11.7));

  /* 流速：滚动越深越快，闲置呼吸时减半 */
  float energy = mix(0.35, 1.0, uEnergy) * mix(1.0, 0.5, uIdle);
  vec2 flow = curl(pos, uTime) * 12000.0 * energy * (0.55 + rnd * 0.95) * uMotion;

  /* 速度向流场收敛，保证不会无限加速 */
  vel = mix(vel, flow, clamp(uDt * 2.4, 0.0, 1.0));

  /* 指针斥力：200px 内推开，带一点切向，越近越强 */
  vec2 toPointer = pos - uPointer;
  float distToPointer = max(length(toPointer), 0.001);
  float falloff = 1.0 - smoothstep(0.0, uPointerRadius, distToPointer);
  vec2 dir = toPointer / distToPointer;
  vec2 tangent = vec2(-dir.y, dir.x);
  vel += (dir + tangent * 0.42) * (falloff * falloff) * uPointerForce * 1000.0 * uDt;

  /* 点击涟漪：波前推动粒子，1.2s 内衰减 */
  for (int i = 0; i < 4; i++) {
    vec4 ripple = uRipples[i];
    if (ripple.w <= 0.0) continue;
    float age = clamp(ripple.z, 0.0, 1.2);
    vec2 delta = pos - ripple.xy;
    float dist = max(length(delta), 0.001);
    float band = exp(-pow((dist - age * 880.0) / 54.0, 2.0));
    float decay = 1.0 - age / 1.2;
    vel += (delta / dist) * band * decay * ripple.w * 900.0 * uDt;
  }

  vel *= exp(-1.7 * uDt);
  float speed = length(vel);
  if (speed > 420.0) vel *= 420.0 / speed;

  pos += vel * uDt;

  /* 环形包裹：粒子永远留在视口内，密度始终均匀 */
  vec2 halfSize = uResolution * 0.5;
  pos = mod(pos + halfSize, uResolution) - halfSize;

  outState = vec4(pos, vel);
}`

/** 绘制：一个顶点一颗粒子，位置从状态纹理 texelFetch 取 */
const DRAW_VS = `#version 300 es
precision highp float;
precision highp int;

uniform sampler2D uState;
uniform vec2 uMapSize;
uniform vec2 uResolution;
uniform float uPixelRatio;
uniform float uIntro;
uniform float uDensity;
uniform float uTheme;
uniform vec4 uRipples[4];

out float vRnd;
out float vSpeed;
out float vWave;

float hash11(float n) {
  return fract(sin(n * 12.9898 + 4.1414) * 43758.5453);
}

void main() {
  int cols = int(uMapSize.x);
  int id = gl_VertexID;
  ivec2 coord = ivec2(id % cols, id / cols);
  vec4 state = texelFetch(uState, coord, 0);
  vec2 pos = state.xy;
  vec2 vel = state.zw;
  float rnd = hash11(float(id) + 1.7);

  vRnd = rnd;
  vSpeed = clamp(length(vel) / 30.0, 0.0, 1.0);
  vWave = 0.0;

  /* 呼吸态只保留 40% 的粒子；亮色比暗色再稀 30%，像晨雾里的浮尘。
     丢到裁剪空间外，不产生任何光栅化开销 */
  float density = uDensity * mix(0.7, 1.0, uTheme);
  if (rnd > density) {
    gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
    gl_PointSize = 1.0;
    return;
  }

  /* 首屏：所有粒子从中心炸开，迅速散开、末段缓缓落位 */
  float ease = 1.0 - pow(1.0 - uIntro, 3.0);
  vec2 dir = pos / max(length(pos), 0.001);
  vec2 origin = dir * (4.0 + rnd * 16.0);
  vec2 screenPos = mix(origin, pos, ease);

  /* 波前附近的粒子额外发亮，涟漪才看得见 */
  float wave = 0.0;
  for (int i = 0; i < 4; i++) {
    vec4 ripple = uRipples[i];
    if (ripple.w <= 0.0) continue;
    float age = clamp(ripple.z, 0.0, 1.2);
    float dist = length(screenPos - ripple.xy);
    wave += exp(-pow((dist - age * 880.0) / 74.0, 2.0)) * (1.0 - age / 1.2) * ripple.w;
  }
  vWave = clamp(wave, 0.0, 1.0);

  gl_Position = vec4(screenPos / (uResolution * 0.5), 0.0, 1.0);
  /* 亮色多给一点点尺寸，低透明度的小点在纸底上才不至于被抗锯齿吃掉；
     基础尺寸约 1.6~4.0 CSS px，再乘 DPR 与速度/波前增益 */
  gl_PointSize = max(1.0, (1.62 + rnd * 2.4) * uPixelRatio * mix(1.24, 1.0, uTheme) * (0.9 + vSpeed * 0.6) * (1.0 + vWave * 0.9));
}`

/** 片元：软圆点。暗色加法发光、亮色低透明度浮尘，同一个 shader 两副气质 */
const DRAW_FS = `#version 300 es
precision highp float;
precision highp int;

uniform vec3 uColA;
uniform vec3 uColB;
uniform vec3 uTint;
uniform float uTheme;
uniform float uEnergy;
uniform float uIdle;
uniform float uIntro;
uniform float uTime;

in float vRnd;
in float vSpeed;
in float vWave;
out vec4 fragColor;

void main() {
  float dist = length(gl_PointCoord - 0.5);
  if (dist > 0.5) discard;

  /* 边缘顺序按规范写，别用反向 smoothstep（edge0 > edge1 在规范里是未定义） */
  float core = 1.0 - smoothstep(0.06, 0.5, dist);
  float halo = 1.0 - smoothstep(0.0, 0.5, dist);
  float soft = core * 0.74 + halo * 0.26;
  /* 亮色是普通混合，柔外晕在纸底上会被稀释掉；把外缘压实一些，浮尘才立得住 */
  soft = mix(pow(soft, 0.68), soft, uTheme);

  vec3 color = mix(uColA, uColB, vRnd);
  color = mix(color, uTint, vWave * 0.6);
  /* 整体加一点色重；上限压到 1，亮色是预乘混合，rgb 不能超过 alpha */
  color = min(color * 1.08, vec3(1.0));

  /* 闲置呼吸：不是把粒子调淡，而是把颜色压实 —— 同色相压深、透明度略升，
     远处看是一层更沉、更慢的尘，而不是整体灰掉 */
  color = mix(color, min(color * color * 1.3, vec3(1.0)), uIdle * 0.6);

  /* 亮色 0.22~0.46 像浮尘；暗色靠加法叠加做轻微 bloom，慢的压暗、快的提亮 */
  float amp = mix(mix(0.22, 0.46, vSpeed), mix(0.30, 1.0, vSpeed), uTheme);
  amp *= mix(0.82, 1.0, uEnergy);
  amp *= mix(1.0, 1.08, uIdle);
  /* 首屏那 1.5s 额外提亮，落定后回到常态 */
  amp *= mix(1.15, 1.0, uIntro);
  amp *= 0.9 + 0.1 * sin(uTime * 1.4 + vRnd * 40.0);
  amp = clamp(amp, 0.0, 1.0);

  /* 预乘 alpha：暗色用 (ONE, ONE) 加法，亮色用 (ONE, ONE_MINUS_SRC_ALPHA) 普通混合 */
  fragColor = vec4(color * soft * amp, soft * amp);
}`

/* ============================================================
   GL 资源
   ============================================================ */

let gl: WebGL2RenderingContext | null = null
let simProg: WebGLProgram | null = null
let drawProg: WebGLProgram | null = null
let initProg: WebGLProgram | null = null
let simU: Record<string, WebGLUniformLocation | null> = {}
let drawU: Record<string, WebGLUniformLocation | null> = {}
let initU: Record<string, WebGLUniformLocation | null> = {}
let stateTex: WebGLTexture[] = []
let targets: WebGLFramebuffer[] = []
let vao: WebGLVertexArrayObject | null = null
let stateFormat: {internal: number; type: number} | null = null
let read = 0

/* ============================================================
   运行状态
   ============================================================ */

let vw = 0
let vh = 0
let pixelRatio = 1
let particleCount = 0
let mapW = 1
let mapH = 1

let rafId = 0
let running = false
let configured = false
let disposed = false
let reduced = false
let coarse = false
let lastFrameAt = 0
let clock = 0

let intro = 0
let idleBoost = 0
let idleTarget = 0
let lastInputAt = 0

let energyTarget = 0
let energySmooth = 0

let pointerX = 0
let pointerY = 0
let pointerImpulse = 0
let pointerForce = 0
let lastPointerX = 0
let lastPointerY = 0
let lastMoveAt = 0

let readGuardOn = false

let themeMix = 1
let themeFrom = 0
let themeTo = 0
let currentTheme = 0
let palFrom: Palette = {a: [129, 140, 248], b: [56, 189, 248], tint: [192, 57, 43]}
let palTo: Palette = palFrom
let currentPal: Palette = palFrom

let rippleList: Ripple[] = []
const rippleData = new Float32Array(RIPPLE_SLOTS * 4)

let resizeTimer = 0
let flashTimer = 0
let bootedAt = 0
let mediaReduced: MediaQueryList | null = null

/* ============================================================
   令牌读取
   ============================================================ */

function parseRGB(raw: string, fallback: RGB): RGB {
    const parts = raw.split(',').map((value) => parseFloat(value))
    if (parts.length < 3 || parts.some((value) => Number.isNaN(value))) return fallback
    return [parts[0], parts[1], parts[2]]
}

/** 读自己根元素上的令牌：全站那一份靠 .gravity--site 覆盖，documentElement 上读不到 */
function readPalette(): Palette {
    const el = rootRef.value ?? document.documentElement
    const cs = getComputedStyle(el)
    return {
        a: parseRGB(cs.getPropertyValue('--gv-a'), [129, 140, 248]),
        b: parseRGB(cs.getPropertyValue('--gv-b'), [56, 189, 248]),
        tint: parseRGB(cs.getPropertyValue('--gv-ripple'), [192, 57, 43]),
    }
}

function samePalette(x: Palette, y: Palette) {
    return x.a.join() === y.a.join() && x.b.join() === y.b.join() && x.tint.join() === y.tint.join()
}

/** 令牌给出 0~255 的三元组，WebGL 的颜色 uniform 只认 0~1 */
function unit(color: RGB): RGB {
    return [color[0] / 255, color[1] / 255, color[2] / 255]
}

function lerpPalette(from: Palette, to: Palette, k: number): Palette {
    const mix = (x: RGB, y: RGB): RGB => [
        x[0] + (y[0] - x[0]) * k,
        x[1] + (y[1] - x[1]) * k,
        x[2] + (y[2] - x[2]) * k,
    ]
    return {a: mix(from.a, to.a), b: mix(from.b, to.b), tint: mix(from.tint, to.tint)}
}

/* ============================================================
   尺寸与规模
   ============================================================ */

/** 像素预算：高分屏把 DPR 收一点，避免点数 × 像素过大拖垮帧率 */
function computeRatio(w: number, h: number) {
    const raw = window.devicePixelRatio || 1
    const budget = Math.sqrt(5_200_000 / Math.max(1, w * h))
    return Math.max(1, Math.min(raw, 2, budget))
}

/** 粒子规模：桌面 8k~15k（DPR 越高越少），移动端 2k */
function computeCount() {
    if (coarse || vw < 760 || vh < 520) return 2000
    const base = 15000 * ((vw * vh) / (1920 * 1080))
    const dprScale = pixelRatio >= 1.8 ? 0.8 : pixelRatio >= 1.4 ? 0.92 : 1
    return Math.round(Math.min(15000, Math.max(8000, base)) * dprScale)
}

function measure() {
    const root = rootRef.value
    vw = Math.max(1, Math.round(root?.clientWidth || window.innerWidth))
    vh = Math.max(1, Math.round(root?.clientHeight || window.innerHeight))
    pixelRatio = computeRatio(vw, vh)
    const canvas = canvasRef.value
    if (canvas) {
        canvas.width = Math.round(vw * pixelRatio)
        canvas.height = Math.round(vh * pixelRatio)
    }
}

/* ============================================================
   编译与分配
   ============================================================ */

function compileShader(type: number, source: string): WebGLShader | null {
    if (!gl) return null
    const shader = gl.createShader(type)
    if (!shader) return null
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.warn('[gravity] shader 编译失败:', gl.getShaderInfoLog(shader))
        gl.deleteShader(shader)
        return null
    }
    return shader
}

function linkProgram(vsSource: string, fsSource: string): WebGLProgram | null {
    if (!gl) return null
    const vs = compileShader(gl.VERTEX_SHADER, vsSource)
    const fs = compileShader(gl.FRAGMENT_SHADER, fsSource)
    if (!vs || !fs) return null
    const program = gl.createProgram()
    if (!program) return null
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    gl.deleteShader(vs)
    gl.deleteShader(fs)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.warn('[gravity] program 链接失败:', gl.getProgramInfoLog(program))
        gl.deleteProgram(program)
        return null
    }
    return program
}

/** 收集 uniform 位置；数组 uniform 同时登记 uRipples[0] 与 uRipples 两个键 */
function uniformMap(program: WebGLProgram) {
    const map: Record<string, WebGLUniformLocation | null> = {}
    if (!gl) return map
    const total = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS) as number
    for (let index = 0; index < total; index += 1) {
        const info = gl.getActiveUniform(program, index)
        if (!info) continue
        const location = gl.getUniformLocation(program, info.name)
        map[info.name] = location
        const bare = info.name.replace(/\[0\]$/, '')
        if (bare !== info.name) map[bare] = location
    }
    return map
}

function createTarget(texture: WebGLTexture): WebGLFramebuffer | null {
    if (!gl) return null
    const framebuffer = gl.createFramebuffer()
    if (!framebuffer) return null
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0)
    const complete = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    if (!complete) {
        gl.deleteFramebuffer(framebuffer)
        return null
    }
    return framebuffer
}

/** 按当前规模分配两张状态纹理，并把初始位置写进去 */
function allocate(): boolean {
    if (!gl || !stateFormat || !initProg) return false

    stateTex.forEach((tex) => gl?.deleteTexture(tex))
    targets.forEach((fbo) => gl?.deleteFramebuffer(fbo))
    stateTex = []
    targets = []

    particleCount = computeCount()
    mapW = Math.max(1, Math.ceil(Math.sqrt(particleCount)))
    mapH = Math.max(1, Math.ceil(particleCount / mapW))

    for (let index = 0; index < 2; index += 1) {
        const texture = gl.createTexture()
        if (!texture) return false
        gl.bindTexture(gl.TEXTURE_2D, texture)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        gl.texImage2D(gl.TEXTURE_2D, 0, stateFormat.internal, mapW, mapH, 0, gl.RGBA, stateFormat.type, null)
        const target = createTarget(texture)
        if (!target) return false
        stateTex.push(texture)
        targets.push(target)
    }

    seedState()
    emit('stats', {particles: particleCount})
    return true
}

/** 用初始着色器把两张纹理都填成随机铺满视口的位置 */
function seedState() {
    if (!gl || !initProg) return
    gl.useProgram(initProg)
    gl.uniform2f(initU.uResolution, vw, vh)
    gl.uniform2f(initU.uMapSize, mapW, mapH)
    gl.uniform1f(initU.uSeed, Math.random() * 997)
    gl.bindVertexArray(vao)
    for (const target of targets) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, target)
        gl.viewport(0, 0, mapW, mapH)
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    read = 0
}

function boot(): boolean {
    const canvas = canvasRef.value
    if (!canvas) return false

    const context = canvas.getContext('webgl2', {
        alpha: true,
        premultipliedAlpha: true,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: 'high-performance',
    })
    if (!context) {
        markFallback()
        return false
    }
    gl = context

    // 位置纹理必须是可渲染的浮点格式，32F 优先、16F 兜底
    if (gl.getExtension('EXT_color_buffer_float')) {
        stateFormat = {internal: gl.RGBA32F, type: gl.FLOAT}
    } else if (gl.getExtension('EXT_color_buffer_half_float')) {
        stateFormat = {internal: gl.RGBA16F, type: gl.HALF_FLOAT}
    } else {
        markFallback()
        return false
    }

    simProg = linkProgram(FULLSCREEN_VS, SIM_FS)
    initProg = linkProgram(FULLSCREEN_VS, INIT_FS)
    drawProg = linkProgram(DRAW_VS, DRAW_FS)
    if (!simProg || !initProg || !drawProg) {
        markFallback()
        return false
    }

    simU = uniformMap(simProg)
    initU = uniformMap(initProg)
    drawU = uniformMap(drawProg)

    vao = gl.createVertexArray()
    if (!allocate()) {
        markFallback()
        return false
    }

    gl.disable(gl.DEPTH_TEST)
    gl.disable(gl.CULL_FACE)
    gl.clearColor(0, 0, 0, 0)
    configured = true
    return true
}

/** WebGL2 不可用或纹理分配失败：只留底衬与网格，不阻塞页面 */
function markFallback() {
    rootRef.value?.classList.add('is-css')
    configured = false
}

/* ============================================================
   每帧
   ============================================================ */

function updateRipples(now: number) {
    rippleData.fill(0)
    if (rippleList.length === 0) return
    rippleList = rippleList.filter((item) => now - item.born < RIPPLE_LIFE * 1000)
    rippleList.forEach((item, index) => {
        const offset = index * 4
        rippleData[offset] = item.x
        rippleData[offset + 1] = item.y
        rippleData[offset + 2] = (now - item.born) / 1000
        rippleData[offset + 3] = item.strength
    })
}

function pushRipple(x: number, y: number, strength: number) {
    rippleList.push({x, y, born: performance.now(), strength})
    if (rippleList.length > RIPPLE_SLOTS) {
        rippleList.splice(0, rippleList.length - RIPPLE_SLOTS)
    }
}

function updateTheme(dt: number) {
    if (themeMix >= 1) return
    themeMix = Math.min(1, themeMix + (dt * 1000) / THEME_FADE)
    const k = themeMix * themeMix * (3 - 2 * themeMix)
    currentTheme = themeFrom + (themeTo - themeFrom) * k
    currentPal = lerpPalette(palFrom, palTo, k)
}

function simulate(dt: number) {
    if (!gl || !simProg) return
    gl.bindFramebuffer(gl.FRAMEBUFFER, targets[1 - read])
    gl.viewport(0, 0, mapW, mapH)
    gl.useProgram(simProg)
    gl.bindVertexArray(vao)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, stateTex[read])
    gl.uniform1i(simU.uState, 0)
    gl.uniform2f(simU.uMapSize, mapW, mapH)
    gl.uniform2f(simU.uResolution, vw, vh)
    gl.uniform1f(simU.uTime, clock)
    gl.uniform1f(simU.uDt, dt)
    gl.uniform2f(simU.uPointer, pointerX, pointerY)
    gl.uniform1f(simU.uPointerForce, reduced ? 0 : pointerForce)
    gl.uniform1f(simU.uPointerRadius, POINTER_RADIUS)
    gl.uniform4fv(simU.uRipples, rippleData)
    gl.uniform1f(simU.uEnergy, energySmooth)
    gl.uniform1f(simU.uIdle, idleBoost)
    gl.uniform1f(simU.uMotion, reduced ? 0.22 : 1)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    read = 1 - read
}

function draw(timeSec: number) {
    const canvas = canvasRef.value
    if (!gl || !drawProg || !canvas) return
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.enable(gl.BLEND)
    // 混合模式切换点选在「天幕已经接近全黑」的那一端：
    // 此时加法与普通混合的结果几乎一致，切换不会被看见。
    if (currentTheme > 0.9) gl.blendFunc(gl.ONE, gl.ONE)
    else gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)

    gl.useProgram(drawProg)
    gl.bindVertexArray(vao)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, stateTex[read])
    gl.uniform1i(drawU.uState, 0)
    gl.uniform2f(drawU.uMapSize, mapW, mapH)
    gl.uniform2f(drawU.uResolution, vw, vh)
    gl.uniform1f(drawU.uPixelRatio, pixelRatio)
    gl.uniform1f(drawU.uIntro, intro)
    gl.uniform1f(drawU.uDensity, 1 - 0.6 * idleBoost)
    gl.uniform4fv(drawU.uRipples, rippleData)
    // 令牌里是 0~255 的三元组，着色器要 0~1；不归一化会被截断成纯白，
    // 亮色下就变成「白色 + 低透明度」压在纸底上，等于看不见。
    const colA = unit(currentPal.a)
    const colB = unit(currentPal.b)
    const tint = unit(currentPal.tint)
    gl.uniform3f(drawU.uColA, colA[0], colA[1], colA[2])
    gl.uniform3f(drawU.uColB, colB[0], colB[1], colB[2])
    gl.uniform3f(drawU.uTint, tint[0], tint[1], tint[2])
    gl.uniform1f(drawU.uTheme, currentTheme)
    gl.uniform1f(drawU.uEnergy, energySmooth)
    gl.uniform1f(drawU.uIdle, idleBoost)
    gl.uniform1f(drawU.uTime, timeSec)
    gl.drawArrays(gl.POINTS, 0, particleCount)
    gl.disable(gl.BLEND)
    gl.bindVertexArray(null)
}

function frame(now: number) {
    rafId = 0
    if (!running || disposed) return
    const dt = Math.min(0.05, Math.max(0.001, (now - lastFrameAt) / 1000))
    lastFrameAt = now

    clock += dt * (reduced ? 0.3 : 1)

    if (intro < 1) intro = Math.min(1, intro + (dt * 1000) / INTRO_MS)

    // 闲置呼吸：60s 无操作降到 40% 粒子、流速减半；有输入后约 1s 回到常态
    if (!reduced && idleTarget === 0 && now - lastInputAt > IDLE_MS) idleTarget = 1
    idleBoost += (idleTarget - idleBoost) * (1 - Math.exp(-dt / 0.32))

    energySmooth += (energyTarget - energySmooth) * (1 - Math.exp(-dt / 0.3))

    // 静止 1.5s 后斥力缓慢回零，流场自己把痕迹抹平
    const still = now - lastMoveAt
    pointerImpulse *= Math.exp(-(still > 1500 ? 0.9 : 3.4) * dt)
    pointerForce += (pointerImpulse - pointerForce) * (1 - Math.exp(-9 * dt))

    updateRipples(now)
    updateTheme(dt)
    simulate(dt)
    draw(now / 1000)

    rafId = requestAnimationFrame(frame)
}

/* ============================================================
   交互
   ============================================================ */

function noteInput() {
    lastInputAt = performance.now()
    if (idleTarget !== 0) idleTarget = 0
}

/** 悬停正文时把整层压到 30%，背景绝不与文字抢注意力 */
function updateReadGuard(target: EventTarget | null) {
    if (!props.protect) return
    const hit = target instanceof Element ? target.closest(READ_SELECTOR) : null
    const next = Boolean(hit)
    if (next === readGuardOn) return
    readGuardOn = next
    rootRef.value?.classList.toggle('is-reading', next)
}

function refreshEnergy() {
    const doc = document.documentElement
    const max = Math.max(1, doc.scrollHeight - window.innerHeight)
    const y = window.scrollY || doc.scrollTop || 0
    energyTarget = Math.min(1, Math.max(0, y / max))
}

function onPointerMove(event: PointerEvent) {
    if (event.pointerType === 'touch') return
    const now = performance.now()
    const dx = event.clientX - lastPointerX
    const dy = event.clientY - lastPointerY
    lastPointerX = event.clientX
    lastPointerY = event.clientY
    pointerX = event.clientX - vw / 2
    pointerY = -(event.clientY - vh / 2)

    const travel = Math.hypot(dx, dy)
    if (travel > 0.4) {
        // 移动越快扰动越强，上限 1.15 防止瞬移时把粒子甩飞
        pointerImpulse = Math.min(1.15, pointerImpulse + travel / 60)
        lastMoveAt = now
    }
    noteInput()
    updateReadGuard(event.target)
}

function onPointerLeave() {
    pointerImpulse = 0
    updateReadGuard(null)
}

function onPointerDown(event: PointerEvent) {
    noteInput()
    if (reduced) return
    pushRipple(event.clientX - vw / 2, -(event.clientY - vh / 2), 1)
}

function onVisibility() {
    if (document.visibilityState === 'visible') start()
    else stop()
}

function onThemeChange() {
    const next = readPalette()
    const dark = document.documentElement.getAttribute('data-theme') === 'dark' ? 1 : 0
    if (dark === themeTo && samePalette(next, palTo)) return

    // 首帧期间 App 才把 data-theme 写到 html 上（子组件先挂载），
    // 这一次属于「补初始值」，直接对齐，不要放涟漪也不要闪光。
    // 减少动态时同理：不做 800ms 插值，颜色直接落位。
    if (performance.now() - bootedAt < 800 || reduced) {
        palFrom = next
        palTo = next
        currentPal = next
        themeFrom = dark
        themeTo = dark
        currentTheme = dark
        themeMix = 1
        return
    }

    palFrom = currentPal
    palTo = next
    themeFrom = currentTheme
    themeTo = dark
    themeMix = 0

    // 主题切换：一次全屏涟漪 + 一次闪光，像空间被重铸
    if (!reduced) {
        pushRipple(0, 0, 1.35)
        flash(820)
    }
}

function onReducedChange() {
    reduced = !!mediaReduced?.matches
    if (reduced) {
        intro = 1
        pointerImpulse = 0
        rippleList = []
    }
}

function onResize() {
    const root = rootRef.value
    if (!root) return
    const nextW = Math.max(1, Math.round(root.clientWidth))
    const nextH = Math.max(1, Math.round(root.clientHeight))
    const nextRatio = computeRatio(nextW, nextH)
    const scaleChanged = Math.abs(nextRatio - pixelRatio) > 0.01

    vw = nextW
    vh = nextH
    pixelRatio = nextRatio
    const canvas = canvasRef.value
    if (canvas) {
        canvas.width = Math.round(vw * pixelRatio)
        canvas.height = Math.round(vh * pixelRatio)
    }

    window.clearTimeout(resizeTimer)
    resizeTimer = window.setTimeout(() => {
        if (!configured) return
        // 尺寸变化大或换了屏幕：重新撒点，顺手抹掉旧边界上的空缺
        if (scaleChanged || particleCount === 0) {
            allocate()
        } else {
            const wanted = computeCount()
            if (Math.abs(wanted - particleCount) > particleCount * 0.25) allocate()
        }
        refreshEnergy()
    }, 220)
}

// 滚动深度 → 能量等级：页首平静，页脚峰值
function onScroll() {
    refreshEnergy()
    noteInput()
}

function flash(duration: number) {
    const el = flashRef.value
    if (!el) return
    el.classList.remove('is-on')
    // 强制回流，让同一个动画可以再次播放
    void el.offsetWidth
    el.classList.add('is-on')
    window.clearTimeout(flashTimer)
    flashTimer = window.setTimeout(() => el.classList.remove('is-on'), duration)
}

function start() {
    if (rafId || !configured || disposed) return
    running = true
    lastFrameAt = performance.now()
    lastInputAt = performance.now()
    rafId = requestAnimationFrame(frame)
}

function stop() {
    running = false
    if (rafId) cancelAnimationFrame(rafId)
    rafId = 0
}

/* ============================================================
   生命周期
   ============================================================ */

let resizeObserver: ResizeObserver | null = null
let themeObserver: MutationObserver | null = null

function bindEvents() {
    window.addEventListener('pointermove', onPointerMove, {passive: true})
    window.addEventListener('pointerdown', onPointerDown, {passive: true})
    document.documentElement.addEventListener('pointerleave', onPointerLeave)
    window.addEventListener('blur', onPointerLeave)
    window.addEventListener('scroll', onScroll, {passive: true})
    document.addEventListener('visibilitychange', onVisibility)
    mediaReduced?.addEventListener('change', onReducedChange)
}

function unbindEvents() {
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerdown', onPointerDown)
    document.documentElement.removeEventListener('pointerleave', onPointerLeave)
    window.removeEventListener('blur', onPointerLeave)
    window.removeEventListener('scroll', onScroll)
    document.removeEventListener('visibilitychange', onVisibility)
    mediaReduced?.removeEventListener('change', onReducedChange)
}

onMounted(() => {
    disposed = false
    bootedAt = performance.now()
    mediaReduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    reduced = mediaReduced.matches
    coarse = window.matchMedia('(pointer: coarse)').matches

    currentPal = readPalette()
    palFrom = currentPal
    palTo = currentPal
    currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 1 : 0
    themeFrom = currentTheme
    themeTo = currentTheme
    themeMix = 1
    intro = reduced ? 1 : 0

    measure()
    if (!boot()) {
        bindEvents()
        return
    }

    refreshEnergy()
    bindEvents()

    // 画布掉上下文时停帧，恢复后重新装配，避免留下坏画布
    canvasRef.value?.addEventListener('webglcontextlost', (event) => {
        event.preventDefault()
        stop()
        configured = false
    })
    canvasRef.value?.addEventListener('webglcontextrestored', () => {
        stateTex = []
        targets = []
        simProg = null
        drawProg = null
        initProg = null
        vao = null
        if (boot()) start()
    })

    resizeObserver = new ResizeObserver(() => onResize())
    if (rootRef.value) resizeObserver.observe(rootRef.value)

    themeObserver = new MutationObserver(onThemeChange)
    themeObserver.observe(document.documentElement, {attributes: true, attributeFilter: ['data-theme']})

    start()
    if (!reduced) flash(900)
})

onBeforeUnmount(() => {
    disposed = true
    stop()
    unbindEvents()
    resizeObserver?.disconnect()
    themeObserver?.disconnect()
    window.clearTimeout(resizeTimer)
    window.clearTimeout(flashTimer)
    // 主动释放上下文，避免反复进出背景室时堆积 GL 上下文
    gl?.getExtension('WEBGL_lose_context')?.loseContext()
    gl = null
    configured = false
})
</script>

<style scoped>
/* ============================================================
   引力场：固定铺满视口，永远在最底层
   与其它背景组件相同 —— z-index: -1，body 保持透明
   ============================================================ */

.gravity {
  position: fixed;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
  contain: paint;
}

/* 天幕：亮色晨雾纸白 / 暗色近黑冷蓝。颜色只在令牌里改，
   过渡交给 background-color（同色值不同主题时也平滑） */
.gravity__base {
  position: absolute;
  inset: 0;
  background-color: var(--gv-base);
  transition: background-color 800ms var(--ease);
}

/* 1px 网格：只用来给深空一点数字空间感，亮色令牌把它关掉 */
.gravity__grid {
  position: absolute;
  inset: 0;
  opacity: var(--gv-grid-a);
  transition: opacity 800ms var(--ease);
  background-image:
    linear-gradient(to right, rgba(var(--gv-grid), 0.5) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(var(--gv-grid), 0.5) 1px, transparent 1px);
  background-size: 36px 36px;
  background-position: 50% 50%;
  -webkit-mask-image: radial-gradient(120% 92% at 50% 46%, #000 26%, transparent 92%);
  mask-image: radial-gradient(120% 92% at 50% 46%, #000 26%, transparent 92%);
}

/* 粒子层单独一层：阅读保护只压这一层，天幕不动，正文对比度不受影响 */
.gravity__field {
  position: absolute;
  inset: 0;
  opacity: 1;
  transition: opacity 520ms var(--ease);
}

.gravity.is-reading .gravity__field {
  opacity: 0.3;
}

.gravity__canvas {
  display: block;
  width: 100%;
  height: 100%;
}

/* 主题重铸 / 首屏大爆炸时的全屏闪光 */
.gravity__flash {
  position: absolute;
  inset: 0;
  opacity: 0;
  background: radial-gradient(circle at 50% 50%, rgba(var(--gv-flash), 0.55), rgba(var(--gv-flash), 0) 62%);
}

.gravity__flash.is-on {
  animation: gravity-flash 860ms var(--ease);
}

@keyframes gravity-flash {
  0% { opacity: 0; }
  16% { opacity: 1; }
  100% { opacity: 0; }
}

/* 四周压暗：暗色更深，亮色只留一点点，保持「晨雾」的通透 */
.gravity__vignette {
  position: absolute;
  inset: 0;
  opacity: var(--gv-vignette-a);
  transition: opacity 800ms var(--ease);
  background: radial-gradient(118% 96% at 50% 46%, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0.9) 100%);
}

/* 全站那一份再收一点，背景永远不能赢过内容 */
.gravity--site .gravity__field {
  opacity: 0.9;
}

.gravity--site.is-reading .gravity__field {
  opacity: 0.3;
}

/* WebGL2 不可用：只剩天幕与网格，安静地当一张纸 */
.gravity.is-css .gravity__field {
  display: none;
}

@media (prefers-reduced-motion: reduce) {
  .gravity__flash {
    display: none;
  }

  .gravity__field,
  .gravity__base,
  .gravity__grid,
  .gravity__vignette {
    transition-duration: 1ms;
  }
}
</style>
