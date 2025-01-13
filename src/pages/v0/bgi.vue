<template>
  <br>
  <hr>
  <el-carousel ref="cRef" type="card" height="200px" :autoplay="false">
    <el-carousel-item v-for="item in bgis">
      <div class="block">
        <span class="demonstration" v-text="(item.type==1?'竖屏':'横屏') + (item.id)"></span>
        <el-image :src="item.url"/>
      </div>
    </el-carousel-item>
  </el-carousel>
  <br>
  <hr>
  <el-row class="row-bg" justify="center">
    <el-col :span="6">
      <div class="mb-4">
        <el-button @click="uset()" type="primary" round>使用此</el-button>
        <el-button @click="delt()" type="danger" round>删除此</el-button>
        <hr>
        <el-upload
            ref="uploadRef"
            class="upload-demo"
            action="/api/bgi/upload_image0"
            :auto-upload="false"
            list-type="picture"
            name="img"
            accept="img/*"
        >
          <template #trigger>
            <el-button type="primary">选择一个图片</el-button>
          </template>

          <el-button class="ml-3" type="success" @click="submitUpload">
            上传
          </el-button>
        </el-upload>
      </div>
    </el-col>
  </el-row>

</template>

<style scoped>
</style>
<script lang="ts" setup>
import {ElCarousel, ElCarouselItem} from 'element-plus'
import {ref} from "vue";
import service from "@/axios";

let bgis = ref([])

function loadAll() {
  service.get("/api/bgi/user_image_list").then(res => {
    bgis.value = res
  })
}

loadAll();

import $ from "jquery";
// 引入方式2
import {useCookies} from "vue3-cookies";

const {cookies} = useCookies();

const uset = function () {
  cookies.remove("randUrl")
  service.get("/api/bgi/set_image?id=" + bgis.value[cRef.value.activeIndex].id).then(res => {
    $("body").css("background-image", "url(" + res.u0 + ")")
  })
}

const delt = function () {
  let url = bgis.value[cRef.value.activeIndex].url;
  service.get("/api/bgi/del_image?url=" + url).then(res => {
    bgis.value = res
  })
}

import type {UploadInstance, CarouselInstance} from 'element-plus'

const cRef = ref<CarouselInstance>()
const uploadRef = ref<UploadInstance>()

const submitUpload = () => {
  if (uploadRef.value) {
    uploadRef.value!.submit()
    setTimeout(function () {
      loadAll()
    }, 1000)
  }
}
</script>