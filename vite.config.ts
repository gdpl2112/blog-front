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
        disableHostCheck: true,
        host: '0.0.0.0', // 这个用于启动
        port: 80, // 指定启动端口
        open: false, //启动后是否自动打开浏览器
        proxy: {
            '/api/': {
                target: baseUrl,
                changeOrigin: false,
                // rewrite: (path) => path.replace(/^\/api/, '/api')
            },'/user': {
                target: baseUrl,
                changeOrigin: false,
            },'/auth': {
                target: baseUrl,
                changeOrigin: false,
            },'/notice': {
                target: baseUrl,
                changeOrigin: false,
            },'/comments': {
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
            }, '/get-music': {
                target: baseUrl,
                changeOrigin: false
            }, '/get-url-by-id': {
                target: baseUrl,
                changeOrigin: false
            }, '/get-cover-by-id': {
                target: baseUrl,
                changeOrigin: false
            }, '/get-lrc-by-id': {
                target: baseUrl,
                changeOrigin: false
            }
        },
    }
})
