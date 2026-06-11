<style scoped>
.article-page {
  max-width: 860px;
  margin: 0 auto;
}

.article-header {
  margin-bottom: var(--space-8);
}

.article-title {
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.25;
  margin: 0 0 var(--space-4);
  color: var(--color-text-primary);
}

.article-meta {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  flex-wrap: wrap;
  font-size: 0.9rem;
  color: var(--color-text-tertiary);
}

.article-meta .dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--color-text-tertiary);
}

.article-actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-top: var(--space-4);
  flex-wrap: wrap;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: 6px 14px;
  font-size: 0.8rem;
  font-weight: 500;
  border-radius: var(--radius-full);
  border: 1px solid var(--color-border);
  background: var(--color-bg-card);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.action-btn:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.action-btn.active {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: white;
}

.article-body {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-8);
  margin-bottom: var(--space-8);
  line-height: 1.8;
  font-size: 1rem;
  color: var(--color-text-primary);
}

.article-body :deep(img) {
  border-radius: var(--radius-sm);
  margin: var(--space-4) 0;
}

.article-body :deep(pre) {
  background: var(--color-bg-soft);
  border-radius: var(--radius-sm);
  padding: var(--space-4);
  overflow-x: auto;
  font-size: 0.9rem;
}

.article-body :deep(blockquote) {
  border-left: 3px solid var(--color-accent);
  margin: var(--space-4) 0;
  padding: var(--space-3) var(--space-5);
  background: var(--color-accent-soft);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
}

/* Comment section */
.comments-section {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
}

.comment-input-wrap {
  display: flex;
  gap: var(--space-3);
  margin-bottom: var(--space-6);
}

.comment-input-wrap input {
  flex: 1;
  padding: 12px 16px;
  font-size: 0.9rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg);
  color: var(--color-text-primary);
  transition: all var(--transition-fast);
  outline: none;
}

.comment-input-wrap input:focus {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px var(--color-accent-soft);
}

.comment-item {
  display: flex;
  gap: var(--space-3);
  padding: var(--space-4) 0;
  border-bottom: 1px solid var(--color-border-light);
}

.comment-item:last-child {
  border-bottom: none;
}

.comment-avatar {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  object-fit: cover;
  flex-shrink: 0;
}

.comment-body {
  flex: 1;
  min-width: 0;
}

.comment-name {
  font-weight: 600;
  font-size: 0.85rem;
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.comment-time {
  font-size: 0.75rem;
  color: var(--color-text-tertiary);
  font-weight: 400;
}

.comment-content {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  margin: var(--space-1) 0 0;
  line-height: 1.6;
}

.comment-delete {
  font-size: 0.75rem;
  color: var(--color-danger);
  cursor: pointer;
  opacity: 0.6;
  transition: opacity var(--transition-fast);
  border: none;
  background: none;
  padding: 0;
}

.comment-delete:hover {
  opacity: 1;
}

.comment-tip {
  text-align: center;
  padding: var(--space-4);
  color: var(--color-text-tertiary);
  font-size: 0.85rem;
}

@media (max-width: 640px) {
  .article-title {
    font-size: 1.5rem;
  }
  .article-body {
    padding: var(--space-4);
  }
}
</style>

<template>
  <div class="article-page">
    <!-- Header -->
    <div class="article-header">
      <h1 class="article-title">{{ data.title }}</h1>
      <div class="article-meta">
        <span>{{ data.authorName }}</span>
        <span class="dot"></span>
        <span>{{ getMsgTime(data.time) }}</span>
        <span class="dot"></span>
        <span><i class="bi bi-eye"></i> {{ data.views }}</span>
      </div>
      <div class="article-actions">
        <button v-if="deletable" class="action-btn" @click="remove">
          <i class="bi bi-trash"></i> 删除
        </button>
        <button v-if="deletable" :class="['action-btn', pClassEnd === 'btn-secondary' ? 'active' : '']" @click="_private">
          <i class="bi bi-file-earmark-lock"></i> 私有
        </button>
        <button v-if="deletable" class="action-btn" @click="_update">
          <i class="bi bi-pen"></i> 修改
        </button>
        <button v-if="login_state" :class="['action-btn', fClassEnd === 'btn-primary' ? 'active' : '']" @click="favorite">
          <i class="bi bi-bookmark-heart"></i> 收藏
        </button>
        <span v-if="!login_state" style="font-size:0.8rem;color:var(--color-text-tertiary);">登录后可收藏/评论</span>
      </div>
    </div>

    <!-- Content body -->
    <div class="article-body">
      <MdPreview v-if="data.type==='md'" :modelValue="data.html" />
      <div v-if="data.type==='html'" v-html="data.html"></div>
    </div>

    <!-- Comments -->
    <div class="comments-section">
      <div class="comment-input-wrap">
        <input
          id="comment_input"
          type="text"
          placeholder="写下你的评论..."
          @keyup.enter="commentDo"
        />
        <button class="btn-modern btn-modern-primary" @click="commentDo">评论</button>
      </div>

      <div v-if="cs.length === 0" class="comment-tip">暂无评论，来说点什么吧</div>

      <div v-for="d in cs" :key="d.commentId" class="comment-item">
        <img :src="d.icon" class="comment-avatar" alt="" />
        <div class="comment-body">
          <div class="comment-name">
            {{ d.nickName }}
            <span class="comment-time">{{ formatMsgTime(d.time) }}</span>
            <button v-if="d.c0" class="comment-delete" @click="del(d.commentId)">
              <i class="bi bi-trash"></i>
            </button>
          </div>
          <p class="comment-content">{{ d.content }}</p>
        </div>
      </div>
    </div>

    <!-- Dialogs -->
    <el-dialog v-model="deleteDialogV" title="确认删除" width="400" center>
      <p>确定删除此文章吗？此操作不可撤销。</p>
      <template #footer>
        <el-button @click="deleteDialogV = false">取消</el-button>
        <el-button type="danger" @click="deleteNow">确定删除</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="privateDialogV" title="提示" width="400" center>
      <p>确定将此文章取消/设置为私有吗？</p>
      <template #footer>
        <el-button @click="privateDialogV = false">取消</el-button>
        <el-button type="primary" @click="privateNow">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {useRoute} from "vue-router";
import {formatMsgTime, toast} from "@/utils/utils";
import {onMounted, ref} from "vue";
import service, {login_state} from "@/axios";
import {MdPreview} from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';
import router from "@/router";
import $ from "jquery";

function getMsgTime(time: string) {
  return formatMsgTime(Number(time))
}

const route = useRoute()
const id = route.query.id

let data = ref({} as any)
let fClassEnd = ref("btn-outline-secondary")
let pClassEnd = ref("btn-outline-secondary")

service.get("/notice/get-notice-id?id=" + id).then(function (response: any) {
  data.value = response
  document.getElementsByTagName("title")[0].innerText = data.value.title
}).catch(function (err) {
  console.log(err);
})

function favorite() {
  service.get("/notice/favorite?id=" + id).then(function (response: any) {
    fClassEnd.value = response ? "btn-primary" : "btn-outline-secondary"
  }).catch(function (err) {
    console.log(err);
  })
}

const cs = ref([] as any[])

service.get("/comments/get-comment?nid=" + id).then(function (response: any) {
  cs.value = response as any
}).catch(function (err) {
  alert(err);
})

function del(id: number) {
  service.get("/comments/del-comment?id=" + id).then(function (response: any) {
    if (response) {
      cs.value = cs.value.filter((d: any) => d.commentId !== id);
      toast("删除完成!", "success")
    }
  }).catch(function (err) {
    toast("删除异常")
  })
}

let deleteDialogV = ref(false)
let privateDialogV = ref(false)

function remove() { deleteDialogV.value = true }

function deleteNow() {
  service.get("/notice/delete?id=" + id).then(function (response: any) {
    if (response.toString() === "OK") {
      toast("删除成功", "success")
      router.push("/")
    }
  }).catch(function (err) {
    toast("删除异常")
  }).finally(function () {
    deleteDialogV.value = false
  })
}

function _private() { privateDialogV.value = true }

function _update() {
  router.push({path: '/update', query: {id: id}})
}

function privateNow() {
  service.get("/notice/private?id=" + id).then(function (response: any) {
    if (response.toString() === "OK") {
      toast("设置成功", "success")
    }
    privated.value = Boolean(response)
    pClassEnd.value = privated.value ? "btn-secondary" : "btn-outline-secondary"
  }).catch(function (err) {
    toast("设置异常")
  }).finally(function () {
    privateDialogV.value = false
  })
}

let deletable = ref(false)
let privated = ref(false)

onMounted(() => {
  if (login_state.value) {
    service.get("/notice/favorited?id=" + id).then(function (response: any) {
      fClassEnd.value = response ? "btn-primary" : "btn-outline-secondary"
    }).catch(function (err) { console.log(err); })
    service.get("/notice/deletable?id=" + id).then(function (response: any) {
      deletable.value = Boolean(response)
    }).catch(function (err) { console.log(err); })
    service.get("/notice/privated?id=" + id).then(function (response: any) {
      privated.value = Boolean(response)
      pClassEnd.value = privated.value ? "btn-secondary" : "btn-outline-secondary"
    }).catch(function (err) { console.log(err); })
  }
})

function commentDo() {
  if (!login_state.value) {
    toast("请先登录")
    router.push("/login");
  } else {
    const content = $("#comment_input").val() as string;
    const formData = new FormData();
    formData.append('nid', id as string);
    formData.append('body', content);
    service.post("/comments/pcm", formData).then((response: any) => {
      cs.value.push(response)
    }).catch(err => {})
  }
}
</script>
