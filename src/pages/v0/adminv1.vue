<template>
  <div>
    <hr>
    <center><h2>每日一言管理</h2></center>
    <el-table :data="data" stripe style="width: 100%">
      <el-table-column type="index" width="50"/>
      <el-table-column prop="date" label="日期" width="180"/>
      <el-table-column prop="from" label="来自" width="180"/>
      <el-table-column prop="line" label="内容"/>
      <el-table-column align="right">
        <template #default="scope">
          <el-button size="default" type="danger" @click="removed(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        size="default"
        background
        layout="prev, pager, next"
        :total="ndata.total"
        :page-size="ndata.size"
        :current-page="p"
        @update:current-page="loadData"
        class="mt-4"/>
  </div>
  <hr>
  <div>
    <span style="margin-top: 1px">添加一个: </span>
    <el-input v-model="vdate" style="width: 97px" placeholder="日期"/>
    <el-input v-model="vline" style="width: 320px"
        :autosize="{ minRows: 1, maxRows: 4 }" type="textarea" placeholder="内容"/>
    <el-input v-model="vfrom" style="width: 100px"
        :autosize="{ minRows: 1, maxRows: 4 }" type="textarea" placeholder="来源"/>
    <el-button v-on:click="add" type="primary" plain>添加</el-button>
    <el-button v-on:click="gen" type="success" plain>生成一个</el-button>
  </div>
  <hr>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import service from "@/axios";
import {toast} from "@/utils/utils";

interface YiYan {
  date: string
  line: string
  from: string
}

let data = ref(new Array<YiYan>)

let ndata = ref({
  total: 0,
  size: 0,
  current: 0,
  records: new Array<YiYan>
})
let p = ref(1)

function loadData(n: number) {
  service.get("/adm/yiyan/list?ps=7&p=" + n).then((r) => {
    ndata.value = r
    data.value = r.records
    p.value = r.current
    data.value.forEach(e => {
      e.svl = false
    })
  })
}

onMounted(() => {
  loadData(1)
})

function removed(e: any) {
  e.svl = true
  service.get("/adm/yiyan/remove?id=" + e.id).then((r) => {
    e.svl = false
    if (r.code == 200) {
      loadData(p.value)
      toast(r.msg, "success")
    } else {
      toast(r.msg)
    }
  })
}

let vdate = ref("")
let vline = ref("")
let vfrom = ref("")

function gen() {
  service.get("/adm/yiyan/gen").then((r) => {
    vdate.value = r.date
    vline.value = r.line
    vfrom.value = r.from
  });
}

function add() {
  service.post("/adm/yiyan/add", {
    date: vdate.value,
    line: vline.value,
    from: vfrom.value
  }).then((r) => {
    if (r.code == 200) {
      loadData(p.value)
      toast(r.msg, "success")

    } else {
      toast(r.msg)
    }
  });
}
</script>
<style scoped>
</style>
