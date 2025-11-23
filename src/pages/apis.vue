<script lang="ts" setup>
import {onMounted, ref, watch} from "vue";
import service from "@/axios";
import {ElMessage} from "element-plus";
import {copyTextElement} from '@/utils/utils'

const list = ref([])
const rawList = ref([])
const searchText = ref('')
const isLoading = ref(true)
const copySuccess = ref<number | null>(null)

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
              </div>

              <!-- 卡片装饰 -->
              <div class="api-card-decoration" :style="{background: getCardGradient(e.state, e.method)}"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
</style>