import {createRouter, createWebHistory,} from 'vue-router'

import notFound from '@/pages/404.vue'

import index from '@/pages/index.vue'
import login from '@/pages/login.vue'
import apis from '@/pages/apis.vue'
import article from '@/pages/article.vue'

import v0 from '@/pages/v0/v0.vue'
import info from '@/pages/v0/info.vue'
import articles from '@/pages/v0/articles.vue'
import aox from '@/pages/v0/aox.vue'


const routes = [{
    path: '/',
    component: index,
    meta: {
        title: '若生er,WebSite'
    }
}, {
    path: '/article',
    component: article
}, {
    path: '/apis',
    component: apis,
    meta: {
        title: 'API列表'
    }
}, {
    path: '/v0',
    component: v0,
    meta: {
        title: '用户信息'
    },
    children: [{
        path: '',
        component: info
    },{
        path: 'info',
        component: info
    }, {
        path: 'articles',
        component: articles
    }, {
        path: 'aox',
        component: aox
    },
    ]
},{
    path: '/login',
    component: login,
    meta: {
        title: 'kloping登录'
    }
}, {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: notFound,
    meta: {
        title: '!!404'
    }
}]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router