<template>
  <div>
    <el-divider content-position="left">这里是分割线只是为了更美观</el-divider>
  </div>

  <div class="bg-zinc-100 bg-opacity-50">
    <br>
    <el-collapse>

      <el-collapse-item name="1">
        <template #title>
          <p>我发布的
            <el-icon>
            <Document/>
          </el-icon>
          </p>
        </template>
        <el-timeline style="overflow-y: scroll;max-height: 500px">
          <el-timeline-item color="#E8A891E5" v-for="e in datas" :timestamp="e.time" placement="top">
            <el-card class="bg-slate-300 bg-opacity-75" style="max-width: 500px" @click="toArticle(e.id)">
              <h4>{{ e.title }}</h4>
              <p>发布于 {{ e.time }}</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-collapse-item>

      <el-collapse-item name="2">
        <template #title>
          <p>我收藏的
            <el-icon>
            <Star/>
            </el-icon>
          </p>
        </template>
        <el-timeline style="overflow-y: scroll;max-height: 500px">
          <el-timeline-item color="#E8A891E5" v-for="e in dataw" :timestamp="e.time" placement="top">
            <el-card class="bg-rose-400 bg-opacity-75" style="max-width: 500px" v-on:click="toArticle(e.id)">
              <h4>{{ e.title }}</h4>
              <p>发布于 {{ e.time }}</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-collapse-item>

      <el-collapse-item name="3">
        <template #title>
          <p>仅自己可见
            <el-icon><Lock /></el-icon>
          </p>
        </template>
        <el-timeline style="overflow-y: scroll;max-height: 500px">
          <el-timeline-item color="#E8A891E5" v-for="e in datap" :timestamp="e.time" placement="top">
            <el-card class="bg-stone-400 bg-opacity-75" style="max-width: 500px" v-on:click="toArticle(e.id)">
              <h4>{{ e.title }}</h4>
              <p>发布于 {{ e.time }}</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-collapse-item>

    </el-collapse>
  </div>
  <el-divider content-position="right">同上喽</el-divider>
</template>

<script lang="ts" setup>
import service from "@/axios";
import {onMounted, ref} from "vue";
import {Document, Lock, Star} from "@element-plus/icons-vue";
import router from "@/router";

let datas = ref([])
service.get("/notice/myall").then((res) => {
  datas.value = res
})

let dataw = ref([])
service.get("/notice/favorites").then((res) => {
  dataw.value = res
})

let datap = ref([])
service.get("/notice/privates").then((res) => {
  datap.value = res
})

function toArticle(id: number) {
  router.push({
    path: '/article',
    query: {
      id: id
    }
  })
}
</script>
