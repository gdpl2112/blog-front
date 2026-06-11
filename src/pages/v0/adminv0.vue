<style scoped>
.admin-section h3 {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0 0 var(--space-4);
  color: var(--color-text-primary);
}

.admin-hint {
  font-size: 0.8rem;
  color: var(--color-text-tertiary);
  margin-bottom: var(--space-4);
  line-height: 1.6;
}

.post-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: 12px 16px;
  background: var(--color-bg-soft);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-2);
  font-size: 0.88rem;
  transition: all var(--transition-fast);
}

.post-item:hover {
  background: var(--color-accent-soft);
}

.post-info {
  flex: 1;
  min-width: 0;
  display: flex;
  gap: var(--space-3);
  align-items: center;
  flex-wrap: wrap;
}
</style>

<template>
  <div class="admin-section">
    <h3>帖子管理</h3>
    <div class="admin-hint">
      可见状态: 0可见 / 1不可见 / 2私有 &nbsp;|&nbsp; 置顶指数: 越高越置顶
    </div>

    <div v-for="e in notices" :key="e.id" class="post-item">
      <el-button :loading="e.svl" :type="e.state == 0 ? 'success' : 'danger'" size="small" @click="toVs(e)">{{ e.state }}</el-button>
      <el-button :loading="e.svl" :type="e.sort>0?'success':'info'" size="small" @click="toSort(e)">{{ e.sort }}</el-button>
      <div class="post-info">
        <strong>{{ e.title }}</strong>
        <span style="color:var(--color-text-tertiary);font-size:0.8rem;">{{ e.authorName }}</span>
        <span style="color:var(--color-text-tertiary);font-size:0.8rem;">{{ e.date }}</span>
        <span class="tag tag-accent" style="font-size:0.7rem;">{{ e.type }}</span>
      </div>
    </div>

    <el-pagination size="default" background layout="prev, pager, next" :total="nr.total" :page-size="nr.size" :current-page="p" @update:current-page="loadData" class="mt-4" />
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import service from "@/axios";
import {toast} from "@/utils/utils";

const p = ref(1)
const nr = ref({} as any)
let notices = ref([] as any[])

function loadData(n: number) {
  service.get("/adm/notice/list?ps=7&p=" + n).then((r: any) => {
    nr.value = r; notices.value = r.records; p.value = r.current;
    notices.value.forEach(e => { e.svl = false })
  })
}
onMounted(() => { loadData(1) })

function toSort(e: any) { e.svl = true; service.get("/adm/notice/sort?id=" + e.id).then((r: any) => { e.svl = false; if (r.code == 200) { e.sort = r.sort; toast(r.msg, "success") } else toast(r.msg) }) }
function toVs(e: any) { e.svl = true; service.get("/adm/notice/state?id=" + e.id).then((r: any) => { e.svl = false; if (r.code == 200) { e.state = r.state; toast(r.msg, "success") } else toast(r.msg) }) }
</script>
