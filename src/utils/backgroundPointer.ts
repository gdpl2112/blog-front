import type {Ref} from 'vue'

interface PointerBackdropOptions {
    onMove?: (x: number, y: number, nx: number, ny: number) => void
    onLeave?: () => void
}

/**
 * 背景鼠标跟随：只在精确指针设备上写入根节点 CSS 变量，
 * 背景组件据此做局部光效与轻量景深，触屏设备不绑定。
 */
export function bindPointerBackdrop(
    rootRef: Ref<HTMLElement | null>,
    options: PointerBackdropOptions = {},
) {
    if (typeof window === 'undefined') return () => {
    }

    const media = window.matchMedia('(hover: hover) and (pointer: fine)')
    let enabled = media.matches
    let frame = 0
    let x = 0
    let y = 0

    function paint() {
        frame = 0
        const root = rootRef.value
        if (!root || !enabled) return
        const nx = x / Math.max(1, window.innerWidth) * 2 - 1
        const ny = y / Math.max(1, window.innerHeight) * 2 - 1
        root.style.setProperty('--pointer-x', `${x}px`)
        root.style.setProperty('--pointer-y', `${y}px`)
        root.style.setProperty('--pointer-nx', String(nx))
        root.style.setProperty('--pointer-ny', String(ny))
        root.classList.add('is-pointing')
        options.onMove?.(x, y, nx, ny)
    }

    function onMove(event: PointerEvent) {
        if (!enabled || event.pointerType === 'touch') return
        x = event.clientX
        y = event.clientY
        if (!frame) frame = requestAnimationFrame(paint)
    }

    function onLeave() {
        const root = rootRef.value
        root?.classList.remove('is-pointing')
        root?.style.setProperty('--pointer-nx', '0')
        root?.style.setProperty('--pointer-ny', '0')
        options.onLeave?.()
    }

    function onMediaChange() {
        enabled = media.matches
        if (!enabled) onLeave()
    }

    window.addEventListener('pointermove', onMove, {passive: true})
    document.documentElement.addEventListener('pointerleave', onLeave)
    window.addEventListener('blur', onLeave)
    media.addEventListener('change', onMediaChange)

    return () => {
        if (frame) cancelAnimationFrame(frame)
        window.removeEventListener('pointermove', onMove)
        document.documentElement.removeEventListener('pointerleave', onLeave)
        window.removeEventListener('blur', onLeave)
        media.removeEventListener('change', onMediaChange)
        onLeave()
    }
}
