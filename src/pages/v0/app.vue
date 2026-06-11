<style scoped>
.app-section h3 {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0 0 var(--space-4);
  color: var(--color-text-primary);
}

.form-card {
  background: var(--color-bg-soft);
  border-radius: var(--radius-md);
  padding: var(--space-5);
  margin-bottom: var(--space-5);
}

.form-card h4 {
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0 0 var(--space-4);
  color: var(--color-text-primary);
}
</style>

<template>
  <div class="app-section">
    <h3>应用管理</h3>

    <div class="form-card">
      <h4>注册新应用</h4>
      <el-form ref="registerFormRef" :model="registerForm" :rules="registerRules" label-width="100px" style="max-width:500px;">
        <el-form-item label="应用名称" prop="appName">
          <el-input v-model="registerForm.appName" placeholder="请输入应用名称" />
        </el-form-item>
        <el-form-item label="应用描述" prop="appDesc">
          <el-input v-model="registerForm.appDesc" type="textarea" placeholder="请输入应用描述" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="registerLoading" @click="submitRegister(registerFormRef)" style="background:var(--color-accent);border-color:var(--color-accent);">注册应用</el-button>
          <el-button @click="resetRegisterForm(registerFormRef)">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="form-card">
      <h4>我的应用</h4>
      <el-table :data="appList" style="width:100%" v-loading="loading">
        <el-table-column prop="appId" label="App ID" width="180" />
        <el-table-column prop="appName" label="应用名称" width="160" />
        <el-table-column prop="appDesc" label="应用描述" />
        <el-table-column label="密钥" width="200">
          <template #default="scope">
            <span>{{ scope.row.appSecret ? (showSecret[scope.row.appId] ? scope.row.appSecret : '********') : '无' }}</span>
            <el-button v-if="scope.row.appSecret" size="small" @click="toggleSecret(scope.row.appId)" style="margin-left:8px;">
              {{ showSecret[scope.row.appId] ? '隐藏' : '显示' }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button size="small" type="warning" @click="resetAppKey(scope.row)" :loading="scope.row.resetting">重置密钥</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
