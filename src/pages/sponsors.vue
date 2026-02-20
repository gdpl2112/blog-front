<script setup lang="ts">
import {onMounted, ref} from 'vue';
import service from "@/axios";

// 赞助列表数据
const sponsors = ref([
  {id: 1, name: '示例数据', amount: 1.01, date: '2025-06-21', msg: '支持!'},
]);

onMounted(() => {
  service.get('/api/get/sponsors').then((r) => {
    sponsors.value = r
  }).catch(e => {
    console.log(e)
  });
})
</script>

<template>
  <div class="container my-5" style="border-radius: 10px;background-color: rgba(207,216,230,0.7)">
    <br>
    <hr>
    <!-- 收款码部分 -->
    <div class="text-center mb-5">
      <h2 class="mb-4">友友们的赞助支持</h2>
      <p>您们的支持是我
        <del>(们)</del>
        前进的动力！
      </p>
      <p>赞助预留备注(昵称:留言)
        <del>可选</del>
        ,收到第一时间更新数据
      </p>
    </div>

    <el-row :gutter="20" justify="center" :xs="24" :sm="12" :md="8">
      <el-col :span="8" :xs="24">
        <el-card class="text-center sponsor-card">
          <h4 class="mb-3">微信支付</h4>
          <div class="qrcode-container">
            <img src="/images/wechat-qrcode.png" alt="微信收款码" class="qrcode"/>
          </div>
          <p style="margin-top: 10px">使用Wechat</p>
        </el-card>
      </el-col>
      <el-col :span="8" :xs="24">
        <el-card class="text-center sponsor-card">
          <h4 class="mb-3">支付宝支付</h4>
          <div class="qrcode-container">
            <img src="/images/alipay-qrcode.png" alt="支付宝收款码" class="qrcode"/>
          </div>
          <p style="margin-top: 10px">使用Alipay</p>
        </el-card>
      </el-col>
    </el-row>

    <!-- 赞助列表 -->
    <div class="sponsor-list mt-5">
      <h3 class="mb-4">赞助名单</h3>
      <h4 v-if="sponsors.length == 0"> 暂时没有赞助信息😭😭 </h4>
      <el-table v-if="sponsors.length > 0" :data="sponsors" stripe style="width: 100%">
        <el-table-column prop="name" label="姓名" width="150"></el-table-column>
        <el-table-column prop="amount" label="金额（元）" width="150">
          <template #default="{ row }">
            ￥{{ row.amount }}
          </template>
        </el-table-column>
        <el-table-column prop="date" label="日期" width="180"></el-table-column>
        <el-table-column prop="msg" label="留言"></el-table-column>
      </el-table>
    </div>
    <hr>
    <br>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
}

.qrcode {
  max-width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.sponsor-card {
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
}

.sponsor-card .qrcode-container {
  width: 250px;
  height: 260px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.sponsor-list {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .el-col {
    margin-bottom: 20px;
  }
  
  .el-col:last-child {
    margin-bottom: 0;
  }
  
  .qrcode {
    max-width: 80%;
    height: auto;
  }
}
</style>