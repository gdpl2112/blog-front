<style scoped>
/* =============================================
   应用管理：注册 + 清单
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

.block {
  padding-bottom: var(--gap-5);
  margin-bottom: var(--gap-5);
  border-bottom: 1px solid var(--rule);
}

.block:last-child {
  border-bottom: 0;
  margin-bottom: 0;
}

.block h3 {
  font-size: var(--text-base);
  font-weight: 600;
  letter-spacing: 0.04em;
  margin: 0 0 4px;
}

.block .tip {
  margin: 0 0 var(--gap-4);
  font-size: var(--text-xs);
  line-height: 1.8;
  color: var(--ink-3);
}

.block :deep(.el-form-item) {
  margin-bottom: 12px;
}

.form-actions {
  display: flex;
  gap: var(--gap-2);
}

.mono-cell {
  font-family: var(--font-mono);
  font-size: 11.5px;
  color: var(--ink-2);
  overflow-wrap: anywhere;
}

.secret-toggle {
  border: 0;
  background: none;
  padding: 0 0 0 8px;
  font-size: var(--text-2xs);
  color: var(--seal);
  cursor: pointer;
}
</style>

<template>
  <div class="ink-in">
    <div class="panel-head">
      <h2>应用管理</h2>
      <span>{{ appList.length }} 个</span>
    </div>

    <!-- 注册 -->
    <section class="block">
      <h3>注册新应用</h3>
      <p class="tip">
        注册后会得到一个 App ID 和密钥，用于第三方登录与授权页（/authc）。
      </p>
      <el-form ref="registerFormRef" :model="registerForm" :rules="registerRules" label-width="84px" style="max-width: 520px">
        <el-form-item label="应用名称" prop="appName">
          <el-input v-model="registerForm.appName" placeholder="2–30 个字" />
        </el-form-item>
        <el-form-item label="应用描述" prop="appDesc">
          <el-input v-model="registerForm.appDesc" type="textarea" :rows="3" placeholder="5–100 个字" />
        </el-form-item>
        <el-form-item>
          <div class="form-actions">
            <el-button type="primary" :loading="registerLoading" @click="submitRegister(registerFormRef)">注册应用</el-button>
            <el-button @click="resetRegisterForm(registerFormRef)">重置</el-button>
          </div>
        </el-form-item>
      </el-form>
    </section>

    <!-- 清单 -->
    <section class="block">
      <h3>我的应用</h3>
      <p v-if="appList.length === 0" class="tip">还没有注册过应用。</p>

      <el-table v-else :data="appList" style="width: 100%" v-loading="loading">
        <el-table-column label="App ID" width="190">
          <template #default="{ row }"><span class="mono-cell">{{ row.appId }}</span></template>
        </el-table-column>
        <el-table-column prop="appName" label="名称" width="150" />
        <el-table-column prop="appDesc" label="描述" min-width="200" show-overflow-tooltip />
        <el-table-column label="密钥" width="230">
          <template #default="{ row }">
            <span class="mono-cell">
              {{ row.appSecret ? (showSecret[row.appId] ? row.appSecret : '••••••••••••') : '无' }}
            </span>
            <button v-if="row.appSecret" class="secret-toggle" @click="toggleSecret(row.appId)">
              {{ showSecret[row.appId] ? '隐藏' : '显示' }}
            </button>
          </template>
        </el-table-column>
        <el-table-column label="" width="96" align="right">
          <template #default="{ row }">
            <el-button size="small" type="warning" plain @click="resetAppKey(row)" :loading="row.resetting">重置密钥</el-button>
          </template>
        </el-table-column>
      </el-table>
    </section>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, reactive, ref} from 'vue'
import type {FormInstance, FormRules} from 'element-plus'
import service from '@/axios'
import {toast} from '@/utils/utils'

const registerFormRef = ref<FormInstance>()
const registerLoading = ref(false)
const registerForm = reactive({appName:'', appDesc:''})
const registerRules = reactive<FormRules>({
  appName: [{required:true,message:'请输入应用名称',trigger:'blur'},{min:2,max:30,message:'长度2-30',trigger:'blur'}],
  appDesc: [{required:true,message:'请输入应用描述',trigger:'blur'},{min:5,max:100,message:'长度5-100',trigger:'blur'}]
})
const appList = ref<any[]>([])
const loading = ref(false)
const showSecret = ref<Record<string,boolean>>({})

const submitRegister = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      registerLoading.value = true
      service.post('/auth/app/register', {app_name: registerForm.appName, app_desc: registerForm.appDesc})
        .then((res: any) => { toast('注册成功', 'success'); resetRegisterForm(formEl); loadAppList() })
        .catch((err) => toast('注册失败: ' + err.message))
        .finally(() => { registerLoading.value = false })
    }
  })
}
const resetRegisterForm = (formEl: FormInstance | undefined) => { if (formEl) formEl.resetFields() }
const loadAppList = () => {
  loading.value = true
  service.get('/auth/app/info').then((res: any) => {
    appList.value = res || []
    appList.value.forEach(app => { showSecret.value[app.appId] = false })
  }).catch((err) => toast('获取失败: ' + err.message)).finally(() => { loading.value = false })
}
const toggleSecret = (appId: string) => { showSecret.value[appId] = !showSecret.value[appId] }
const resetAppKey = (row: any) => {
  row.resetting = true
  service.post('/auth/app/reset', {app_id: row.appId}).then((res: any) => {
    toast('密钥重置成功', 'success')
    const index = appList.value.findIndex(item => item.appId === row.appId)
    if (index !== -1) { appList.value[index] = res; showSecret.value[res.appId] = false }
  }).catch((err) => toast('重置失败: ' + err.message)).finally(() => { row.resetting = false })
}

onMounted(() => { loadAppList() })
</script>
