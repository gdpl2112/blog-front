<style scoped>
/* =============================================
   密码本：检索 → 一页表格 → 行尾删除
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

.toolbar {
  display: flex;
  gap: var(--gap-2);
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: var(--gap-4);
}

.cell-input {
  height: 28px;
}

.cell-input :deep(.el-input__wrapper) {
  box-shadow: none !important;
  background: var(--paper-2) !important;
}

.copy-btn {
  color: var(--ink-3);
  padding: 0 2px;
}

.copy-btn:hover {
  color: var(--seal);
}

.empty-text {
  font-size: var(--text-xs);
  color: var(--ink-3);
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
        在末尾空行填写内容即新增一条，鼠标离开整行自动保存；删除请用行尾按钮。
      </p>
      <span class="tool-count">{{ savedCount }} 条</span>
    </div>

    <div class="toolbar">
      <el-input v-model="keyword" style="width: 240px" placeholder="搜索平台、账号或备注" clearable>
        <template #prefix><i class="bi bi-search"></i></template>
      </el-input>
      <span v-if="keyword.trim()" class="tool-count">命中 {{ visibleList.length }} 条</span>
    </div>

    <el-table :data="visibleList" @cell-mouse-leave="handleCellLeave">
      <el-table-column type="index" width="46" />
      <el-table-column label="平台" prop="type" width="120">
        <template #default="scope"><el-input class="cell-input" v-model="scope.row.type" /></template>
      </el-table-column>
      <el-table-column label="账号类型" prop="stype" width="120">
        <template #default="scope"><el-input class="cell-input" v-model="scope.row.stype" /></template>
      </el-table-column>
      <el-table-column label="账号" prop="account" width="210">
        <template #default="scope">
          <el-input class="cell-input" v-model="scope.row.account">
            <template #suffix>
              <el-button link class="copy-btn" title="复制账号" @click.stop="copy(scope.row.account, '账号')">
                <i class="bi bi-clipboard"></i>
              </el-button>
            </template>
          </el-input>
        </template>
      </el-table-column>
      <el-table-column label="密码" prop="pwd" width="210">
        <template #default="scope">
          <el-input class="cell-input" v-model="scope.row.pwd" type="password" show-password>
            <template #suffix>
              <el-button link class="copy-btn" title="复制密码" @click.stop="copy(scope.row.pwd, '密码')">
                <i class="bi bi-clipboard"></i>
              </el-button>
            </template>
          </el-input>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="tips" min-width="140">
        <template #default="scope"><el-input class="cell-input" v-model="scope.row.tips" /></template>
      </el-table-column>
      <el-table-column label="操作" width="72" align="center">
        <template #default="scope">
          <el-button v-if="scope.row.id !== 0" link type="danger" @click="remove(scope.row)">删除</el-button>
        </template>
      </el-table-column>
      <template #empty><span class="empty-text">没有匹配的记录</span></template>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, reactive, ref} from 'vue'
import {ElMessageBox} from 'element-plus'
import service from '@/axios'
import {toast} from '@/utils/utils'

interface PwdNoteData {
  id: number
  type: string
  stype: string
  account: string
  pwd: string
  tips: string
  /** 落库时的内容快照，用于判断这一行是否真的被改过 */
  base: string
}

/** 末尾常驻一条空白行，填写后即成为新增入口 */
const dataList = reactive<PwdNoteData[]>([blank()])

const keyword = ref('')

const savedCount = computed(() => dataList.filter(item => item.id !== 0).length)

/** 搜索只在前端过滤已有记录；末尾空白行不参与，避免误填进筛选结果 */
const visibleList = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  if (!kw) return dataList
  return dataList.filter(row => row.id !== 0
    && [row.type, row.stype, row.account, row.tips].join(' ').toLowerCase().includes(kw))
})

function blank(): PwdNoteData {
  return {id: 0, type: '', stype: '', account: '', pwd: '', tips: '', base: ''}
}

/** 只提交业务字段，避免把界面状态发给后端 */
function payload(row: PwdNoteData) {
  return {type: row.type, stype: row.stype, account: row.account, pwd: row.pwd, tips: row.tips}
}

function snapshot(row: PwdNoteData) {
  return [row.type, row.stype, row.account, row.pwd, row.tips].join('\u0001')
}

function isEmpty(row: PwdNoteData) {
  return !row.type && !row.stype && !row.account && !row.pwd && !row.tips
}

function copy(value: string, label: string) {
  if (!value) {
    toast(`这一行还没有${label}`, 'warning')
    return
  }
  navigator.clipboard.writeText(value).then(() => toast(`已复制${label}`, 'success'))
}


/**
 * 只在鼠标真正离开整行时才保存。
 * el-table 的 cell-mouse-leave 是单元格级别的，行内换格同样会触发，
 * 这里用 relatedTarget 是否仍在该行内来判定，避免编辑中途被提前落库。
 */
function handleCellLeave(row: PwdNoteData, _column: unknown, cell: HTMLElement, event: Event) {
  const related = (event as MouseEvent).relatedTarget as Node | null
  if (related && cell?.parentElement?.contains(related)) return

  persist(row)
}

function persist(row: PwdNoteData) {
  if (row.id === 0) {
    // 空白行不落库；清空已有记录只保存空内容，删除必须走显式按钮
    if (isEmpty(row)) return
    service.post('/api/pwdnote', payload(row)).then((res: any) => {
      if (res.code == 200) {
        const created: PwdNoteData = {...res.data, base: ''}
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

async function remove(row: PwdNoteData) {
  try {
    await ElMessageBox.confirm(`删除「${row.type || row.account || '这一条'}」后无法恢复。`, '删除记录', {
      type: 'warning',
      confirmButtonText: '删除',
      cancelButtonText: '取消'
    })
  } catch {
    return
  }
  service.delete(`/api/pwdnote/${row.id}`).then((res: any) => {
    if (res.code == 200) {
      const index = dataList.findIndex(item => item.id === row.id)
      if (index >= 0) dataList.splice(index, 1)
      toast('删除成功', 'success', 2000)
    } else toast(res.msg)
  })
}

onMounted(() => {
  service.get('/api/pwdnote').then((res: any) => {
    const list: PwdNoteData[] = (Array.isArray(res) ? res : [])
      .map(item => ({...item, base: snapshot(item)}))
    // 已有记录排在前面，末尾始终保留一条空白新增行
    dataList.splice(0, dataList.length, ...list, blank())
  })
})
</script>