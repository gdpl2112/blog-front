<style scoped>
.upload-page {
  max-width: 860px;
  margin: 0 auto;
}

.upload-header {
  margin-bottom: var(--space-6);
}

.upload-header h1 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: var(--color-text-primary);
}

.upload-form {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
}

.form-row {
  margin-bottom: var(--space-5);
}

.upload-actions {
  display: flex;
  gap: var(--space-3);
  justify-content: center;
  margin-top: var(--space-6);
}
</style>

<template>
  <div class="upload-page">
    <div class="upload-header">
      <h1>发布文章</h1>
    </div>

    <div class="upload-form">
      <div class="form-row">
        <el-upload list-type="picture" class="upload-demo" drag action="/user/upload_img" :on-success="setIcon">
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">文章图标 <em>点击上传</em></div>
          <template #tip>
            <div class="el-upload__tip">jpg/png, 小于 2MB</div>
          </template>
        </el-upload>
      </div>

      <div class="form-row">
        <el-input v-model="title" placeholder="文章标题（5-20字）" size="large" />
      </div>

      <div class="form-row">
        <MdEditor v-model="text" @onUploadImg="onUploadImg" />
      </div>

      <div class="upload-actions">
        <el-button :loading="loading" type="primary" size="large" @click="submit()" style="background:var(--color-accent);border-color:var(--color-accent);min-width:200px;">
          公开发布
        </el-button>
        <el-button :loading="loading" size="large" @click="submitp()" style="min-width:200px;">
          仅自己可见
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {UploadFilled} from '@element-plus/icons-vue'
import {ref} from 'vue';
import {MdEditor} from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import type {UploadProps} from "element-plus";
import {toast} from "@/utils/utils";
import service from "@/axios";
import router from "@/router";

const text = ref('# 引入md-editor-v3\n## markdown编辑器\n### 请书写你的文章');
const title = ref('');
const imageUrl = ref('')
let k0 = false

const setIcon: UploadProps['onSuccess'] = (response) => { imageUrl.value = response; k0 = true }
const loading = ref(false)

function submit() {
  if (title.value === '') { toast("标题不能为空") }
  else if (title.value.length < 5 || title.value.length > 20) { toast("标题不能少于5或大于20字") }
  else if (text.value === '') { toast("内容不能为空") }
  else if (text.value.length < 30) { toast("内容不能少于30个字") }
  else if (!k0) { toast("请上传图标") }
  else {
    const formData = new FormData()
    formData.append("title", title.value)
    formData.append("code", text.value)
    formData.append("icon", imageUrl.value)
    loading.value = true
    service.post("/notice/upload", formData).then((res: any) => {
      if (res.code === 200) { toast("提交成功", "success"); router.push("/") }
      else { toast(res.msg) }
    }).finally(() => { loading.value = false })
  }
}

function submitp() {
  if (title.value === '') { toast("标题不能为空") }
  else if (title.value.length < 5 || title.value.length > 20) { toast("标题不能少于5或大于20字") }
  else if (text.value === '') { toast("内容不能为空") }
  else if (text.value.length < 30) { toast("内容不能少于30个字") }
  else if (!k0) { toast("请上传图标") }
  else {
    const formData = new FormData()
    formData.append("title", title.value)
    formData.append("code", text.value)
    formData.append("icon", imageUrl.value)
    loading.value = true
    service.post("/notice/uploadp", formData).then((res: any) => {
      if (res.code === 200) { toast("提交成功", "success"); router.push("/") }
      else { toast(res.msg) }
    }).finally(() => { loading.value = false })
  }
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
