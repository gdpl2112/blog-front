<style scoped>
.update-page {
  max-width: 860px;
  margin: 0 auto;
}

.update-header {
  margin-bottom: var(--space-6);
}

.update-header h1 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: var(--color-text-primary);
}

.update-form {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
}

.form-row {
  margin-bottom: var(--space-5);
}
</style>

<template>
  <div class="update-page">
    <div class="update-header">
      <h1>修改文章</h1>
    </div>

    <div class="update-form">
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

      <div style="text-align:center;margin-top:var(--space-6);">
        <el-button :loading="loading" type="primary" size="large" @click="submitUpdate()" style="background:var(--color-accent);border-color:var(--color-accent);min-width:200px;">
          提交修改
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {UploadFilled} from '@element-plus/icons-vue'
import {onMounted, ref} from 'vue';
import {MdEditor} from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import type {UploadProps} from "element-plus";
import {toast} from "@/utils/utils";
import service from "@/axios";
import router from "@/router";
import {useRoute} from "vue-router";

const text = ref('# 引入md-editor-v3\n## markdown编辑器\n### 请书写你的文章');
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
  }).catch(function (err) { alert(err) })
})

function submitUpdate() {
  if (title.value === '') { toast("标题不能为空") }
  else if (title.value.length < 5 || title.value.length > 20) { toast("标题不能少于5或大于20字") }
  else if (text.value === '') { toast("内容不能为空") }
  else if (text.value.length < 30) { toast("内容不能少于30个字") }
  else {
    const formData = new FormData()
    formData.append("title", title.value)
    formData.append("code", text.value)
    formData.append("icon", imageUrl.value)
    loading.value = true
    service.put("/notice/update?id=" + id, formData).then((re: any) => {
      if (re.code === 200) { toast("提交成功", "success"); router.push("/") }
      else { toast(re.msg) }
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
