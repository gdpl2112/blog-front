// main.ts
import {createApp} from 'vue'

import ElementPlus from 'element-plus'

import 'element-plus/dist/index.css'

import App from './App.vue'

import 'virtual:windi.css'
import '@/perm'
import router from './router'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/css/bootstrap.min.css'

import 'bootstrap/dist/js/bootstrap.bundle.min'

import 'aplayer/dist/APlayer.min.css';

import {useScroll} from "vue3-progress-scroll";

const app = createApp(App)

app.use(useScroll, {
    progress: "green", // 进度条颜色
    progressRollback: "#fff", // 进度条回滚颜色
    progressTop: "3px", // 进度条距离顶部的距离
    progressLeft: "0px", // 进度条距离左边的距离
    UIViewBackground: "#fff", // 页面背景色
})

app.use(ElementPlus)

app.use(router)

app.mount('#app')

export default app
