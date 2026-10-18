import {ref} from 'vue'

export type BackgroundId = 'backdrop' | 'galaxy'

const BACKGROUND_KEY = 'blog-background'
const SEED_KEY = 'blog-background-seed'
const DEFAULT_SEED = 20261018

function readBackground(): BackgroundId {
    try {
        return localStorage.getItem(BACKGROUND_KEY) === 'galaxy' ? 'galaxy' : 'backdrop'
    } catch {
        return 'backdrop'
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
 *  - backdrop：站点原来的琉璃底衬，亮色/暗色都适用；
 *  - galaxy：银河，只在深色主题下接管全站（亮色主题仍是琉璃底衬，保证正文对比度），
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
