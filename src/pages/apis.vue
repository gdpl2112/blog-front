<script lang="ts" setup>
import {onMounted, ref, watch} from "vue";
import axios from "axios";
import service from "@/axios";
import {ElMessage} from "element-plus";
import {copyTextElement} from '@/utils/utils'

const list = ref([])
const rawList = ref([])
const searchText = ref('')
const isLoading = ref(true)
const copySuccess = ref<number | null>(null)

// ===== 在线测试 =====
interface KV {
  key: string
  value: string
}

// 独立的 axios 实例: 不走全局拦截器(避免 403 跳登录), 任何状态码都返回
const testClient = axios.create({timeout: 30000, validateStatus: () => true})

const testDialogVisible = ref(false)
const testApiName = ref('')
const testMethod = ref('GET')
const testUrl = ref('')
const testParams = ref<KV[]>([])
const testHeaders = ref<KV[]>([])
const testBody = ref('')
const testLoading = ref(false)
const showRespHeaders = ref(false)
const testResponse = ref<{
  status: number
  statusText: string
  time: number
  headers: Record<string, any>
  data: string
  error?: string
} | null>(null)

const methodOptions = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']

// 把示例地址拆成 url + 查询参数, 方便编辑
function parseAddress(address: string): { url: string; params: KV[] } {
  try {
    const u = new URL(address)
    const params: KV[] = []
    u.searchParams.forEach((v, k) => params.push({key: k, value: v}))
    return {url: u.origin + u.pathname, params}
  } catch {
    return {url: address || '', params: []}
  }
}

function openTestDialog(e: any) {
  testApiName.value = e.name
  testMethod.value = (e.method || 'GET').toUpperCase()
  const {url, params} = parseAddress(e.address || '')
  testUrl.value = url
  testParams.value = params.length ? params : [{key: '', value: ''}]
  testHeaders.value = [{key: '', value: ''}]
  testBody.value = ''
  testResponse.value = null
  showRespHeaders.value = false
  testDialogVisible.value = true
}

function addParam() {
  testParams.value.push({key: '', value: ''})
}

function removeParam(i: number) {
  testParams.value.splice(i, 1)
}

function addHeader() {
  testHeaders.value.push({key: '', value: ''})
}

function removeHeader(i: number) {
  testHeaders.value.splice(i, 1)
}

function kvToObject(arr: KV[]): Record<string, string> {
  const o: Record<string, string> = {}
  arr.forEach(({key, value}) => {
    if (key && key.trim()) o[key.trim()] = value
  })
  return o
}

function statusClass(status: number): string {
  if (status >= 200 && status < 300) return 'status-2xx'
  if (status >= 300 && status < 400) return 'status-3xx'
  if (status >= 400 && status < 500) return 'status-4xx'
  if (status >= 500) return 'status-5xx'
  return 'status-err'
}

function prettyJson(s: string): string {
  try {
    return JSON.stringify(JSON.parse(s), null, 2)
  } catch {
    return s
  }
}

// 公共 CORS 代理 (allorigins): 服务端转发, 给浏览器补上合法 CORS 头
const PUBLIC_CORS_PROXY = 'https://api.allorigins.win/get?url='

function buildFullUrl(url: string, params: Record<string, string>): string {
  const keys = Object.keys(params)
  if (!keys.length) return url
  const usp = new URLSearchParams()
  keys.forEach((k) => usp.append(k, params[k]))
  return url + (url.includes('?') ? '&' : '?') + usp.toString()
}

// 直连失败(通常是跨域/网络)时, 经公共 CORS 代理转发 (仅支持 GET)
async function sendViaProxy(
  method: string,
  params: Record<string, string>,
  start: number,
) {
  if (method !== 'GET') {
    testResponse.value = {
      status: 0,
      statusText: 'Error',
      time: Date.now() - start,
      headers: {},
      data: '',
      error: '该接口跨域且非 GET 请求, 公共代理无法转发。请在浏览器同源环境或自建代理下测试。',
    }
    return
  }
  const fullUrl = buildFullUrl(testUrl.value.trim(), params)
  const resp = await testClient.get(PUBLIC_CORS_PROXY + encodeURIComponent(fullUrl))
  const d: any = resp.data
  if (d && d.status) {
    const contents = typeof d.contents === 'string' ? d.contents : JSON.stringify(d.contents)
    testResponse.value = {
      status: d.status.http_code || resp.status,
      statusText: '(经公共代理)',
      time: d.status.response_time ?? (Date.now() - start),
      headers: d.status.content_type ? {'content-type': d.status.content_type} : {},
      data: prettyJson(contents || ''),
    }
  } else {
    testResponse.value = {
      status: resp.status,
      statusText: '(经公共代理)',
      time: Date.now() - start,
      headers: {},
      data: prettyJson(typeof d === 'object' ? JSON.stringify(d) : String(d)),
    }
  }
}

async function sendTest() {
  if (!testUrl.value.trim()) {
    ElMessage.warning('请填写请求 URL')
    return
  }
  testLoading.value = true
  testResponse.value = null
  showRespHeaders.value = false
  const start = Date.now()
  const method = testMethod.value.toUpperCase()
  const headers = kvToObject(testHeaders.value)
  const params = kvToObject(testParams.value)
  let data: any = undefined
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method) && testBody.value.trim()) {
    try {
      data = JSON.parse(testBody.value)
    } catch {
      data = testBody.value
    }
  }
  try {
    const resp = await testClient.request({
      url: testUrl.value.trim(),
      method: method as any,
      params,
      headers,
      data,
    })
    const bodyStr = typeof resp.data === 'object'
      ? JSON.stringify(resp.data, null, 2)
      : String(resp.data)
    testResponse.value = {
      status: resp.status,
      statusText: resp.statusText,
      time: Date.now() - start,
      headers: resp.headers as any,
      data: bodyStr,
    }
  } catch (directErr: any) {
    // 直连被浏览器拦截(跨域/网络), 自动回退到公共 CORS 代理
    try {
      await sendViaProxy(method, params, start)
    } catch (proxyErr: any) {
      testResponse.value = {
        status: 0,
        statusText: 'Error',
        time: Date.now() - start,
        headers: {},
        data: '',
        error: '直连被拦截 (跨域/网络): ' + (directErr?.message || '未知')
          + '\n公共代理也失败: ' + (proxyErr?.message || '未知'),
      }
    }
  } finally {
    testLoading.value = false
  }
}

function copyResponse() {
  if (!testResponse.value) return
  navigator.clipboard?.writeText(testResponse.value.error || testResponse.value.data)
    .then(() => ElMessage.success('已复制响应'))
    .catch(() => ElMessage.error('复制失败'))
}

// 加载API列表
async function loadApiList() {
  isLoading.value = true
  try {
    const response = await service.get("/api/list")
    list.value = response
    rawList.value = response
  } catch (err) {
    ElMessage.error('获取API列表失败')
    console.error('API加载错误:', err)
  } finally {
    isLoading.value = false
  }
}

// 复制文本到剪贴板
function copyTextToClipboard(id: number, address: string) {
  const eid = "#input-" + id
  const success = copyTextElement(eid)
  if (success) {
    ElMessage.success('复制成功')
    copySuccess.value = id
    setTimeout(() => {
      copySuccess.value = null
    }, 2000)
  } else {
    ElMessage.error('复制失败')
  }
}

// 过滤API列表
watch(searchText, (newText) => {
  if (!newText) {
    list.value = rawList.value
  } else {
    const lowerText = newText.toLowerCase()
    list.value = rawList.value.filter((e: any) => 
      JSON.stringify(e).toLowerCase().includes(lowerText)
    )
  }
})

// 获取卡片渐变颜色
function getCardGradient(state: string, method: string): string {
  if (state === 'success') {
    switch (method.toLowerCase()) {
      case 'get':
        return 'linear-gradient(90deg, #38a169, #48bb78)'
      case 'post':
        return 'linear-gradient(90deg, #3182ce, #4299e1)'
      case 'put':
        return 'linear-gradient(90deg, #d69e2e, #ecc94b)'
      case 'delete':
        return 'linear-gradient(90deg, #e53e3e, #f56565)'
      default:
        return 'linear-gradient(90deg, #805ad5, #9f7aea)'
    }
  } else if (state === 'warning') {
    return 'linear-gradient(90deg, #d69e2e, #ed8936)'
  } else {
    return 'linear-gradient(90deg, #e53e3e, #dd6b20)'
  }
}

// 初始化
onMounted(() => {
  loadApiList()
})
</script>
<template>
  <div class="api-page-container">
    <!-- 页面标题 -->
    <div class="api-page-header">
      <div class="api-title-card">
        <h2 class="api-title-text">API列表</h2>
        <div class="api-subtitle">开放接口文档</div>
      </div>
    </div>

    <!-- 容器 -->
    <div class="container">
      <div class="api-content-wrapper">
        <!-- 警告信息 -->
        <div class="api-warning-banner">
          <div class="warning-icon">⚠️</div>
          <div class="warning-text">接口仅用于娱乐 禁止用于非法用途</div>
        </div>

        <!-- 搜索区域 -->
        <div class="api-search-section">
          <div class="search-input-container">
            <input 
              v-model="searchText"
              class="api-search-input form-control"
              type="search" 
              placeholder="搜索API名称、描述或作者..."
              aria-label="Search"
            >
            <div class="search-icon">🔍</div>
          </div>
          <div class="search-stats">
            找到 <span class="stats-highlight">{{ list.length }}</span> 个API
          </div>
        </div>

        <!-- 加载状态 -->
        <div v-if="isLoading" class="api-loading-container">
          <div class="loading-spinner"></div>
          <div class="loading-text">加载中...</div>
        </div>

        <!-- 空状态 -->
        <div v-else-if="list.length === 0" class="api-empty-state">
          <div class="empty-icon">📭</div>
          <div class="empty-text">没有找到匹配的API</div>
          <button 
            v-if="searchText" 
            @click="searchText = ''" 
            class="clear-search-btn"
          >
            清除搜索
          </button>
        </div>

        <!-- API列表 -->
        <div v-else class="api-grid">
          <div 
            v-for="(e, i) in list" 
            :key="e.id"
            class="api-card-container"
          >
            <div class="api-card">
              <!-- 标签栏 -->
              <div class="api-tags-container">
                <div 
                  :class="['api-tag', 'tag-author', e.author === 'kloping' ? 'author-official' : 'author-contributor']"
                >
                  {{ e.author }}
                </div>
                <div :class="['api-tag', 'tag-method', 'method-' + e.method.toLowerCase()]">
                  {{ e.method }}
                </div>
                <div :class="['api-tag', 'tag-state', 'state-' + e.state]">
                  {{ e.state === 'success' ? '可用' : e.state }}
                </div>
              </div>

              <!-- 卡片内容 -->
              <div class="api-card-content">
                <h5 class="api-card-title">
                  {{ e.name }}
                  <span v-if="e.state !== 'success'" class="status-badge status-{{ e.state }}">
                    {{ e.state }}
                  </span>
                </h5>
                <p class="api-card-description">
                  {{ e.desc }}
                </p>
                
                <!-- API地址 -->
                <div class="api-address-section">
                  <div class="section-label">接口地址</div>
                  <div class="input-group">
                    <input 
                      :id="'input-' + e.id"
                      type="text" 
                      class="form-control api-address-input"
                      :value="e.address"
                      readonly
                    >
                    <button 
                      @click="copyTextToClipboard(e.id, e.address)"
                      :class="['btn', 'btn-copy', copySuccess === e.id ? 'copied' : '']"
                      type="button"
                    >
                      {{ copySuccess === e.id ? '✓ 已复制' : '复制' }}
                    </button>
                  </div>
                </div>

                <!-- 在线测试按钮 -->
                <button
                  @click="openTestDialog(e)"
                  class="btn btn-test-api"
                  type="button"
                >
                  🚀 在线测试
                </button>
              </div>

              <!-- 卡片装饰 -->
              <div class="api-card-decoration" :style="{background: getCardGradient(e.state, e.method)}"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 在线测试弹窗 -->
    <el-dialog
      v-model="testDialogVisible"
      :title="'在线测试 - ' + testApiName"
      width="720px"
      top="6vh"
      class="api-test-dialog"
      append-to-body
    >
      <div class="test-form">
        <!-- 请求行 -->
        <div class="test-row test-request-line">
          <el-select v-model="testMethod" class="test-method-select" placeholder="方法">
            <el-option v-for="m in methodOptions" :key="m" :label="m" :value="m"/>
          </el-select>
          <el-input v-model="testUrl" class="test-url-input" placeholder="请求 URL"/>
          <el-button type="primary" :loading="testLoading" @click="sendTest">发送</el-button>
        </div>

        <!-- 查询参数 -->
        <div class="test-section">
          <div class="test-section-head">
            <span class="test-section-title">Query 参数</span>
            <el-button text size="small" @click="addParam">+ 添加</el-button>
          </div>
          <div v-for="(p, i) in testParams" :key="'p' + i" class="test-kv-row">
            <el-input v-model="p.key" placeholder="key" size="small"/>
            <el-input v-model="p.value" placeholder="value" size="small"/>
            <el-button text size="small" class="kv-del" @click="removeParam(i)">✕</el-button>
          </div>
        </div>

        <!-- 请求头 -->
        <div class="test-section">
          <div class="test-section-head">
            <span class="test-section-title">请求头 Headers</span>
            <el-button text size="small" @click="addHeader">+ 添加</el-button>
          </div>
          <div v-for="(h, i) in testHeaders" :key="'h' + i" class="test-kv-row">
            <el-input v-model="h.key" placeholder="key" size="small"/>
            <el-input v-model="h.value" placeholder="value" size="small"/>
            <el-button text size="small" class="kv-del" @click="removeHeader(i)">✕</el-button>
          </div>
        </div>

        <!-- 请求体 -->
        <div v-if="testMethod !== 'GET'" class="test-section">
          <div class="test-section-head">
            <span class="test-section-title">请求体 Body (JSON/文本)</span>
          </div>
          <el-input
            v-model="testBody"
            type="textarea"
            :rows="4"
            placeholder='{"key": "value"}'
          />
        </div>

        <!-- 响应 -->
        <div v-if="testResponse" class="test-response">
          <div class="resp-meta">
            <span :class="['resp-status', statusClass(testResponse.status)]">
              {{ testResponse.error ? 'Error' : testResponse.status + ' ' + testResponse.statusText }}
            </span>
            <span class="resp-time">⏱ {{ testResponse.time }} ms</span>
            <el-button
              v-if="!testResponse.error"
              text
              size="small"
              @click="showRespHeaders = !showRespHeaders"
            >
              {{ showRespHeaders ? '隐藏响应头' : '查看响应头' }}
            </el-button>
            <el-button text size="small" @click="copyResponse">复制响应</el-button>
          </div>
          <pre v-if="showRespHeaders && !testResponse.error" class="resp-headers">{{ Object.entries(testResponse.headers).map(([k, v]) => k + ': ' + v).join('\n') }}</pre>
          <pre class="resp-body">{{ testResponse.error || testResponse.data || '(空响应)' }}</pre>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
/* 全局样式重置 */
* {
  box-sizing: border-box;
}

/* 页面容器 */
.api-page-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem 0;
}

/* 页面标题 */
.api-page-header {
  text-align: center;
  margin-bottom: 2rem;
  animation: fadeInUp 0.6s ease-out;
}

.api-title-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
}

.api-title-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
}

.api-title-text {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 0.5rem 0;
  background: linear-gradient(45deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.api-subtitle {
  font-size: 1.1rem;
  color: #718096;
  font-weight: 500;
}

/* 内容包装器 */
.api-content-wrapper {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
}

/* 警告横幅 */
.api-warning-banner {
  display: flex;
  align-items: center;
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 2rem;
  animation: pulse 2s infinite;
}

.warning-icon {
  font-size: 1.5rem;
  margin-right: 1rem;
}

.warning-text {
  font-weight: 500;
  color: #856404;
}

/* 搜索区域 */
.api-search-section {
  margin-bottom: 2rem;
  position: relative;
}

.search-input-container {
  position: relative;
  margin-bottom: 0.5rem;
}

.api-search-input {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.api-search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.search-icon {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #a0aec0;
  pointer-events: none;
}

.search-stats {
  text-align: right;
  font-size: 0.875rem;
  color: #718096;
}

.stats-highlight {
  font-weight: 700;
  color: #667eea;
}

/* 加载状态 */
.api-loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 0;
  color: #718096;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.loading-text {
  font-size: 1rem;
  font-weight: 500;
}

/* 空状态 */
.api-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 0;
  color: #718096;
  text-align: center;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-text {
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
}

.clear-search-btn {
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-search-btn:hover {
  background: #5a67d8;
  transform: translateY(-1px);
}

/* API网格布局 */
.api-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

/* API卡片 */
.api-card-container {
  transition: transform 0.4s ease, box-shadow 0.4s ease;
  will-change: transform, box-shadow;
}

.api-card-container:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
}

.api-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* 标签容器 */
.api-tags-container {
  display: flex;
  gap: 0.5rem;
  padding: 1rem 1rem 0;
  flex-wrap: wrap;
}

.api-tag {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

/* 作者标签 */
.tag-author {
  background: #edf2f7;
  color: #4a5568;
}

.author-official {
  background: #e6fffa;
  color: #2b6cb0;
}

.author-contributor {
  background: #fffaf0;
  color: #c05621;
}

/* 方法标签 */
.tag-method {
  font-weight: 700;
}

.method-get {
  background: #c6f6d5;
  color: #22543d;
}

.method-post {
  background: #bee3f8;
  color: #2c5282;
}

.method-put {
  background: #feebc8;
  color: #c05621;
}

.method-delete {
  background: #fed7d7;
  color: #c53030;
}

/* 状态标签 */
.tag-state {
  font-weight: 700;
}

.state-success {
  background: #c6f6d5;
  color: #22543d;
}

.state-warning {
  background: #feebc8;
  color: #c05621;
}

.state-error {
  background: #fed7d7;
  color: #c53030;
}

/* 卡片内容 */
.api-card-content {
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.api-card-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0.5rem 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.status-badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 600;
}

.status-warning {
  background: #feebc8;
  color: #c05621;
}

.status-error {
  background: #fed7d7;
  color: #c53030;
}

.api-card-description {
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  flex: 1;
  min-height: 60px;
}

/* API地址部分 */
.api-address-section {
  margin-top: auto;
}

.section-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #718096;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.input-group {
  display: flex;
  margin-bottom: 0;
}

.api-address-input {
  flex: 1;
  padding: 0.5rem 1rem;
  border: 2px solid #e2e8f0;
  border-right: none;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.875rem;
  background: #f7fafc;
  transition: border-color 0.3s ease;
}

.api-address-input:focus {
  outline: none;
  border-color: #667eea;
}

.btn-copy {
  background: #667eea;
  color: white;
  border: none;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.btn-copy:hover {
  background: #5a67d8;
}

.btn-copy.copied {
  background: #38a169;
}

/* 卡片装饰条 */
.api-card-decoration {
  height: 4px;
  width: 100%;
  transition: background 0.3s ease;
}

/* 动画 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .api-page-container {
    padding: 1rem 0;
  }
  
  .api-title-card {
    padding: 1.5rem;
    margin: 0 1rem;
  }
  
  .api-title-text {
    font-size: 2rem;
  }
  
  .api-content-wrapper {
    padding: 1.5rem;
    margin: 0 1rem 1rem;
    border-radius: 12px;
  }
  
  .api-grid {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
  
  .api-card-container {
    margin-bottom: 0;
  }
  
  .api-search-input {
    font-size: 0.9375rem;
  }
}

@media (max-width: 480px) {
  .api-title-text {
    font-size: 1.75rem;
  }
  
  .api-subtitle {
    font-size: 1rem;
  }
  
  .api-content-wrapper {
    padding: 1.25rem;
  }
  
  .api-card-content {
    padding: 0.875rem;
  }
  
  .api-card-title {
    font-size: 1.125rem;
  }
  
  .input-group {
    flex-direction: column;
  }
  
  .api-address-input {
    border-right: 2px solid #e2e8f0;
    border-bottom-left-radius: 0;
    border-top-right-radius: 8px;
  }
  
  .btn-copy {
    border-top-right-radius: 0;
    border-bottom-left-radius: 8px;
    margin-top: 0.5rem;
  }
}

/* ===== 在线测试 ===== */
.btn-test-api {
  width: 100%;
  margin-top: 1rem;
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(90deg, #667eea, #764ba2);
  transition: opacity 0.2s, transform 0.15s;
}

.btn-test-api:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.test-form {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.test-request-line {
  display: flex;
  gap: 0.6rem;
  align-items: center;
}

.test-method-select {
  width: 110px;
  flex-shrink: 0;
}

.test-url-input {
  flex: 1;
}

.test-section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.test-section-title {
  font-weight: 600;
  color: #2d3748;
  font-size: 0.95rem;
}

.test-kv-row {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 0.5rem;
}

.kv-del {
  color: #e53e3e;
  flex-shrink: 0;
}

.test-response {
  border-top: 1px solid #edf2f7;
  padding-top: 1rem;
}

.resp-meta {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  flex-wrap: wrap;
  margin-bottom: 0.6rem;
}

.resp-status {
  font-weight: 700;
  padding: 0.2rem 0.7rem;
  border-radius: 6px;
  color: #fff;
  font-size: 0.85rem;
}

.status-2xx { background: #38a169; }
.status-3xx { background: #3182ce; }
.status-4xx { background: #d69e2e; }
.status-5xx { background: #e53e3e; }
.status-err { background: #718096; }

.resp-time {
  color: #718096;
  font-size: 0.85rem;
}

.resp-headers {
  background: #f7fafc;
  border: 1px solid #edf2f7;
  border-radius: 8px;
  padding: 0.7rem;
  font-size: 0.8rem;
  color: #4a5568;
  white-space: pre-wrap;
  word-break: break-all;
  margin-bottom: 0.6rem;
  max-height: 160px;
  overflow-y: auto;
}

.resp-body {
  background: #1e1e2e;
  color: #cdd6f4;
  border-radius: 10px;
  padding: 1rem;
  font-family: 'Fira Code', Consolas, monospace;
  font-size: 0.85rem;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 360px;
  overflow-y: auto;
  margin: 0;
}
</style>