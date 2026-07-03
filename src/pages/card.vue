<style scoped>
.card-page {
  max-width: 480px;
  margin: 40px auto;
  text-align: center;
}

.redeem-bar {
  display: flex;
  gap: 8px;
  margin-top: 16px;
}

.secret {
  margin-top: 16px;
  font-weight: 700;
  word-break: break-all;
}
</style>

<template>
  <div class="card-page">
    <h2>卡号兑换</h2>
    <div class="redeem-bar">
      <el-input v-model="no" placeholder="请输入卡号" @keyup.enter="redeem" />
      <el-button type="primary" @click="redeem">兑换</el-button>
    </div>
    <div class="secret" v-if="secret">卡密：{{ secret }}</div>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import service from "@/axios";
import {toast} from "@/utils/utils";

const no = ref("")
const secret = ref("")

function redeem() {
  if (!no.value.trim()) { toast("请输入卡号", "warning"); return }
  service.get("/api/card/redeem?no=" + encodeURIComponent(no.value.trim())).then((r: any) => {
    if (r.code == 200) secret.value = r.secret
    else toast(r.msg)
  })
}
</script>
