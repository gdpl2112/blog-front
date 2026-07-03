<style scoped>
.admin-section h3 {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0 0 var(--space-4);
  color: var(--color-text-primary);
}

.add-bar {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
  align-items: center;
  margin-top: var(--space-4);
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-border);
}
</style>

<template>
  <div class="admin-section">
    <h3>卡密管理</h3>

    <el-table :data="data" stripe style="width:100%">
      <el-table-column type="index" width="50" />
      <el-table-column prop="cardNo" label="卡号" width="180" />
      <el-table-column prop="cardSecret" label="卡密" />
      <el-table-column label="状态" width="90">
        <template #default="scope">
          <el-tag :type="scope.row.state == 1 ? 'info' : 'success'">{{ scope.row.state == 1 ? '已兑换' : '未兑换' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="兑换时间" width="160">
        <template #default="scope">
          <span>{{ scope.row.redeemTime ? formatMsgTime(scope.row.redeemTime) : '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="right" width="160">
        <template #default="scope">
          <el-button size="default" v-if="scope.row.state == 1" :loading="scope.row.svl" @click="reset(scope.row)">重置</el-button>
          <el-button size="default" type="danger" :loading="scope.row.svl" @click="removed(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination size="default" background layout="prev, pager, next" :total="ndata.total" :page-size="ndata.size" :current-page="p" @update:current-page="loadData" class="mt-4" />

    <div class="add-bar">
      <el-input v-model="vno" style="width:180px;" placeholder="卡号" />
      <el-input v-model="vsecret" style="width:260px;" placeholder="卡密" />
      <el-button @click="add" type="primary" plain>添加</el-button>
      <el-input-number v-model="genCount" :min="1" :max="100" style="width:100px;" />
      <el-button @click="gen" type="success" plain>批量生成</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import service from "@/axios";
import {toast, formatMsgTime} from "@/utils/utils";

interface CardKey { id: number; cardNo: string; cardSecret: string; state: number; createTime: number; redeemTime: number }
let data = ref(new Array<CardKey>)
let ndata = ref({total:0,size:0,current:0,records:new Array<CardKey>})
let p = ref(1)

function loadData(n: number) {
  service.get("/adm/card/list?ps=7&p=" + n).then((r: any) => { ndata.value = r; data.value = r.records; p.value = r.current; data.value.forEach((e: any) => { e.svl = false }) })
}
onMounted(() => { loadData(1) })

function removed(e: any) { e.svl = true; service.get("/adm/card/remove?id=" + e.id).then((r: any) => { e.svl = false; if (r.code == 200) { loadData(p.value); toast(r.msg, "success") } else toast(r.msg) }) }

function reset(e: any) { e.svl = true; service.get("/adm/card/reset?id=" + e.id).then((r: any) => { e.svl = false; if (r.code == 200) { loadData(p.value); toast(r.msg, "success") } else toast(r.msg) }) }

let vno = ref(""); let vsecret = ref("")
function add() { service.post("/adm/card/add", {cardNo:vno.value,cardSecret:vsecret.value}).then((r: any) => { if (r.code == 200) { vno.value = ""; vsecret.value = ""; loadData(p.value); toast(r.msg, "success") } else toast(r.msg) }) }

let genCount = ref(5)
function gen() { service.get("/adm/card/gen?count=" + genCount.value).then((r: any) => { if (r.code == 200) { loadData(1); toast(r.msg, "success") } else toast(r.msg) }) }
</script>
