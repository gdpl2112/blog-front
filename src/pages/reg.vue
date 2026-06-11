<style scoped>
.reg-page {
  display: flex;
  min-height: 70vh;
  align-items: stretch;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-md);
}

.reg-brand {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: var(--space-10) var(--space-8);
  background: linear-gradient(135deg, #7c3aed, var(--color-accent));
  color: white;
}

.reg-brand h1 {
  font-size: 2.2rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 0 0 var(--space-3);
}

.reg-brand p {
  font-size: 1rem;
  opacity: 0.85;
  margin: 0;
  line-height: 1.6;
  max-width: 32ch;
}

.reg-form-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: var(--space-10) var(--space-8);
}

.reg-form-wrap h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 var(--space-6);
  color: var(--color-text-primary);
}

.reg-form {
  width: 100%;
  max-width: 360px;
}

@media (max-width: 768px) {
  .reg-page {
    flex-direction: column;
    min-height: auto;
  }
  .reg-brand {
    padding: var(--space-8) var(--space-6);
    text-align: center;
  }
  .reg-brand h1 { font-size: 1.6rem; }
  .reg-brand p { margin: 0 auto; }
  .reg-form-wrap {
    padding: var(--space-8) var(--space-6);
  }
}
</style>

<template>
  <div class="reg-page">
    <div class="reg-brand">
      <h1>kloping's blog</h1>
      <p>加入kloping的博客社区，探索更多精彩内容。</p>
    </div>
    <div class="reg-form-wrap">
      <h2>创建账号</h2>
      <el-form ref="ruleFormRef" :rules="rules" :model="ruleForm" class="reg-form">
        <el-form-item prop="username">
          <el-input v-model="ruleForm.username" placeholder="用户名" size="large">
            <template #prefix><el-icon><User /></el-icon></template>
          </el-input>
        </el-form-item>
        <el-form-item prop="email">
          <el-input v-model="ruleForm.email" placeholder="邮箱地址" size="large" />
        </el-form-item>
        <el-form-item prop="code">
          <div style="display:flex;gap:8px;width:100%;">
            <el-input v-model="ruleForm.code" placeholder="验证码" size="large" style="flex:1;" />
            <el-button :loading="reqLoading" @click="reqCode(ruleFormRef)" size="large" style="flex-shrink:0;">获取验证码</el-button>
          </div>
        </el-form-item>
        <el-form-item prop="pass">
          <el-input show-password v-model="ruleForm.pass" type="password" placeholder="密码" size="large">
            <template #prefix><el-icon><Lock /></el-icon></template>
          </el-input>
        </el-form-item>
        <el-form-item prop="checkPass">
          <el-input show-password v-model="ruleForm.checkPass" type="password" placeholder="确认密码" size="large">
            <template #prefix><el-icon><Lock /></el-icon></template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" type="primary" size="large" @click="submitForm" style="width:100%;background:var(--color-accent);border-color:var(--color-accent);">
            注册
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button size="large" @click="gotoLogin" style="width:100%;">已有账号？去登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {reactive, ref} from 'vue'
import {Lock, User} from '@element-plus/icons-vue'
import {useRouter} from "vue-router";
import type {FormInstance} from "element-plus";
import service from "@/axios";
import {toast} from "@/utils/utils";

const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({username: '', email: '', code: '', pass: '', checkPass: ''})

const validatePass = (rule: any, value: any, callback: any) => {
  if (value === '') callback(new Error('密码不能为空'))
  else { if (ruleForm.checkPass !== '') ruleFormRef.value?.validateField('checkPass'); callback() }
}
const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === '') callback(new Error('请确认密码'))
  else if (value !== ruleForm.pass) callback(new Error("密码输入不匹配"))
  else callback()
}

const rules = {
  email: [{required: true, message: '邮箱不可空', trigger: 'blur'},{type: 'email', message: '邮箱格式不正确', trigger: ['blur','change']}],
  username: [{required: true, message: '请输入用户名', trigger: 'blur'},{min: 3, max: 20, message: '长度在3到20个字符', trigger: 'blur'}],
  code: [{required: true, message: '请输入验证码', trigger: 'blur'},{min: 3, max: 20, message: '长度在3到20个字符', trigger: 'blur'}],
  pass: [{required: true, message: '请输入密码', trigger: 'blur'},{min: 6, max: 24, message: '长度在6到20个字符', trigger: 'blur'},{validator: validatePass, trigger: 'blur'}],
  checkPass: [{validator: validatePass2, trigger: 'blur'},{required: true, message: '请确认密码', trigger: 'blur'},{min: 6, max: 24, message: '长度在6到20个字符', trigger: 'blur'}]
}

const router = useRouter()
const loading = ref(false)
const reqLoading = ref(false)

const submitForm = () => {
  ruleFormRef.value?.validate((valid) => {
    if (valid) {
      loading.value = true
      const formData = new FormData()
      formData.append("eid", ruleForm.email)
      formData.append("name", ruleForm.username)
      formData.append("pwd", ruleForm.pass)
      formData.append("code", ruleForm.code)
      service.post("/user/reg", formData).then((res: any) => {
        if (res.code == 200) { toast("注册成功","success"); resetForm(); gotoLogin() }
        else toast(res.msg)
      }).finally(() => { loading.value = false })
    } else toast("请检查表单输入完整")
  })
}

const resetForm = () => { ruleForm.username = ''; ruleForm.email = ''; ruleForm.code = ''; ruleForm.pass = ''; ruleForm.checkPass = '' }

const reqCode = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validateField('email', (valid) => {
    if (valid) {
      reqLoading.value = true
      service.get("/user/req0?eid=" + ruleForm.email).then((res: any) => { toast(res, "warning") })
        .catch((err: any) => { toast("验证码发送失败:" + err) })
        .finally(() => { reqLoading.value = false })
    } else toast("请确保邮箱正确")
  })
}

const gotoLogin = () => { router.push("/login") }
</script>
