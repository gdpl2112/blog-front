import {fileURLToPath, URL} from 'node:url'

import {defineConfig, type Plugin} from 'vite'
import vue from '@vitejs/plugin-vue'

import WindiCSS from 'vite-plugin-windicss'

import path from 'path'

let baseUrl = 'http://127.0.0.1:81/'


// https://vitejs.dev/config/
export default defineConfig({
    // 必须用根路径：路由是 createWebHistory() 的 History 模式。
    // 若用 './'，构建产物中的资源会变成相对路径 ./assets/xxx.js，
    // 直接刷新 /v0/workbench 时浏览器按文档地址解析成 /v0/assets/xxx.js，
    // 该地址被后端 SPA 回退成 index.html（text/html），模块脚本无法执行 → 白屏。
    base: '/',
    plugins: [
        vue(),
        WindiCSS()
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
