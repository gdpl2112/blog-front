<template>
  <el-row class="min-h-screen">
    <el-col :lg="14" :md="12" class="bg-opacity-30 bg-zinc-500  flex items-center justify-center">
      <div style="margin-left: 20px;margin-right: 20px">
        <div class="font-bold text-5xl text-light-50">kloping's blog</div>
        <div class="text-gray-200 text-sm my-3">欢迎访问kloping的博客 本站提供api 以及用户上传api 上传帖子等作用</div>
      </div>
    </el-col>
    <el-col :lg="10" :md="12" class="bg-light-50 bg-opacity-100 flex items-center justify-center flex-col">
      <h2 class="font-bold text-3xl text-gray-700">欢迎注册!</h2>
      <div class="flex items-center justify-center text-neutral-300 my-5 space-x-3">
        <span class="h-[1px] w-16 bg-gray-200"></span>
        <span>使用邮箱验证码注册</span>
        <span class="h-[1px] w-16 bg-gray-200"></span>
      </div>
      <el-form ref="ruleFormRef" :rules="rules" :model="ruleForm" class="w-[320px]">

        <el-form-item prop="username">
          <el-input v-model="ruleForm.username" placeholder="请输入用户名">
            <template #prefix>
              <el-icon>
                <User/>
              </el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form ref="eidRuleFormRef" :rules="rules" :model="ruleForm" class="w-[320px]">
          <el-form-item ref="eidRuleFormRef" prop="email" label="邮箱:" :rules="rules.email">
            <el-input v-model="ruleForm.email"/>
          </el-form-item>
        </el-form>

        <el-form-item label="验证码:" prop="code" :rules="rules.code">
          <el-input class="w-[144px] mr-2" v-model="ruleForm.code" type="text"/>
          <el-button class="w-[100px]" :loading="reqLoading" @click="reqCode(ruleFormRef)">请求验证码</el-button>
        </el-form-item>


        <el-form-item label="输入密码:" prop="pass" :rules="rules.pass">
          <el-input show-password v-model="ruleForm.pass" type="password" autocomplete="off"/>
          <template #prefix>
            <el-icon>
              <Lock/>
            </el-icon>
          </template>
        </el-form-item>

        <el-form-item label="确认密码:" prop="checkPass">
          <el-input show-password v-model="ruleForm.checkPass" type="password" autocomplete="off"/>
          <template #prefix>
            <el-icon>
              <Lock/>
            </el-icon>
          </template>
        </el-form-item>
        <br>
        <el-form-item>
          <el-button :loading="loading" round class="w-[200px] bg-rose-500" type="primary" @click="submitForm">
            提交注册
          </el-button>
          <el-button round class="w-[100px] bg-cyan-200" @click="resetForm()">重置</el-button>
        </el-form-item>
        <hr>
        <el-form-item>
          <el-button :loading="loading" round class="w-[300px] bg-orange-300" type="primary" @click="gotoLogin">
            去登录
          </el-button>
        </el-form-item>

      </el-form>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import {reactive, ref} from 'vue'
import {Lock, User} from '@element-plus/icons-vue'
import {useRouter} from "vue-router";
import type {FormInstance} from "element-plus";
import service from "@/axios";
import {toast} from "@/utils/utils";

const ruleFormRef = ref<FormInstance>()

const eidRuleFormRef = ref<FormInstance>()

const ruleForm = reactive({
  username: '',
  email: '',
  code: '',
  pass: '',
  checkPass: '',
})
const validatePass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('密码不能为空'))
  } else {
    if (ruleForm.checkPass !== '') {
      if (!ruleFormRef.value) return
      ruleFormRef.value.validateField('checkPass')
    }
    callback()
  }
}

const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请确认密码'))
  } else if (value !== ruleForm.pass) {
    callback(new Error("密码输入不匹配"))
  } else {
    callback()
  }
}

const rules = {
  email: [
    {required: true, message: '邮箱地址不可空', trigger: 'blur',},
    {type: 'email', message: '请检查邮箱格式', trigger: ['blur', 'change'],}
  ], username: [
    {required: true, message: '请输入用户名', trigger: 'blur'},
    {min: 3, max: 20, message: '长度在 3 到 12 个字符', trigger: 'blur'}
  ], code: [
    {required: true, message: '请输入验证码', trigger: 'blur'},
    {min: 3, max: 20, message: '长度在 3 到 12 个字符', trigger: 'blur'}
  ], pass: [
    {required: true, message: '请输入密码', trigger: 'blur'},
    {min: 6, max: 24, message: '长度在 6 到 20 个字符', trigger: 'blur'},
    {validator: validatePass, trigger: 'blur'}
  ], checkPass: [
    {validator: validatePass2, trigger: 'blur'},
    {required: true, message: '请输入密码', trigger: 'blur'},
    {min: 6, max: 24, message: '长度在 6 到 20 个字符', trigger: 'blur'}
  ]
}

const router = useRouter()

const loading = ref(false)

const reqLoading = ref(false)

const submitForm = () => {
  ruleFormRef.value.validate((valid) => {
    if (valid) {
      eidRuleFormRef.value.validate((valid) => {
        if (valid) {
          loading.value = true
          const formData = new FormData()
          formData.append("eid", ruleForm.email)
          formData.append("name", ruleForm.username)
          formData.append("pwd", ruleForm.pass)
          formData.append("code", ruleForm.code)
          service.post("/user/reg", formData).then((res) => {
            if (res.code == 200) {
              toast("注册成功","success")
              resetForm()
              gotoLogin()
            }else{
              toast(res.msg)
            }
          }).finally(() => {
            loading.value = false
          })
        } else {
          toast("请确保邮箱正确")
        }
      })
    } else {
      toast("请检查表单输入完整")
    }
  })
}

const resetForm = () => {
  ruleForm.username = ''
  ruleForm.email = ''
  ruleForm.code = ''
  ruleForm.pass = ''
  ruleForm.checkPass = ''
}

const reqCode = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  eidRuleFormRef.value.validate((valid) => {
    if (valid) {
      reqLoading.value = true
      service.get("/user/req0?eid=" + ruleForm.email).then((res) => {
        toast(res, "warning")
      }).catch((err) => {
        toast("验证码发送失败:" + err)
      }).finally(() => {
        reqLoading.value = false
      })
    } else {
      toast("请确保邮箱正确")
    }
  })
}

const gotoLogin = () => {
  router.push("/login")
}

</script>