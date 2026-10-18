<style scoped>
/* =============================================
   文章管理：三份清单
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

.group {
  border-bottom: 1px solid var(--rule);
}

.group-head {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 13px 2px;
  border: 0;
  background: transparent;
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  color: var(--ink);
  text-align: left;
  cursor: pointer;
  transition: color var(--dur) var(--ease);
}

.group-head:hover {
  color: var(--seal);
}

.group-head i {
  font-size: 9px;
  color: var(--ink-3);
  transition: transform var(--dur) var(--ease);
}

.group-head.open i {
  transform: rotate(90deg);
}

.group-head .n {
  margin-left: auto;
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  color: var(--ink-3);
  letter-spacing: 0.06em;
}

.rows {
  padding: 0 0 10px;
}

.row {
  display: flex;
  align-items: baseline;
  gap: var(--gap-4);
  padding: 9px 2px 9px 20px;
  border-top: 1px solid var(--rule);
  cursor: pointer;
  transition: background var(--dur) var(--ease);
}

.row:hover {
  background: var(--paper-2);
}

.row-title {
  flex: 1;
  min-width: 0;
  font-size: var(--text-sm);
  color: var(--ink);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.row:hover .row-title {
  color: var(--seal);
}

.row-time {
  flex-shrink: 0;
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  color: var(--ink-3);
  letter-spacing: 0.04em;
}

.rows-empty {
  padding: 12px 2px 14px 20px;
  font-size: var(--text-xs);
  color: var(--ink-3);
}
</style>

<template>
  <div class="ink-in">
    <div class="panel-head">
      <h2>文章管理</h2>
      <span>共 {{ datas.length + dataw.length + datap.length }} 篇</span>
    </div>

    <div class="group">
      <button class="group-head" :class="{ open: open1 }" @click="open1 = !open1">
        <i class="bi bi-chevron-right"></i>
        我发布的
        <span class="n">{{ datas.length }}</span>
      </button>
      <div v-if="open1" class="rows">
        <p v-if="datas.length === 0" class="rows-empty">还没有发布过文章。</p>
        <div v-for="e in datas" :key="e.id" class="row" @click="toArticle(e.id)">
          <span class="row-title">{{ e.title }}</span>
          <span class="row-time">{{ e.time }}</span>
        </div>
      </div>
    </div>

    <div class="group">
      <button class="group-head" :class="{ open: open2 }" @click="open2 = !open2">
        <i class="bi bi-chevron-right"></i>
        我收藏的
        <span class="n">{{ dataw.length }}</span>
      </button>
      <div v-if="open2" class="rows">
        <p v-if="dataw.length === 0" class="rows-empty">收藏夹是空的。</p>
        <div v-for="e in dataw" :key="e.id" class="row" @click="toArticle(e.id)">
          <span class="row-title">{{ e.title }}</span>
          <span class="row-time">{{ e.time }}</span>
        </div>
      </div>
    </div>

    <div class="group">
      <button class="group-head" :class="{ open: open3 }" @click="open3 = !open3">
        <i class="bi bi-chevron-right"></i>
        仅自己可见
        <span class="n">{{ datap.length }}</span>
      </button>
      <div v-if="open3" class="rows">
        <p v-if="datap.length === 0" class="rows-empty">没有私有文章。</p>
        <div v-for="e in datap" :key="e.id" class="row" @click="toArticle(e.id)">
          <span class="row-title">{{ e.title }}</span>
          <span class="row-time">{{ e.time }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import service from "@/axios";
import {ref} from "vue";
import router from "@/router";

const open1 = ref(true)
const open2 = ref(true)
const open3 = ref(true)

let datas = ref([])
let dataw = ref([])
let datap = ref([])

service.get("/notice/myall").then((res: any) => { datas.value = res })
service.get("/notice/favorites").then((res: any) => { dataw.value = res })
service.get("/notice/privates").then((res: any) => { datap.value = res })

function toArticle(id: number) { router.push({path: '/article', query: {id: id}}) }
</script>
