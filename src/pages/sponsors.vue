<style scoped>
/* =============================================
   赞助页：两张收款图版 + 一份名单
   ============================================= */

.sponsors {
  padding-top: var(--gap-4);
}

.sponsors-head {
  max-width: 36em;
  padding-bottom: var(--gap-5);
}

.sponsors-head h1 {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 600;
  letter-spacing: 0.06em;
  margin: 0 0 10px;
}

.sponsors-head p {
  margin: 0;
  font-size: var(--text-sm);
  line-height: 1.95;
  color: var(--ink-2);
}

/* ---------- 图版 ---------- */

.plates {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--gap-5);
  padding-bottom: var(--gap-7);
}

.plate {
  border: 1px solid var(--glass-line);
  border-radius: var(--r-lg);
  padding: var(--gap-5);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--gap-3);
  background: var(--glass);
  box-shadow: var(--glass-shadow), var(--glass-inner);
  backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-sat));
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-sat));
  transition: transform var(--dur) var(--ease), background var(--dur) var(--ease);
}

.plate:hover {
  transform: translateY(-2px);
  background: var(--glass-strong);
}

.plate h2 {
  font-size: var(--text-base);
  font-weight: 600;
  letter-spacing: 0.08em;
  margin: 0;
  align-self: flex-start;
}

.plate-img {
  width: min(220px, 100%);
  aspect-ratio: 1;
  object-fit: contain;
  padding: var(--gap-2);
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid var(--glass-line-2);
  border-radius: var(--r-md);
}

.plate-note {
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  letter-spacing: 0.1em;
  color: var(--ink-3);
  margin: 0;
}

/* ---------- 名单 ---------- */

.list-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--gap-4);
  padding-bottom: var(--gap-3);
  border-bottom: 1px solid var(--rule-2);
}

.list-head h2 {
  font-size: var(--text-lg);
  letter-spacing: 0.06em;
}

.list-head span {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--ink-3);
  letter-spacing: 0.06em;
}

.sponsor-row {
  display: grid;
  grid-template-columns: 160px 120px 120px minmax(0, 1fr);
  gap: var(--gap-4);
  align-items: baseline;
  padding: var(--gap-4) var(--gap-1);
  border-bottom: 1px solid var(--rule);
  font-size: var(--text-sm);
  transition: background var(--dur) var(--ease);
}

.sponsor-row:hover {
  background: var(--glass-thin);
}

.sponsor-name {
  font-weight: 600;
  color: var(--ink);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sponsor-amount {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: var(--seal);
  font-weight: 600;
  letter-spacing: 0.02em;
}

.sponsor-date {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--ink-3);
  letter-spacing: 0.04em;
}

.sponsor-msg {
  color: var(--ink-2);
  overflow-wrap: anywhere;
}

.sponsor-empty {
  padding: var(--gap-7) 0;
  color: var(--ink-3);
  font-size: var(--text-sm);
}

@media (max-width: 760px) {
  .plates {
    grid-template-columns: 1fr;
  }

  .sponsor-row {
    grid-template-columns: minmax(0, 1fr) auto;
    row-gap: 4px;
  }

  .sponsor-name { grid-column: 1; }
  .sponsor-amount { grid-column: 2; text-align: right; }
  .sponsor-date { grid-column: 1; }
  .sponsor-msg { grid-column: 1 / -1; }
}
</style>

<template>
  <div class="sponsors ink-in">
    <header class="sponsors-head">
      <h1>赞助</h1>
      <p>
        这个站点的服务器、域名和写文章时喝掉的咖啡，都由这些二维码支撑。
        转账时留一句昵称和留言，我会把它记在下面的名单里。
      </p>
    </header>

    <!-- 图版 -->
    <section class="plates">
      <div class="plate">
        <h2>微信支付</h2>
        <img src="/images/wechat-qrcode.png" alt="微信收款码" class="plate-img" />
        <p class="plate-note">扫码转账</p>
      </div>
      <div class="plate">
        <h2>支付宝</h2>
        <img src="/images/alipay-qrcode.png" alt="支付宝收款码" class="plate-img" />
        <p class="plate-note">扫码转账</p>
      </div>
    </section>

    <!-- 名单 -->
    <section>
      <div class="list-head">
        <h2>赞助名单</h2>
        <span>{{ sponsors.length }} 位</span>
      </div>

      <div v-if="sponsors.length === 0" class="sponsor-empty">还没有人留下名字。</div>

      <div v-else>
        <div v-for="s in sponsors" :key="s.id" class="sponsor-row">
          <span class="sponsor-name">{{ s.name }}</span>
          <span class="sponsor-amount">¥ {{ s.amount }}</span>
          <span class="sponsor-date">{{ s.date }}</span>
          <span class="sponsor-msg">{{ s.msg }}</span>
        </div>
      </div>
    </section>
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
