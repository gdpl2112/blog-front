<style scoped>
.ai-page {
  max-width: var(--max-width);
  margin: 0 auto;
  height: calc(100vh - var(--nav-height) - var(--space-8));
  min-height: 600px;
}

.ai-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: var(--space-4);
  height: 100%;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

/* Sidebar */
.ai-sidebar {
  background: var(--color-bg-soft);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4);
  border-bottom: 1px solid var(--color-border);
}

.sidebar-header h3 {
  font-size: 0.875rem;
  font-weight: 700;
  margin: 0;
  color: var(--color-text-primary);
}

.sidebar-count {
  font-size: 0.75rem;
  color: var(--color-text-tertiary);
  background: var(--color-bg);
  padding: 2px 8px;
  border-radius: var(--radius-full);
}

.session-list {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-2);
}

.session-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
  margin-bottom: 2px;
}

.session-item:hover {
  background: var(--color-accent-soft);
}

.session-item.active {
  background: var(--color-accent);
  color: white;
}

.session-item.active .session-meta {
  color: rgba(255,255,255,0.7);
}

.session-title {
  font-size: 0.8rem;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.session-meta {
  font-size: 0.7rem;
  color: var(--color-text-tertiary);
  margin-top: 2px;
}

.session-del {
  opacity: 0;
  transition: opacity var(--transition-fast);
  border: none;
  background: none;
  color: inherit;
  cursor: pointer;
  padding: 4px;
  font-size: 0.8rem;
}

.session-item:hover .session-del {
  opacity: 0.6;
}

.session-item:hover .session-del:hover {
  opacity: 1;
}

.sidebar-collapsed {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-3);
  cursor: pointer;
  color: var(--color-text-tertiary);
  font-size: 1.2rem;
  border-right: 1px solid var(--color-border);
  background: var(--color-bg-soft);
  transition: all var(--transition-fast);
}

.sidebar-collapsed:hover {
  color: var(--color-accent);
  background: var(--color-accent-soft);
}

/* Main chat area */
.chat-main {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4);
  border-bottom: 1px solid var(--color-border);
}

.chat-header h4 {
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0;
  color: var(--color-text-primary);
}

.chat-header small {
  color: var(--color-text-tertiary);
  font-size: 0.75rem;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-3) var(--space-2);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.message-row {
  display: flex;
  gap: var(--space-2);
  max-width: 92%;
}

.message-row.user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message-avatar {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  flex-shrink: 0;
  color: white;
}

.avatar-assistant {
  background: var(--color-accent);
}

.avatar-user {
  background: var(--color-success);
}

.message-bubble {
  padding: 8px 12px;
  border-radius: var(--radius-md);
  font-size: 0.8rem;
  line-height: 1.55;
  min-width: 60px;
}

.bubble-assistant {
  background: var(--color-bg-soft);
  color: var(--color-text-primary);
}

.bubble-user {
  background: var(--color-accent);
  color: white;
}

.message-actions {
  display: flex;
  gap: var(--space-1);
  margin-top: var(--space-1);
  justify-content: flex-end;
}

.message-action-btn {
  border: none;
  background: none;
  color: var(--color-text-tertiary);
  font-size: 0.75rem;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.message-action-btn:hover {
  color: var(--color-accent);
  background: var(--color-accent-soft);
}

.message-time {
  font-size: 0.7rem;
  color: var(--color-text-tertiary);
}

/* Empty state */
.empty-chat {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-8);
  text-align: center;
}

.empty-chat-icon {
  font-size: 2.5rem;
  margin-bottom: var(--space-4);
}

.empty-chat h5 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 var(--space-2);
  color: var(--color-text-primary);
}

.empty-chat p {
  color: var(--color-text-secondary);
  font-size: 0.85rem;
  margin: 0 0 var(--space-6);
  max-width: 36ch;
}

.quick-prompts {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  justify-content: center;
}

.quick-prompt-btn {
  padding: 7px 14px;
  font-size: 0.8rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  background: var(--color-bg-card);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.quick-prompt-btn:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

/* Input area */
.chat-input-area {
  padding: var(--space-4);
  border-top: 1px solid var(--color-border);
  background: var(--color-bg-card);
}

.format-toolbar {
  display: flex;
  gap: var(--space-1);
  margin-bottom: var(--space-3);
  flex-wrap: wrap;
}

.format-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-bg-card);
  color: var(--color-text-tertiary);
  cursor: pointer;
  transition: all var(--transition-fast);
  font-size: 0.85rem;
}

.format-btn:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.format-hint {
  font-size: 0.7rem;
  color: var(--color-text-tertiary);
  align-self: center;
  margin-left: auto;
}

.input-row {
  display: flex;
  gap: var(--space-2);
}

.input-row textarea {
  flex: 1;
  padding: 10px 14px;
  font-size: 0.85rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg);
  color: var(--color-text-primary);
  resize: none;
  outline: none;
  transition: all var(--transition-fast);
  font-family: inherit;
}

.input-row textarea:focus {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px var(--color-accent-soft);
}

.send-btn {
  padding: 10px 20px;
  border: none;
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.send-btn.send {
  background: var(--color-accent);
  color: white;
}

.send-btn.send:hover {
  background: var(--color-accent-hover);
}

.send-btn.stop {
  background: var(--color-danger);
  color: white;
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.image-row {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
  margin-bottom: var(--space-2);
}

.image-attachment {
  position: relative;
  width: 64px;
  height: 64px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  border: 1px solid var(--color-border);
}

.image-attachment img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-remove {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 18px;
  height: 18px;
  border: none;
  border-radius: 50%;
  background: rgba(239,68,68,0.9);
  color: white;
  font-size: 0.6rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Overlay / modal */
.overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
}

.overlay-content {
  background: var(--color-bg-elevated);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  max-width: 720px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
}

.overlay-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-4);
}

.overlay-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
}

.overlay-close {
  border: none;
  background: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: var(--color-text-tertiary);
}

/* Image upload */
.image-upload-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: 4px 10px;
  font-size: 0.8rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text-tertiary);
  cursor: pointer;
  transition: all var(--transition-fast);
  background: var(--color-bg-card);
}

.image-upload-btn:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

@media (max-width: 768px) {
  .ai-layout { grid-template-columns: 1fr; }
  .ai-sidebar { display: none; }
  .message-row { max-width: 95%; }
}

/* Dark mode overrides for markdown */
:deep(.md-editor-preview) {
  background: transparent !important;
  color: inherit;
  font-size: 0.8rem !important;
  line-height: 1.55 !important;
}

/* 缩小 markdown 内部各级字号 */
:deep(.md-editor-preview h1) { font-size: 1.2rem !important; }
:deep(.md-editor-preview h2) { font-size: 1.1rem !important; }
:deep(.md-editor-preview h3) { font-size: 1rem !important; }
:deep(.md-editor-preview h4) { font-size: 0.95rem !important; }
:deep(.md-editor-preview h5) { font-size: 0.9rem !important; }
:deep(.md-editor-preview h6) { font-size: 0.85rem !important; }
:deep(.md-editor-preview p) { font-size: 0.8rem !important; }
:deep(.md-editor-preview li) { font-size: 0.8rem !important; }
:deep(.md-editor-preview code) { font-size: 0.75rem !important; }
:deep(.md-editor-preview pre) { font-size: 0.75rem !important; }
:deep(.md-editor-preview blockquote) { font-size: 0.8rem !important; }
:deep(.md-editor-preview table) { font-size: 0.8rem !important; }
</style>

<template>
  <div class="ai-page">
    <div class="ai-layout">
      <!-- Sidebar (collapsible) -->
      <aside v-if="!isSessionSidebarCollapsed" class="ai-sidebar">
        <div class="sidebar-header">
          <h3>会话历史</h3>
          <div style="display:flex;align-items:center;gap:var(--space-2);">
            <span class="sidebar-count">{{ sessions.length }}</span>
            <button class="btn-modern btn-modern-primary" @click="addSession" style="padding:4px 10px;font-size:0.75rem;">
              <i class="bi bi-plus"></i> 新建
            </button>
          </div>
        </div>
        <div class="session-list">
          <div v-for="session in sessions" :key="session.id"
               :class="['session-item', { active: currentSessionId === session.id }]"
               @click="switchSession(session.id)">
            <div style="flex:1;min-width:0;">
              <div class="session-title">{{ session.title || (session.title_temp || '新会话') }}</div>
              <div class="session-meta">{{ session.messages.length }} 条消息</div>
            </div>
            <button v-if="sessions.length > 1" class="session-del" @click.stop="confirmDeleteSession(session.id)">
              <i class="bi bi-x"></i>
            </button>
          </div>
        </div>
      </aside>

      <!-- Collapsed toggle -->
      <div v-else class="sidebar-collapsed" @click="toggleSessionSidebar" title="展开会话历史">
        <i class="bi bi-layout-sidebar-inset"></i>
      </div>

      <!-- Chat main -->
      <div class="chat-main">
        <div class="chat-header">
          <div>
            <h4>{{ currentSession?.title || (currentSession?.title_temp || '新会话') }}</h4>
            <small>{{ currentSession?.messages.length || 0 }} 条消息 · 会话历史最长保存7日</small>
          </div>
          <div style="display:flex;gap:var(--space-2);">
            <button class="btn-modern btn-modern-ghost" @click="toggleSessionSidebar" style="padding:4px 10px;font-size:0.8rem;" title="切换侧栏">
              <i class="bi bi-layout-sidebar"></i>
            </button>
            <button class="btn-modern btn-modern-ghost" @click="confirmClearSession" style="padding:4px 10px;font-size:0.8rem;color:var(--color-danger);" title="清空会话">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>

        <div class="chat-messages" ref="chatHistory">
          <!-- Empty state -->
          <div v-if="messages.length === 0" class="empty-chat">
            <div class="empty-chat-icon">🤖</div>
            <h5>开始新的对话</h5>
            <p>输入您的问题，AI助手将为您提供帮助。</p>
            <div class="quick-prompts">
              <button v-for="prompt in quickPrompts" :key="prompt" class="quick-prompt-btn" @click="useQuickPrompt(prompt)">
                {{ prompt }}
              </button>
            </div>
          </div>

          <!-- Messages -->
          <div v-for="(message, index) in messages" :key="index"
               :class="['message-row', message.role === 'user' ? 'user' : '']">
            <div :class="['message-avatar', message.role === 'assistant' ? 'avatar-assistant' : 'avatar-user']">
              <i :class="message.role === 'assistant' ? 'bi bi-robot' : 'bi bi-person'"></i>
            </div>
            <div>
              <div :class="['message-bubble', message.role === 'assistant' ? 'bubble-assistant' : 'bubble-user']">
                <MdPreview v-if="message.role === 'assistant'" :modelValue="message.content" />
                <div v-else style="white-space:pre-wrap;">{{ message.content }}</div>
                <div v-if="message.images && message.images.length > 0" style="display:flex;gap:8px;margin-top:8px;flex-wrap:wrap;">
                  <a v-for="(img, ii) in message.images" :key="ii" :href="imageDisplaySrc(img)" target="_blank">
                    <img :src="imageDisplaySrc(img)" style="max-width:120px;border-radius:6px;" />
                  </a>
                </div>
              </div>
              <div class="message-actions">
                <span class="message-time">{{ formatMessageTime(message) }}</span>
                <button class="message-action-btn" @click="copyMessageContent(message.content)" title="复制">
                  <i class="bi bi-clipboard"></i>
                </button>
                <button class="message-action-btn" @click="showFullScreenMessage(message)" title="全屏">
                  <i class="bi bi-arrows-fullscreen"></i>
                </button>
                <button v-if="message.role === 'user' && !isLoading && canEditOrDeleteMessage(message)"
                        class="message-action-btn" @click="editMessage(message, index)" title="编辑">
                  <i class="bi bi-pen"></i>
                </button>
                <button v-if="message.role === 'user' && !isLoading && canEditOrDeleteMessage(message)"
                        class="message-action-btn" @click="confirmDeleteMessage(message, index)" title="删除">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Loading indicator -->
          <div v-if="thinkingContent" class="message-row">
            <div class="message-avatar avatar-assistant"><i class="bi bi-robot"></i></div>
            <div class="message-bubble bubble-assistant" style="display:flex;align-items:center;gap:8px;">
              <div class="loading-ring" style="width:16px;height:16px;border-width:2px;"></div>
              <span style="color:var(--color-text-tertiary);font-size:0.85rem;">{{ thinkingContent || '思考中...' }}</span>
            </div>
          </div>

          <!-- Load more -->
          <div v-if="hasMoreMessages" style="text-align:center;padding:8px;">
            <button class="btn-modern" @click="loadMoreMessages" style="padding:6px 16px;font-size:0.8rem;">加载更多</button>
          </div>
        </div>

        <!-- Input area -->
        <div class="chat-input-area">
          <div class="format-toolbar">
            <button class="format-btn" @click="formatText('**')" title="粗体"><i class="bi bi-type-bold"></i></button>
            <button class="format-btn" @click="formatText('*')" title="斜体"><i class="bi bi-type-italic"></i></button>
            <button class="format-btn" @click="formatText('```\n\n```')" title="代码块"><i class="bi bi-code"></i></button>
            <button class="format-btn" @click="formatText('>')" title="引用"><i class="bi bi-chat-square-quote"></i></button>
            <button class="format-btn" @click="formatText('[链接文字](https://)')" title="链接"><i class="bi bi-link-45deg"></i></button>
            <span class="format-hint">Enter 发送，Shift+Enter 换行</span>
          </div>

          <div class="image-row">
            <div v-for="item in imageAttachments" :key="item.id" class="image-attachment">
              <img :src="item.dataUrl" :alt="item.name" />
              <button class="image-remove" @click="removeImageAttachment(item.id)">×</button>
            </div>
          </div>

          <div class="input-row">
            <textarea v-model="userInput"
                      @paste="handleImagePaste"
                      @keydown.enter.exact.prevent="sendMessage"
                      @keydown.enter.shift.exact.prevent="userInput += '\n'"
                      placeholder="输入您的问题..."
                      :disabled="isLoading || !login_state"
                      rows="2"
                      ref="textareaRef"></textarea>
            <button :class="['send-btn', isLoading ? 'stop' : 'send']"
                    @click="isLoading ? stopStreaming() : sendMessage()"
                    :disabled="(!canSendMessage && !isLoading) || !login_state">
              <span v-if="isLoading"><i class="bi bi-stop-circle"></i> 停止</span>
              <span v-else><i class="bi bi-send"></i></span>
            </button>
          </div>

          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;">
            <button class="image-upload-btn" :disabled="isLoading || !login_state" @click="triggerImageUpload">
              <i class="bi bi-image"></i> 图片
            </button>
            <input ref="imageFileInputRef" type="file" accept="image/*" multiple class="d-none" :disabled="isLoading || !login_state" @change="handleImageFileChange" />
            <div>
              <span v-if="!login_state" style="font-size:0.75rem;color:var(--color-danger);">
                请先 <router-link to="/login" style="color:var(--color-accent);">登录</router-link>
              </span>
              <span v-else style="font-size:0.75rem;color:var(--color-text-tertiary);">{{ userInput.length }} 字符</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Fullscreen -->
    <div v-if="isFullScreenMode" class="overlay" @click.self="exitFullScreenMode">
      <div class="overlay-content">
        <div class="overlay-header">
          <h3>{{ fullScreenMessage?.role === 'assistant' ? 'AI 回复' : '我的消息' }}</h3>
          <button class="overlay-close" @click="exitFullScreenMode"><i class="bi bi-x-lg"></i></button>
        </div>
        <MdPreview :modelValue="fullScreenMessage?.content || ''" />
        <div v-if="fullScreenMessage?.images && fullScreenMessage.images.length > 0" style="margin-top:16px;">
          <div style="display:flex;gap:12px;flex-wrap:wrap;">
            <a v-for="(img, ii) in fullScreenMessage.images" :key="ii" :href="imageDisplaySrc(img)" target="_blank">
              <img :src="imageDisplaySrc(img)" style="max-width:200px;border-radius:8px;" />
            </a>
          </div>
        </div>
        <div style="display:flex;justify-content:space-between;margin-top:16px;">
          <span style="font-size:0.8rem;color:var(--color-text-tertiary);">{{ fullScreenMessage ? formatMessageTime(fullScreenMessage) : '' }}</span>
          <button class="btn-modern" @click="copyMessageContent(fullScreenMessage?.content || '')" style="padding:6px 14px;font-size:0.8rem;">
            <i class="bi bi-clipboard"></i> 复制
          </button>
        </div>
      </div>
    </div>

    <!-- Confirm dialog -->
    <div v-if="showConfirmDialog" class="overlay">
      <div class="overlay-content" style="max-width:400px;">
        <h4 style="margin:0 0 12px;">{{ confirmTitle }}</h4>
        <p style="margin:0 0 20px;color:var(--color-text-secondary);">{{ confirmMessage }}</p>
        <div style="display:flex;gap:8px;justify-content:flex-end;">
          <button class="btn-modern" @click="showConfirmDialog = false">取消</button>
          <button class="btn-modern" style="background:var(--color-danger);color:white;border-color:var(--color-danger);" @click="handleConfirmAction">确认</button>
        </div>
      </div>
    </div>

    <!-- Edit dialog -->
    <div v-if="editingMessage" class="overlay">
      <div class="overlay-content" style="max-width:600px;">
        <h4 style="margin:0 0 12px;">编辑消息</h4>
        <textarea v-model="editMessageContent" style="width:100%;padding:12px;border:1px solid var(--color-border);border-radius:var(--radius-md);font-size:0.9rem;resize:vertical;min-height:100px;" rows="4"></textarea>
        <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:16px;">
          <button class="btn-modern" @click="cancelEditMessage">取消</button>
          <button class="btn-modern btn-modern-primary" @click="saveEditedMessage">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, nextTick, onBeforeUnmount, onMounted, ref, watch} from "vue";
import {toast} from "@/utils/utils";
import service, {login_state} from "@/axios";
import router from "@/router";
import {MdPreview} from "md-editor-v3";
import Cookie from "js-cookie";

interface MessageImage { src: string; mimeType: string; }
interface Message { role: 'user' | 'assistant'; content: string; timestamp?: number; edited?: boolean; images?: MessageImage[]; }
interface Session { id: string; title: string; title_temp: string; messages: Message[]; lastUpdated?: number; }
interface ImageObjectInput { url?: string; }

const sessions = ref<Session[]>([]);
const currentSessionId = ref<string>('');
const userInput = ref('');
const messages = ref<Message[]>([]);
const isLoading = ref(false);
const thinkingContent = ref('');
const isSessionSidebarCollapsed = ref(false);
const chatHistory = ref<HTMLElement | null>(null);
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const hasMoreMessages = ref(false);
const imageAttachments = ref<{id:string;dataUrl:string;name:string;file:File}[]>([]);
const imageFileInputRef = ref<HTMLInputElement | null>(null);
const isFullScreenMode = ref(false);
const fullScreenMessage = ref<Message | null>(null);
const showConfirmDialog = ref(false);
const confirmTitle = ref('');
const confirmMessage = ref('');
const confirmAction = ref<() => void>(() => {});
const editingMessage = ref<Message | null>(null);
const editingMessageIndex = ref(-1);
const editMessageContent = ref('');
const darkMode = ref(false);

const quickPrompts = ["什么是 RESTful API", "帮我写一个冒泡排序", "介绍一下 Vue3 的新特性", "帮我优化这段代码"];

const currentSession = computed(() => sessions.value.find(s => s.id === currentSessionId.value));
const canSendMessage = computed(() => userInput.value.trim().length > 0 || imageAttachments.value.length > 0);

function generateId() { return Date.now().toString(36) + Math.random().toString(36).slice(2,8); }

function getAuthHeaders() {
  return {
    'Token': Cookie.get('token') || '',
    'Authorization': Cookie.get('authorization') || ''
  };
}

function imageDisplaySrc(img: MessageImage): string {
  return (img as any).base64 || img.src;
}
function formatText(wrapper: string) { userInput.value += wrapper; textareaRef.value?.focus(); }
function formatMessageTime(msg: Message) { if (!msg.timestamp) return ''; const d = new Date(msg.timestamp); return `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`; }
function canEditOrDeleteMessage(msg: Message) { return msg.timestamp && (Date.now() - msg.timestamp) < 180000; }
function scrollToBottom() { nextTick(() => { if (chatHistory.value) chatHistory.value.scrollTop = chatHistory.value.scrollHeight; }); }

function toggleSessionSidebar() { isSessionSidebarCollapsed.value = !isSessionSidebarCollapsed.value; }

function addSession() {
  const id = generateId();
  sessions.value.unshift({ id, title: '', title_temp: '新会话', messages: [], lastUpdated: Date.now() });
  currentSessionId.value = id;
  messages.value = [];
  saveSessions();
}

async function switchSession(id: string) {
  currentSessionId.value = id;
  if (isSessionSidebarCollapsed.value) isSessionSidebarCollapsed.value = false;
  // 先从本地缓存加载（如果有），同时从服务端加载最新历史
  const local = currentSession.value?.messages || [];
  messages.value = local.length > 0 ? local : [];
  fetchServerHistory(id);
}

async function fetchServerHistory(chatId: string) {
  try {
    const res = await fetch(`/api/chat/list?chatId=${chatId}`, { headers: getAuthHeaders() });
    if (!res.ok) return;
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      const msgs: Message[] = data.map((m: any) => ({
        role: m.role,
        content: m.content || '',
        timestamp: m.timestamp || Date.now(),
        images: m.images ? m.images.map((img: any) => ({
          src: img.base64 || img.url || '',
          mimeType: img.mimeType || ''
        })) : undefined
      }));
      // 只在当前会话仍是这个 chatId 时更新
      if (currentSessionId.value === chatId) {
        messages.value = msgs;
        // 同步到本地会话
        if (currentSession.value) {
          currentSession.value.messages = msgs;
          // 尝试用第一条用户消息作为标题
          if (!currentSession.value.title) {
            const firstUser = msgs.find(m => m.role === 'user');
            if (firstUser && firstUser.content) {
              currentSession.value.title_temp = firstUser.content.slice(0, 20);
              currentSession.value.title = firstUser.content.slice(0, 20);
            }
          }
        }
        saveSessions();
      }
    }
  } catch {}
}

async function confirmDeleteSession(id: string) {
  confirmTitle.value = '删除会话';
  confirmMessage.value = '确定删除此会话？所有消息将丢失。';
  confirmAction.value = async () => {
    // 调用服务端删除
    try { await fetch(`/api/chat/delete?chatId=${id}`, { headers: getAuthHeaders() }); } catch {}
    const idx = sessions.value.findIndex(s => s.id === id);
    if (idx > -1) sessions.value.splice(idx, 1);
    if (currentSessionId.value === id) {
      if (sessions.value.length > 0) { currentSessionId.value = sessions.value[0].id; messages.value = sessions.value[0].messages; }
      else addSession();
    }
    showConfirmDialog.value = false;
    saveSessions();
  };
  showConfirmDialog.value = true;
}

function confirmClearSession() {
  confirmTitle.value = '清空会话';
  confirmMessage.value = '确定清空当前会话的所有消息？';
  confirmAction.value = () => { if (currentSession.value) { currentSession.value.messages = []; messages.value = []; } showConfirmDialog.value = false; saveSessions(); };
  showConfirmDialog.value = true;
}

async function sendMessage() {
  if (!canSendMessage.value || isLoading.value || !login_state.value) return;
  const text = userInput.value.trim();
  // API 要求图片格式: { base64, mimeType }
  const apiImages = imageAttachments.value.map(a => ({ base64: a.dataUrl, mimeType: a.file.type }));
  // 本地显示用图片
  const localImages: MessageImage[] = imageAttachments.value.map(a => ({ src: a.dataUrl, mimeType: a.file.type }));
  userInput.value = '';
  imageAttachments.value = [];

  const userMsg: Message = { role: 'user', content: text, timestamp: Date.now(), images: localImages.length > 0 ? localImages : undefined };
  messages.value.push(userMsg);
  scrollToBottom();
  isLoading.value = true;
  thinkingContent.value = 'AI正在思考...';

  try {
    const payload: any = {
      chatId: currentSessionId.value,
      q: text
    };
    if (apiImages.length > 0) payload.images = apiImages;
    const res = await fetch('/api/chat/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      throw new Error(errText || `HTTP ${res.status}`);
    }
    const reader = res.body?.getReader();
    if (!reader) throw new Error('No reader');
    const decoder = new TextDecoder();
    let content = '';
    let buffer = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      for (const line of lines) {
        if (!line.trim()) continue;
        if (line.startsWith('data:')) {
          try {
            const json = JSON.parse(line.slice(5).trim());
            if (json.type === 'error') {
              toast(json.content || '未知错误');
              throw new Error(json.content || '服务端错误');
            }
            if (json.type === 'done') continue;
            if (json.type === 'thinking') {
              thinkingContent.value = json.content || '思考中...';
              continue;
            }
            // type === 'content' 或其他带 content 的事件
            if (json.content) {
              content += json.content;
              if (messages.value[messages.value.length - 1]?.role === 'assistant')
                messages.value[messages.value.length - 1].content = content;
              else
                messages.value.push({ role: 'assistant', content, timestamp: Date.now() });
              thinkingContent.value = '';
              scrollToBottom();
            }
          } catch {
            // 非 JSON 行，跳过
          }
        }
      }
    }
    if (currentSession.value && !currentSession.value.title && text.length > 0) {
      currentSession.value.title_temp = text.slice(0, 20);
      currentSession.value.title = text.slice(0, 20);
    }
    saveSessions();
  } catch (e: any) {
    if (e.message !== '服务端错误') {
      toast('发送失败: ' + (e.message || '未知错误'));
    }
  } finally {
    isLoading.value = false;
    thinkingContent.value = '';
    saveSessions();
  }
}

function stopStreaming() { isLoading.value = false; thinkingContent.value = ''; }
function copyMessageContent(content: string) { navigator.clipboard.writeText(content).then(() => toast('已复制', 'success')).catch(() => {}); }
function showFullScreenMessage(msg: Message) { fullScreenMessage.value = msg; isFullScreenMode.value = true; }
function exitFullScreenMode() { isFullScreenMode.value = false; fullScreenMessage.value = null; }
function editMessage(msg: Message, idx: number) { editingMessage.value = msg; editingMessageIndex.value = idx; editMessageContent.value = msg.content; }
function cancelEditMessage() { editingMessage.value = null; editingMessageIndex.value = -1; editMessageContent.value = ''; }
function saveEditedMessage() {
  if (editingMessage.value && editingMessageIndex.value > -1 && editMessageContent.value.trim()) {
    editingMessage.value.content = editMessageContent.value.trim();
    editingMessage.value.edited = true;
    if (currentSession.value) currentSession.value.messages[editingMessageIndex.value] = editingMessage.value;
    saveSessions();
  }
  cancelEditMessage();
}
function confirmDeleteMessage(msg: Message, idx: number) {
  confirmTitle.value = '删除消息';
  confirmMessage.value = '确定删除此消息？';
  confirmAction.value = () => {
    messages.value.splice(idx, 1);
    if (currentSession.value) currentSession.value.messages.splice(idx, 1);
    showConfirmDialog.value = false;
    saveSessions();
  };
  showConfirmDialog.value = true;
}
function handleConfirmAction() { confirmAction.value(); }

function useQuickPrompt(prompt: string) { userInput.value = prompt; textareaRef.value?.focus(); }
function triggerImageUpload() { imageFileInputRef.value?.click(); }
function handleImageFileChange(e: Event) {
  const files = (e.target as HTMLInputElement).files;
  if (!files) return;
  Array.from(files).forEach(file => {
    if (file.size > 300 * 1024) { toast('图片不能超过300KB'); return; }
    const reader = new FileReader();
    reader.onload = () => { imageAttachments.value.push({ id: generateId(), dataUrl: reader.result as string, name: file.name, file }); };
    reader.readAsDataURL(file);
  });
}
function handleImagePaste(e: ClipboardEvent) {
  const items = e.clipboardData?.items;
  if (!items) return;
  Array.from(items).forEach(item => {
    if (item.type.startsWith('image/')) {
      const file = item.getAsFile();
      if (file && file.size <= 300 * 1024) {
        const reader = new FileReader();
        reader.onload = () => { imageAttachments.value.push({ id: generateId(), dataUrl: reader.result as string, name: file.name, file }); };
        reader.readAsDataURL(file);
      }
    }
  });
}
function removeImageAttachment(id: string) { const idx = imageAttachments.value.findIndex(a => a.id === id); if (idx > -1) imageAttachments.value.splice(idx, 1); }

function saveSessions() {
  sessions.value.forEach(s => s.lastUpdated = Date.now());
  try { localStorage.setItem('ai-chat-sessions', JSON.stringify(sessions.value)); } catch {}
}
function loadSessions() {
  try {
    const data = localStorage.getItem('ai-chat-sessions');
    if (data) { sessions.value = JSON.parse(data); }
  } catch {}
}

async function fetchServerChatIds() {
  try {
    const res = await fetch('/api/chat/chatIds', { headers: getAuthHeaders() });
    if (!res.ok) return;
    const ids: string[] = await res.json();
    if (!Array.isArray(ids) || ids.length === 0) return;
    // 合并服务端 ID 到本地会话列表
    const existingIds = new Set(sessions.value.map(s => s.id));
    for (const id of ids) {
      if (!existingIds.has(id)) {
        sessions.value.unshift({ id, title: '', title_temp: '会话 ' + id.slice(-6), messages: [], lastUpdated: Date.now() });
      }
    }
    saveSessions();
    // 如果没有当前会话，切换到第一个
    if (!currentSessionId.value || !existingIds.has(currentSessionId.value)) {
      switchSession(sessions.value[0]?.id || ids[0]);
    }
  } catch {}
}

onMounted(() => {
  loadSessions();
  if (sessions.value.length === 0) addSession();
  if (login_state.value) fetchServerChatIds();
});

function loadMoreMessages() { hasMoreMessages.value = false; }
</script>
