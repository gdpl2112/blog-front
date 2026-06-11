<style scoped>
/* =============================================
   APIs Page - Redesigned Developer API Catalog
   ============================================= */

/* ---- Page Shell ---- */
.apis-page {
  max-width: var(--max-width);
  margin: 0 auto;
}

/* ---- Header Section ---- */
.apis-header {
  margin-bottom: var(--space-10);
}

.apis-header .section-header {
  margin-bottom: var(--space-6);
}

.apis-header .section-header h2 {
  font-size: 2rem;
  font-weight: 750;
  letter-spacing: -0.03em;
}

.apis-header .section-header p {
  font-size: 0.95rem;
  color: var(--color-text-secondary);
  max-width: 52ch;
}

/* ---- Search Bar ---- */
.search-bar {
  display: flex;
  gap: var(--space-2);
  max-width: 440px;
  position: relative;
}

.search-bar input {
  flex: 1;
  height: 44px;
  padding: 0 16px 0 42px;
  font-size: 0.9rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-bg-card);
  color: var(--color-text-primary);
  outline: none;
  transition: all var(--transition-base);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.search-bar input:focus {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px var(--color-accent-soft);
}

.search-bar input::placeholder {
  color: var(--color-text-tertiary);
}

/* Search icon inside input */
.search-icon-wrapper {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-tertiary);
  font-size: 1rem;
  pointer-events: none;
}

/* ---- API Grid ---- */
.api-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: var(--space-5);
}

/* ---- API Card ---- */
.api-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-6);
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-base);
  overflow: hidden;
  /* Left accent line - colored per method */
}

/* Method-based left accent */
.api-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 16px;
  bottom: 16px;
  width: 3px;
  border-radius: 0 2px 2px 0;
  background: var(--color-accent);
  transition: all var(--transition-base);
  opacity: 0;
}

.api-card:hover::before {
  opacity: 1;
}

/* Method accent colors via data attribute */
.api-card.method-get::before { background: #10b981; }
.api-card.method-post::before { background: #6366f1; }
.api-card.method-put::before { background: #f59e0b; }
.api-card.method-delete::before { background: #ef4444; }
.api-card.method-patch::before { background: #8b5cf6; }

.api-card:hover {
  border-color: var(--color-accent-soft);
  box-shadow: var(--shadow-lg);
  transform: translateY(-3px);
  background: var(--color-bg-card);
}

.api-card.method-get:hover { border-color: rgba(16, 185, 129, 0.25); box-shadow: 0 8px 30px rgba(16, 185, 129, 0.08); }
.api-card.method-post:hover { border-color: rgba(99, 102, 241, 0.25); box-shadow: 0 8px 30px rgba(99, 102, 241, 0.08); }
.api-card.method-put:hover { border-color: rgba(245, 158, 11, 0.25); box-shadow: 0 8px 30px rgba(245, 158, 11, 0.08); }
.api-card.method-delete:hover { border-color: rgba(239, 68, 68, 0.25); box-shadow: 0 8px 30px rgba(239, 68, 68, 0.08); }
.api-card.method-patch:hover { border-color: rgba(139, 92, 246, 0.25); box-shadow: 0 8px 30px rgba(139, 92, 246, 0.08); }

/* Subtle top-right glow blob on hover */
.api-card::after {
  content: '';
  position: absolute;
  top: -40px;
  right: -40px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: var(--color-accent-soft);
  opacity: 0;
  transition: opacity var(--transition-slow);
  pointer-events: none;
}

.api-card:hover::after {
  opacity: 0.5;
}

/* ---- Card Content ---- */
.api-card-header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.api-method-badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  font-size: 0.68rem;
  font-weight: 700;
  font-family: var(--font-mono);
  letter-spacing: 0.04em;
  border-radius: var(--radius-sm);
  text-transform: uppercase;
  line-height: 1.4;
}

.api-method-badge.get {
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
  border: 1px solid rgba(16, 185, 129, 0.2);
}
.api-method-badge.post {
  background: rgba(99, 102, 241, 0.1);
  color: #4f46e5;
  border: 1px solid rgba(99, 102, 241, 0.2);
}
.api-method-badge.put {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
  border: 1px solid rgba(245, 158, 11, 0.2);
}
.api-method-badge.delete {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
  border: 1px solid rgba(239, 68, 68, 0.2);
}
.api-method-badge.patch {
  background: rgba(139, 92, 246, 0.1);
  color: #7c3aed;
  border: 1px solid rgba(139, 92, 246, 0.2);
}

[data-theme="dark"] .api-method-badge.get { color: #34d399; }
[data-theme="dark"] .api-method-badge.post { color: #818cf8; }
[data-theme="dark"] .api-method-badge.put { color: #fbbf24; }
[data-theme="dark"] .api-method-badge.delete { color: #f87171; }
[data-theme="dark"] .api-method-badge.patch { color: #a78bfa; }

.api-state-badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  font-size: 0.68rem;
  font-weight: 600;
  border-radius: var(--radius-full);
  background: var(--color-accent-soft);
  color: var(--color-accent);
}

.api-name {
  font-size: 1.05rem;
  font-weight: 700;
  margin: 0;
  color: var(--color-text-primary);
  letter-spacing: -0.01em;
  line-height: 1.3;
}

.api-desc {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  margin: 0;
  line-height: 1.65;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.api-address-bar {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: 8px 12px;
  background: var(--color-bg-soft);
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-size: 0.76rem;
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
  transition: all var(--transition-fast);
  overflow: hidden;
  position: relative;
  z-index: 1;
}

.api-address-bar:hover {
  border-color: var(--color-accent-soft);
  background: var(--color-bg-card);
}

.api-address-bar .url-text {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.api-address-bar .copy-hint {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-tertiary);
  opacity: 0;
  transition: opacity var(--transition-fast);
  flex-shrink: 0;
}

.api-address-bar:hover .copy-hint {
  opacity: 1;
}

/* ---- Empty State ---- */
.empty-state {
  text-align: center;
  padding: var(--space-20) var(--space-6);
}

.empty-state h3 {
  font-size: 1.15rem;
  font-weight: 600;
  margin: 0 0 var(--space-2);
  color: var(--color-text-primary);
}

.empty-state p {
  color: var(--color-text-secondary);
  margin: 0;
}

/* =============================================
   Test Dialog - Postman-style Redesign
   ============================================= */

/* Override Element Plus dialog styles via deep selector */
:deep(.el-dialog) {
  border-radius: var(--radius-lg) !important;
  background: var(--color-bg-elevated) !important;
  backdrop-filter: blur(24px) !important;
  -webkit-backdrop-filter: blur(24px) !important;
  border: 1px solid var(--color-border) !important;
  box-shadow: var(--shadow-xl) !important;
  overflow: hidden !important;
}

:deep(.el-dialog__header) {
  padding: var(--space-5) var(--space-6) !important;
  margin: 0 !important;
  border-bottom: 1px solid var(--color-border);
}

:deep(.el-dialog__title) {
  font-size: 1.05rem !important;
  font-weight: 700 !important;
  color: var(--color-text-primary) !important;
  letter-spacing: -0.01em !important;
}

:deep(.el-dialog__headerbtn) {
  top: 16px !important;
  right: 16px !important;
  width: 32px !important;
  height: 32px !important;
  font-size: 1rem !important;
}

:deep(.el-dialog__body) {
  padding: 0 !important;
}

/* Dialog inner container */
.test-dialog-body {
  display: flex;
  flex-direction: column;
  max-height: 65vh;
  overflow-y: auto;
}

/* ---- Request Builder Section ---- */
.request-builder {
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

/* URL Bar (Postman-style inline method + URL) */
.url-bar {
  display: flex;
  align-items: stretch;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  overflow: hidden;
  transition: all var(--transition-fast);
}

.url-bar:focus-within {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px var(--color-accent-soft);
}

.url-bar .method-select {
  width: 120px;
  flex-shrink: 0;
}

.url-bar .method-select :deep(.el-input__wrapper) {
  border-radius: 0 !important;
  border: none !important;
  border-right: 1px solid var(--color-border) !important;
  box-shadow: none !important;
  background: var(--color-bg-soft) !important;
}

.url-bar .url-input {
  flex: 1;
}

.url-bar .url-input :deep(.el-input__wrapper) {
  border-radius: 0 !important;
  border: none !important;
  box-shadow: none !important;
  background: var(--color-bg-card) !important;
}

.url-bar .url-input :deep(.el-input__inner) {
  font-family: var(--font-mono) !important;
  font-size: 0.85rem !important;
}

.url-bar .send-btn-wrapper {
  flex-shrink: 0;
}

.send-request-btn {
  height: 100%;
  padding: 0 24px;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  border: none;
  border-radius: 0;
  background: linear-gradient(135deg, var(--color-accent), #7c3aed);
  color: white;
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.send-request-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--color-accent-hover), #8b5cf6);
  box-shadow: 0 4px 16px var(--color-accent-glow);
}

.send-request-btn:active:not(:disabled) {
  transform: scale(0.97);
}

.send-request-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ---- Collapsible Sections ---- */
.params-section {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.section-toggle {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  width: 100%;
  padding: 10px 14px;
  border: none;
  background: var(--color-bg-soft);
  color: var(--color-text-secondary);
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.section-toggle:hover {
  color: var(--color-text-primary);
  background: var(--color-bg-card);
}

.section-toggle i {
  font-size: 0.6rem;
  transition: transform var(--transition-fast);
}

.section-toggle.open i {
  transform: rotate(90deg);
}

.section-body {
  padding: var(--space-3);
  display: flex;
  flex-direction: column;
  gap: 6px;
  background: var(--color-bg-card);
}

.kv-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.kv-row :deep(.el-input__wrapper) {
  box-shadow: none !important;
  background: var(--color-bg-soft) !important;
  border: 1px solid var(--color-border) !important;
  transition: all var(--transition-fast) !important;
}

.kv-row :deep(.el-input__wrapper:hover) {
  border-color: var(--color-accent-soft) !important;
}

.kv-row :deep(.el-input__wrapper.is-focus) {
  border-color: var(--color-accent) !important;
  box-shadow: 0 0 0 2px var(--color-accent-soft) !important;
}

.kv-remove-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-bg-soft);
  color: var(--color-text-tertiary);
  cursor: pointer;
  flex-shrink: 0;
  transition: all var(--transition-fast);
  font-size: 0.85rem;
}

.kv-remove-btn:hover {
  border-color: var(--color-danger);
  color: var(--color-danger);
  background: rgba(239, 68, 68, 0.06);
}

.add-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--color-text-tertiary);
  cursor: pointer;
  transition: all var(--transition-fast);
  width: fit-content;
}

.add-btn:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
  background: var(--color-accent-soft);
}

/* Body textarea */
.body-section {
  margin-top: var(--space-2);
}

.body-section :deep(.el-textarea__inner) {
  background: var(--color-bg-soft) !important;
  border: 1px solid var(--color-border) !important;
  font-family: var(--font-mono) !important;
  font-size: 0.82rem !important;
  border-radius: var(--radius-md) !important;
  resize: vertical;
  transition: all var(--transition-fast);
}

.body-section :deep(.el-textarea__inner:focus) {
  border-color: var(--color-accent) !important;
  box-shadow: 0 0 0 2px var(--color-accent-soft) !important;
}

/* ---- Response Panel ---- */
.response-panel {
  border-top: 1px solid var(--color-border);
}

.response-status-bar {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: 10px 16px;
  background: var(--color-bg-soft);
  border-bottom: 1px solid var(--color-border);
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-dot.success { background: #10b981; box-shadow: 0 0 6px rgba(16, 185, 129, 0.4); }
.status-dot.error { background: #ef4444; box-shadow: 0 0 6px rgba(239, 68, 68, 0.4); }
.status-dot.info { background: var(--color-accent); box-shadow: 0 0 6px var(--color-accent-glow); }

.status-code {
  font-size: 0.85rem;
  font-weight: 700;
  font-family: var(--font-mono);
  color: var(--color-text-primary);
}

.status-text {
  font-size: 0.78rem;
  color: var(--color-text-secondary);
}

.response-time {
  margin-left: auto;
  font-size: 0.78rem;
  font-family: var(--font-mono);
  color: var(--color-text-tertiary);
  display: flex;
  align-items: center;
  gap: 4px;
}

.response-time .time-value {
  color: var(--color-text-secondary);
  font-weight: 600;
}

.response-actions {
  display: flex;
  gap: var(--space-1);
}

.response-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 4px 10px;
  font-size: 0.72rem;
  font-weight: 500;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.response-action-btn:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
  background: var(--color-accent-soft);
}

.response-headers-panel {
  padding: var(--space-3) var(--space-4);
  background: var(--color-bg-soft);
  border-bottom: 1px solid var(--color-border);
}

.response-headers-panel pre {
  margin: 0;
  font-size: 0.75rem;
  font-family: var(--font-mono);
  color: var(--color-text-secondary);
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 140px;
  overflow-y: auto;
}

.response-body {
  padding: var(--space-4);
  background: var(--color-bg-soft);
  max-height: 320px;
  overflow: auto;
}

.response-body pre {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.82rem;
  color: var(--color-text-primary);
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.6;
}

.response-body pre.error-text {
  color: var(--color-danger);
}

/* ---- Dialog transition ---- */
.test-dialog-fade-enter-active {
  transition: all 300ms cubic-bezier(0.16, 1, 0.3, 1);
}

.test-dialog-fade-leave-active {
  transition: all 200ms cubic-bezier(0.16, 1, 0.3, 1);
}

.test-dialog-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.test-dialog-fade-leave-to {
  opacity: 0;
}

/* ---- Responsive ---- */
@media (max-width: 768px) {
  .api-grid {
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }

  .apis-header .section-header h2 {
    font-size: 1.55rem;
  }

  .url-bar {
    flex-wrap: wrap;
  }

  .url-bar .method-select {
    width: 100px;
  }

  .send-request-btn {
    padding: 10px 16px;
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .api-grid {
    grid-template-columns: 1fr;
    gap: var(--space-3);
  }

  .api-card {
    padding: var(--space-4);
  }

  .url-bar {
    flex-direction: column;
  }

  .url-bar .method-select {
    width: 100%;
  }

  .url-bar .method-select :deep(.el-input__wrapper) {
    border-right: none !important;
    border-bottom: 1px solid var(--color-border) !important;
  }

  .send-request-btn {
    width: 100%;
    border-radius: 0 0 var(--radius-md) var(--radius-md);
  }
}
</style>

<template>
  <div class="apis-page">
    <!-- Header -->
    <div class="apis-header">
      <div class="section-header">
        <h2>公共 API</h2>
        <p>探索和使用开放的 API 接口，点击卡片即可在线测试</p>
      </div>
      <div class="search-bar">
        <span class="search-icon-wrapper"><i class="bi bi-search"></i></span>
        <input v-model="searchText" placeholder="搜索 API 名称或描述..." @input="filterList" />
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="empty-state">
      <div class="loading-ring" style="margin: 0 auto 12px"></div>
      <p>加载中...</p>
    </div>

    <!-- API Grid -->
    <div v-else class="api-grid">
      <div
        v-for="item in list"
        :key="item.id"
        class="api-card"
        :class="'method-' + (item.method || 'get').toLowerCase()"
        @click="openTest(item)"
      >
        <!-- Header: badges -->
        <div class="api-card-header">
          <span
            v-if="item.method"
            class="api-method-badge"
            :class="item.method.toLowerCase()"
          >{{ item.method }}</span>
          <span v-if="item.state" class="api-state-badge">{{ item.state }}</span>
        </div>

        <!-- Name -->
        <h3 class="api-name">{{ item.name }}</h3>

        <!-- Description -->
        <p class="api-desc">{{ item.desc }}</p>

        <!-- Address bar -->
        <div class="api-address-bar" @click.stop="copyApi(item.address)">
          <i class="bi bi-link-45deg" style="font-size:0.8rem;flex-shrink:0;color:var(--color-text-tertiary);"></i>
          <span class="url-text">{{ item.address }}</span>
          <span class="copy-hint">点击复制</span>
        </div>
      </div>
    </div>

    <!-- Empty -->
    <div v-if="!isLoading && list.length === 0" class="empty-state">
      <h3>没有找到 API</h3>
      <p>尝试其他关键词搜索</p>
    </div>

    <!-- Test Dialog -->
    <el-dialog
      v-model="testDialogVisible"
      :title="'API 测试 - ' + testApiName"
      width="780"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <div class="test-dialog-body">
        <!-- Request Builder -->
        <div class="request-builder">
          <!-- URL Bar: Method + URL + Send -->
          <div class="url-bar">
            <div class="method-select">
              <el-select v-model="testMethod" style="width:100%">
                <el-option v-for="m in methodOptions" :key="m" :value="m" :label="m" />
              </el-select>
            </div>
            <div class="url-input">
              <el-input v-model="testUrl" placeholder="https://api.example.com/endpoint" />
            </div>
            <div class="send-btn-wrapper">
              <button class="send-request-btn" :disabled="testLoading" @click="sendTestRequest">
                <span v-if="testLoading">
                  <i class="bi bi-arrow-repeat" style="display:inline-block;animation:loading-spin 0.8s linear infinite;"></i>
                  发送中...
                </span>
                <span v-else>
                  <i class="bi bi-send-fill"></i> 发送
                </span>
              </button>
            </div>
          </div>

          <!-- Query Parameters -->
          <div class="params-section">
            <button
              class="section-toggle"
              :class="{ open: showParams }"
              @click="showParams = !showParams"
            >
              <i class="bi bi-chevron-right"></i>
              Query 参数
              <span style="font-weight:400;font-size:0.72rem;margin-left:auto;color:var(--color-text-tertiary);">
                {{ testParams.filter(p => p.key).length }} 个
              </span>
            </button>
            <div v-if="showParams" class="section-body">
              <div v-for="(p, i) in testParams" :key="'p'+i" class="kv-row">
                <el-input v-model="p.key" placeholder="参数名" style="flex:1" size="small" />
                <el-input v-model="p.value" placeholder="参数值" style="flex:1" size="small" />
                <button class="kv-remove-btn" @click="testParams.splice(i, 1)" title="移除">
                  <i class="bi bi-x"></i>
                </button>
              </div>
              <button class="add-btn" @click="testParams.push({ key: '', value: '' })">
                <i class="bi bi-plus"></i> 添加参数
              </button>
            </div>
          </div>

          <!-- Headers -->
          <div class="params-section">
            <button
              class="section-toggle"
              :class="{ open: showHeaders }"
              @click="showHeaders = !showHeaders"
            >
              <i class="bi bi-chevron-right"></i>
              Headers
              <span style="font-weight:400;font-size:0.72rem;margin-left:auto;color:var(--color-text-tertiary);">
                {{ testHeaders.filter(h => h.key).length }} 个
              </span>
            </button>
            <div v-if="showHeaders" class="section-body">
              <div v-for="(h, i) in testHeaders" :key="'h'+i" class="kv-row">
                <el-input v-model="h.key" placeholder="Header 名" style="flex:1" size="small" />
                <el-input v-model="h.value" placeholder="Header 值" style="flex:1" size="small" />
                <button class="kv-remove-btn" @click="testHeaders.splice(i, 1)" title="移除">
                  <i class="bi bi-x"></i>
                </button>
              </div>
              <button class="add-btn" @click="testHeaders.push({ key: '', value: '' })">
                <i class="bi bi-plus"></i> 添加 Header
              </button>
            </div>
          </div>

          <!-- Request Body (only for methods that support body) -->
          <div v-if="['POST', 'PUT', 'PATCH'].includes(testMethod)" class="body-section">
            <el-input
              v-model="testBody"
              type="textarea"
              :rows="5"
              placeholder='{"key": "value"}'
            />
          </div>
        </div>

        <!-- Response Panel -->
        <div v-if="testResponse" class="response-panel">
          <!-- Status bar -->
          <div class="response-status-bar">
            <div class="status-indicator">
              <span
                class="status-dot"
                :class="testResponse.status < 400 ? 'success' : 'error'"
              ></span>
              <span class="status-code">{{ testResponse.status }}</span>
              <span class="status-text">{{ testResponse.statusText }}</span>
            </div>
            <div class="response-time">
              <i class="bi bi-clock" style="font-size:0.7rem;"></i>
              <span class="time-value">{{ testResponse.time }}</span> ms
            </div>
            <div class="response-actions">
              <button class="response-action-btn" @click="showRespHeaders = !showRespHeaders">
                <i :class="showRespHeaders ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                {{ showRespHeaders ? '隐藏头' : '头信息' }}
              </button>
              <button class="response-action-btn" @click="copyResponseText()">
                <i class="bi bi-clipboard"></i> 复制
              </button>
            </div>
          </div>

          <!-- Response headers (collapsible) -->
          <div v-if="showRespHeaders" class="response-headers-panel">
            <pre>{{ JSON.stringify(testResponse.headers, null, 2) }}</pre>
          </div>

          <!-- Response body -->
          <div class="response-body">
            <pre :class="{ 'error-text': testResponse.error }">{{ testResponse.error || testResponse.data }}</pre>
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

const list = ref([])
const rawList = ref([])
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
  list.value = rawList.value.filter((item: any) =>
    (item.name && item.name.toLowerCase().includes(t)) ||
    (item.desc && item.desc.toLowerCase().includes(t))
  )
}

function openTest(item: any) {
  testApiName.value = item.name
  testMethod.value = item.method || 'GET'
  const parsed = parseAddress(item.address)
  testUrl.value = parsed.url
  testParams.value = parsed.params.length ? parsed.params : [{ key: '', value: '' }]
  testHeaders.value = [{ key: '', value: '' }]
  testBody.value = ''
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
    const res = await publicClient.get("/api/list")
    rawList.value = res
    list.value = [...rawList.value]
  } catch { ElMessage.error('加载API列表失败') }
  finally { isLoading.value = false }
})
</script>
