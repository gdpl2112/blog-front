<style scoped>
/* =============================================
   AI 配置
   ============================================= */

.panel-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--gap-4);
  padding-bottom: 10px;
  border-bottom: 1px solid var(--rule-2);
  margin-bottom: var(--gap-4);
}

.panel-head h2 {
  font-size: var(--text-md);
  letter-spacing: 0.06em;
  margin: 0;
}

.panel-head span {
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  letter-spacing: 0.08em;
  color: var(--ink-3);
}

.hint {
  margin: 0 0 var(--gap-5);
  font-size: var(--text-xs);
  line-height: 1.9;
  color: var(--ink-3);
}

.token-bar {
  display: flex;
  gap: var(--gap-2);
  align-items: center;
  margin-bottom: var(--gap-5);
  padding-bottom: var(--gap-5);
  border-bottom: 1px solid var(--rule);
}

.token-bar :deep(.el-input) {
  max-width: 480px;
}

.group {
  border-top: 1px solid var(--rule-2);
  padding-top: var(--gap-4);
  margin-bottom: var(--gap-6);
}

.group h3 {
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  font-weight: 400;
  letter-spacing: 0.18em;
  color: var(--ink-3);
  margin: 0 0 var(--gap-4);
}

.group :deep(.el-form-item) {
  margin-bottom: 14px;
}

.config-form {
  max-width: 720px;
}

.form-actions {
  display: flex;
  align-items: center;
  gap: var(--gap-2);
  flex-wrap: wrap;
}

.stamp {
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  letter-spacing: 0.04em;
  color: var(--ink-3);
}

@media (max-width: 640px) {
  .token-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .token-bar :deep(.el-input) {
    max-width: none;
  }
}
</style>

<template>
  <div class="ink-in">
    <div class="panel-head">
      <h2>AI 配置</h2>
      <span>仅管理员</span>
    </div>

    <p class="hint">
      API Key 默认脱敏显示。查看完整 Key 或保存配置前，请确认当前设备的凭证安全。
    </p>

    <div class="token-bar">
      <el-input v-model="adminToken" type="password" show-password clearable placeholder="可选：ADMIN_TOKEN" @keyup.enter="loadConfig" />
      <el-button :loading="loading" type="primary" @click="loadConfig">读取配置</el-button>
      <el-button :loading="revealing" :disabled="!configLoaded" @click="toggleReveal">
        {{ reveal ? '隐藏完整 Key' : '查看完整 Key' }}
      </el-button>
    </div>

    <el-alert v-if="errorMessage" :title="errorMessage" type="error" show-icon :closable="false" style="margin-bottom: 16px" />

    <el-form v-if="configLoaded" ref="formRef" :model="form" :rules="rules" label-width="160px" class="config-form">
      <div class="group">
        <h3>对话模型</h3>
        <el-form-item label="Base URL" prop="chatBaseUrl"><el-input v-model="form.chatBaseUrl" placeholder="https://api.example.com/" /></el-form-item>
        <el-form-item label="API Key"><el-input v-model="form.chatApiKey" type="password" show-password placeholder="留空表示保留原值" /></el-form-item>
        <el-form-item label="模型" prop="chatModel"><el-input v-model="form.chatModel" /></el-form-item>
        <el-form-item label="Completions Path" prop="chatCompletionsPath"><el-input v-model="form.chatCompletionsPath" /></el-form-item>
        <el-form-item label="Temperature" prop="chatTemperature">
          <el-input-number v-model="form.chatTemperature" :min="0" :max="2" :step="0.05" :precision="2" />
        </el-form-item>
      </div>

      <div class="group">
        <h3>EMBEDDING 模型</h3>
        <el-form-item label="Base URL" prop="embeddingBaseUrl"><el-input v-model="form.embeddingBaseUrl" placeholder="https://embed.example.com/" /></el-form-item>
        <el-form-item label="API Key"><el-input v-model="form.embeddingApiKey" type="password" show-password placeholder="留空表示保留原值" /></el-form-item>
        <el-form-item label="模型" prop="embeddingModel"><el-input v-model="form.embeddingModel" /></el-form-item>
        <el-form-item label="Embeddings Path" prop="embeddingEmbeddingsPath"><el-input v-model="form.embeddingEmbeddingsPath" /></el-form-item>
        <el-form-item label="Dimensions" prop="embeddingDimensions">
          <el-input-number v-model="form.embeddingDimensions" :min="1" :step="1" />
        </el-form-item>
      </div>

      <div class="form-actions">
        <el-button type="primary" :loading="saving" @click="saveConfig">保存配置</el-button>
        <el-button :disabled="saving" @click="loadConfig">重新读取</el-button>
        <span v-if="lastUpdated" class="stamp">{{ lastUpdated }}</span>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from 'vue'
import type {FormInstance, FormRules} from 'element-plus'
import service from '@/axios'
import Cookie from 'js-cookie'
import {toast} from '@/utils/utils'

interface AiConfig {
  chatBaseUrl: string; chatApiKey: string; chatModel: string; chatCompletionsPath: string; chatTemperature: number
  embeddingBaseUrl: string; embeddingApiKey: string; embeddingModel: string; embeddingEmbeddingsPath: string; embeddingDimensions: number
}

const emptyConfig = (): AiConfig => ({
  chatBaseUrl: '', chatApiKey: '', chatModel: '', chatCompletionsPath: '/v1/chat/completions', chatTemperature: 0.7,
  embeddingBaseUrl: '', embeddingApiKey: '', embeddingModel: '', embeddingEmbeddingsPath: '/v1/embeddings', embeddingDimensions: 1024
})

const form = reactive<AiConfig>(emptyConfig())
const formRef = ref<FormInstance>()
const adminToken = ref(sessionStorage.getItem('admin-token') || '')
const configLoaded = ref(false)
const loading = ref(false)
const saving = ref(false)
const revealing = ref(false)
const reveal = ref(false)
const errorMessage = ref('')
const lastUpdated = ref('')

const rules: FormRules<AiConfig> = {
  chatBaseUrl: [{required: true, message: '请输入对话 Base URL', trigger: 'blur'}],
  chatModel: [{required: true, message: '请输入对话模型', trigger: 'blur'}],
  chatCompletionsPath: [{required: true, message: '请输入对话路径', trigger: 'blur'}],
  chatTemperature: [{required: true, message: 'Temperature 必须在 0 到 2 之间', trigger: 'change'}],
  embeddingBaseUrl: [{required: true, message: '请输入 Embedding Base URL', trigger: 'blur'}],
  embeddingModel: [{required: true, message: '请输入 Embedding 模型', trigger: 'blur'}],
  embeddingEmbeddingsPath: [{required: true, message: '请输入 Embeddings 路径', trigger: 'blur'}],
  embeddingDimensions: [{required: true, message: '请输入 Embedding 维度', trigger: 'change'}]
}

function authHeaders() {
  const token = adminToken.value.trim()
  if (token) {
    sessionStorage.setItem('admin-token', token)
  } else {
    sessionStorage.removeItem('admin-token')
  }
  const headers: Record<string, string> = {}
  if (token) {
    headers.Authorization = `Bearer ${token}`
    headers.token = token
  } else {
    const cookieToken = Cookie.get('token')
    const cookieAuthorization = Cookie.get('authorization')
    if (cookieToken) headers.token = cookieToken
    if (cookieAuthorization) headers.Authorization = cookieAuthorization
  }
  return headers
}

function unwrapResponse(response: any): any {
  if (response && typeof response === 'object' && 'code' in response) {
    if (response.code !== 200) throw new Error(response.msg || '请求失败')
    return response.data ?? response
  }
  return response
}

function applyConfig(value: any) {
  const next = {...emptyConfig(), ...(value || {})}
  Object.assign(form, next)
}

async function loadConfig() {
  loading.value = true
  errorMessage.value = ''
  try {
    const response = await service.get(`/adm/ai/config${reveal.value ? '?reveal=true' : ''}`, {headers: authHeaders()})
    applyConfig(unwrapResponse(response))
    configLoaded.value = true
    lastUpdated.value = `读取于 ${new Date().toLocaleTimeString()}`
  } catch (error: any) {
    errorMessage.value = error?.message || error?.msg || '读取 AI 配置失败'
  } finally {
    loading.value = false
  }
}

async function toggleReveal() {
  reveal.value = !reveal.value
  revealing.value = true
  try {
    const response = await service.get(`/adm/ai/config${reveal.value ? '?reveal=true' : ''}`, {headers: authHeaders()})
    applyConfig(unwrapResponse(response))
  } catch (error: any) {
    reveal.value = !reveal.value
    errorMessage.value = error?.message || error?.msg || '读取完整 API Key 失败'
  } finally {
    revealing.value = false
  }
}

function isMasked(value: string) {
  return /\*{2,}/.test(value)
}

async function saveConfig() {
  if (!formRef.value) return
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  saving.value = true
  errorMessage.value = ''
  try {
    const payload: Partial<AiConfig> = {...form}
    if (!payload.chatApiKey || isMasked(payload.chatApiKey)) delete payload.chatApiKey
    if (!payload.embeddingApiKey || isMasked(payload.embeddingApiKey)) delete payload.embeddingApiKey
    const response = await service.put('/adm/ai/config', payload, {headers: authHeaders()})
    applyConfig(unwrapResponse(response))
    toast('配置已更新', 'success')
    lastUpdated.value = `更新于 ${new Date().toLocaleTimeString()}`
  } catch (error: any) {
    errorMessage.value = error?.message || error?.msg || '更新 AI 配置失败'
  } finally {
    saving.value = false
  }
}

onMounted(loadConfig)
</script>
