import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

import WindiCSS from 'vite-plugin-windicss'

import path from 'path'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

let baseUrl = 'http://127.0.0.1:81/'
// https://vitejs.dev/config/
export default defineConfig({
    build: {
        minify: 'esbuild', // 比 terser 快 10 倍[2](@ref)
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        // 将大依赖拆分为独立 chunk
                        if (id.includes('element-plus')) return 'vendor-element';
                        if (id.includes('bootstrap')) return 'vendor-bootstrap';
                        return 'vendor';
                    }
                }
            }
        }
    },
    base: './',
    plugins: [
        vue(),
        WindiCSS(),
        AutoImport({ resolvers: [ElementPlusResolver()] }),
        Components({ resolvers: [ElementPlusResolver()] }),
    ],
    resolve: {
        alias: {
            '~': path.resolve(__dirname, 'src'),
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }, server: {
        // disableHostCheck: true,
        host: '0.0.0.0', // 这个用于启动
        port: 180, // 指定启动端口
        open: false, //启动后是否自动打开浏览器
        proxy: {
            '/api': {
                target: baseUrl,
                changeOrigin: false,
                // rewrite: (path) => path.replace(/^\/api/, '/api')
            }, '/user': {
                target: baseUrl,
                changeOrigin: false,
            }, '/adm': {
                target: baseUrl,
                changeOrigin: false,
            }, '/auth': {
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
