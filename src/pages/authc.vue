<template>
  <div class="auth-page min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div v-if="!isLoggedIn">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            需要登录以授权应用
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            应用 "{{ appName }}" 请求访问您的账户
          </p>
        </div>
      </div>

      <div v-else>
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div class="text-center">
            <svg class="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <h3 class="mt-2 text-lg font-medium text-gray-900">授权确认</h3>
            <div class="mt-2 text-sm text-gray-500">
              <p>应用 "{{ appName }}" 请求以下权限：</p>
              <ul class="mt-2 list-disc list-inside text-left">
                <li>访问您的基本资料</li>
                <li>读取您的文章信息</li>
              </ul>
              <p>{{ appDesc }}</p>
            </div>
            <div class="mt-6">
              <button
                  :disabled="authorizing"
                  @click="handleAuthorize"
                  class="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 mr-3"
              >
                {{ authorizing ? '授权中...' : '同意授权' }}
              </button>
              <button
                  @click="handleCancel"
                  class="inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {toast} from '@/utils/utils'
import service, {login_state} from '@/axios'

// 状态管理
const authorizing = ref(false)
const isLoggedIn = ref(false)
const appName = ref('第三方应用')
const appDesc = ref('第三方应用')

// 路由和参数
const router = useRouter()
const route = useRoute()

// 授权参数
const appId = ref('')
const redirectUri = ref('')

// 检查URL参数
onMounted(() => {
  // 获取URL参数
  const query = route.query
  appId.value = query.app_id as string || ''
  redirectUri.value = query.redirect_uri as string || ''

  // 设置应用名称（可以从后端获取）
  if (appId.value) {
    appName.value = `应用${appId.value}`
    service.get("/auth/app/info/app?app_id=" + appId.value)
        .then(res => {
          let r0 = res as any
          appName.value = r0.app_name
          appDesc.value = r0.app_desc
        })
  }

  // 检查用户登录状态
  isLoggedIn.value = login_state.value

  // 如果没有必要的参数，显示错误
  if (!appId.value || !redirectUri.value) {
    toast('缺少必要的授权参数', 'error')
    router.push('/')
  }

  if (!login_state.value) {
    toast('请先登录', 'error')
    router.push('/login?redirect_uri=' + redirectUri.value + '&app_id=' + appId.value)
  }
})

// 处理授权
const handleAuthorize = () => {
  if (!appId.value || !redirectUri.value) {
    toast('缺少必要的授权参数', 'error')
    return
  }

  authorizing.value = true

  // 向后端请求授权
  service.post('/auth/app/authorize?type=u&app_id=' + appId.value + '&redirect_uri=' + redirectUri.value)
      .then(res => {
        if (res.code === 200) {
          // 授权成功，重定向到指定地址
          toast('授权成功..', 'success')
          // 将授权码作为查询参数添加到重定向URL
          setTimeout(() => {
            window.location.href = res.data
          }, 1000)
        } else {
          toast(res.msg || '授权失败', 'error')
        }
      })
      .catch(err => {
        toast(err.msg || '授权过程中发生错误', 'error')
      })
      .finally(() => {
        authorizing.value = false
      })
}

// 取消授权
const handleCancel = () => {
  toast('授权已取消', 'info')
  router.push('/')
}
</script>

<style scoped>
.auth-page {
  background-color: #f9fafb;
}
</style>