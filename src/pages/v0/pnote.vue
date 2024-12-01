<template>
  <div>
    <el-table :data="dataList" @cell-mouse-enter="handleCellEnter" @cell-mouse-leave="handleCellLeave">
      <el-table-column type="index" width="50"/>
      <el-table-column label="平台" prop="type" width="120">
        <template #default="scope">
          <el-input v-if="scope.row.isEdit" class="cell-input" v-model="scope.row.type"
                    @input="handlerChange(scope.row, scope.row.type)"/>
        </template>
      </el-table-column>
      <el-table-column label="账号类型" prop="stype" width="120">
        <template #default="scope">
          <el-input v-if="scope.row.isEdit" class="cell-input" v-model="scope.row.stype"
                    @input="handlerChange(scope.row, scope.row.stype)"/>
        </template>
      </el-table-column>
      <el-table-column label="账号" prop="account" width="240">
        <template #default="scope">
          <el-input v-if="scope.row.isEdit" class="cell-input" v-model="scope.row.account"
                    @input="handlerChange(scope.row, scope.row.account)"/>
        </template>
      </el-table-column>
      <el-table-column label="密码" prop="pwd" width="240">
        <template #default="scope">
          <el-input v-if="scope.row.isEdit" class="cell-input" v-model="scope.row.pwd"
                    @input="handlerChange(scope.row, scope.row.pwd)"/>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="tips" width="160">
        <template #default="scope">
          <el-input v-if="scope.row.isEdit" class="cell-input" v-model="scope.row.tips"
                    @input="handlerChange(scope.row, scope.row.tips)"/>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive} from 'vue';
import {toast} from "@/utils/utils";
import service from "@/axios";

interface PwdNoteData {
  id: number,
  type: string,
  stype: string,
  account: string,
  pwd: string,
  tips: string,
  isEdit: boolean
}

const dataList = reactive<PwdNoteData[]>([
  {
    id: 0,
    type: '',
    stype: '',
    account: '',
    pwd: '',
    tips: '',
    isEdit: true
  }
])
let mr: PwdNoteData = {
  isEdit: false
}
const handleCellEnter = (row: any, column: any, cell: any, event: any) => {
  row.isEdit = true
  mr.id = row.id
  mr.account = row.account
  mr.pwd = row.pwd
  mr.stype = row.stype
  mr.tips = row.tips
  mr.type = row.type
  mr.isEdit = row.isEdit
}

const handleCellLeave = (row: any, column: any, cell: any, event: any) => {
  row.isEdit = false
  //判断mr是否修改
  if (row.type == '' && row.stype == '' && row.account == '' && row.pwd == '' && row.tips == '') {
    if (row.id != 0) {
      service.delete(`/api/pwdnote/${row.id}`).then(res => {
        if (res.code == 200) {
          //通过id移除dataList指定元素
          dataList.splice(dataList.findIndex(item => item.id === row.id), 1)
          toast("删除成功", "success", 2000)
        } else {
          toast(res.msg)
        }
      });
    }
  }else if (row.id == 0) {
    service.post("/api/pwdnote", row).then(res => {
      if (res.code == 200) {
        res.data.isEdit = true
        dataList.push(res.data)
        row.type = ''
        row.stype = ''
        row.account = ''
        row.pwd = ''
        row.tips = ''
        toast("添加成功", "success", 2000)
      } else {
        toast(res.msg)
      }
    })
  } else if (mr.type != row.type || mr.stype != row.stype || mr.account != row.account || mr.pwd != row.pwd || mr.tips != row.tips) {
    service.put(`/api/pwdnote/${row.id}`, row).then(res => {
      if (res.code == 200) {
        toast("修改成功", "success", 2000)
      } else {
        toast(res.msg)
      }
    });
  }

}

function handlerChange(e: PwdNoteData, value: string) {

}

onMounted(() => {
  toast('修改示例表示添加新数据', 'warning', 5000)
  service.get("/api/pwdnote").then(res => {
    let arr: Array<PwdNoteData> = res;
    if (arr.length != 0) {
      arr.forEach((item) => {
        item.isEdit = true
        dataList.push(item)
      })
    }
  })
})
</script>
<style scoped>
.cell-input {
  height: 26px;
  margin-left: -10px;
}

:deep(.cell-select .el-select__wrapper) {
  height: 26px;
  min-height: 26px;
  margin-left: -11px;
}

:deep(.el-table .el-table__row) {
  height: 50px;
}
</style>
