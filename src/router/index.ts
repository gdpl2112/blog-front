import {createRouter, createWebHistory,} from 'vue-router'

import notFound from '@/pages/404.vue'

import index from '@/pages/index.vue'
import login from '@/pages/login.vue'
import reg from '@/pages/reg.vue'
import apis from '@/pages/apis.vue'
import article from '@/pages/article.vue'
import upload from '@/pages/upload.vue'
import update from '@/pages/update.vue'
import musicroom from '@/pages/musicoom.vue'
import sponsors from '@/pages/sponsors.vue'
import ai from '@/pages/ai.vue'
import authc from '@/pages/authc.vue'
import effects from '@/pages/effects.vue'

import v0 from '@/pages/v0/v0.vue'
import info from '@/pages/v0/info.vue'
import articles from '@/pages/v0/articles.vue'
import aox from '@/pages/v0/aox.vue'
import app from '@/pages/v0/app.vue'
import adminv0 from '@/pages/v0/adminv0.vue'
import adminv1 from '@/pages/v0/adminv1.vue'
import adminai from '@/pages/v0/adminai.vue'

// 工作台模块：外壳 + 概览 + 内置工具
import workbench from '@/pages/v0/workbench/index.vue'
import workbenchOverview from '@/pages/v0/workbench/overview.vue'
import pnote from '@/pages/v0/workbench/tools/pnote.vue'
import cardkey from '@/pages/v0/workbench/tools/cardkey.vue'


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
        title: 'kweb公共API列表'
    }
}, {
    path: '/upload',
    component: upload,
    meta: {
        title: 'kweb发布文章'
    }
}, {
    path: '/update',
    component: update,
    meta: {
        title: '帖子修改'
    }
}, {
    path: '/room',
    component: musicroom,
    meta: {
        title: 'kweb音乐'
    }
}, {
    path: '/sponsors',
    component: sponsors,
    meta: {
        title: '友友们的赞助'
    }
}, {
    path: '/effects',
    component: effects,
    meta: {
        title: '背景室',
        // 背景室自己挂载所选背景，App.vue 需要关掉全站底衬
        hideBackdrop: true
    }
}, {
    path: '/ai',
    component: ai,
    meta: {
        title: '小生AI对话'
    }
}, {
    path: '/v0',
    component: v0,
    meta: {
        title: '个人中心'
    },
    children: [{
        path: '',
        redirect: '/v0/workbench'
    }, {
        // 工作台：个人中心首页，工具作为其子模块
        path: 'workbench',
        component: workbench,
        children: [{
            path: '',
            component: workbenchOverview,
            meta: {
                title: '工作台',
                sub: '把内容、接口、应用与工具收在一处。'
            }
        }, {
            path: 'pnote',
            component: pnote,
            meta: {
                title: '密码本',
                sub: '账号密码的一页账本：鼠标移入行内即可编辑，移出自动保存。'
            }
        }, {
            path: 'cardkey',
            component: cardkey,
            meta: {
                title: '卡密维护',
                sub: '卡号卡密的生成、检索与兑换状态，仅管理员可见。'
            }
        }]
    }, {
        path: 'info',
        component: info
    }, {
        path: 'articles',
        component: articles
    }, {
        path: 'aox',
        component: aox
    },{
        path: 'app',
        component: app
    },{
        path: 'adminv0',
        component: adminv0
    },{
        path: 'adminv1',
        component: adminv1
    },{
        path: 'adminai',
        component: adminai,
        meta: {
            title: 'AI配置',
            requiresAdmin: true
        }
    },{
        // 旧地址兼容：工具已迁入工作台
        path: 'pnote',
        redirect: '/v0/workbench/pnote'
    },{
        path: 'adminv2',
        redirect: '/v0/workbench/cardkey'
    }
    ]
},{
    path: '/login',
    component: login,
    meta: {
        title: 'kloping登录'
    }
}, {
    path: '/reg',
    component: reg,
    meta: {
        title: 'kloping`s blog注册'
    }
}, {
    path: '/authc',
    component: authc,
    meta: {
        title: '应用授权'
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
