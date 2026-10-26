<style scoped>
/* =============================================
   密码本：可原地编辑的一页表格
   ============================================= */

.tool-bar {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--gap-4);
  flex-wrap: wrap;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--rule-2);
  margin-bottom: var(--gap-4);
}

.tool-hint {
  margin: 0;
  font-size: var(--text-xs);
  line-height: 1.8;
  color: var(--ink-3);
  max-width: 52em;
}

.tool-count {
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  letter-spacing: 0.08em;
  color: var(--ink-3);
  white-space: nowrap;
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
  <div class="tool">
    <div class="tool-bar">
      <p class="tool-hint">
        把鼠标移入任意一行即可编辑，移出这一行时自动保存；清空整行会被删除，在末尾空行填写内容即新增一条。
      </p>
      <span class="tool-count">{{ savedCount }} 条</span>
    </div>

    <el-table
      :data="dataList"
      @cell-mouse-enter="handleCellEnter"
      @cell-mouse-leave="handleCellLeave"
    >
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
import {computed, onMounted, reactive} from 'vue'
import service from '@/axios'
import {toast} from '@/utils/utils'

interface PwdNoteData {
  id: number
  type: string
  stype: string
  account: string
  pwd: string
  tips: string
  isEdit: boolean
  /** 落库时的内容快照，用于判断这一行是否真的被改过 */
  base: string
}

/** 末尾常驻一条空白行，填写后即成为新增入口 */
const dataList = reactive<PwdNoteData[]>([blank()])

const savedCount = computed(() => dataList.filter(item => item.id !== 0).length)

function blank(): PwdNoteData {
  return {id: 0, type: '', stype: '', account: '', pwd: '', tips: '', isEdit: true, base: ''}
}

/** 只提交业务字段，避免把 isEdit / base 之类的界面状态发给后端 */
function payload(row: PwdNoteData) {
  return {type: row.type, stype: row.stype, account: row.account, pwd: row.pwd, tips: row.tips}
}

function snapshot(row: PwdNoteData) {
  return [row.type, row.stype, row.account, row.pwd, row.tips].join('\u0001')
}

function isEmpty(row: PwdNoteData) {
  return !row.type && !row.stype && !row.account && !row.pwd && !row.tips
}

function handleCellEnter(row: PwdNoteData) {
  row.isEdit = true
}

/**
 * 只在鼠标真正离开整行时才保存。
 * el-table 的 cell-mouse-leave 是单元格级别的，行内换格同样会触发，
 * 这里用 relatedTarget 是否仍在该行内来判定，避免编辑中途被提前落库。
 */
function handleCellLeave(row: PwdNoteData, _column: unknown, cell: HTMLElement, event: Event) {
  const related = (event as MouseEvent).relatedTarget as Node | null
  if (related && cell?.parentElement?.contains(related)) return

  row.isEdit = false
  persist(row)
}

function persist(row: PwdNoteData) {
  if (isEmpty(row)) {
    if (row.id !== 0) {
      service.delete(`/api/pwdnote/${row.id}`).then((res: any) => {
        if (res.code == 200) {
          const index = dataList.findIndex(item => item.id === row.id)
          if (index >= 0) dataList.splice(index, 1)
          toast('删除成功', 'success', 2000)
        } else toast(res.msg)
      })
    }
    return
  }

  if (row.id === 0) {
    service.post('/api/pwdnote', payload(row)).then((res: any) => {
      if (res.code == 200) {
        const created: PwdNoteData = {...res.data, isEdit: true, base: ''}
        created.base = snapshot(created)
        // 插在空白行之前，保证末尾始终是新增入口
        dataList.splice(dataList.length - 1, 0, created)
        Object.assign(row, blank())
        toast('添加成功', 'success', 2000)
      } else toast(res.msg)
    })
    return
  }

  if (snapshot(row) === row.base) return

  service.put(`/api/pwdnote/${row.id}`, payload(row)).then((res: any) => {
    if (res.code == 200) {
      row.base = snapshot(row)
      toast('修改成功', 'success', 2000)
    } else toast(res.msg)
  })
}

onMounted(() => {
  service.get('/api/pwdnote').then((res: any) => {
    const list: Array<PwdNoteData> = Array.isArray(res) ? res : []
    list.forEach(item => {
      item.isEdit = true
      item.base = snapshot(item)
      dataList.push(item)
    })
  })
})
</script>
