import {createRouter, createWebHistory,} from 'vue-router'

import notFound from '@/pages/404.vue'

import index from '@/pages/index.vue'
import login from '@/pages/login.vue'
import reg from '@/pages/reg.vue'
import apis from '@/pages/apis.vue'
import article from '@/pages/article.vue'
import upload from '@/pages/upload.vue'
import musicroom from '@/pages/musicoom.vue'
import tem from '@/pages/tem.vue'
import sponsors from '@/pages/sponsors.vue'

import v0 from '@/pages/v0/v0.vue'
import info from '@/pages/v0/info.vue'
import articles from '@/pages/v0/articles.vue'
import aox from '@/pages/v0/aox.vue'
import pnote from '@/pages/v0/pnote.vue'
import adminv0 from '@/pages/v0/adminv0.vue'


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
    path: '/upload',
    component: upload,
    meta: {
        title: '发布文章'
    }
}, {
    path: '/room',
    component: musicroom,
    meta: {
        title: '听音乐'
    }
}, {
    path: '/tem',
    component: tem,
    meta: {
        title: '测试'
    }
}, {
    path: '/sponsors',
    component: sponsors,
    meta: {
        title: '友友们的赞助'
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
    },{
        path: 'pnote',
        component: pnote
    },{
        path: 'adminv0',
        component: adminv0
    }
    ]
},{
    path: '/login',
    component: login,
    meta: {
        title: 'kloping登录'
    }
},{
    path: '/reg',
    component: reg,
    meta: {
        title: 'kloping`s blog注册'
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
