<style scoped>
/* =============================================
   一言维护
   ============================================= */

.panel-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--gap-4);
  padding-bottom: 10px;
  border-bottom: 1px solid var(--rule-2);
  margin-bottom: var(--gap-5);
}

.panel-head h2 {
  font-size: var(--text-md);
  letter-spacing: 0.06em;
  margin: 0;
}

.panel-head span {
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  letter-spacing: 0.08em;
  color: var(--ink-3);
}

.add-bar {
  display: flex;
  gap: var(--gap-2);
  flex-wrap: wrap;
  align-items: flex-start;
  margin-top: var(--gap-5);
  padding-top: var(--gap-4);
  border-top: 1px solid var(--glass-line);
}

.add-bar .grow {
  flex: 1;
  min-width: 220px;
}

.pager {
  margin-top: var(--gap-4);
  display: flex;
  justify-content: flex-end;
}

.cell-line {
  font-size: var(--text-sm);
  color: var(--ink);
  line-height: 1.7;
}

.cell-mono {
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  color: var(--ink-3);
  letter-spacing: 0.04em;
}
</style>

<template>
  <div class="ink-in">
    <div class="panel-head">
      <h2>一言维护</h2>
      <span>{{ ndata.total || 0 }} 条</span>
    </div>

    <el-table :data="data" style="width: 100%">
      <el-table-column type="index" width="46" />
      <el-table-column label="日期" width="120">
        <template #default="{ row }"><span class="cell-mono">{{ row.date }}</span></template>
      </el-table-column>
      <el-table-column label="来自" width="140">
        <template #default="{ row }"><span class="cell-mono">{{ row.from }}</span></template>
      </el-table-column>
      <el-table-column label="内容">
        <template #default="{ row }"><span class="cell-line">{{ row.line }}</span></template>
      </el-table-column>
      <el-table-column label="" width="80" align="right">
        <template #default="scope">
          <el-button size="small" type="danger" plain @click="removed(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pager">
      <el-pagination
        size="small"
        background
        layout="prev, pager, next"
        :total="ndata.total"
        :page-size="ndata.size"
        :current-page="p"
        @update:current-page="loadData"
      />
    </div>

    <div class="add-bar">
      <el-input v-model="vdate" style="width: 120px" placeholder="日期" />
      <el-input v-model="vline" class="grow" type="textarea" :autosize="{minRows:1,maxRows:2}" placeholder="内容" />
      <el-input v-model="vfrom" style="width: 120px" type="textarea" :autosize="{minRows:1,maxRows:2}" placeholder="来源" />
      <el-button @click="add" type="primary">添加</el-button>
      <el-button @click="gen">生成一条</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import service from "@/axios";
import {toast} from "@/utils/utils";

interface YiYan { date: string; line: string; from: string }
let data = ref(new Array<YiYan>)
let ndata = ref({total:0,size:0,current:0,records:new Array<YiYan>})
let p = ref(1)

function loadData(n: number) {
  service.get("/adm/yiyan/list?ps=7&p=" + n).then((r: any) => { ndata.value = r; data.value = r.records; p.value = r.current; data.value.forEach((e: any) => { e.svl = false }) })
}
onMounted(() => { loadData(1) })

function removed(e: any) { e.svl = true; service.get("/adm/yiyan/remove?id=" + e.id).then((r: any) => { e.svl = false; if (r.code == 200) { loadData(p.value); toast(r.msg, "success") } else toast(r.msg) }) }

let vdate = ref(""); let vline = ref(""); let vfrom = ref("")
function gen() { service.get("/adm/yiyan/gen").then((r: any) => { vdate.value = r.date; vline.value = r.line; vfrom.value = r.from }) }
function add() { service.post("/adm/yiyan/add", {date:vdate.value,line:vline.value,from:vfrom.value}).then((r: any) => { if (r.code == 200) { loadData(p.value); toast(r.msg, "success") } else toast(r.msg) }) }
</script>
