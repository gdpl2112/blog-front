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
      <el-table-column type="index" width="44" />
      <el-table-column prop="cardNo" label="卡号" min-width="150" show-overflow-tooltip />
      <el-table-column prop="cardSecret" label="卡密" min-width="200" show-overflow-tooltip>
        <template #default="scope">
          <span style="cursor:pointer" @click="copySecret(scope.row.cardSecret)">{{ scope.row.cardSecret }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="85" align="center">
        <template #default="scope">
          <el-tag :type="scope.row.state == 1 ? 'info' : 'success'">{{ scope.row.state == 1 ? '已兑换' : '未兑换' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="90">
        <template #default="scope">
          <span>{{ scope.row.createTime ? formatMsgTime(scope.row.createTime) : '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="兑换时间" width="90">
        <template #default="scope">
          <span>{{ scope.row.redeemTime ? formatMsgTime(scope.row.redeemTime) : '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="right" width="160">
        <template #default="scope">
          <div style="display:flex;gap:8px;justify-content:flex-end;">
            <el-button size="default" v-if="scope.row.state == 1" :loading="scope.row.svl" @click="reset(scope.row)">重置</el-button>
            <el-button size="default" type="danger" :loading="scope.row.svl" @click="removed(scope.row)">删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <div style="display:flex;align-items:center;justify-content:space-between;" class="mt-4">
      <el-pagination size="default" background layout="prev, pager, next" :total="ndata.total" :page-size="ndata.size" :current-page="p" @update:current-page="loadData" />
      <el-button size="default" type="warning" plain @click="copyUnused">复制未使用卡号</el-button>
    </div>

    <div class="add-bar">
      <el-input v-model="vno" style="width:180px;" placeholder="卡号" />
      <el-input v-model="vsecret" style="width:260px;" placeholder="卡密" />
      <el-button @click="add" type="primary" plain>添加</el-button>
    </div>
    <div class="add-bar">
      <el-input v-model="vimport" style="width:400px;" type="textarea" :autosize="{minRows:2,maxRows:6}" placeholder="批量导入卡密，一行一个，自动生成卡号" />
      <el-button @click="imp" type="success" plain>导入卡密</el-button>
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

function copySecret(s: string) { navigator.clipboard.writeText(s).then(() => toast("卡密已复制", "success")) }

function copyUnused() { service.get("/adm/card/unused").then((r: any) => { if (r.code == 200) { if (!r.list || r.list.length == 0) { toast("没有未使用的卡号", "warning"); return } navigator.clipboard.writeText(r.list.join("\n")).then(() => toast("已复制 " + r.list.length + " 条未使用卡号", "success")) } else toast(r.msg) }) }

function reset(e: any) { e.svl = true; service.get("/adm/card/reset?id=" + e.id).then((r: any) => { e.svl = false; if (r.code == 200) { loadData(p.value); toast(r.msg, "success") } else toast(r.msg) }) }

let vno = ref(""); let vsecret = ref("")
function add() { service.post("/adm/card/add", {cardNo:vno.value,cardSecret:vsecret.value}).then((r: any) => { if (r.code == 200) { vno.value = ""; vsecret.value = ""; loadData(p.value); toast(r.msg, "success") } else toast(r.msg) }) }

let vimport = ref("")
function imp() { if (!vimport.value.trim()) { toast("请输入卡密", "warning"); return } service.post("/adm/card/import", vimport.value, {headers: {"Content-Type": "text/plain"}}).then((r: any) => { if (r.code == 200) { vimport.value = ""; loadData(1); toast(r.msg, "success") } else toast(r.msg) }) }
</script>
