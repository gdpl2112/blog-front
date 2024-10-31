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

const app = createApp(App)

app.use(ElementPlus)

app.use(router)

app.mount('#app')