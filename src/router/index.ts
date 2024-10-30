import {createRouter, createWebHistory,} from 'vue-router'

import index from '~/pages/index.vue'
import login from '~/pages/login.vue'
import api from '~/pages/api.vue'
import v0 from '~/pages/v0.vue'
import notice from '~/pages/notice.vue'
import notFound from '~/pages/404.vue'

const routes = [{
    path: '/',
    component: index
}, {
    path: '/index',
    component: index
}, {
    path: '/notice',
    component: notice
}, {
    path: '/api',
    component: api
}, {
    path: '/v0',
    component: v0
},{
    path: '/login',
    component: login
}, {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: notFound
}]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router