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

.filter-bar {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: var(--space-4);
}
</style>

<template>
  <div class="admin-section">
    <h3>卡密管理</h3>

    <div class="filter-bar">
      <el-input v-model="vkw" style="width:220px;" placeholder="搜索卡号或卡密" clearable @keyup.enter="loadData(1)" @clear="loadData(1)" />
      <el-select v-model="vstate" style="width:110px;" @change="loadData(1)">
        <el-option label="全部" value="" />
        <el-option label="未使用" value="0" />
        <el-option label="已使用" value="1" />
      </el-select>
      <el-select v-model="vsort" style="width:140px;" @change="loadData(1)">
        <el-option label="默认排序" value="" />
        <el-option label="创建时间 ↓" value="createTime,desc" />
        <el-option label="创建时间 ↑" value="createTime,asc" />
        <el-option label="兑换时间 ↓" value="redeemTime,desc" />
        <el-option label="兑换时间 ↑" value="redeemTime,asc" />
      </el-select>
      <el-button type="primary" plain @click="loadData(1)">搜索</el-button>
    </div>

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

    <el-dialog v-model="impDialog" title="导入成功，生成的卡号" width="520px">
      <el-input :model-value="impNos.join('\n')" type="textarea" :autosize="{minRows:4,maxRows:12}" readonly />
      <template #footer>
        <el-button @click="impDialog = false">关闭</el-button>
        <el-button type="primary" @click="copyImpNos">一键复制</el-button>
      </template>
    </el-dialog>
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

let vkw = ref(""); let vstate = ref(""); let vsort = ref("")

function loadData(n: number) {
  let url = "/adm/card/list?ps=12&p=" + n
  if (vstate.value !== "") url += "&state=" + vstate.value
  if (vkw.value.trim()) url += "&kw=" + encodeURIComponent(vkw.value.trim())
  if (vsort.value) { const [s, o] = vsort.value.split(","); url += "&sort=" + s + "&order=" + o }
  service.get(url).then((r: any) => { ndata.value = r; data.value = r.records; p.value = r.current; data.value.forEach((e: any) => { e.svl = false }) })
}
onMounted(() => { loadData(1) })

function removed(e: any) { e.svl = true; service.get("/adm/card/remove?id=" + e.id).then((r: any) => { e.svl = false; if (r.code == 200) { loadData(p.value); toast(r.msg, "success") } else toast(r.msg) }) }

function copySecret(s: string) { navigator.clipboard.writeText(s).then(() => toast("卡密已复制", "success")) }

function copyUnused() { service.get("/adm/card/unused").then((r: any) => { if (r.code == 200) { if (!r.list || r.list.length == 0) { toast("没有未使用的卡号", "warning"); return } navigator.clipboard.writeText(r.list.join("\n")).then(() => toast("已复制 " + r.list.length + " 条未使用卡号", "success")) } else toast(r.msg) }) }

function reset(e: any) { e.svl = true; service.get("/adm/card/reset?id=" + e.id).then((r: any) => { e.svl = false; if (r.code == 200) { loadData(p.value); toast(r.msg, "success") } else toast(r.msg) }) }

let vno = ref(""); let vsecret = ref("")
function add() { service.post("/adm/card/add", {cardNo:vno.value,cardSecret:vsecret.value}).then((r: any) => { if (r.code == 200) { vno.value = ""; vsecret.value = ""; loadData(p.value); toast(r.msg, "success") } else toast(r.msg) }) }

let vimport = ref("")
let impDialog = ref(false); let impNos = ref(new Array<string>)
function imp() { if (!vimport.value.trim()) { toast("请输入卡密", "warning"); return } service.post("/adm/card/import", vimport.value, {headers: {"Content-Type": "text/plain"}}).then((r: any) => { if (r.code == 200) { vimport.value = ""; loadData(1); toast(r.msg, "success"); impNos.value = (r.list || []).map((e: any) => e.cardNo); if (impNos.value.length > 0) impDialog.value = true } else toast(r.msg) }) }
function copyImpNos() { navigator.clipboard.writeText(impNos.value.join("\n")).then(() => toast("已复制 " + impNos.value.length + " 条卡号", "success")) }
</script>
