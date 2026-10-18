<style scoped>
/* =============================================
   密码本：可原地编辑的一页表格
   ============================================= */

.panel-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--gap-4);
  padding-bottom: 10px;
  border-bottom: 1px solid var(--rule-2);
  margin-bottom: var(--gap-4);
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

.tip {
  margin: 0 0 var(--gap-4);
  font-size: var(--text-xs);
  line-height: 1.9;
  color: var(--ink-3);
}

.cell-input {
  height: 28px;
}

.cell-input :deep(.el-input__wrapper) {
  box-shadow: none !important;
  background: var(--paper-2) !important;
}

:deep(.el-table .el-table__row) {
  height: 48px;
}

:deep(.el-table__cell) {
  font-size: var(--text-sm);
}
</style>

<template>
  <div class="ink-in">
    <div class="panel-head">
      <h2>密码本</h2>
      <span>悬停即编辑</span>
    </div>

    <p class="tip">
      把光标移到任意一行即可编辑，移开后自动保存。把一行的内容全部清空，这一行会被删除；在最后一行填写内容即可新增一条。
    </p>

    <el-table :data="dataList" @cell-mouse-enter="handleCellEnter" @cell-mouse-leave="handleCellLeave">
      <el-table-column type="index" width="46" />
      <el-table-column label="平台" prop="type" width="120">
        <template #default="scope"><el-input v-if="scope.row.isEdit" class="cell-input" v-model="scope.row.type" /></template>
      </el-table-column>
      <el-table-column label="账号类型" prop="stype" width="120">
        <template #default="scope"><el-input v-if="scope.row.isEdit" class="cell-input" v-model="scope.row.stype" /></template>
      </el-table-column>
      <el-table-column label="账号" prop="account" width="200">
        <template #default="scope"><el-input v-if="scope.row.isEdit" class="cell-input" v-model="scope.row.account" /></template>
      </el-table-column>
      <el-table-column label="密码" prop="pwd" width="200">
        <template #default="scope"><el-input v-if="scope.row.isEdit" class="cell-input" v-model="scope.row.pwd" type="password" show-password /></template>
      </el-table-column>
      <el-table-column label="备注" prop="tips" min-width="140">
        <template #default="scope"><el-input v-if="scope.row.isEdit" class="cell-input" v-model="scope.row.tips" /></template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive} from 'vue';
import {toast} from "@/utils/utils";
import service from "@/axios";

interface PwdNoteData { id: number; type: string; stype: string; account: string; pwd: string; tips: string; isEdit: boolean }
const dataList = reactive<PwdNoteData[]>([{id:0,type:'',stype:'',account:'',pwd:'',tips:'',isEdit:true}])
let mr: PwdNoteData = {isEdit: false} as PwdNoteData

const handleCellEnter = (row: any) => { row.isEdit = true; mr = {...row} }
const handleCellLeave = (row: any) => {
  row.isEdit = false
  if (row.type == '' && row.stype == '' && row.account == '' && row.pwd == '' && row.tips == '') {
    if (row.id != 0) { service.delete(`/api/pwdnote/${row.id}`).then((res: any) => { if (res.code == 200) { dataList.splice(dataList.findIndex(item => item.id === row.id), 1); toast("删除成功", "success", 2000) } else toast(res.msg) }) }
  } else if (row.id == 0) {
    service.post("/api/pwdnote", row).then((res: any) => {
      if (res.code == 200) { res.data.isEdit = true; dataList.push(res.data); Object.assign(row, {type:'',stype:'',account:'',pwd:'',tips:''}); toast("添加成功", "success", 2000) }
      else toast(res.msg)
    })
  } else if (mr.type != row.type || mr.stype != row.stype || mr.account != row.account || mr.pwd != row.pwd || mr.tips != row.tips) {
    service.put(`/api/pwdnote/${row.id}`, row).then((res: any) => { if (res.code == 200) toast("修改成功", "success", 2000); else toast(res.msg) })
  }
}

onMounted(() => {
  service.get("/api/pwdnote").then((res: any) => {
    let arr: Array<PwdNoteData> = res;
    if (arr.length != 0) arr.forEach((item) => { item.isEdit = true; dataList.push(item) })
  })
})
</script>
