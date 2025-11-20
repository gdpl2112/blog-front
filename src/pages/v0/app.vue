<template>
  <div>
    <h2>应用管理</h2>

    <!-- 应用注册表单 -->
    <el-card class="mb-4">
      <template #header>
        <div class="card-header">
          <span>注册新应用</span>
        </div>
      </template>

      <el-form
          ref="registerFormRef"
          :model="registerForm"
          :rules="registerRules"
          label-width="120px"
          class="max-w-md"
      >
        <el-form-item label="应用名称" prop="appName">
          <el-input v-model="registerForm.appName" placeholder="请输入应用名称"/>
        </el-form-item>

        <el-form-item label="应用描述" prop="appDesc">
          <el-input
              v-model="registerForm.appDesc"
              type="textarea"
              placeholder="请输入应用描述"
          />
        </el-form-item>

        <el-form-item>
          <el-button
              type="primary"
              @click="submitRegister(registerFormRef)"
              :loading="registerLoading"
          >
            注册应用
          </el-button>
          <el-button @click="resetRegisterForm(registerFormRef)">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 应用列表 -->
    <el-card>
      <template #header>
        <div class="card-header">
          <span>我的应用</span>
        </div>
      </template>

      <el-table
          :data="appList"
          style="width: 100%"
          v-loading="loading"
      >
        <el-table-column prop="appId" label="App ID" width="180"/>
        <el-table-column prop="appName" label="应用名称" width="180"/>
        <el-table-column prop="appDesc" label="应用描述"/>
        <el-table-column label="密钥" width="200">
          <template #default="scope">
            <span>{{
                scope.row.appSecret ? (showSecret[scope.row.appId] ? scope.row.appSecret : '********') : '无'
              }}</span>
            <el-button
                v-if="scope.row.appSecret"
                size="small"
                @click="toggleSecret(scope.row.appId)"
                class="ml-2"
            >
              {{ showSecret[scope.row.appId] ? '隐藏' : '显示' }}
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button
                size="small"
                type="warning"
                @click="resetAppKey(scope.row)"
                :loading="scope.row.resetting"
            >
              重置密钥
            </el-button>
            <!--            <el-button size="small" type="danger" @click="deleteApp(scope.row)">-->
            <!--              删除-->
            <!--            </el-button>-->
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, reactive, ref} from 'vue'
import type {FormInstance, FormRules} from 'element-plus'
import service from '@/axios'
import {toast} from '@/utils/utils'
import {MdPreview} from "md-editor-v3";

// 注册表单相关
const registerFormRef = ref<FormInstance>()
const registerLoading = ref(false)
const registerForm = reactive({
  appName: '',
  appDesc: ''
})

const registerRules = reactive<FormRules>({
  appName: [
    {required: true, message: '请输入应用名称', trigger: 'blur'},
    {min: 2, max: 30, message: '长度应在 2 到 30 个字符之间', trigger: 'blur'}
  ],
  appDesc: [
    {required: true, message: '请输入应用描述', trigger: 'blur'},
    {min: 5, max: 100, message: '长度应在 5 到 100 个字符之间', trigger: 'blur'}
  ]
})

// 应用列表相关
const appList = ref<any[]>([])
const loading = ref(false)
// 控制密钥显示/隐藏的状态对象
const showSecret = ref<Record<string, boolean>>({})

// 提交注册表单
const submitRegister = async (formEl: FormInstance | undefined) => {
  if (!formEl) return

  await formEl.validate((valid) => {
    if (valid) {
      registerLoading.value = true

      service.post('/auth/app/register', {
        app_name: registerForm.appName,
        app_desc: registerForm.appDesc
      }).then((res: any) => {
        toast('应用注册成功', 'success')
        resetRegisterForm(formEl)
        loadAppList() // 重新加载应用列表
      }).catch((err) => {
        toast('注册失败: ' + err.message)
      }).finally(() => {
        registerLoading.value = false
      })
    }
  })
}

// 重置注册表单
const resetRegisterForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

// 加载应用列表
const loadAppList = () => {
  loading.value = true

  service.get('/auth/app/info').then((res: any) => {
    appList.value = res || []
    // 初始化所有应用的密钥显示状态为隐藏
    appList.value.forEach(app => {
      showSecret.value[app.appId] = false
    })
  }).catch((err) => {
    toast('获取应用列表失败: ' + err.message)
  }).finally(() => {
    loading.value = false
  })
}

// 切换密钥显示/隐藏状态
const toggleSecret = (appId: string) => {
  showSecret.value[appId] = !showSecret.value[appId]
}

// 重置应用密钥
const resetAppKey = (row: any) => {
  // 设置正在重置状态
  row.resetting = true

  service.post('/auth/app/reset', {
    app_id: row.appId
  }).then((res: any) => {
    toast('密钥重置成功', 'success')
    // 更新列表中的应用信息
    const index = appList.value.findIndex(item => item.appId === row.appId)
    if (index !== -1) {
      appList.value[index] = res
      // 重置后默认隐藏密钥
      showSecret.value[res.appId] = false
    }
  }).catch((err) => {
    toast('密钥重置失败: ' + err.message)
  }).finally(() => {
    row.resetting = false
  })
}

// 删除应用（如果后端支持）
const deleteApp = (row: any) => {
  // 这里可以添加删除确认对话框
  toast('删除功能暂未实现')
}

// 组件挂载时加载应用列表
onMounted(() => {
  loadAppList()
})
</script>

<style scoped>
.mb-4 {
  margin-bottom: 1rem;
}

.max-w-md {
  max-width: 500px;
}

.card-header {
  font-weight: bold;
}

.ml-2 {
  margin-left: 0.5rem;
}
</style>