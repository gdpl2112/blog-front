<style scoped>
.sponsors-page {
  max-width: 800px;
  margin: 0 auto;
}

.sponsors-hero {
  text-align: center;
  margin-bottom: var(--space-8);
}

.sponsors-hero h1 {
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 0 0 var(--space-3);
  color: var(--color-text-primary);
}

.sponsors-hero p {
  color: var(--color-text-secondary);
  font-size: 1rem;
  line-height: 1.6;
  margin: 0 auto;
  max-width: 48ch;
}

.qr-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-6);
  margin-bottom: var(--space-10);
}

.qr-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  text-align: center;
  transition: all var(--transition-base);
}

.qr-card:hover {
  border-color: var(--color-accent-soft);
  box-shadow: var(--shadow-md);
}

.qr-card h4 {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0 0 var(--space-4);
  color: var(--color-text-primary);
}

.qr-image {
  width: 200px;
  height: 200px;
  object-fit: contain;
  margin: 0 auto;
  display: block;
  border-radius: var(--radius-sm);
}

.qr-card p {
  margin-top: var(--space-3);
  font-size: 0.85rem;
  color: var(--color-text-tertiary);
}

.sponsor-table-wrap {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
}

.sponsor-table-wrap h3 {
  font-size: 1.15rem;
  font-weight: 700;
  margin: 0 0 var(--space-5);
  color: var(--color-text-primary);
}

.sponsor-empty {
  text-align: center;
  padding: var(--space-8);
  color: var(--color-text-tertiary);
}

@media (max-width: 640px) {
  .qr-grid { grid-template-columns: 1fr; }
  .qr-image { width: 160px; height: 160px; }
}
</style>

<template>
  <div class="sponsors-page">
    <div class="sponsors-hero">
      <h1>赞助支持</h1>
      <p>您们的支持是我前进的动力！赞助时请备注（昵称:留言），收到后第一时间更新数据。</p>
    </div>

    <div class="qr-grid">
      <div class="qr-card">
        <h4>微信支付</h4>
        <img src="/images/wechat-qrcode.png" alt="微信收款码" class="qr-image" />
        <p>使用 WeChat 扫码</p>
      </div>
      <div class="qr-card">
        <h4>支付宝</h4>
        <img src="/images/alipay-qrcode.png" alt="支付宝收款码" class="qr-image" />
        <p>使用 Alipay 扫码</p>
      </div>
    </div>

    <div class="sponsor-table-wrap">
      <h3>赞助名单</h3>
      <div v-if="sponsors.length === 0" class="sponsor-empty">暂时没有赞助信息</div>
      <el-table v-else :data="sponsors" stripe style="width:100%">
        <el-table-column prop="name" label="姓名" width="140" />
        <el-table-column prop="amount" label="金额（元）" width="140">
          <template #default="{ row }">￥{{ row.amount }}</template>
        </el-table-column>
        <el-table-column prop="date" label="日期" width="160" />
        <el-table-column prop="msg" label="留言" />
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue';
import service from "@/axios";

const sponsors = ref([{id:1,name:'示例数据',amount:1.01,date:'2025-06-21',msg:'支持!'}]);

onMounted(() => {
  service.get('/api/get/sponsors').then((r: any) => { sponsors.value = r })
    .catch(e => console.log(e));
});
</script>
