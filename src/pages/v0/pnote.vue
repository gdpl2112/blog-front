<style scoped>
.pnote-section h3 {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0 0 var(--space-4);
  color: var(--color-text-primary);
}
</style>

<template>
  <div class="pnote-section">
    <h3>密码本</h3>
    <el-table :data="dataList" @cell-mouse-enter="handleCellEnter" @cell-mouse-leave="handleCellLeave">
      <el-table-column type="index" width="50" />
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
      <el-table-column label="备注" prop="tips" width="140">
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
  toast('修改示例表示添加新数据', 'warning', 5000)
  service.get("/api/pwdnote").then((res: any) => {
    let arr: Array<PwdNoteData> = res;
    if (arr.length != 0) arr.forEach((item) => { item.isEdit = true; dataList.push(item) })
  })
})
</script>

<style scoped>
.cell-input { height: 26px; margin-left: -10px; }
:deep(.el-table .el-table__row) { height: 50px; }
</style>
