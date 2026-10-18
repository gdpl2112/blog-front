<style scoped>
/* =============================================
   文章页：一页印本 — 窄栏、宋体、上下双线
   ============================================= */

.article {
  padding-top: var(--gap-4);
}

/* ---------- 顶部操作条 ---------- */

.article-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--gap-4);
  flex-wrap: wrap;
  /* 与正文同一栏宽，保证操作条与阅读栏对齐 */
  max-width: 43rem;
  margin: 0 auto;
  padding-bottom: var(--gap-4);
  border-bottom: 1px solid var(--rule);
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: var(--text-sm);
  color: var(--ink-2);
}

.back-link:hover {
  color: var(--seal);
  text-decoration: none;
}

.article-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 30px;
  padding: 0 11px;
  font-size: var(--text-xs);
  letter-spacing: 0.04em;
  color: var(--ink-2);
  background: var(--glass-thin);
  border: 1px solid var(--glass-line-2);
  border-radius: 9px;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  cursor: pointer;
  transition: all var(--dur) var(--ease);
}

.action-btn:hover {
  background: var(--glass-strong);
  border-color: var(--glass-line);
  color: var(--ink);
}

.action-btn.is-on {
  border-color: var(--seal);
  color: var(--seal);
  background: var(--seal-wash);
}

.action-hint {
  font-size: var(--text-xs);
  color: var(--ink-3);
}

/* ---------- 题头 ---------- */

.article-head {
  padding: var(--gap-7) 0 var(--gap-5);
  max-width: 43rem;
  margin: 0 auto;
}

.article-title {
  font-family: var(--font-display);
  font-size: clamp(27px, 3.6vw, 40px);
  font-weight: 600;
  line-height: 1.42;
  letter-spacing: 0.02em;
  margin: 0 0 var(--gap-5);
  color: var(--ink);
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 0;
  flex-wrap: wrap;
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  letter-spacing: 0.06em;
  color: var(--ink-3);
}

.article-meta span {
  padding: 0 12px;
  border-left: 1px solid var(--rule);
}

.article-meta span:first-child {
  padding-left: 0;
  border-left: 0;
}

.article-meta .who {
  color: var(--ink-2);
}

/* ---------- 正文 ---------- */

.article-body {
  max-width: 43rem;
  margin: 0 auto var(--gap-6);
  padding: clamp(24px, 3.6vw, 46px);
  background: var(--glass);
  border: 1px solid var(--glass-line);
  border-radius: var(--r-lg);
  box-shadow: var(--glass-shadow), var(--glass-inner);
  backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-sat));
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-sat));
  font-family: var(--font-display);
  font-size: 17.5px;
  line-height: 2.02;
  letter-spacing: 0.02em;
  color: var(--ink);
}

.article-body :deep(img) {
  border-radius: 8px;
  margin: var(--gap-6) 0;
  box-shadow: 0 0 0 1px var(--rule);
}

.article-body :deep(a) {
  color: var(--seal);
  border-bottom: 1px solid var(--seal-wash);
}

.article-body :deep(h1),
.article-body :deep(h2),
.article-body :deep(h3),
.article-body :deep(h4) {
  font-family: var(--font-display);
  letter-spacing: 0.03em;
  margin: 1.8em 0 0.7em;
  line-height: 1.5;
}

.article-body :deep(h2) { font-size: 1.28em; }
.article-body :deep(h3) { font-size: 1.14em; }

.article-body :deep(p) {
  margin: 0 0 1.15em;
}

.article-body :deep(blockquote) {
  margin: var(--gap-6) 0;
  padding: 4px 0 4px 22px;
  border-left: 2px solid var(--seal);
  color: var(--ink-2);
  font-size: 1.02em;
}

.article-body :deep(blockquote p) {
  margin: 0 0 0.6em;
}

.article-body :deep(pre) {
  background: var(--block);
  color: var(--block-ink);
  border-radius: 8px;
  padding: var(--gap-4) var(--gap-5);
  overflow-x: auto;
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 1.75;
  margin: var(--gap-6) 0;
}

.article-body :deep(code) {
  font-family: var(--font-mono);
  font-size: 0.88em;
}

.article-body :deep(pre code) {
  background: transparent;
  color: inherit;
  padding: 0;
}

.article-body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  margin: var(--gap-5) 0;
}

.article-body :deep(th),
.article-body :deep(td) {
  border: 1px solid var(--rule);
  padding: 8px 12px;
  text-align: left;
}

.article-body :deep(th) {
  background: var(--paper-2);
  font-weight: 600;
}

.article-body :deep(ul),
.article-body :deep(ol) {
  padding-left: 1.4em;
  margin: 0 0 1.15em;
}

.article-body :deep(li) {
  margin-bottom: 0.4em;
}

/* ---------- 评论 ---------- */

.comments {
  max-width: 43rem;
  margin: 0 auto;
  padding: clamp(20px, 3vw, 34px);
  background: var(--glass);
  border: 1px solid var(--glass-line);
  border-radius: var(--r-lg);
  box-shadow: var(--glass-shadow), var(--glass-inner);
  backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-sat));
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-sat));
}

.comments-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: var(--gap-5);
}

.comments-head h2 {
  font-size: var(--text-md);
  letter-spacing: 0.06em;
}

.comments-head span {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--ink-3);
}

.comment-form {
  display: flex;
  gap: var(--gap-2);
  margin-bottom: var(--gap-6);
}

.comment-form input {
  flex: 1;
  height: 44px;
  padding: 0 16px;
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  color: var(--ink);
  background: var(--glass-thin);
  border: 1px solid var(--glass-line-2);
  border-radius: var(--r-full);
  outline: none;
  transition: all var(--dur) var(--ease);
}

.comment-form input::placeholder {
  color: var(--ink-3);
}

.comment-form input:focus {
  border-color: var(--glass-line);
  background: var(--glass-strong);
  box-shadow: 0 0 0 4px var(--focus-ring);
}

.comment {
  display: flex;
  gap: var(--gap-3);
  padding: var(--gap-4) 0;
  border-bottom: 1px solid var(--rule);
}

.comment-avatar {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
  filter: grayscale(0.15);
}

.comment-body {
  flex: 1;
  min-width: 0;
}

.comment-name {
  display: flex;
  align-items: baseline;
  gap: var(--gap-2);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--ink);
}

.comment-time {
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  font-weight: 400;
  letter-spacing: 0.04em;
  color: var(--ink-3);
}

.comment-content {
  margin: 4px 0 0;
  font-size: var(--text-sm);
  line-height: 1.85;
  color: var(--ink-2);
  white-space: pre-wrap;
  word-break: break-word;
}

.comment-delete {
  margin-left: auto;
  border: 0;
  background: none;
  padding: 2px;
  font-size: 11px;
  color: var(--ink-3);
  cursor: pointer;
  transition: color var(--dur) var(--ease);
}

.comment-delete:hover {
  color: var(--color-danger);
}

.comment-empty {
  padding: var(--gap-5) 0;
  font-size: var(--text-sm);
  color: var(--ink-3);
}

@media (max-width: 700px) {
  .article-body {
    font-size: 16.5px;
    line-height: 1.95;
  }

  .comment-form {
    flex-direction: column;
  }

  .comment-form .btn {
    width: 100%;
  }
}
</style>

<template>
  <article class="article ink-in">
    <!-- 操作条 -->
    <div class="article-bar">
      <RouterLink to="/" class="back-link">
        <i class="bi bi-arrow-left"></i> 全部文章
      </RouterLink>

      <div class="article-actions">
        <button v-if="deletable" class="action-btn" @click="remove">
          <i class="bi bi-trash3"></i> 删除
        </button>
        <button v-if="deletable" class="action-btn" :class="{ 'is-on': privated }" @click="_private">
          <i class="bi bi-lock"></i> {{ privated ? '已私有' : '设为私有' }}
        </button>
        <button v-if="deletable" class="action-btn" @click="_update">
          <i class="bi bi-pencil"></i> 修改
        </button>
        <button v-if="login_state" class="action-btn" :class="{ 'is-on': favorited }" @click="favorite">
          <i :class="favorited ? 'bi bi-bookmark-fill' : 'bi bi-bookmark'"></i>
          {{ favorited ? '已收藏' : '收藏' }}
        </button>
        <span v-else class="action-hint">登录后可收藏和评论</span>
      </div>
    </div>

    <!-- 题头 -->
    <header class="article-head">
      <h1 class="article-title">{{ data.title }}</h1>
      <div class="article-meta">
        <span class="who">{{ data.authorName }}</span>
        <span>{{ getMsgTime(data.time) }}</span>
        <span>{{ data.views }} 次阅读</span>
      </div>
    </header>

    <!-- 正文 -->
    <div class="article-body">
      <MdPreview v-if="data.type === 'md'" :modelValue="data.html" />
      <div v-if="data.type === 'html'" v-html="data.html"></div>
    </div>

    <!-- 评论 -->
    <section class="comments">
      <div class="comments-head">
        <h2>评论</h2>
        <span>{{ cs.length }} 条</span>
      </div>

      <div class="comment-form">
        <input
          id="comment_input"
          type="text"
          placeholder="写下你的评论，回车发送"
          @keyup.enter="commentDo"
        />
        <button class="btn btn--solid" @click="commentDo">发送</button>
      </div>

      <p v-if="cs.length === 0" class="comment-empty">还没有人说话。</p>

      <div v-for="d in cs" :key="d.commentId" class="comment">
        <img :src="d.icon" class="comment-avatar" alt="" loading="lazy" />
        <div class="comment-body">
          <div class="comment-name">
            {{ d.nickName }}
            <span class="comment-time">{{ formatMsgTime(d.time) }}</span>
            <button v-if="d.c0" class="comment-delete" @click="del(d.commentId)" title="删除评论">
              <i class="bi bi-trash3"></i>
            </button>
          </div>
          <p class="comment-content">{{ d.content }}</p>
        </div>
      </div>
    </section>

    <!-- 弹窗 -->
    <el-dialog
      append-to-body v-model="deleteDialogV" title="删除这篇文章" width="400" align-center>
      <p>删除后无法恢复，确认继续？</p>
      <template #footer>
        <el-button @click="deleteDialogV = false">取消</el-button>
        <el-button type="danger" @click="deleteNow">删除</el-button>
      </template>
    </el-dialog>

    <el-dialog
      append-to-body v-model="privateDialogV" title="调整可见范围" width="400" align-center>
      <p>设为私有后，只有你自己能看到这篇文章。</p>
      <template #footer>
        <el-button @click="privateDialogV = false">取消</el-button>
        <el-button type="primary" @click="privateNow">确定</el-button>
      </template>
    </el-dialog>
  </article>
</template>

<script lang="ts" setup>
import {useRoute} from "vue-router";
import {RouterLink} from "vue-router";
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
let favorited = ref(false)

service.get("/notice/get-notice-id?id=" + id).then(function (response: any) {
  data.value = response
  document.getElementsByTagName("title")[0].innerText = data.value.title
}).catch(function (err) {
  console.log(err);
})

function favorite() {
  service.get("/notice/favorite?id=" + id).then(function (response: any) {
    favorited.value = Boolean(response)
  }).catch(function (err) {
    console.log(err);
  })
}

const cs = ref([] as any[])

service.get("/comments/get-comment?nid=" + id).then(function (response: any) {
  cs.value = response as any
}).catch(function (err) {
  toast("评论加载失败")
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
      favorited.value = Boolean(response)
    }).catch(function (err) { console.log(err); })
    service.get("/notice/deletable?id=" + id).then(function (response: any) {
      deletable.value = Boolean(response)
    }).catch(function (err) { console.log(err); })
    service.get("/notice/privated?id=" + id).then(function (response: any) {
      privated.value = Boolean(response)
    }).catch(function (err) { console.log(err); })
  }
})

function commentDo() {
  if (!login_state.value) {
    toast("请先登录")
    router.push("/login");
  } else {
    const content = $("#comment_input").val() as string;
    if (!content || !content.trim()) {
      toast("评论内容不能为空");
      return;
    }
    const formData = new FormData();
    formData.append('nid', id as string);
    formData.append('body', content);
    service.post("/comments/pcm", formData).then((response: any) => {
      cs.value.push(response)
      $('#comment_input').val('')
    }).catch(err => {})
  }
}
</script>
