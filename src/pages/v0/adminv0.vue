<template>
  <div>
    <hr>
    <center><h2>帖子管理</h2></center>

    <div>
      <el-divider content-position="left">
        可见/置顶指数/信息 <br>
        标题-作者名-日期-内容类型
      </el-divider>
      <el-divider content-position="right">可见 0可见 1不可见 2私有 <br> 置顶指数 越高越置顶</el-divider>
    </div>

    <ul class="list-group bg-opacity-50">
      <li class="list-group-item bg-opacity-75" v-for="e in notices">
        <el-button :loading="e.svl"
                   :type="e.state == 0 ? 'success' : 'danger'"
                   @click="toVs(e)">{{ e.state }}
        </el-button>
        <el-button :loading="e.svl"
                   :type="e.sort>0?'success':'info'"
                   @click="toSort(e)">{{ e.sort }}
        </el-button>

        {{ e.title }} --- {{ e.authorName }} --- {{ e.date }} - {{ e.type }}
      </li>
    </ul>

    <el-pagination
        size="default"
        background
        layout="prev, pager, next"
        :total="nr.total"
        :page-size="nr.size"
        :current-page="p"
        @update:current-page="loadData"
        class="mt-4"/>
  </div>
  <hr>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import service from "@/axios";
import {toast} from "@/utils/utils";

const p = ref(1)

const nr = ref({})

let notices = ref([])

function loadData(n: number) {
  service.get("/adm/notice/list?ps=7&p=" + n).then((r) => {
    nr.value = r
    notices.value = r.records
    p.value = r.current
    notices.value.forEach(e => {
      e.svl = false
    })
  })
}

onMounted(() => {
  loadData(1);
})

function toSort(e: any) {
  e.svl = true
  service.get("/adm/notice/sort?id=" + e.id).then((r) => {
    e.svl = false
    if (r.code == 200) {
      e.sort = r.sort;
      toast(r.msg, "success")
    } else {
      toast(r.msg)
    }
  })
}

function toVs(e: any) {
  e.svl = true
  service.get("/adm/notice/state?id=" + e.id).then((r) => {
    e.svl = false
    if (r.code == 200) {
      e.state = r.state;
      toast(r.msg, "success")
    } else {
      toast(r.msg)
    }
    e.sv = r.state > 0
  })
}
</script>
<style scoped>
</style>
