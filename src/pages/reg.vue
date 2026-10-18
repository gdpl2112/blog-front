<style scoped>
/* =============================================
   注册：与登录同一册扉页，副本略作区分
   ============================================= */

.entry-page {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 420px;
  min-height: calc(100vh - var(--nav-h) - 232px);
  border: 1px solid var(--glass-line);
  border-radius: var(--r-lg);
  background: var(--glass);
  box-shadow: var(--glass-shadow), var(--glass-inner);
  backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-sat));
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-sat));
  overflow: hidden;
}

.entry-side {
  position: relative;
  background: var(--glass-thin);
  border-right: 1px solid var(--glass-line-2);
  padding: var(--gap-7) var(--gap-6);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: var(--gap-7);
}

.entry-side h1 {
  font-family: var(--font-display);
  font-size: clamp(24px, 2.8vw, 34px);
  font-weight: 600;
  letter-spacing: 0.1em;
  line-height: 1.45;
  margin: var(--gap-5) 0 var(--gap-4);
  color: var(--ink);
}

.entry-side p {
  margin: 0;
  max-width: 24em;
  font-size: var(--text-sm);
  line-height: 2;
  color: var(--ink-2);
}

.side-list {
  list-style: none;
  margin: var(--gap-5) 0 0;
  padding: 0;
  border-top: 1px solid var(--rule-2);
}

.side-list li {
  display: flex;
  gap: 12px;
  padding: 11px 0;
  border-bottom: 1px solid var(--rule);
  font-size: var(--text-sm);
  color: var(--ink-2);
}

.side-list li::before {
  content: '—';
  color: var(--seal);
  font-family: var(--font-mono);
  font-size: 11px;
  line-height: 2.1;
}

.entry-form {
  padding: var(--gap-7) var(--gap-6);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.entry-form h2 {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 600;
  letter-spacing: 0.06em;
  margin: 0 0 6px;
}

.entry-form .sub {
  margin: 0 0 var(--gap-5);
  font-size: var(--text-sm);
  color: var(--ink-3);
}

.form-block {
  width: 100%;
}

.form-block :deep(.el-form-item) {
  margin-bottom: 12px;
}

.code-row {
  display: flex;
  gap: 8px;
  width: 100%;
}

.code-row :deep(.el-button) {
  flex-shrink: 0;
}

@media (max-width: 900px) {
  .entry-page {
    grid-template-columns: 1fr;
    min-height: auto;
  }

  .entry-side {
    padding: var(--gap-6) var(--gap-5);
    border-right: 0;
    border-bottom: 1px solid var(--rule);
    gap: var(--gap-4);
  }

  .entry-side h1 {
    font-size: 23px;
    margin: var(--gap-3) 0 8px;
  }

  .side-list {
    display: none;
  }

  .entry-form {
    padding: var(--gap-6) var(--gap-5);
  }
}
</style>

<template>
  <div class="entry-page ink-in">
    <aside class="entry-side">
      <div>
        <span class="seal seal--sm">册</span>
        <h1>给自己在这本册页里<br />留一个位置</h1>
        <p>注册只需要一个邮箱。之后你可以发文章、收藏别人的、把自己的接口挂到公开目录上。</p>
        <ul class="side-list">
          <li>发文、收藏、评论，都会记在你的账号下</li>
          <li>可以绑定 QQ 号，下次用 QQ 直接登录</li>
          <li>邮箱用于找回密码和接收验证码</li>
        </ul>
      </div>
    </aside>

    <section class="entry-form">
      <h2>注册</h2>
      <p class="sub">验证码会发到你的邮箱。</p>

      <el-form ref="ruleFormRef" :rules="rules" :model="ruleForm" class="form-block">
        <el-form-item prop="username">
          <el-input v-model="ruleForm.username" placeholder="用户名" size="large">
            <template #prefix><el-icon><User /></el-icon></template>
          </el-input>
        </el-form-item>
        <el-form-item prop="email">
          <el-input v-model="ruleForm.email" placeholder="邮箱地址" size="large" />
        </el-form-item>
        <el-form-item prop="code">
          <div class="code-row">
            <el-input v-model="ruleForm.code" placeholder="验证码" size="large" style="flex: 1" />
            <el-button :loading="reqLoading" @click="reqCode(ruleFormRef)" size="large">获取验证码</el-button>
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
          <el-button :loading="loading" type="primary" size="large" @click="submitForm" style="width: 100%">
            创建账号
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button size="large" @click="gotoLogin" style="width: 100%">已有账号，去登录</el-button>
        </el-form-item>
      </el-form>
    </section>
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
