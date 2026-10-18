import {fileURLToPath, URL} from 'node:url'

import {defineConfig, type Plugin} from 'vite'
import vue from '@vitejs/plugin-vue'

import WindiCSS from 'vite-plugin-windicss'

import path from 'path'

let baseUrl = 'http://127.0.0.1:81/'

/**
 * 监听器错误兜底插件（仅开发期生效）。
 *
 * 背景：Windows 下若被监听的文件正被其他进程独占（典型如 Chrome/Edge
 * 用户目录里的 `Cookies-journal`、`LOCK`、`*.tmp`），chokidar 会触发
 * `error` 事件；Node 对没有监听器的 `error` 事件会直接终止进程，表现为
 * dev server 启动即崩溃（EBUSY / EPERM）。
 *
 * 这里给 watcher 挂一个 error 监听器，把「进程崩溃」降级为「控制台警告」，
 * 保证开发服务器在个别文件被锁定时仍可继续工作。
 */
function watcherErrorGuard(): Plugin {
    return {
        name: 'watcher-error-guard',
        apply: 'serve',
        configureServer(server) {
            server.watcher.on('error', (err: any) => {
                console.warn('[vite] 文件监听异常，已忽略（不影响 HMR）:', err?.message ?? err)
            })
        },
    }
}

// https://vitejs.dev/config/
export default defineConfig({
    base: './',
    plugins: [
        vue(),
        WindiCSS(),
        watcherErrorGuard(),
    ],
    resolve: {
        alias: {
            '~': path.resolve(__dirname, 'src'),
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }, server: {
        // disableHostCheck: true,
        host: '0.0.0.0', // 这个用于启动
        port: 80, // 指定启动端口
        open: false, //启动后是否自动打开浏览器
        /**
         * 关键修复：缩小 chokidar 的监听范围。
         *
         * `.shots / .shots2` 是截图工具落盘的浏览器用户目录（内含 p1~p5 等
         * Chrome profile），其中 `Cookies-journal` 等文件长期被浏览器进程
         * 占用，Windows 上会返回 EBUSY，导致 dev server 直接崩溃；这些目录
         * 也无需参与 HMR。构建产物 `dist` 同理。
         *
         * 注意：Vite 5 默认只忽略 node_modules 与 .git，不会读取 .gitignore。
         */
        watch: {
            ignored: [
                '**/.shots/**',
                '**/.shots2/**',
                '**/dist/**',
                '**/.codegraph/**',
                '**/.idea/**',
                '**/node_modules/**',
                '**/.git/**',
                // 浏览器/系统进程的临时锁文件，Windows 上极易 EBUSY
                '**/*.{log,tmp,journal,lock}',
            ],
        },
        proxy: {
            '/api/': {
                target: baseUrl,
                changeOrigin: false,
                // rewrite: (path) => path.replace(/^\/api/, '/api')
            }, '/user': {
                target: baseUrl,
                changeOrigin: false,
            }, '/adm': {
                target: baseUrl,
                changeOrigin: false,
            }, '/auth/': {
                target: baseUrl,
                changeOrigin: false,
            }, '/notice': {
                target: baseUrl,
                changeOrigin: false,
            }, '/comments': {
                target: baseUrl,
                changeOrigin: false,
            }, '/2022/': {
                target: baseUrl,
                changeOrigin: false
            }, '/2023/': {
                target: baseUrl,
                changeOrigin: false
            }, '/2024/': {
                target: baseUrl,
                changeOrigin: false
            }, '/2025/': {
                target: baseUrl,
                changeOrigin: false
            }, '/avatar/': {
                target: baseUrl,
                changeOrigin: false
            }, '/tool': {
                target: baseUrl,
                changeOrigin: false
            }, '/get-host': {
                target: baseUrl,
                changeOrigin: false
            }, '/stamp2time': {
                target: baseUrl,
                changeOrigin: false
            }, '/sources/*': {
                target: baseUrl,
                changeOrigin: false
            }, '/f/': {
                target: baseUrl,
                changeOrigin: false
            }
        },
    }
})
