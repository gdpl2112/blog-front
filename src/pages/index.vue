<style>
/* 每日一言样式优化 */
.dayyan-section {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(240, 240, 240, 0.8) 100%);
  border-radius: 16px;
  padding: 20px;
  margin: 20px 0;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.dayyan-section:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.dayyan-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
}

/* 帖子卡片样式优化 */
.post-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  margin: 20px 0;
  padding: 20px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 1px solid rgba(229, 231, 235, 0.8);
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.post-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(120deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.post-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
  border-color: rgba(102, 126, 234, 0.3);
}

.post-card:hover::after {
  opacity: 1;
}

/* 置顶标签样式 */
.sticky-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  z-index: 10;
}

/* 图片容器样式 */
.post-image-container {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  aspect-ratio: 4/3;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.post-card:hover .post-image-container {
  transform: scale(1.03);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.post-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.post-card:hover .post-image {
  transform: scale(1.05);
}

/* 内容样式 */
.post-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 12px;
  line-height: 1.4;
  transition: color 0.3s ease;
}

.post-card:hover .post-title {
  color: #667eea;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  color: #6b7280;
  font-size: 0.9rem;
}

.post-author {
  font-weight: 600;
  color: #4b5563;
}

.post-stats {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 12px;
  font-size: 0.85rem;
  color: #9ca3af;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  transition: color 0.3s ease;
}

.post-card:hover .stat-item {
  color: #667eea;
}

/* 分页样式优化 */
.pagination-container {
  margin: 40px 0 20px;
  display: flex;
  justify-content: center;
}

.pagination {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  padding: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(229, 231, 235, 0.5);
}

.pagination .page-item .page-link {
  border-radius: 8px;
  margin: 0 2px;
  padding: 10px 16px;
  color: #4b5563;
  border: none;
  background: transparent;
  transition: all 0.3s ease;
  font-weight: 500;
}

.pagination .page-item.active .page-link {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.pagination .page-item:hover:not(.disabled) .page-link {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  transform: translateY(-1px);
}

.pagination .page-item.disabled .page-link {
  color: #d1d5db;
  cursor: not-allowed;
}

/* 加载动画 */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  width: 100%;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(102, 126, 234, 0.2);
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 空状态样式 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
}

.empty-state h3 {
  color: #4b5563;
  margin-bottom: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .post-card {
    padding: 16px;
  }
  
  .post-title {
    font-size: 1.1rem;
  }
  
  .post-meta, .post-stats {
    flex-wrap: wrap;
    gap: 8px;
    font-size: 0.8rem;
  }
}
</style>
<template>
  <div class="container" style="width: 90%; max-width: 1200px; margin: 0 auto;">
    <!-- 每日一言区域 -->
    <div class="dayyan-section">
      <div class="text-center">
        <div class="text-sm font-medium text-gray-600 mb-2">每日一言</div>
        <div id="dayyan_div" class="text-lg font-bold text-gray-800 mb-2 cursor-pointer"
             @click="copyTextElement('#dayyan_div')" title="点击复制">
          “ {{ dayyan.line }} ”
          <el-icon class="ml-2 inline-block transition-transform hover:scale-110">
            <CopyDocument/>
          </el-icon>
        </div>
        <div class="text-md text-gray-700">—— {{ dayyan.from }} ——</div>
      </div>
    </div>

    <!-- 帖子列表 -->
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
    </div>
    
    <div v-else-if="data.length === 0" class="empty-state">
      <h3>暂无帖子</h3>
      <p>当前没有可用的帖子内容</p>
    </div>
    
    <div v-else class="posts-container">
      <div v-for="d in data" :key="d.id" class="post-card" @click="routerTo(d.id)">
        <!-- 置顶标签 -->
        <div v-if="d.sort > 0" class="sticky-badge">置顶</div>
        
        <div class="row">
          <!-- 帖子图片 -->
          <div class="col-md-4 col-sm-12 mb-4 mb-md-0">
            <div class="post-image-container">
              <img 
                referrer="no-referrer" 
                class="post-image" 
                :src="d.icon" 
                :alt="d.title"
                :title="d.title"
              >
            </div>
          </div>
          
          <!-- 帖子内容 -->
          <div class="col-md-8 col-sm-12">
            <h3 class="post-title">{{ d.title }}</h3>
            
            <div class="post-meta">
              <span class="post-author">{{ d.authorName }}</span>
              <span>•</span>
              <span>{{ getF(d.time) }}</span>
            </div>
            
            <!-- 可以添加帖子摘要，如果API提供的话 -->
            <div v-if="d.summary" class="post-summary text-gray-600 mb-3 line-clamp-2">
              {{ d.summary }}
            </div>
            
            <div class="post-stats">
              <div class="stat-item">
                <i class="bi bi-eye"></i>
                <span>{{ d.views }}</span>
              </div>
              <div class="stat-item">
                <i class="bi bi-chat-dots"></i>
                <span>{{ d.comments || 0 }}</span>
              </div>
              <div class="stat-item">
                <i class="bi bi-heart"></i>
                <span>{{ d.likes || 0 }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div v-if="!isLoading && rawdata.pages > 1" class="pagination-container">
      <nav aria-label="分页导航">
        <ul class="pagination">
          <li :class="['page-item', { disabled: pup <= 0 }]">
            <a class="page-link" @click="showPageDatas(pn - 1)" aria-label="上一页">
              <span aria-hidden="true">«</span>
            </a>
          </li>
          <li v-if="pup > 0" class="page-item">
            <a class="page-link" @click="showPageDatas(pn - 1)">{{ pn - 1 }}</a>
          </li>
          <li class="page-item active" aria-current="page">
            <a class="page-link">{{ pn }}</a>
          </li>
          <li v-if="pdown > 0" class="page-item">
            <a class="page-link" @click="showPageDatas(pn + 1)">{{ pn + 1 }}</a>
          </li>
          <li :class="['page-item', { disabled: pdown <= 0 }]">
            <a class="page-link" @click="showPageDatas(pn + 1)" aria-label="下一页">
              <span aria-hidden="true">»</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script lang="ts" setup>
import service from "@/axios";
import {onMounted, ref} from "vue";
import {copyTextElement, formatMsgTime} from "@/utils/utils";
import router from "@/router";
import {CopyDocument} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";

// 数据状态
let rawdata = ref({current: 1, pages: 1, records: []})
let data = ref([])
let pup = ref(null)
let pdown = ref(null)
let pn = ref(1)
let isLoading = ref(false)

// 每日一言数据
let dayyan = ref({line: "每日一言内容", from: "来源"})

// 加载页面数据
async function showPageDatas(p: number) {
  // 避免无效页码请求
  if (p < 1 || (rawdata.value.pages && p > rawdata.value.pages)) return;
  
  isLoading.value = true;
  
  try {
    const response = await service.get(`/notice/gets?pageNum=${p}`);
    rawdata.value = response;
    pn.value = p;
    pup.value = rawdata.value.current - 1;
    pdown.value = rawdata.value.current + 1;
    pdown.value = pdown.value > rawdata.value.pages ? -1 : pdown.value;
    data.value = rawdata.value.records || [];
  } catch (err) {
    console.error('加载页面数据失败:', err);
    // 使用更好的错误提示方式，而不是alert
    ElMessage.error('加载失败，请稍后重试');
  } finally {
    isLoading.value = false;
  }
}

// 格式化时间
function getF(t: number): string {
  return formatMsgTime(t);
}

// 跳转到文章详情
function routerTo(id: number) {
  if (!id) return;
  
  router.push({
    path: '/article',
    query: {
      id: id
    }
  });
}

// 页面加载时初始化
onMounted(async () => {
  // 并行加载每日一言和帖子数据
  const promises = [
    loadDayyan(),
    showPageDatas(1)
  ];
  
  await Promise.allSettled(promises);
});

// 加载每日一言
async function loadDayyan() {
  try {
    const response = await service.get("/api/get/dayYan");
    dayyan.value = response;
  } catch (err) {
    console.error('加载每日一言失败:', err);
    // 设置默认值，避免页面显示空白
    dayyan.value = {
      line: "生活不止眼前的苟且，还有诗和远方",
      from: "未知"
    };
  }
}
</script>