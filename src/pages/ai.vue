<template>
  <div class="container" :class="{ 'dark-mode': isDarkMode }" style="min-height: 92vh;">
    <div class="chat-container">
      <header class="chat-header">
        <div class="header-left">
          <div class="logo-container">
            <div class="logo-icon bg-primary text-white rounded-full p-2">
              <i class="bi bi-robot"></i>
            </div>
            <h1 class="title">小生AI博客智能助手</h1>
          </div>
          <p class="subtitle">高效智能，随时为您服务</p>
        </div>
        <div class="header-right">
          <button class="btn btn-outline-secondary btn-sm" @click="toggleDarkMode">
            <i :class="isDarkMode ? 'bi bi-sun' : 'bi bi-moon'"></i>
          </button>
        </div>
      </header>
      <div class="row">
      <!-- 会话列表侧边栏 -->
      <div class="col-lg-3 col-md-12 mb-3">
        <div class="card" :class="isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-light'">
          <div class="card-header d-flex justify-content-between align-items-center">
            <span class="sidebar-title">会话历史</span>
            <button class="btn btn-sm btn-primary" @click="addSession" :title="'新建会话'">
              <i class="bi bi-plus-circle"></i> 新建
            </button>
          </div>
          <div class="card-body p-0" style="max-height: 60vh; overflow-y: auto;">
            <div
                v-for="session in sessions"
                :key="session.id"
                class="border-bottom p-3 session-item transition-all duration-200"
                :class="{ 
                  'bg-primary text-white': currentSessionId === session.id,
                  'hover:bg-primary/10': !isDarkMode && currentSessionId !== session.id,
                  'hover:bg-gray-700': isDarkMode && currentSessionId !== session.id
                }"
                @click="switchSession(session.id)"
                style="cursor: pointer;">
              <div class="d-flex justify-content-between align-items-center">
                <div class="session-title truncate">
                  {{ session.title || (session.title_temp || '新会话') }}
                </div>
                <button
                    v-if="sessions.length > 1"
                    class="btn btn-sm opacity-70 hover:opacity-100 transition-opacity"
                    :class="currentSessionId === session.id ? 'btn-light' : (isDarkMode ? 'text-danger' : 'btn-outline-danger')"
                    @click.stop="confirmDeleteSession(session.id)"
                    :title="'删除会话'">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
              <div class="text-xs text-muted mt-1 truncate" v-if="currentSession && session.id === currentSession.id">
                {{ session.messages.length }} 条消息
              </div>
              <div 
                class="text-xs text-muted mt-1 truncate" 
                v-else-if="session.messages.length > 0"
              >
                {{ formatSessionTime(session.messages[session.messages.length - 1]) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 聊天主区域 -->
      <div class="col-lg-9 col-md-12">
        <div class="card h-100" :class="isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : ''">
          <div class="card-header d-flex justify-content-between align-items-center">
            <div>
              <h5 class="mb-0">{{ currentSession?.title || (currentSession?.title_temp || '新会话') }}</h5>
              <small class="text-muted">{{ currentSession?.messages.length || 0 }} 条消息 · 会话历史最长保存7日</small>
            </div>
            <button 
              class="btn btn-sm btn-outline-secondary"
              @click="confirmClearSession"
              :title="'清空当前会话'"
            >
              <i class="bi bi-trash"></i> 清空
            </button>
          </div>

          <div 
            class="card-body p-0" 
            style="height: 60vh; overflow-y: auto;" 
            ref="chatHistory"
            :class="isDarkMode ? 'bg-gray-900' : ''"
          >
            <!-- 消息列表 -->
            <div v-if="messages.length > 0">
              <div
                  v-for="(message, index) in messages"
                  :key="index"
                  class="p-4 chat-message transition-all"
                  :class="{
                  'bg-primary bg-opacity-5 hover:bg-primary bg-opacity-10': !isDarkMode && message.role === 'assistant',
                  'text-end': message.role === 'user',
                  'bg-gray-800 hover:bg-gray-750': isDarkMode && message.role === 'assistant',
                  'bg-gray-750 hover:bg-gray-700': isDarkMode && message.role === 'user'
                }"
              >
                <div class="d-flex align-items-start"
                     :class="message.role === 'user' ? 'justify-content-end' : 'justify-content-start'">

                  <div v-if="message.role === 'assistant'"
                       class="rounded-circle d-flex align-items-center justify-content-center text-white me-2 ms-2 message-avatar bg-primary">
                      <i class="bi bi-robot"></i>
                  </div>
                  <div class="rounded message-bubble transition-all hover:shadow-md"
                       :class="message.role === 'user' ? 
                         (isDarkMode ? 'bg-gray-600 text-white' : 'bg-primary text-white') : 
                         (isDarkMode ? 'bg-gray-700 text-white' : 'bg-light')"
                       style="max-width: 80%;">
                    <div class="message-content p-2">
                      <MdPreview 
                        :modelValue="message.content" 
                        class="message-bubble" 
                        :class="isDarkMode ? 'markdown-dark' : ''"
                      />
                    </div>
                    <div class="d-flex justify-content-end mt-1 px-2 pb-1">
                      <span class="text-xs text-muted mr-2">
                        {{ formatMessageTime(message) }}
                      </span>
                      <button
                          class="btn btn-sm btn-outline-secondary py-0 px-2 mx-1 opacity-70 hover:opacity-100 transition-opacity"
                          @click="copyMessageContent(message.content)"
                          title="复制内容"
                      >
                        <i class="bi bi-clipboard"></i>
                      </button>
                      <button
                          class="btn btn-sm btn-outline-secondary py-0 px-2 opacity-70 hover:opacity-100 transition-opacity"
                          @click="showFullScreenMessage(message)"
                          title="全屏查看"
                      >
                        <i class="bi bi-arrows-fullscreen"></i>
                      </button>
                      <button 
                        v-if="message.role === 'user' && !isLoading && canEditOrDeleteMessage(message)"
                        class="btn btn-sm btn-outline-secondary py-0 px-2 mx-1 opacity-70 hover:opacity-100 transition-opacity"
                        @click="editMessage(message, index)"
                        title="编辑消息"
                      >
                        <i class="bi bi-pen"></i>
                      </button>
                      <button 
                        v-if="message.role === 'user' && !isLoading && canEditOrDeleteMessage(message)"
                        class="btn btn-sm btn-outline-secondary py-0 px-2 opacity-70 hover:opacity-100 transition-opacity"
                        @click="confirmDeleteMessage(message, index)"
                        title="删除消息"
                      >
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                  <div v-if="message.role === 'user'"
                       class="rounded-circle d-flex align-items-center justify-content-center text-white me-2 ms-2 message-avatar" 
                       :class="isDarkMode ? 'bg-gray-600' : 'bg-success'">
                      <i class="bi bi-person"></i>
                  </div>
                </div>
              </div>
            </div>
            <!-- 空状态 -->
            <div v-else class="text-center p-8 text-muted" :class="isDarkMode ? 'bg-gray-900' : ''">
              <div class="display-1 mb-4">🤖</div>
              <h5 class="mb-2">开始新的对话</h5>
              <p class="mb-4 max-w-md mx-auto">输入您的问题，AI助手将为您提供帮助。试试以下常见问题：</p>
              <div class="flex flex-wrap justify-center gap-2 mb-6">
                <button 
                  v-for="prompt in quickPrompts" 
                  :key="prompt"
                  class="btn btn-outline-secondary btn-sm"
                  @click="useQuickPrompt(prompt)"
                  :class="isDarkMode ? 'btn-outline-gray-500' : ''"
                >
                  {{ prompt }}
                </button>
              </div>
            </div>

            <!-- 思考指示器 -->
            <div v-if="thinkingContent" class="p-3 border-bottom" :class="isDarkMode ? 'bg-gray-750' : 'bg-warning bg-opacity-10'">
              <div class="d-flex align-items-center">
                <div class="spinner-grow spinner-grow-sm me-2" role="status">
                  <span class="visually-hidden">思考中...</span>
                </div>
                <span class="text-muted">{{ thinkingContent }}</span>
              </div>
            </div>
            
            <!-- 加载更多消息按钮 -->
            <div v-if="hasMoreMessages" class="text-center p-2">
              <button 
                class="btn btn-sm btn-outline-secondary" 
                @click="loadMoreMessages"
                :class="isDarkMode ? 'btn-outline-gray-500' : ''"
              >
                加载更多消息
              </button>
            </div>
          </div>

          <!-- 输入区域 -->
          <div class="card-footer" :class="isDarkMode ? 'bg-gray-800 border-gray-700' : ''">
            <!-- 格式化工具栏 -->
            <div class="toolbar mb-2">
              <button 
                class="btn btn-sm btn-outline-secondary mr-1" 
                @click="formatText('**')"
                title="粗体"
                :class="isDarkMode ? 'btn-outline-gray-500' : ''"
              >
                <i class="bi bi-type-bold"></i>
              </button>
              <button 
                class="btn btn-sm btn-outline-secondary mr-1" 
                @click="formatText('*')"
                title="斜体"
                :class="isDarkMode ? 'btn-outline-gray-500' : ''"
              >
                <i class="bi bi-type-italic"></i>
              </button>
              <button 
                class="btn btn-sm btn-outline-secondary mr-1" 
                @click="formatText('```\n\n```')"
                title="代码块"
                :class="isDarkMode ? 'btn-outline-gray-500' : ''"
              >
                <i class="bi bi-code"></i>
              </button>
              <button 
                class="btn btn-sm btn-outline-secondary mr-1" 
                @click="formatText('>')"
                title="引用"
                :class="isDarkMode ? 'btn-outline-gray-500' : ''"
              >
                <i class="bi bi-chat-square-quote"></i>
              </button>
              <button 
                class="btn btn-sm btn-outline-secondary mr-1" 
                @click="formatText('[链接文字](https://)')"
                title="链接"
                :class="isDarkMode ? 'btn-outline-gray-500' : ''"
              >
                <i class="bi bi-link-45deg"></i>
              </button>
              <span class="text-xs text-muted ml-2" v-if="!isLoading">
                Enter发送，Shift+Enter换行
              </span>
            </div>
            
            <div class="input-group">
              <textarea
                  v-model="userInput"
                  @keydown.enter.exact.prevent="sendMessage"
                  @keydown.enter.shift.exact.prevent="userInput += '\n'"
                  class="form-control transition-all focus:ring-2 focus:ring-primary/50"
                  :class="isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''"
                  placeholder="输入您的问题..."
                  :disabled="isLoading || !login_state"
                  rows="2"
                  style="resize: none;"
                  ref="textareaRef"
              ></textarea>
              <button
                  class="btn transition-all hover:shadow-md"
                  :class="isLoading ? 'btn-danger' : 'btn-primary'"
                  @click="isLoading ? stopStreaming() : sendMessage()"
                  :disabled="(!userInput.trim() && !isLoading) || !login_state"
                  :title="isLoading ? '停止生成' : '发送消息'"
              >
                <span v-if="isLoading">
                  <span class="spinner-border spinner-border-sm me-1" role="status"></span>
                  停止
                </span>
                <span v-else>
                  <i class="bi bi-send"></i> 发送
                </span>
              </button>
            </div>
            
            <div v-if="!login_state" class="text-center mt-2 text-danger">
              <small>需要登录才能使用AI对话功能，请先
                <router-link to="/login" class="text-primary hover:underline">登录</router-link>
              </small>
            </div>
            
            <!-- 字数统计 -->
            <div v-else class="text-right mt-1">
              <small class="text-muted">{{ userInput.length }} 字符</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

  <!-- 全屏显示模态框 -->
  <div
      v-if="isFullScreenMode"
      class="fixed inset-0 bg-black bg-opacity-90 z-50 d-flex flex-column justify-center items-center p-4 animate-fade-in"
      @click.self="exitFullScreenMode"
  >
    <div class="absolute top-4 right-4">
      <button
          class="btn btn-lg btn-outline-light rounded-full w-10 h-10 flex items-center justify-center hover:bg-white/20 transition-colors"
          @click="exitFullScreenMode"
          title="退出全屏"
      >
        <i class="bi bi-x-lg"></i>
      </button>
    </div>
    <div class="bg-white rounded-lg shadow-xl p-6 max-w-4xl w-full max-h-[80vh] overflow-auto animate-scale-in">
      <div class="mb-4">
        <div
            class="rounded-circle d-flex align-items-center justify-center text-white me-2 mb-2 message-avatar bg-primary inline-flex">
          <i :class="fullScreenMessage?.role === 'assistant' ? 'bi bi-robot' : 'bi bi-person'"></i>
        </div>
        <h3 class="text-lg font-semibold">{{ fullScreenMessage?.role === 'assistant' ? 'AI 回复' : '我的消息' }}</h3>
      </div>
      <div class="mb-4">
        <MdPreview :modelValue="fullScreenMessage?.content || ''" class="markdown-fullscreen"/>
      </div>
      <div class="mt-4 d-flex justify-between">
        <div class="text-sm text-muted">
          {{ fullScreenMessage ? formatMessageTime(fullScreenMessage) : '' }}
        </div>
        <button
            class="btn btn-sm btn-primary py-1 px-3 hover:bg-primary/90 transition-colors"
            @click="copyMessageContent(fullScreenMessage?.content || '')"
            title="复制内容"
        >
          <i class="bi bi-clipboard me-1"></i> 复制内容
        </button>
      </div>
    </div>
  </div>
  
  <!-- 确认对话框 -->
  <div v-if="showConfirmDialog" class="fixed inset-0 bg-black bg-opacity-50 z-50 d-flex justify-center items-center">
    <div class="bg-white rounded-lg shadow-lg max-w-md w-full p-5">
      <h4 class="text-lg font-semibold mb-3">{{ confirmTitle }}</h4>
      <p class="mb-4">{{ confirmMessage }}</p>
      <div class="d-flex justify-end gap-2">
        <button class="btn btn-outline-secondary" @click="showConfirmDialog = false">取消</button>
        <button class="btn btn-danger" @click="handleConfirmAction">确认</button>
      </div>
    </div>
  </div>
  
  <!-- 编辑消息对话框 -->
  <div v-if="editingMessage" class="fixed inset-0 bg-black bg-opacity-50 z-50 d-flex justify-center items-center">
    <div class="bg-white rounded-lg shadow-lg max-w-2xl w-full p-5">
      <h4 class="text-lg font-semibold mb-3">编辑消息</h4>
      <textarea
        v-model="editMessageContent"
        class="form-control mb-4"
        rows="4"
        placeholder="编辑您的消息..."
      ></textarea>
      <div class="d-flex justify-end gap-2">
        <button class="btn btn-outline-secondary" @click="cancelEditMessage">取消</button>
        <button class="btn btn-primary" @click="saveEditedMessage">保存</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, nextTick, onMounted, ref, watch} from "vue";
import {toast} from "@/utils/utils";
import service, {login_state} from "@/axios";
import router from "@/router";
import {MdPreview} from "md-editor-v3";
import Cookie from "js-cookie";

// 定义消息类型，增加时间戳属性
interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: number; // 新增时间戳
  edited?: boolean; // 新增编辑标记
}

// 定义会话类型
interface Session {
  id: string;
  title: string;
  title_temp: string;
  messages: Message[];
  lastUpdated?: number; // 新增最后更新时间
}

const welcome_text = "你好!我是\"小生AI博客智能助手\",有什么我可以帮助你的吗？"

// 响应式数据
const messages = ref<Message[]>([]);
const userInput = ref("");
const isLoading = ref(false);
const chatHistory = ref<HTMLElement | null>(null);
const thinkingContent = ref("");
const abortController = ref<AbortController | null>(null);
// 全屏显示相关数据
const isFullScreenMode = ref(false);
const fullScreenMessage = ref<Message | null>(null);

// 新增响应式数据
const isDarkMode = ref(false);
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const hasMoreMessages = ref(false); // 是否有更多消息可加载
const showConfirmDialog = ref(false);
const confirmTitle = ref("");
const confirmMessage = ref("");
const confirmAction = ref<() => void>(() => {});
const editingMessage = ref<Message | null>(null);
const editingMessageIndex = ref(-1);
const editMessageContent = ref("");

// 快捷提示语
const quickPrompts = [
  "如何学习前端开发？",
  "推荐几个编程学习网站",
  "解释一下什么是机器学习",
  "分享一些健康生活小技巧",
  "如何提高代码质量？"
];

// 会话相关数据
const sessions = ref<Session[]>([
  {
    id: generateChatId(),
    title: '欢迎使用AI助手',
    title_temp: '会话ID',
    messages: [{
      role: 'assistant',
      content: welcome_text
    }]
  }
]);
const currentSessionId = ref<string>(sessions.value[0].id);

// 获取当前会话
const currentSession = computed(() => {
  return sessions.value.find(session => session.id === currentSessionId.value);
});

// 生成chatId
function generateChatId() {
  return 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// 添加新会话
function addSession() {
  const newSession: Session = {
    id: generateChatId(),
    title: '',
    title_temp: '新会话',
    messages: [{
      role: 'assistant',
      content: welcome_text,
      timestamp: Date.now()
    }],
    lastUpdated: Date.now()
  };

  sessions.value.push(newSession);
  switchSession(newSession.id);
  toast('新会话创建成功', 'success');
}

// 切换深色/浅色模式
function toggleDarkMode() {
  isDarkMode.value = !isDarkMode.value;
  // 保存模式到本地存储
  localStorage.setItem('chatDarkMode', isDarkMode.value ? 'true' : 'false');
  // 更新页面类名
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

// 格式化消息时间
function formatMessageTime(message: Message): string {
  if (!message.timestamp) {
    return '';
  }
  const date = new Date(message.timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  // 不到1分钟
  if (diff < 60000) {
    return '刚刚';
  }
  // 不到1小时
  if (diff < 3600000) {
    return Math.floor(diff / 60000) + '分钟前';
  }
  // 不到24小时
  if (diff < 86400000) {
    return Math.floor(diff / 3600000) + '小时前';
  }
  // 不到7天
  if (diff < 604800000) {
    return Math.floor(diff / 86400000) + '天前';
  }
  
  // 超过7天显示具体日期
  return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}

// 格式化会话时间
function formatSessionTime(message: Message): string {
  if (!message.timestamp) {
    return '';
  }
  return formatMessageTime(message);
}

// 确认对话框
function showConfirm(title: string, message: string, action: () => void) {
  confirmTitle.value = title;
  confirmMessage.value = message;
  confirmAction.value = action;
  showConfirmDialog.value = true;
}

function handleConfirmAction() {
  confirmAction.value();
  showConfirmDialog.value = false;
}

// 确认删除会话
function confirmDeleteSession(sessionId: string) {
  showConfirm(
    '删除会话',
    '确定要删除此会话吗？此操作不可恢复。',
    () => deleteSession(sessionId)
  );
}

// 确认清空会话
function confirmClearSession() {
  showConfirm(
    '清空会话',
    '确定要清空当前会话的所有消息吗？此操作不可恢复。',
    clearCurrentSession
  );
}

// 确认删除消息
function confirmDeleteMessage(message: Message, index: number) {
  showConfirm(
    '删除消息',
    '确定要删除此消息吗？',
    () => deleteMessage(index)
  );
}

// 删除消息
function deleteMessage(index: number) {
  if (messages.value[index] && messages.value[index].role === 'user' && currentSession.value) {
    messages.value.splice(index, 1);
    currentSession.value.messages = [...messages.value];
    toast('消息已删除', 'success');
  }
}

// 编辑消息
function editMessage(message: Message, index: number) {
  if (message.role === 'user' && canEditOrDeleteMessage(message)) {
    editingMessage.value = message;
    editingMessageIndex.value = index;
    editMessageContent.value = message.content;
  }
}

// 保存编辑后的消息
function saveEditedMessage() {
  if (editingMessageIndex.value >= 0 && messages.value[editingMessageIndex.value]) {
    messages.value[editingMessageIndex.value].content = editMessageContent.value;
    messages.value[editingMessageIndex.value].edited = true;
    messages.value[editingMessageIndex.value].timestamp = Date.now();
    
    if (currentSession.value) {
      currentSession.value.messages = [...messages.value];
    }
    
    cancelEditMessage();
    toast('消息已更新', 'success');
  }
}

// 取消编辑消息
function cancelEditMessage() {
  editingMessage.value = null;
  editingMessageIndex.value = -1;
  editMessageContent.value = '';
}

// 检查消息是否可以编辑或删除（例如：3分钟内的用户消息）
function canEditOrDeleteMessage(message: Message): boolean {
  if (message.role !== 'user' || !message.timestamp) return false;
  
  const now = Date.now();
  const messageTime = message.timestamp;
  const diff = now - messageTime;
  
  // 3分钟内的消息可以编辑/删除
  return diff <= 3 * 60 * 1000;
}

// 格式化文本输入
function formatText(pattern: string) {
  if (!textareaRef.value) return;
  
  const textarea = textareaRef.value;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selectedText = userInput.value.substring(start, end);
  
  let replacement = '';
  
  if (pattern === '**' || pattern === '*' || pattern === '>') {
    replacement = pattern + selectedText + (pattern === '>' ? '' : pattern);
  } else if (pattern.includes('```')) {
    replacement = pattern;
    // 如果有选中的文本，将其放入代码块中间
    if (selectedText) {
      const lines = pattern.split('\n');
      replacement = lines[0] + '\n' + selectedText + '\n' + lines[2];
    }
  } else if (pattern.includes('[')) {
    replacement = pattern.replace('链接文字', selectedText || '链接');
  }
  
  userInput.value = 
    userInput.value.substring(0, start) + 
    replacement + 
    userInput.value.substring(end);
  
  nextTick(() => {
    // 设置光标位置
    const newCursorPos = start + replacement.length;
    textarea.focus();
    textarea.setSelectionRange(newCursorPos, newCursorPos);
  });
}

// 使用快捷提示
function useQuickPrompt(prompt: string) {
  if (!login_state.value) {
    toast("需要登录才能与AI对话，请先登录。");
    router.push("/login");
    return;
  }
  
  userInput.value = prompt;
  nextTick(() => {
    textareaRef.value?.focus();
  });
}

// 加载更多消息
function loadMoreMessages() {
  // 这里可以实现消息的分页加载逻辑
  // 目前只是一个示例，实际项目中需要与后端API对接
  toast('加载更多消息功能待实现');
}

// 切换会话
async function switchSession(sessionId: string) {
  const session = sessions.value.find(s => s.id === sessionId);
  if (session) {
    // 如果会话没有消息内容，则从服务器加载
    if (session.messages.length === 0) {
      await loadChatHistory(sessionId);
    }

    currentSessionId.value = sessionId;
    messages.value = [...session.messages];
    scrollToBottom();
  }
  thinkingContent.value = '';
}

// 删除会话
async function deleteSession(sessionId: string) {
  if (sessions.value.length <= 1) {
    toast("至少需要保留一个会话");
    return;
  }

  const index = sessions.value.findIndex(s => s.id === sessionId);
  if (index !== -1) {
    try {
      await service.get(`/api/chat/delete?chatId=${sessionId}`);
      toast("会话删除成功", "success");
    } catch (error) {
      toast("删除会话失败");
      console.error("删除会话失败:", error);
    }

    sessions.value.splice(index, 1);

    if (currentSessionId.value === sessionId) {
      switchSession(sessions.value[0].id);
    }
  }
}

// 清空当前会话
function clearCurrentSession() {
  if (currentSession.value) {
    // 保留欢迎消息
    currentSession.value.messages = [{
      role: 'assistant',
      content: welcome_text,
      timestamp: Date.now()
    }];
    messages.value = [...currentSession.value.messages];
    scrollToBottom();
    toast('会话已清空', 'success');
  }
}

// 从服务器加载会话列表
async function loadChatSessions() {
  try {
    const response = await service.get("/api/chat/chatIds") as string[];
    const chatIds = response || [];

    const loadedSessions: Session[] = [];

    // 为每个chatId创建会话对象，但不立即加载详细内容
    for (const chatId of chatIds) {
      const session: Session = {
        id: chatId,
        title: '',
        title_temp: '会话_' + chatId.substring(chatId.length - 5, chatId.length),
        messages: [],
        lastUpdated: Date.now()
      };

      loadedSessions.push(session);
    }

    if (loadedSessions.length > 0) {
      sessions.value = loadedSessions;
      currentSessionId.value = loadedSessions[0].id;
      // 注意：这里不自动加载第一个会话的内容，让onMounted来处理
    }
  } catch (error) {
    console.error("加载会话列表失败:", error);
    toast("加载会话列表失败");
  }
}

// 从服务器加载特定会话的历史记录
async function loadChatHistory(chatId: string) {
  try {
    const response = await service.get(`/api/chat/list?chatId=${chatId}`) as Message[];
    const chatData = response || [];

    const session = sessions.value.find(s => s.id === chatId);
    if (session) {
      session.messages = chatData.map((item: any) => ({
        role: item.role,
        content: item.content,
        timestamp: item.timestamp || Date.now(),
        edited: item.edited || false
      }));

      if (chatData.length > 0 && !session.title) {
        const firstUserMessage = chatData.find(msg => msg.role === 'user');
        if (firstUserMessage) {
          session.title = firstUserMessage.content.substring(0, 20) +
              (firstUserMessage.content.length > 20 ? '...' : '');
        }
      }
      
      // 更新最后更新时间
      session.lastUpdated = Date.now();
    }
  } catch (error) {
    console.error("加载会话历史失败:", error);
    toast("加载会话历史失败");
  }
}

// 发送消息
function sendMessage() {
  if (!userInput.value.trim() || isLoading.value) return;

  if (!login_state.value) {
    toast("需要登录才能与AI对话，请先登录。");
    router.push("/login");
    return;
  }

  const userMessage: Message = {
    role: 'user',
    content: userInput.value.trim(),
    timestamp: Date.now()
  };

  messages.value.push(userMessage);

  if (currentSession.value) {
    currentSession.value.messages = [...messages.value];
    currentSession.value.lastUpdated = Date.now();

    if (!currentSession.value.title) {
      currentSession.value.title = userInput.value.trim().substring(0, 20) + (userInput.value.trim().length > 20 ? '...' : '');
    }
  }

  const userQuestion = userInput.value.trim();
  userInput.value = "";

  isLoading.value = true;
  thinkingContent.value = "正在思考...";

  scrollToBottom();

  callAIStreamAPI(userQuestion);
}

// 复制消息内容
async function copyMessageContent(content: string) {
  try {
    await navigator.clipboard.writeText(content);
    toast("内容已复制到剪贴板", "success");
  } catch (err) {
    console.error("复制失败:", err);
    toast("复制失败");
  }
}

// 显示全屏消息
function showFullScreenMessage(message: Message) {
  fullScreenMessage.value = message;
  isFullScreenMode.value = true;
  // 防止页面滚动
  document.body.style.overflow = 'hidden';
}

// 退出全屏模式
function exitFullScreenMode() {
  isFullScreenMode.value = false;
  fullScreenMessage.value = null;
  // 恢复页面滚动
  document.body.style.overflow = 'auto';
}

// 调用后端流式接口
async function callAIStreamAPI(question: string) {
  try {
    abortController.value = new AbortController();

    const response = await fetch('/api/chat/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': (Cookie.get("token") || Cookie.get("authorization")) as string
      }, body: JSON.stringify({
        q: question,
        chatId: currentSessionId.value
      }),
      signal: abortController.value.signal
    });

    if (!response.ok || !response.body) {
      throw new Error('请求失败');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');

    const aiMessageIndex = messages.value.length;
    const aiMessage: Message = {
      role: 'assistant',
      content: '',
      timestamp: Date.now()
    };
    messages.value.push(aiMessage);

    if (currentSession.value) {
      currentSession.value.messages = [...messages.value];
      currentSession.value.lastUpdated = Date.now();
    }

    let accumulatedData = '';
    
    // 添加打字机效果的延迟
    const typingDelay = 30; // 毫秒
    let lastContentUpdate = Date.now();

    try {
      while (true) {
        const {done, value} = await reader.read();
        if (done) break;

        accumulatedData += decoder.decode(value, {stream: true});

        const lines = accumulatedData.split('\n');
        accumulatedData = lines.pop() || '';

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (trimmedLine === '' || trimmedLine === '[DONE]') continue;

          const dataStr = trimmedLine.replace(/^data:\s*/, '').trim();
          if (dataStr === '') continue;

          try {
            const data = JSON.parse(dataStr);

            if (data.type === 'thinking') {
              thinkingContent.value = data.content;
              nextTick(() => {
                scrollToBottom();
              });
            } else if (data.type === 'content') {
              // 实现打字机效果 - 限制更新频率
              const now = Date.now();
              if (now - lastContentUpdate > typingDelay) {
                appendContent(aiMessageIndex, data.content);
                lastContentUpdate = now;
              } else {
                // 如果更新太频繁，添加短暂延迟后再更新
                await new Promise(resolve => setTimeout(resolve, typingDelay));
                appendContent(aiMessageIndex, data.content);
                lastContentUpdate = Date.now();
              }
              
              if (thinkingContent.value !== "") {
                thinkingContent.value = "";
              }
            } else if (data.type === 'done') {
              console.log('流式响应结束');
            }
          } catch (e) {
            if (dataStr) {
              appendContent(aiMessageIndex, dataStr);
            } else {
              console.error('解析JSON失败:', e, '原始数据:', dataStr);
            }
          }
        }
      }

      if (accumulatedData) {
        const trimmedLine = accumulatedData.trim();
        if (trimmedLine !== '' && trimmedLine !== '[DONE]') {
          const dataStr = trimmedLine.replace(/^data:\s*/, '').trim();
          if (dataStr) {
            try {
              const data = JSON.parse(dataStr);

              if (data.type === 'content') {
                appendContent(aiMessageIndex, data.content);
              }
            } catch (e) {
              if (dataStr) {
                appendContent(aiMessageIndex, dataStr);
              }
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
      isLoading.value = false;
      thinkingContent.value = "";
      scrollToBottom();
    }
  } catch (error: any) {
    if (error && error.name === 'AbortError') {
      thinkingContent.value = '[对话已停止]';
    } else {
      thinkingContent.value = '[发生错误，请重试]';
    }
    isLoading.value = false;
    scrollToBottom();
  }
}

// 直接追加内容并触发更新
function appendContent(messageIndex: number, content: string) {
  messages.value[messageIndex].content += content;

  if (currentSession.value) {
    currentSession.value.messages = [...messages.value];
  }

  nextTick(() => {
    scrollToBottom();
  });
}

// 停止流式传输
function stopStreaming() {
  if (abortController.value) {
    abortController.value.abort();
    isLoading.value = false;
    thinkingContent.value = '[对话已停止]';
  }
}

// 滚动到底部
function scrollToBottom() {
  nextTick(() => {
    if (chatHistory.value) {
      chatHistory.value.scrollTop = chatHistory.value.scrollHeight;
    }
  });
}

// 监听深色模式设置
onMounted(async () => {
  // 从本地存储加载深色模式设置
  const savedDarkMode = localStorage.getItem('chatDarkMode');
  if (savedDarkMode === 'true') {
    isDarkMode.value = true;
    document.documentElement.classList.add('dark');
  }

  if (login_state.value) {
    // 加载用户的会话列表
    await loadChatSessions();

    // 如果有会话列表，加载第一个会话的内容
    if (sessions.value.length > 0) {
      // 确保第一个会话的内容已加载
      if (sessions.value[0].messages.length === 0) {
        await loadChatHistory(sessions.value[0].id);
      }
      messages.value = [...sessions.value[0].messages];
    } else {
      // 如果没有历史会话，创建一个默认会话
      sessions.value.push({
        id: generateChatId(),
        title: '',
        title_temp: '会话ID',
        messages: [{
          role: 'assistant',
          content: welcome_text,
          timestamp: Date.now()
        }],
        lastUpdated: Date.now()
      });
      messages.value = [...sessions.value[0].messages];
    }
  } else {
    // 用户未登录时显示默认欢迎消息
    if (sessions.value.length === 0) {
      sessions.value.push({
        id: generateChatId(),
        title: '',
        title_temp: '会话ID',
        messages: [{
          role: 'assistant',
          content: welcome_text,
          timestamp: Date.now()
        }],
        lastUpdated: Date.now()
      });
    }
    messages.value = [...sessions.value[0].messages];
  }

  scrollToBottom();
});

// 监听窗口大小变化，自动调整聊天区域高度
const handleResize = () => {
  nextTick(() => {
    scrollToBottom();
  });
};

// 添加窗口大小变化监听
window.addEventListener('resize', handleResize);

// 组件卸载时移除监听
import { onBeforeUnmount } from 'vue';
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
/* 聊天容器样式 */
.chat-container {
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

/* 聊天头部样式 */
.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid #e9ecef;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  backdrop-filter: blur(5px);
}

.header-left {
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.95);
  padding: 0.5rem 1rem;
  border-radius: 12px;
}

.dark-mode .header-left {
  background: rgba(30, 30, 30, 0.95);
}

.logo-container {
  display: flex;
  align-items: center;
  margin-bottom: 0.25rem;
}

.logo-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  color: white;
  font-size: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: #333;
  text-shadow: 0 1px 2px rgba(0,0,0,0.1);
  background-color: rgba(255, 255, 255, 0.9);
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
}

.subtitle {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin: 0.25rem 0 0 0;
  opacity: 1;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
}

/* 深色模式下的标题样式 */
.dark-mode .title {
  color: #ffffff;
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
  background-color: rgba(30, 30, 30, 0.95);
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
}

.dark-mode .subtitle {
  color: #b0b0b0;
  opacity: 1;
  background-color: rgba(30, 30, 30, 0.95);
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
}

/* 深色模式下的容器样式 */
.dark-mode {
  background-color: #1a1a1a;
  color: #e0e0e0;
}

.dark-mode .chat-header {
  border-bottom-color: #333;
  background-color: rgba(30, 30, 30, 0.95);
}

.dark-mode .subtitle {
  color: #b0b0b0;
}

/* 会话列表侧边栏样式 */
.sidebar-title {
  font-weight: 600;
  font-size: 1rem;
}

.session-title {
  font-weight: 500;
  font-size: 0.95rem;
  max-width: 70%;
}

.session-item {
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid #eee;
}

.dark-mode .session-item {
  border-bottom-color: #333;
  background-color: #1e1e1e;
}

.dark-mode .session-item:last-child {
  border-bottom: none;
}

.dark-mode .session-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* 深色模式下的卡片样式 */
.dark-mode .bg-gray-800 {
  background-color: #2d2d2d !important;
  border-color: #404040 !important;
  color: #e0e0e0 !important;
}

.dark-mode .bg-gray-700 {
  background-color: #333 !important;
  color: #e0e0e0 !important;
}

.dark-mode .bg-gray-750 {
  background-color: #2a2a2a !important;
  color: #e0e0e0 !important;
}

.dark-mode .bg-gray-900 {
  background-color: #1a1a1a !important;
  color: #e0e0e0 !important;
}

/* 深色模式下的欢迎信息和空状态 */
.dark-mode .text-muted {
  color: #999 !important;
}

.dark-mode .text-center.p-8.text-muted {
  background-color: #1a1a1a !important;
  color: #999 !important;
}

.dark-mode .btn-outline-gray-500 {
  border-color: #555 !important;
  color: #e0e0e0 !important;
}

.dark-mode .btn-outline-gray-500:hover {
  background-color: #333 !important;
  border-color: #666 !important;
}

/* 深色模式下的卡片头部和底部 */
.dark-mode .card-header {
  background-color: #2d2d2d !important;
  border-bottom-color: #404040 !important;
  color: #e0e0e0 !important;
}

.dark-mode .card-footer {
  background-color: #2d2d2d !important;
  border-top-color: #404040 !important;
}

/* 深色模式下的卡片内容 */
.dark-mode .card-body {
  background-color: #2d2d2d !important;
}

/* 深色模式下的输入框容器 */
.dark-mode .input-group {
  border-color: #404040 !important;
}

/* 深色模式下的欢迎会话标题 */
.dark-mode .session-item .session-title {
  color: #e0e0e0 !important;
}

/* 消息气泡样式 */
.chat-message {
  transition: all 0.3s ease;
}

.message-bubble {
  border-radius: 12px;
  padding: 8px 12px;
  word-wrap: break-word;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.dark-mode .message-bubble {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.message-content {
  overflow-wrap: break-word;
}

/* 用户消息气泡样式 */
.chat-message .bg-success {
  background-color: #e6f7ff !important;
  color: #333 !important;
}

.dark-mode .chat-message .bg-success {
  background-color: #1e40af !important;
  color: #ffffff !important;
}

/* AI助手消息气泡样式 */
.chat-message .bg-light {
  background-color: #f8f9fa !important;
}

.dark-mode .chat-message .bg-light {
  background-color: #2d2d2d !important;
  color: #e0e0e0 !important;
  border: 1px solid #404040;
}

/* 头像样式 */
.message-avatar {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
}

.message-avatar i {
  font-size: 14px;
}

.dark-mode .message-avatar {
  background-color: #444;
  color: #e0e0e0;
}

/* Markdown内容样式 */
.markdown-content :deep(.md-editor-v3-preview) {
  padding: 0;
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
}

/* 代码样式 - 浅色模式 */
.markdown-content :deep(code) {
  background: #f1f3f4;
  padding: 0.2em 0.4em;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
}

.markdown-content :deep(pre) {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  margin: 1rem 0;
  border: 1px solid #e9ecef;
}

.markdown-content :deep(pre code) {
  background: transparent;
  padding: 0;
}

/* 列表样式 */
.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

.markdown-content :deep(li) {
  margin-bottom: 0.5rem;
}

/* 引用样式 */
.markdown-content :deep(blockquote) {
  border-left: 4px solid #6c757d;
  padding-left: 1rem;
  margin-left: 0;
  margin-right: 0;
  margin-bottom: 1rem;
  font-style: italic;
  color: #6c757d;
}

/* 图片样式 */
.markdown-content :deep(img) {
  max-width: 100%;
  height: auto;
  margin: 1rem 0;
  border-radius: 4px;
}

/* 表格样式 */
.markdown-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
}

.markdown-content :deep(th),
.markdown-content :deep(td) {
  padding: 0.75rem;
  border: 1px solid #dee2e6;
}

.markdown-content :deep(th) {
  background-color: #f8f9fa;
  font-weight: 600;
}

/* 深色模式下的Markdown样式 */
.markdown-dark :deep(.md-editor-v3-preview) {
  color: #e0e0e0;
}

.markdown-dark :deep(.md-editor-v3-preview h1),
.markdown-dark :deep(.md-editor-v3-preview h2),
.markdown-dark :deep(.md-editor-v3-preview h3),
.markdown-dark :deep(.md-editor-v3-preview h4),
.markdown-dark :deep(.md-editor-v3-preview h5),
.markdown-dark :deep(.md-editor-v3-preview h6) {
  color: #fff;
  border-bottom-color: #444;
}

.markdown-dark :deep(code) {
  background-color: #444;
  color: #e0e0e0;
}

.markdown-dark :deep(pre) {
  background-color: #2d2d2d !important;
  border-color: #444 !important;
}

.markdown-dark :deep(blockquote) {
  border-left-color: #666;
  color: #bbb;
}

.markdown-dark :deep(a) {
  color: #8ab4f8;
}

.markdown-dark :deep(table) {
  border-color: #444;
}

.markdown-dark :deep(th) {
  background-color: #333 !important;
  border-color: #444;
  color: #e0e0e0;
}

.markdown-dark :deep(td) {
  border-color: #444;
  color: #e0e0e0;
}

/* 输入框样式 */
.form-control:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.dark-mode .form-control:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 0.2rem rgba(59, 130, 246, 0.3);
}

.dark-mode .form-control {
  background-color: #2a2a2a;
  border-color: #4a4a4a;
  color: #e0e0e0;
}

.dark-mode .form-control::placeholder {
  color: #999;
}

/* 格式化工具栏样式 */
.toolbar {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
}

.toolbar button {
  font-size: 0.85rem;
  min-width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dark-mode .toolbar button {
  color: #e0e0e0;
}

/* 全屏模式样式 */
.markdown-fullscreen {
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
}

.markdown-fullscreen :deep(.md-editor-v3-preview) {
  font-size: 16px;
  line-height: 1.8;
}

.markdown-fullscreen :deep(code) {
  background: #f1f3f4;
  padding: 0.2em 0.4em;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
}

.markdown-fullscreen :deep(pre) {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  overflow-x: auto;
  margin: 1rem 0;
  border: 1px solid #e9ecef;
}

.markdown-fullscreen :deep(ul),
.markdown-fullscreen :deep(ol) {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

.markdown-fullscreen :deep(li) {
  margin-bottom: 0.5rem;
}

.markdown-fullscreen :deep(blockquote) {
  border-left: 4px solid #6c757d;
  padding-left: 1rem;
  margin-left: 0;
  margin-right: 0;
  margin-bottom: 1rem;
  font-style: italic;
  color: #6c757d;
}

.markdown-fullscreen :deep(img) {
  max-width: 100%;
  height: auto;
  margin: 1rem 0;
  border-radius: 4px;
}

.markdown-fullscreen :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
}

.markdown-fullscreen :deep(th),
.markdown-fullscreen :deep(td) {
  padding: 0.75rem;
  border: 1px solid #dee2e6;
}

.markdown-fullscreen :deep(th) {
  background-color: #f8f9fa;
  font-weight: 600;
}

/* 深色模式下的全屏样式 */
.dark-mode .markdown-fullscreen {
  background-color: #1a1a1a;
  color: #e0e0e0;
}

/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fade-in {
  animation: fadeIn 0.2s ease-out;
}

.animate-scale-in {
  animation: scaleIn 0.25s ease-out;
}

/* 截断文本样式 */
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 按钮悬停效果 */
button {
  transition: all 0.2s ease;
}

/* 全屏按钮悬停效果 */
.btn-outline-secondary:hover {
  background-color: #f8f9fa;
}

.dark-mode .btn-outline-secondary:hover {
  background-color: #3a3a3a;
  color: #ffffff;
  border-color: #666;
}

.dark-mode .btn-outline-secondary {
  color: #e0e0e0;
  border-color: #555;
}

/* 响应式样式 */
@media (max-width: 768px) {
  .chat-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .header-right {
    margin-top: 0.5rem;
    align-self: flex-end;
  }
  
  .logo-container {
    margin-bottom: 0;
  }
  
  .title {
    font-size: 1.25rem;
  }
  
  .session-title {
    max-width: 65%;
  }
  
  .toolbar {
    flex-wrap: wrap;
  }
  
  .toolbar button {
    margin-bottom: 0.25rem;
  }
  
  .message-bubble {
    max-width: 85%;
  }
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #999;
}

.dark-mode ::-webkit-scrollbar-track {
  background: #2d2d2d;
}

.dark-mode ::-webkit-scrollbar-thumb {
  background: #555;
}

.dark-mode ::-webkit-scrollbar-thumb:hover {
  background: #777;
}

/* 确认对话框样式 */
.dark-mode .bg-white {
  background-color: #2a2a2a;
  color: #e0e0e0;
}

/* 模态框样式 - 深色模式 */
.dark-mode .modal-content {
  background-color: #2a2a2a;
  border-color: #404040;
  color: #e0e0e0;
}

.dark-mode .modal-header {
  border-bottom-color: #404040;
}

.dark-mode .modal-footer {
  border-top-color: #404040;
}

/* 打字机动画 */
.spinner-grow {
  animation: spinner-grow 0.75s linear infinite;
}

@keyframes spinner-grow {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}
</style>