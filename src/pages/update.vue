<style scoped>
/* =============================================
   改稿：与发文同一张稿纸
   ============================================= */

.write {
  max-width: 960px;
  margin: 0 auto;
  padding: clamp(20px, 3vw, 38px);
  background: var(--glass);
  border: 1px solid var(--glass-line);
  border-radius: var(--r-lg);
  box-shadow: var(--glass-shadow), var(--glass-inner);
  backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-sat));
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-sat));
}

.write-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--gap-4);
  flex-wrap: wrap;
  padding-bottom: var(--gap-4);
  border-bottom: 1px solid var(--rule-2);
  margin-bottom: var(--gap-5);
}

.write-head h1 {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 600;
  letter-spacing: 0.08em;
  margin: 0;
}

.write-head a {
  font-size: var(--text-xs);
  color: var(--ink-3);
}

.write-rules {
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  letter-spacing: 0.08em;
  color: var(--ink-3);
}

.cover-row {
  display: flex;
  align-items: center;
  gap: var(--gap-4);
  margin-bottom: var(--gap-5);
  padding-bottom: var(--gap-5);
  border-bottom: 1px solid var(--rule);
}

.cover-preview {
  width: 132px;
  height: 88px;
  flex-shrink: 0;
  object-fit: cover;
  border: 1px solid var(--rule);
  border-radius: 8px;
  background: var(--paper-2);
}

.cover-preview--empty {
  display: grid;
  place-items: center;
  color: var(--ink-3);
  font-size: 18px;
}

.cover-upload {
  flex: 1;
  min-width: 0;
}

.cover-upload :deep(.el-upload) {
  width: 100%;
}

.cover-upload :deep(.el-upload-dragger) {
  padding: 18px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.cover-upload :deep(.el-icon--upload) {
  font-size: 20px;
  margin: 0;
  color: var(--ink-3);
}

.cover-upload :deep(.el-upload__text) {
  font-size: var(--text-sm);
  color: var(--ink-2);
}

.cover-upload :deep(.el-upload__text em) {
  color: var(--seal);
  font-style: normal;
}

.cover-upload :deep(.el-upload__tip) {
  margin-top: 6px;
}

.title-input {
  width: 100%;
  padding: 6px 0 12px;
  margin-bottom: var(--gap-5);
  font-family: var(--font-display);
  font-size: clamp(22px, 2.6vw, 30px);
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--ink);
  background: transparent;
  border: 0;
  border-bottom: 1px solid var(--rule);
  outline: none;
  transition: border-color var(--dur) var(--ease);
}

.title-input::placeholder {
  color: var(--ink-3);
  font-weight: 400;
}

.title-input:focus {
  border-bottom-color: var(--ink);
}

.editor-wrap {
  border: 1px solid var(--glass-line-2);
  border-radius: var(--r-md);
  background: var(--glass-thin);
  overflow: hidden;
  margin-bottom: var(--gap-5);
}

.editor-wrap :deep(.md-editor) {
  border: 0;
  border-radius: 0;
  background: transparent;
}

.editor-wrap :deep(.md-editor-toolbar-wrapper) {
  border-bottom: 1px solid var(--rule);
  background: var(--paper-2);
}

.editor-wrap :deep(.md-editor-input-wrapper),
.editor-wrap :deep(.md-editor-content) {
  background: transparent;
}

.write-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--gap-2);
  padding-top: var(--gap-5);
  border-top: 1px solid var(--rule);
}

.write-actions .hint {
  margin-right: auto;
  font-size: var(--text-xs);
  color: var(--ink-3);
}

@media (max-width: 700px) {
  .cover-row {
    flex-direction: column;
    align-items: stretch;
  }

  .cover-preview {
    width: 100%;
    height: 140px;
  }

  .write-actions {
    flex-direction: column-reverse;
    align-items: stretch;
  }

  .write-actions .btn {
    width: 100%;
  }
}
</style>

<template>
  <div class="write ink-in">
    <header class="write-head">
      <h1>修改文章</h1>
      <span class="write-rules">改动会立即覆盖原来的版本</span>
    </header>

    <div class="cover-row">
      <img v-if="imageUrl" :src="imageUrl" class="cover-preview" alt="封面" />
      <div v-else class="cover-preview cover-preview--empty">
        <i class="bi bi-image"></i>
      </div>

      <div class="cover-upload">
        <el-upload
          drag
          action="/user/upload_img"
          :show-file-list="false"
          :on-success="setIcon"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">重新拖入图片，或<em>点击替换封面</em></div>
          <template #tip>
            <div class="el-upload__tip">jpg / png，小于 2MB</div>
          </template>
        </el-upload>
      </div>
    </div>

    <input v-model="title" class="title-input" type="text" placeholder="标题" maxlength="20" />

    <div class="editor-wrap">
      <MdEditor v-model="text" @onUploadImg="onUploadImg" style="height: 520px" />
    </div>

    <div class="write-actions">
      <span class="hint">确认无误后再提交，文章列表会立即更新。</span>
      <RouterLink to="/" class="btn">放弃修改</RouterLink>
      <button class="btn btn--solid" :disabled="loading" @click="submitUpdate()">
        <i class="bi bi-check2"></i> 保存修改
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {UploadFilled} from '@element-plus/icons-vue'
import {onMounted, ref} from 'vue';
import {RouterLink, useRoute} from 'vue-router';
import {MdEditor} from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import type {UploadProps} from "element-plus";
import {toast} from "@/utils/utils";
import service from "@/axios";
import router from "@/router";

const text = ref('');
const title = ref('');
const imageUrl = ref('')
const setIcon: UploadProps['onSuccess'] = (response) => { imageUrl.value = response }
const loading = ref(false)

const route = useRoute()
const id = route.query.id

onMounted(() => {
  service.get("/notice/get-notice-id?id=" + id).then(function (response: any) {
    title.value = response.title
    text.value = response.html
    imageUrl.value = response.icon
  }).catch(function (err) { toast("读取文章失败") })
})

function submitUpdate() {
  if (title.value === '') { toast("标题不能为空"); return }
  if (title.value.length < 5 || title.value.length > 20) { toast("标题需要 5–20 个字"); return }
  if (text.value === '') { toast("内容不能为空"); return }
  if (text.value.length < 30) { toast("内容不能少于 30 个字"); return }
  const formData = new FormData()
  formData.append("title", title.value)
  formData.append("code", text.value)
  formData.append("icon", imageUrl.value)
  loading.value = true
  service.put("/notice/update?id=" + id, formData).then((re: any) => {
    if (re.code === 200) { toast("已保存", "success"); router.push("/") }
    else { toast(re.msg) }
  }).finally(() => { loading.value = false })
}

const onUploadImg = async (files: any, callback: any) => {
  const res = await Promise.all(files.map((file: any) => {
    return new Promise((rev, rej) => {
      const form = new FormData();
      form.append('file', file);
      service.post('/user/upload_img', form, {headers: {'Content-Type': 'multipart/form-data'}})
        .then((res) => rev(res)).catch((error) => rej(error));
    });
  }));
  callback(res.map((item: any) => item));
}
</script>
