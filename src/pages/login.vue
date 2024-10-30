<template>
  <el-row class="min-h-screen">
    <el-col :lg="16" :md="12" class="bg-opacity-30 bg-zinc-500  flex items-center justify-center">
      <div style="margin-left: 20px;margin-right: 20px">
        <div class="font-bold text-5xl text-light-50">kloping's blog</div>
        <div class="text-gray-200 text-sm my-3">欢迎访问kloping的博客 本站提供api 以及用户上传api 上传帖子等作用</div>
      </div>
    </el-col>
    <el-col :lg="8" :md="12" class="bg-light-50 bg-opacity-100 flex items-center justify-center flex-col">
      <h2 class="font-bold text-3xl text-gray-700">welcome!</h2>
      <div class="flex items-center justify-center text-neutral-300 my-5 space-x-3">
        <span class="h-[1px] w-16 bg-gray-200"></span>
        <span>账号密码登录</span>
        <span class="h-[1px] w-16 bg-gray-200"></span>
      </div>
      <el-form ref="formRef" :rules="rules" :model="form" class="w-[250px]">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名">
            <template #prefix>
              <el-icon>
                <User/>
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" show-password v-model="form.password" placeholder="请输入密码">
            <template #prefix>
              <el-icon>
                <Lock/>
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" round class="w-[160px] bg-rose-500" type="primary" @click="submitForm">
            登录
          </el-button>
          <el-button round class="w-[78px] bg-cyan-200" @click="resetForm()">重置</el-button>
        </el-form-item>
        第三方登录:
        <el-form-item>
          <el-button :loading="loading" round class="w-[240px] bg-zinc-800" type="primary" @click="gotoGithub">
            GITHUB
          </el-button>
        </el-form-item>

      </el-form>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import {reactive, ref} from 'vue'
import {Lock, User} from '@element-plus/icons-vue'
import {login} from '@/api/login'
import {useRouter} from "vue-router";
import {toast} from "@/utils/utils";
import Cookie from "js-cookie"

const form = reactive({
  username: '',
  password: ''
})


const rules = {
  username: [
    {required: true, message: '请输入用户名', trigger: 'blur'},
    {min: 3, max: 20, message: '长度在 3 到 12 个字符', trigger: 'blur'}
  ],
  password: [
    {required: true, message: '请输入密码', trigger: 'blur'},
    {min: 6, max: 24, message: '长度在 6 到 20 个字符', trigger: 'blur'}
  ]
}

const formRef = ref(null)

const router = useRouter()

const loading = ref(false)

const submitForm = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      login(form.username, form.password).then(res => {
        toast("登录成功")
        Cookie.set("token", res.token)
        router.push("/")
      }).catch(err => {
        if (err) {
          toast(err.msg, "error")
        }
      }).finally(() => {
        loading.value = false
      });
    } else {
      console.log("error submit")
    }
  })
}

const resetForm = () => {
  form.username = ''
  form.password = ''
}

const gotoGithub = () => {

}

</script>