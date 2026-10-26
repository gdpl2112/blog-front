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

import 'aplayer/dist/APlayer.min.css'

import '@/styles/design-tokens.css'
import '@/styles/element-skin.css'

const app = createApp(App)

app.use(ElementPlus)

app.use(router)

// 等首次导航解析完成后再挂载。
// 直接访问 /v0/workbench 这类嵌套路由时，perm.ts 的守卫是异步的；
// 若先 mount 后解析，RouterView 会先以 START_LOCATION 渲染出一片空白，
// 守卫重定向时还会白闪一次。isReady 失败也要挂载，避免守卫异常导致整页不出内容。
router.isReady()
    .catch((err) => {
        console.error('[router] 首次导航未完成', err)
    })
    .then(() => app.mount('#app'))

export default app
