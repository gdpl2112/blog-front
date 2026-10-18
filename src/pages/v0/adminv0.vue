<style scoped>
/* =============================================
   帖子维护：一行一帖
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

.hint {
  margin: 0 0 var(--gap-5);
  font-size: var(--text-xs);
  line-height: 1.9;
  color: var(--ink-3);
}

.hint b {
  font-weight: 600;
  color: var(--ink-2);
}

.post-row {
  display: grid;
  grid-template-columns: 56px 56px minmax(0, 1fr);
  gap: var(--gap-3);
  align-items: center;
  padding: var(--gap-3) 0;
  border-bottom: 1px solid var(--rule);
  transition: background var(--dur) var(--ease);
}

.post-row:hover {
  background: var(--paper-2);
}

.state-btn {
  height: 26px;
  border: 1px solid var(--rule-2);
  border-radius: 8px;
  background: transparent;
  color: var(--ink-2);
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  cursor: pointer;
  transition: all var(--dur) var(--ease);
}

.state-btn:hover {
  border-color: var(--ink);
  color: var(--ink);
}

.state-btn.ok {
  border-color: rgba(47, 107, 79, 0.5);
  color: #2f6b4f;
  background: rgba(47, 107, 79, 0.06);
}

.state-btn.seal {
  border-color: var(--seal);
  color: var(--seal);
  background: var(--seal-wash);
}

.post-info {
  display: flex;
  align-items: baseline;
  gap: 10px;
  min-width: 0;
  flex-wrap: wrap;
}

.post-info strong {
  font-weight: 600;
  font-size: var(--text-sm);
  color: var(--ink);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

.post-meta {
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  color: var(--ink-3);
  letter-spacing: 0.04em;
}

.pager {
  margin-top: var(--gap-5);
  display: flex;
  justify-content: flex-end;
}
</style>

<template>
  <div class="ink-in">
    <div class="panel-head">
      <h2>帖子维护</h2>
      <span>{{ nr.total || 0 }} 篇</span>
    </div>

    <p class="hint">
      左侧数字是可见状态：<b>0</b> 可见、<b>1</b> 不可见、<b>2</b> 私有；右侧数字是置顶指数，越大越靠前。点击即可切换。
    </p>

    <div v-for="e in notices" :key="e.id" class="post-row">
      <button
        class="state-btn"
        :class="e.state == 0 ? 'ok' : 'seal'"
        :disabled="e.svl"
        @click="toVs(e)"
        :title="'可见状态 ' + e.state"
      >{{ e.state }}</button>

      <button
        class="state-btn"
        :class="e.sort > 0 ? 'ok' : ''"
        :disabled="e.svl"
        @click="toSort(e)"
        :title="'置顶指数 ' + e.sort"
      >{{ e.sort }}</button>

      <div class="post-info">
        <strong>{{ e.title }}</strong>
        <span class="post-meta">{{ e.authorName }}</span>
        <span class="post-meta">{{ e.date }}</span>
        <span class="chip">{{ e.type }}</span>
      </div>
    </div>

    <div class="pager">
      <el-pagination
        size="small"
        background
        layout="prev, pager, next"
        :total="nr.total"
        :page-size="nr.size"
        :current-page="p"
        @update:current-page="loadData"
      />
    </div>
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
