<template>
  <div class="container" style="background-color: rgba(255,255,255,0.85); min-height: 85vh;">
    <br>
    <h2 class="text-center" style="color: #333;">小生AI博客智能助手</h2>
    <hr>
    <div class="row">
      <!-- 会话列表侧边栏 -->
      <div class="col-lg-3 col-md-12 mb-3">
        <div class="card bg-light">
          <div class="card-header d-flex justify-content-between align-items-center">
            <span>会话历史</span>
            <button class="btn btn-sm btn-primary" @click="addSession">
              <i class="bi bi-plus-circle"></i> 新建
            </button>
          </div>
          <div class="card-body p-0" style="max-height: 60vh; overflow-y: auto;">
            <div 
              v-for="session in sessions" 
              :key="session.id"
              class="border-bottom p-3 session-item"
              :class="{ 'bg-primary text-white': currentSessionId === session.id }"
              @click="switchSession(session.id)"
              style="cursor: pointer;">
              <div class="d-flex justify-content-between align-items-center">
                <div class="fw-bold">{{ session.title || '新对话' }}</div>
                <button 
                  v-if="sessions.length > 1"
                  class="btn btn-sm"
                  :class="currentSessionId === session.id ? 'btn-light' : 'btn-outline-danger'"
                  @click.stop="deleteSession(session.id)">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 聊天主区域 -->
      <div class="col-lg-9 col-md-12">
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <div>
              <h5 class="mb-0">{{ currentSession?.title || '新对话' }}</h5>
              <small class="text-muted">{{ currentSession?.messages.length || 0 }} 条消息. 会话历史最长保存7日</small>
            </div>
            <button class="btn btn-sm btn-outline-secondary" @click="clearCurrentSession">
              <i class="bi bi-trash"></i> 清空
            </button>
          </div>
          
          <div class="card-body p-0" style="height: 60vh; overflow-y: auto;" ref="chatHistory">
            <!-- 消息列表 -->
            <div v-if="messages.length > 0">
              <div 
                v-for="(message, index) in messages" 
                :key="index"
                class="border-bottom py-2 chat-message"
                :class="{
                  'bg-primary bg-opacity-10': message.role === 'assistant',
                  'text-end': message.role === 'user'
                }"
              >
                <div class="d-flex align-items-start" 
                     :class="message.role === 'user' ? 'justify-content-end' : 'justify-content-start'">

                  <div v-if="message.role === 'assistant'" class="rounded-circle d-flex align-items-center justify-content-center text-white me-2 ms-2 message-avatar bg-primary">
                    {{ 'AI' }}
                  </div>
                  <div class="rounded message-bubble" 
                       :class="message.role === 'user' ? 'bg-success text-dark' : 'bg-light'"
                       style="max-width: 80%;">
                    <MdPreview :modelValue="message.content" class="message-bubble"/>
                    <div class="d-flex justify-content-end mt-1">
                      <button 
                        class="btn btn-sm btn-outline-secondary py-0 px-2"
                        @click="copyMessageContent(message.content)"
                        title="复制内容"
                      >
                        <i class="bi bi-clipboard"></i>
                      </button>
                    </div>
                  </div>
                 <div v-if="message.role === 'user'" class="rounded-circle d-flex align-items-center justify-content-center text-white me-2 ms-2 message-avatar bg-success">
                    {{ '我' }}
                  </div>
                </div>
              </div>
            </div>
            <!-- 空状态 -->
            <div v-else class="text-center p-5 text-muted">
              <div class="display-1 mb-3">🤖</div>
              <h5>开始新的对话</h5>
              <p class="mb-0">输入您的问题，AI助手将为您提供帮助</p>
            </div>
            
            <!-- 思考指示器 -->
            <div v-if="thinkingContent" class="p-3 border-bottom bg-warning bg-opacity-10">
              <div class="d-flex align-items-center">
                <div class="spinner-grow spinner-grow-sm me-2" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <span class="text-muted">{{ thinkingContent }}</span>
              </div>
            </div>
          </div>
          
          <!-- 输入区域 -->
          <div class="card-footer">
            <div class="input-group">
              <textarea
                v-model="userInput"
                @keydown.enter.exact.prevent="sendMessage"
                @keydown.enter.shift.exact.prevent="userInput += '\n'"
                class="form-control"
                placeholder="输入您的问题...(Enter发送，Shift+Enter换行);&#10;内容由AI生成仅供参考! 会话上下文长度最大有限"
                :disabled="isLoading"
                rows="2"
                style="resize: none;"
              ></textarea>
              <button 
                class="btn" 
                :class="isLoading ? 'btn-danger' : 'btn-primary'"
                @click="isLoading ? stopStreaming() : sendMessage()"
                :disabled="(!userInput.trim() && !isLoading) || !login_state"
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
              <small>需要登录才能使用AI对话功能，请先 <router-link to="/login">登录</router-link></small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick, computed } from "vue";
import { formatMsgTime, toast } from "@/utils/utils";
import { login_state } from "@/axios";
import router from "@/router";
import { MdPreview } from "md-editor-v3";
import service from "@/axios";
import type { AxiosResponse } from "axios";

// 定义消息类型
interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// 定义会话类型
interface Session {
  id: string;
  title: string;
  messages: Message[];
}

const welcome_text = "你好!我是\"小生AI博客智能助手\",有什么我可以帮助你的吗？"

// 响应式数据
const messages = ref<Message[]>([]);
const userInput = ref("");
const isLoading = ref(false);
const chatHistory = ref<HTMLElement | null>(null);
const thinkingContent = ref("");
const abortController = ref<AbortController | null>(null);

// 会话相关数据
const sessions = ref<Session[]>([
  {
    id: generateChatId(),
    title: '欢迎使用AI助手',
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
    messages: [{
      role: 'assistant',
      content: welcome_text
    }]
  };

  sessions.value.push(newSession);
  switchSession(newSession.id);
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
    currentSession.value.messages = currentSession.value.messages.filter(msg => msg.role === 'assistant' && msg.content.includes('你好！我是AI助手'));
    messages.value = [...currentSession.value.messages];
    scrollToBottom();
  }
}

// 从服务器加载会话列表
async function loadChatSessions() {
  try {
    const response = await service.get("/api/chat/chatIds");
    const chatIds = response || [];

    const loadedSessions: Session[] = [];

    // 为每个chatId创建会话对象，但不立即加载详细内容
    for (const chatId of chatIds) {
      const session: Session = {
        id: chatId,
        title: '',
        messages: []
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
    const response = await service.get(`/api/chat/list?chatId=${chatId}`);
    const chatData = response || [];

    const session = sessions.value.find(s => s.id === chatId);
    if (session) {
      session.messages = chatData.map((item: any) => ({
        role: item.role,
        content: item.content
      }));

      if (chatData.length > 0 && !session.title) {
        const firstUserMessage = chatData[0]
        if (firstUserMessage) {
          session.title = firstUserMessage.content.substring(0, 20) +
              (firstUserMessage.content.length > 20 ? '...' : '');
        }
      }
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
    content: userInput.value.trim()
  };

  messages.value.push(userMessage);

  if (currentSession.value) {
    currentSession.value.messages = [...messages.value];

    if (!currentSession.value.title) {
      currentSession.value.title = userInput.value.trim().substring(0, 20) + (userInput.value.trim().length > 20 ? '...' : '');
    }
  }

  const userQuestion = userInput.value.trim();
  userInput.value = "";

  isLoading.value = true;
  thinkingContent.value = "";

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

// 调用后端流式接口
async function callAIStreamAPI(question: string) {
  try {
    abortController.value = new AbortController();

    const response = await fetch('/api/chat/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
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
      content: ''
    };
    messages.value.push(aiMessage);

    if (currentSession.value) {
      currentSession.value.messages = [...messages.value];
    }

    let accumulatedData = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        accumulatedData += decoder.decode(value, { stream: true });

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
              appendContent(aiMessageIndex, data.content);
              if(thinkingContent.value !== "")
                thinkingContent.value = "";
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

// 初始化欢迎消息
onMounted(async () => {
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
        messages: [{
          role: 'assistant',
          content: welcome_text
        }]
      });
      messages.value = [...sessions.value[0].messages];
    }
  } else {
    // 用户未登录时显示默认欢迎消息
    if (sessions.value.length === 0) {
      sessions.value.push({
        id: generateChatId(),
        title: '',
        messages: [{
          role: 'assistant',
          content: welcome_text
        }]
      });
    }
    messages.value = [...sessions.value[0].messages];
  }

  scrollToBottom();
});
</script>

<style scoped>
.session-item:hover {
  background-color: #f0f0f0;
}

.markdown-content {
  background: transparent !important;
  font-size: 0.9rem;
}

.markdown-content :deep(pre) {
  background: #f8f9fa;
  padding: 8px;
  border-radius: 6px;
  overflow-x: auto;
  margin: 4px 0;
  border: 1px solid #e9ecef;
}

.markdown-content :deep(code) {
  background: #f1f3f4;
  padding: 1px 4px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.85em;
}

/* 调整用户消息气泡样式 */
.chat-message .bg-success {
  background-color: #f0f0f0 !important;
  color: #333 !important;
}

/* 调整AI助手消息气泡样式 */
.chat-message .bg-light {
  background-color: #f8f9fa !important;
}

/* 调整消息气泡样式 */
.chat-message .message-bubble {
  padding: 0.4rem 0.6rem !important;
  border-radius: 12px !important;
  font-size: 0.9rem;
  margin: 0 0.5rem;
}

/* 调整头像大小和样式 */
.message-avatar {
  width: 30px !important;
  height: 30px !important;
  min-width: 30px !important;
  font-size: 14px !important;
}
</style>