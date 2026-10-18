import {ref} from 'vue'

export type ThemeId = 'light' | 'dark'

const THEME_KEY = 'blog-theme'

function readTheme(): ThemeId {
    try {
        return localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light'
    } catch {
        return 'light'
    }
}

/** 全站主题：localStorage 记忆 + html[data-theme] 驱动全部令牌 */
export const theme = ref<ThemeId>(readTheme())

export function applyTheme(value: ThemeId = theme.value) {
    document.documentElement.setAttribute('data-theme', value)
}

export function setTheme(value: ThemeId) {
    theme.value = value
    try {
        localStorage.setItem(THEME_KEY, value)
    } catch {
        // 隐私模式下 localStorage 可能不可写，忽略即可
    }
    applyTheme(value)
}

export function toggleTheme() {
    setTheme(theme.value === 'dark' ? 'light' : 'dark')
}
