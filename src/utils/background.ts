import {ref} from 'vue'

export type BackgroundId = 'landscape' | 'galaxy'

const BACKGROUND_KEY = 'blog-background'
const SEED_KEY = 'blog-background-seed'
const DEFAULT_SEED = 20261018
const BACKGROUND_IDS: BackgroundId[] = ['landscape', 'galaxy']
const DEFAULT_BACKGROUND: BackgroundId = 'landscape'

function readBackground(): BackgroundId {
    try {
        const value = localStorage.getItem(BACKGROUND_KEY) as BackgroundId | null
        return value && BACKGROUND_IDS.includes(value) ? value : DEFAULT_BACKGROUND
    } catch {
        return DEFAULT_BACKGROUND
    }
}

function readSeed(): number {
    try {
        const value = Number(localStorage.getItem(SEED_KEY))
        return Number.isFinite(value) && value > 0 ? Math.floor(value) : DEFAULT_SEED
    } catch {
        return DEFAULT_SEED
    }
}

/**
 * 全站背景：
 *  - landscape：山水（默认），亮色是天亮、暗色是天黑，两副天色都在令牌里，不用额外记东西；
 *  - galaxy：银河，明暗两种主题下都接管全站（亮色取纸底墨星、暗色取深空），
 *    种子会一起记住，保证全站看到的是同一片星空。
 */
export const globalBackground = ref<BackgroundId>(readBackground())
export const globalBackgroundSeed = ref<number>(readSeed())

export function setGlobalBackground(id: BackgroundId, seed?: number) {
    globalBackground.value = id
    if (typeof seed === 'number' && Number.isFinite(seed)) {
        globalBackgroundSeed.value = Math.floor(seed)
    }
    try {
        localStorage.setItem(BACKGROUND_KEY, id)
        if (typeof seed === 'number' && Number.isFinite(seed)) {
            localStorage.setItem(SEED_KEY, String(Math.floor(seed)))
        }
    } catch {
        // 隐私模式下 localStorage 可能不可写，不影响本次会话
    }
}
