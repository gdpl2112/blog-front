<template>
  <div class="container bg-teal-50 bg-opacity-50">
    <hr>
    <div class="row">
      <div class="col-3"></div>
      <div class="col-6">
        <el-upload list-type="picture" class="upload-demo" drag action="/user/upload_img" :on-success="setIcon">
          <el-icon class="el-icon--upload">
            <upload-filled/>
          </el-icon>
          <div class="el-upload__text">
            文章图标 <em>点击上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              jpg/png files with a size less than 2048kb
            </div>
          </template>
        </el-upload>
      </div>
    </div>
    <div class="row">
      <div class="col-2">
      </div>
      <div class="col-8">
        <el-input v-model="title" style="" placeholder="文章标题"/>
      </div>
    </div>
    <hr>
    <div class="row">
      <div class="col">
        <MdEditor v-model="text" @onUploadImg="onUploadImg"/>
      </div>
    </div>
    <br>
    <hr>
    <el-row justify="center">

      <el-button :loading="loading" style="width: 300px;" color="#626aef" :dark="isDark" @click="submit()">提交
      </el-button>
      <el-button :loading="loading" style="width: 300px;"
                 color="#626aef" :dark="isDark" @click="submitp()">提交到仅己可见
      </el-button>

    </el-row>
    <hr>
    <br>
    <hr>
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

const setIcon: UploadProps['onSuccess'] = (
    response, uploadFile
) => {
  imageUrl.value = response
  k0 = true
}
const loading = ref(false)

function submit() {
  if (title.value === '') {
    toast("标题不能为空")
  } else if (title.value.length < 5 || title.value.length > 20) {
    toast("标题不能少于5或大于20字")
  } else if (text.value === '') {
    toast("内容不能为空")
  } else if (text.value.length < 30) {
    toast("内容不能少于30个字")
  } else if (!k0) {
    toast("请上传图标")
  } else {
    const formData = new FormData()
    formData.append("title", title.value)
    formData.append("code", text.value)
    formData.append("icon", imageUrl.value)
    loading.value = true
    service.post("/notice/upload", formData).then((res) => {
      if (res.code === 200) {
        toast("提交成功", "success")
        router.push("/")
      } else {
        toast(res.msg)
      }
    }).finally(() => {
      loading.value = false
    })
  }
}

function submitp() {
  if (title.value === '') {
    toast("标题不能为空")
  } else if (title.value.length < 5 || title.value.length > 20) {
    toast("标题不能少于5或大于20字")
  } else if (text.value === '') {
    toast("内容不能为空")
  } else if (text.value.length < 30) {
    toast("内容不能少于30个字")
  } else if (!k0) {
    toast("请上传图标")
  } else {
    const formData = new FormData()
    formData.append("title", title.value)
    formData.append("code", text.value)
    formData.append("icon", imageUrl.value)
    loading.value = true
    service.post("/notice/uploadp", formData).then((res) => {
      if (res.code === 200) {
        toast("提交成功", "success")
        router.push("/")
      } else {
        toast(res.msg)
      }
    }).finally(() => {
      loading.value = false
    })
  }
}


const onUploadImg = async (files, callback) => {
  const res = await Promise.all(
      files.map((file) => {
        return new Promise((rev, rej) => {
          const form = new FormData();
          form.append('file', file);
          service.post('/user/upload_img', form, {headers: {'Content-Type': 'multipart/form-data'}})
              .then((res) => rev(res))
              .catch((error) => rej(error));
        });
      })
  );
  callback(res.map((item) => item));
}
</script>
