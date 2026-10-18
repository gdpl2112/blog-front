<style scoped>
/* =============================================
   接口页：一份接口目录 + 在线调用台
   ============================================= */

.apis {
  padding-top: var(--gap-4);
}

/* ---------- 页头 ---------- */

.apis-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--gap-6);
  flex-wrap: wrap;
  padding-bottom: var(--gap-5);
}

.apis-head h1 {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 600;
  letter-spacing: 0.06em;
  margin: 0 0 10px;
}

.apis-lede {
  margin: 0;
  max-width: 34em;
  font-size: var(--text-sm);
  line-height: 1.9;
  color: var(--ink-2);
}

.search {
  position: relative;
  width: min(340px, 100%);
}

.search input {
  width: 100%;
  height: 42px;
  padding: 0 95px 0 38px;
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  color: var(--ink);
  background: var(--glass-thin);
  border: 1px solid var(--glass-line-2);
  border-radius: var(--r-full);
  outline: none;
  backdrop-filter: blur(14px) saturate(150%);
  -webkit-backdrop-filter: blur(14px) saturate(150%);
  transition: all var(--dur) var(--ease);
}

.search input::placeholder {
  color: var(--ink-3);
}

.search input:focus {
  background: var(--glass-strong);
  border-color: var(--glass-line);
  box-shadow: 0 0 0 4px var(--focus-ring);
}

.search i {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 13px;
  color: var(--ink-3);
  pointer-events: none;
}

.search .found {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  letter-spacing: 0.08em;
  color: var(--ink-3);
  pointer-events: none;
}

/* ---------- 目录 ---------- */

.api-list {
  padding: var(--gap-1) var(--gap-5);
  background: var(--glass);
  border: 1px solid var(--glass-line);
  border-radius: var(--r-lg);
  box-shadow: var(--glass-shadow), var(--glass-inner);
  backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-sat));
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-sat));
  overflow: hidden;
}

.api-row {
  display: grid;
  grid-template-columns: 62px minmax(0, 1fr) minmax(0, 0.9fr) auto;
  gap: var(--gap-5);
  align-items: center;
  padding: var(--gap-4) var(--gap-2);
  border-bottom: 1px solid var(--rule);
  cursor: pointer;
  transition: background var(--dur) var(--ease);
}

.api-row:hover {
  background: var(--glass-thin);
}

.method {
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  letter-spacing: 0.06em;
  text-align: center;
  padding: 4px 0;
  border: 1px solid var(--glass-line-2);
  border-radius: 8px;
  background: var(--glass-thin);
  color: var(--ink-2);
}

.method.get { color: #2f6b4f; border-color: rgba(47, 107, 79, 0.45); }
.method.post { color: #1f4fa8; border-color: rgba(31, 79, 168, 0.4); }
.method.put { color: #a87718; border-color: rgba(168, 119, 24, 0.45); }
.method.delete { color: var(--color-danger); border-color: rgba(179, 38, 30, 0.4); }
.method.patch { color: #6b3fa0; border-color: rgba(107, 63, 160, 0.4); }

[data-theme="dark"] .method.get { color: #6fbf95; }
[data-theme="dark"] .method.post { color: #7fa3e8; }
[data-theme="dark"] .method.put { color: #d9a94c; }
[data-theme="dark"] .method.patch { color: #b79ce0; }

.api-name {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--ink);
  margin: 0 0 3px;
  line-height: 1.5;
}

.api-desc {
  margin: 0;
  font-size: var(--text-sm);
  line-height: 1.7;
  color: var(--ink-2);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.api-addr {
  font-family: var(--font-mono);
  font-size: 11.5px;
  color: var(--ink-3);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-bottom: 1px dashed transparent;
  transition: color var(--dur) var(--ease), border-color var(--dur) var(--ease);
}

.api-row:hover .api-addr {
  color: var(--ink-2);
  border-bottom-color: var(--rule-2);
}

.api-tail {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.api-tail .go {
  font-size: 12px;
  color: var(--ink-3);
  transition: transform var(--dur) var(--ease), color var(--dur) var(--ease);
}

.api-row:hover .api-tail .go {
  color: var(--seal);
  transform: translateX(3px);
}

/* 空态也托在玻璃上，避免页面出现无归属的文字块 */
.empty {
  padding: var(--gap-8) var(--gap-6);
  background: var(--glass);
  border: 1px solid var(--glass-line);
  border-radius: var(--r-lg);
  box-shadow: var(--glass-shadow), var(--glass-inner);
  backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-sat));
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-sat));
}

```
/* ---------- 调用台 ---------- */

.console {
  display: flex;
  flex-direction: column;
}

.url-bar {
  display: flex;
  align-items: stretch;
  border: 1px solid var(--glass-line-2);
  border-radius: var(--r-md);
  background: var(--glass-thin);
  overflow: hidden;
  transition: all var(--dur) var(--ease);
}

.url-bar:focus-within {
  border-color: var(--glass-line);
  box-shadow: 0 0 0 4px var(--focus-ring);
}

.url-bar .method-select {
  width: 104px;
  flex-shrink: 0;
  border-right: 1px solid var(--rule);
}

.url-bar .url-input {
  flex: 1;
}

.url-bar .url-input :deep(.el-input__wrapper) {
  box-shadow: none !important;
  border-radius: 0 !important;
  /* 继承 .url-bar 的玻璃底，避免暗色模式下出现白块 */
  background: transparent !important;
}

.url-bar .method-select :deep(.el-input__wrapper) {
  box-shadow: none !important;
  border-radius: 0 !important;
  background: transparent !important;
}

.url-bar .url-input :deep(.el-input__inner) {
  font-family: var(--font-mono) !important;
  font-size: 12.5px !important;
  height: 42px;
}

.send-btn {
  flex-shrink: 0;
  padding: 0 22px;
  border: 0;
  border-left: 1px solid var(--rule);
  background: var(--ink);
  color: var(--on-ink);
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  font-weight: 500;
  letter-spacing: 0.06em;
  cursor: pointer;
  transition: background var(--dur) var(--ease);
}

.send-btn:hover:not(:disabled) {
  background: var(--seal);
  color: #fff;
}

.send-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

/* 折叠区 */
.fold {
  margin-top: var(--gap-4);
  border: 1px solid var(--glass-line-2);
  border-radius: var(--r-md);
  overflow: hidden;
}

.fold-head {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 9px 12px;
  border: 0;
  background: var(--paper-2);
  color: var(--ink-2);
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  letter-spacing: 0.12em;
  cursor: pointer;
  text-align: left;
}

.fold-head i {
  font-size: 8px;
  transition: transform var(--dur) var(--ease);
}

.fold-head.open i {
  transform: rotate(90deg);
}

.fold-head .n {
  margin-left: auto;
  color: var(--ink-3);
}

.fold-body {
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.kv {
  display: flex;
  gap: 6px;
  align-items: center;
}

.kv :deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px var(--rule) inset !important;
  background: var(--paper-2) !important;
}

.kv :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px var(--ink) inset !important;
}

.kv-del {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  flex-shrink: 0;
  border: 1px solid var(--rule);
  border-radius: 8px;
  background: transparent;
  color: var(--ink-3);
  cursor: pointer;
  font-size: 12px;
}

.kv-del:hover {
  border-color: var(--color-danger);
  color: var(--color-danger);
}

.add-kv {
  align-self: flex-start;
  margin-top: 2px;
  padding: 4px 10px;
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  letter-spacing: 0.08em;
  color: var(--ink-3);
  background: transparent;
  border: 1px dashed var(--rule-2);
  border-radius: 8px;
  cursor: pointer;
}

.add-kv:hover {
  border-color: var(--seal);
  color: var(--seal);
}

.body-area {
  margin-top: var(--gap-4);
}

.body-area :deep(.el-textarea__inner) {
  font-family: var(--font-mono) !important;
  font-size: 12.5px !important;
  line-height: 1.7;
  background: var(--paper-2) !important;
}

/* 响应 */
.response {
  margin-top: var(--gap-5);
  border: 1px solid var(--glass-line-2);
  border-radius: var(--r-md);
  overflow: hidden;
}

.response-bar {
  display: flex;
  align-items: center;
  gap: var(--gap-4);
  padding: 8px 12px;
  background: var(--paper-2);
  border-bottom: 1px solid var(--rule);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--ink-2);
}

.response-bar .status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  color: var(--ink);
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #2f6b4f;
}

.dot.bad {
  background: var(--color-danger);
}

.response-bar .time {
  margin-left: auto;
  color: var(--ink-3);
}

.response-bar button {
  border: 1px solid var(--rule-2);
  background: transparent;
  color: var(--ink-2);
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  letter-spacing: 0.06em;
  padding: 3px 8px;
  border-radius: 8px;
  cursor: pointer;
}

.response-bar button:hover {
  border-color: var(--ink);
  color: var(--ink);
}

.headers {
  padding: 10px 12px;
  background: var(--paper-2);
  border-bottom: 1px solid var(--rule);
  max-height: 150px;
  overflow: auto;
}

.headers pre,
.response-body pre {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 11.5px;
  line-height: 1.7;
  white-space: pre-wrap;
  word-break: break-word;
  color: var(--ink-2);
}

.response-body {
  background: var(--block);
  padding: var(--gap-4);
  max-height: 320px;
  overflow: auto;
}

.response-body pre {
  color: var(--block-ink);
  font-size: 12px;
}

.response-body pre.err {
  color: #f0907f;
}

@media (max-width: 860px) {
  .api-row {
    grid-template-columns: 54px minmax(0, 1fr) auto;
    gap: var(--gap-3);
  }

  .api-addr {
    display: none;
  }

  .apis-head {
    align-items: flex-start;
  }

  .search {
    width: 100%;
  }

  .url-bar {
    flex-wrap: wrap;
  }

  .url-bar .method-select {
    width: 96px;
  }

  .send-btn {
    padding: 0 16px;
  }
}
</style>

<template>
  <div class="apis ink-in">
    <!-- 页头 -->
    <div class="apis-head">
      <div>
        <h1>接口</h1>
        <p class="apis-lede">
          站内对外开放的接口都列在这里。点开任意一条即可直接带上参数调用，响应会原样返回。
        </p>
      </div>

      <div class="search">
        <i class="bi bi-search"></i>
        <input v-model="searchText" placeholder="搜索名称或描述" @input="filterList" />
        <span v-if="searchText" class="found">{{ list.length }} / {{ rawList.length }}</span>
      </div>
    </div>

    <!-- 载入 -->
    <div v-if="isLoading" class="empty">
      <div class="loading-ring" style="margin: 0 auto 14px;"></div>
      <p>正在取接口目录…</p>
    </div>

    <!-- 目录 -->
    <div v-else-if="list.length > 0" class="api-list">
      <div
        v-for="item in list"
        :key="item.id"
        class="api-row"
        @click="openTest(item)"
      >
        <span class="method" :class="(item.method || 'get').toLowerCase()">{{ item.method || 'GET' }}</span>

        <div>
          <h2 class="api-name">{{ item.name }}</h2>
          <p class="api-desc">{{ item.desc }}</p>
        </div>

        <div class="api-addr" :title="item.address">{{ item.address }}</div>

        <div class="api-tail">
          <span v-if="item.state" class="chip">{{ item.state }}</span>
          <button
            class="btn btn--ghost btn--sm"
            title="复制地址"
            @click.stop="copyApi(item.address)"
          >
            <i class="bi bi-clipboard"></i>
          </button>
          <i class="bi bi-arrow-right go"></i>
        </div>
      </div>
    </div>

    <!-- 空 -->
    <div v-else class="empty">
      <h3>没有匹配的接口</h3>
      <p>换个关键词再试一次。</p>
    </div>

    <!-- 调用台 -->
    <el-dialog
      append-to-body
      v-model="testDialogVisible"
      :title="testApiName || '调用接口'"
      width="760"
      :close-on-click-modal="false"
      destroy-on-close
      align-center
    >
      <div class="console">
        <div class="url-bar">
          <div class="method-select">
            <el-select v-model="testMethod" style="width: 100%">
              <el-option v-for="m in methodOptions" :key="m" :value="m" :label="m" />
            </el-select>
          </div>
          <div class="url-input">
            <el-input v-model="testUrl" placeholder="https://api.example.com/endpoint" />
          </div>
          <button class="send-btn" :disabled="testLoading" @click="sendTestRequest">
            <span v-if="testLoading">发送中</span>
            <span v-else>发送</span>
          </button>
        </div>

        <!-- Query -->
        <div class="fold">
          <button class="fold-head" :class="{ open: showParams }" @click="showParams = !showParams">
            <i class="bi bi-chevron-right"></i>
            QUERY 参数
            <span class="n">{{ testParams.filter(p => p.key).length }}</span>
          </button>
          <div v-if="showParams" class="fold-body">
            <div v-for="(p, i) in testParams" :key="'p' + i" class="kv">
              <el-input v-model="p.key" placeholder="参数名" size="small" style="flex: 1" />
              <el-input v-model="p.value" placeholder="参数值" size="small" style="flex: 1" />
              <button class="kv-del" @click="testParams.splice(i, 1)" title="移除">
                <i class="bi bi-x"></i>
              </button>
            </div>
            <button class="add-kv" @click="testParams.push({ key: '', value: '' })">+ 添加参数</button>
          </div>
        </div>

        <!-- Headers -->
        <div class="fold">
          <button class="fold-head" :class="{ open: showHeaders }" @click="showHeaders = !showHeaders">
            <i class="bi bi-chevron-right"></i>
            HEADERS
            <span class="n">{{ testHeaders.filter(h => h.key).length }}</span>
          </button>
          <div v-if="showHeaders" class="fold-body">
            <div v-for="(h, i) in testHeaders" :key="'h' + i" class="kv">
              <el-input v-model="h.key" placeholder="Header 名" size="small" style="flex: 1" />
              <el-input v-model="h.value" placeholder="Header 值" size="small" style="flex: 1" />
              <button class="kv-del" @click="testHeaders.splice(i, 1)" title="移除">
                <i class="bi bi-x"></i>
              </button>
            </div>
            <button class="add-kv" @click="testHeaders.push({ key: '', value: '' })">+ 添加 Header</button>
          </div>
        </div>

        <!-- Body -->
        <div v-if="['POST', 'PUT', 'PATCH'].includes(testMethod)" class="body-area">
          <el-input v-model="testBody" type="textarea" :rows="5" placeholder='{"key": "value"}' />
        </div>

        <!-- 响应 -->
        <div v-if="testResponse" class="response">
          <div class="response-bar">
            <span class="status">
              <span class="dot" :class="{ bad: testResponse.status >= 400 || testResponse.error }"></span>
              {{ testResponse.status || 'ERR' }}
              <span style="color: var(--ink-3); font-weight: 400;">{{ testResponse.statusText }}</span>
            </span>
            <span class="time">{{ testResponse.time }} ms</span>
            <button @click="showRespHeaders = !showRespHeaders">
              {{ showRespHeaders ? '隐藏头' : '响应头' }}
            </button>
            <button @click="copyResponseText()">复制</button>
          </div>

          <div v-if="showRespHeaders" class="headers">
            <pre>{{ JSON.stringify(testResponse.headers, null, 2) }}</pre>
          </div>

          <div class="response-body">
            <pre :class="{ err: testResponse.error }">{{ testResponse.error || testResponse.data }}</pre>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import axios from "axios";
import { ElMessage } from "element-plus";
import { copyTextElement } from '@/utils/utils'

// 公共API页面使用独立的axios实例，不带auth拦截器，避免未登录时403被全局拦截重定向
const publicClient = axios.create({ baseURL: '/', timeout: 30000 })
publicClient.interceptors.response.use(
  r => r.data,
  err => Promise.reject(err)
)

interface ApiDefinition {
  id: number | string
  name: string
  desc: string
  state: string
  address: string
  method: string
  requestBody?: string
}

const list = ref<ApiDefinition[]>([])
const rawList = ref<ApiDefinition[]>([])
const searchText = ref('')
const isLoading = ref(true)

interface KV { key: string; value: string }
const testClient = axios.create({ timeout: 30000, validateStatus: () => true })
const testDialogVisible = ref(false)
const testApiName = ref('')
const testMethod = ref('GET')
const testUrl = ref('')
const testParams = ref<KV[]>([])
const testHeaders = ref<KV[]>([])
const testBody = ref('')
const testLoading = ref(false)
const showRespHeaders = ref(false)
const showParams = ref(true)
const showHeaders = ref(false)
const testResponse = ref<{
  status: number
  statusText: string
  time: number
  headers: Record<string, any>
  data: string
  error?: string
} | null>(null)
const methodOptions = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
const bodyMethods = ['POST', 'PUT', 'PATCH']

function parseAddress(address: string): { url: string; params: KV[] } {
  try {
    const u = new URL(address)
    const params: KV[] = []
    u.searchParams.forEach((v, k) => params.push({ key: k, value: v }))
    return { url: u.origin + u.pathname, params }
  } catch { return { url: address, params: [] } }
}

function copyApi(addr: string) { copyTextElement(addr) }

function copyResponseText() {
  if (!testResponse.value) return
  const text = testResponse.value.error || testResponse.value.data
  copyTextElement(text)
}

function filterList() {
  const t = searchText.value.toLowerCase()
  if (!t) { list.value = [...rawList.value]; return }
  list.value = rawList.value.filter(item =>
    (item.name && item.name.toLowerCase().includes(t)) ||
    (item.desc && item.desc.toLowerCase().includes(t))
  )
}

function openTest(item: ApiDefinition) {
  testApiName.value = item.name
  testMethod.value = item.method || 'GET'
  const parsed = parseAddress(item.address)
  testUrl.value = parsed.url
  testParams.value = parsed.params.length ? parsed.params : [{ key: '', value: '' }]
  // 后端元数据提供 JSON 示例时，同时预设正确的内容类型，打开后即可直接测试。
  const hasJsonBody = bodyMethods.includes(testMethod.value) && Boolean(item.requestBody)
  testHeaders.value = hasJsonBody
    ? [{ key: 'Content-Type', value: 'application/json' }, { key: '', value: '' }]
    : [{ key: '', value: '' }]
  testBody.value = item.requestBody || (bodyMethods.includes(testMethod.value) ? '{}' : '')
  testResponse.value = null
  showRespHeaders.value = false
  showParams.value = true
  showHeaders.value = false
  testDialogVisible.value = true
}

async function sendTestRequest() {
  testLoading.value = true
  testResponse.value = null
  const start = performance.now()
  try {
    const paramsObj: Record<string, string> = {}
    testParams.value.filter(p => p.key).forEach(p => { paramsObj[p.key] = p.value })
    const headersObj: Record<string, string> = {}
    testHeaders.value.filter(h => h.key).forEach(h => { headersObj[h.key] = h.value })

    const res = await testClient({
      method: testMethod.value.toLowerCase() as any,
      url: testUrl.value,
      params: paramsObj,
      headers: headersObj,
      data: testBody.value || undefined,
    })
    testResponse.value = {
      status: res.status,
      statusText: res.statusText,
      time: Math.round(performance.now() - start),
      headers: res.headers,
      data: typeof res.data === 'string' ? res.data : JSON.stringify(res.data, null, 2),
    }
  } catch (e: any) {
    testResponse.value = {
      status: 0,
      statusText: 'Error',
      time: Math.round(performance.now() - start),
      headers: {},
      data: '',
      error: e.message || String(e),
    }
  } finally { testLoading.value = false }
}

onMounted(async () => {
  try {
    const res = await publicClient.get("/api/list") as unknown as ApiDefinition[]
    rawList.value = res
    list.value = [...rawList.value]
  } catch { ElMessage.error('加载API列表失败') }
  finally { isLoading.value = false }
})
</script>
