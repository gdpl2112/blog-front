import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

import WindiCSS from 'vite-plugin-windicss'

import path from 'path'


let baseUrl = 'http://127.0.0.1:406/'
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        WindiCSS(),
    ],
    resolve: {
        alias: {
            '~': path.resolve(__dirname, 'src'),
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }, server: {
        host: '0.0.0.0', // 这个用于启动
        port: 80, // 指定启动端口
        open: false, //启动后是否自动打开浏览器
        proxy: {
            '/api': {
                target: baseUrl,
                changeOrigin: false,
                rewrite: (path) => path.replace(/^\/api/, '/api')
            }, '/ba': {
                target: baseUrl,
                changeOrigin: false,
                rewrite: (path) => path.replace(/^\/ba/, '')
            }, '/2024': {
                target: baseUrl,
                changeOrigin: false
            }
        },
    }
})
