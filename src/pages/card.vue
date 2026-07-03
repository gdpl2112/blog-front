<style scoped>
.card-page {
  max-width: 560px;
  margin: 0 auto;
}

.card-hero {
  text-align: center;
  margin-bottom: var(--space-8);
}

.card-hero h1 {
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 0 0 var(--space-3);
  color: var(--color-text-primary);
}

.card-hero p {
  color: var(--color-text-secondary);
  font-size: 1rem;
  margin: 0 auto;
}

.card-box {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
}

.redeem-bar {
  display: flex;
  gap: var(--space-2);
}

.result-box {
  margin-top: var(--space-6);
  padding: var(--space-4);
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-sm);
  text-align: center;
}

.result-box .secret {
  font-size: 1.1rem;
  font-weight: 700;
  word-break: break-all;
  color: var(--color-accent);
  margin: var(--space-2) 0;
}
</style>

<template>
  <div class="card-page">
    <div class="card-hero">
      <h1>卡号兑换</h1>
      <p>输入卡号，兑换对应的卡密</p>
    </div>
    <div class="card-box">
      <div class="redeem-bar">
        <el-input v-model="no" placeholder="请输入卡号" @keyup.enter="redeem" />
        <el-button type="primary" :loading="loading" @click="redeem">兑换</el-button>
      </div>
      <div class="result-box" v-if="secret">
        <div>兑换成功！你的卡密为：</div>
        <div class="secret" id="card-secret">{{ secret }}</div>
        <el-button size="small" @click="copy">复制卡密</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import service from "@/axios";
import {toast, copyTextElement} from "@/utils/utils";

const no = ref("")
const secret = ref("")
const loading = ref(false)

function redeem() {
  if (!no.value.trim()) { toast("请输入卡号", "warning"); return }
  loading.value = true
  secret.value = ""
  service.get("/api/card/redeem?no=" + encodeURIComponent(no.value.trim())).then((r: any) => {
    loading.value = false
    if (r.code == 200) { secret.value = r.secret; toast(r.msg, "success") }
    else toast(r.msg)
  }).catch(() => { loading.value = false })
}

function copy() { copyTextElement("#card-secret") }
</script>
