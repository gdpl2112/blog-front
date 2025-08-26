<template>
  <el-row id="main0" class="min-h-screen">
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
          <el-input v-model="form.username" placeholder="请输入用户名/QQ/邮箱">
            <template #prefix>
              <el-icon>
                <userInfo/>
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
          <el-button round class="w-[78px] bg-cyan-200" @click="resetEid()">忘记密码?</el-button>
        </el-form-item>


        <el-form-item>
          <el-row class="w-[150px] mb-2">
            <el-text truncated>第三方登录</el-text>
          </el-row>
          <el-button :loading="loading" round class="w-[150px] bg-zinc-800" type="primary" @click="gotoGithub"
                     style="margin: 5px;">
            <img alt="github" loading="lazy" src="https://s.nmxc.ltd/sakurairo_vision/@2.6/display_icon/sora/github.png"
                 style="opacity: 0.86; max-width: 22px;">
            GITHUB
          </el-button>
          <el-button :loading="loading" round class="w-[150px] bg-zinc-50" type="primary" @click="gotoQq"
                     style="color: #3e2929;margin-left: 6px;margin-top: 5px">
            <img alt="qq" loading="lazy" src="/tencentqq-icon.png"
                 style="opacity: 0.86; max-width: 22px;max-height: 22px">
            QQ账号登录
          </el-button>

        </el-form-item>

        <el-form-item>
          <el-row class="w-[150px] mb-2">
            <el-text truncated>注册</el-text>
          </el-row>
          <el-button :loading="loading" round class="w-[160px] bg-sky-500" type="primary" @click="gotoReg">
            邮箱注册
          </el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import {onMounted, reactive, ref} from 'vue'
import {Lock} from '@element-plus/icons-vue'
import {useRouter} from "vue-router";
import {toast} from "@/utils/utils";
import Cookie from "js-cookie"
import service, {loadUser, userInfo, userLogin} from "@/axios";
import {ElLoading} from "element-plus";

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
      userLogin(form.username, form.password).then(res => {
        if (res.code === 200) {
          Cookie.set("token", res.token)
          router.push("/")
          toast("登录成功", "success")
          loadUser()
        } else toast(res.msg)
      }).catch(err => {
        toast(err.msg)
      }).finally(() => {
        loading.value = false
      });
    } else {
      console.log("error submit")
    }
  })
}

const resetEid = () => {
  let eid = prompt("请输入已绑定邮箱")
  const loadingf = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  service.get("/auth/reset_email?eid=" + eid).then(res => {
    if (res.code === 200) {
      toast("请检查你的邮箱/切勿重复操作", "success")
    } else toast(res.msg)
  }).catch(err => {
    toast(err, "danger")
  }).finally(() => {
    loadingf.close()
  });
}

const gotoGithub = () => {
  service.get("/auth/github/login?now=false").then(res => {
    document.location = res.url
  }).catch(err => {
    toast("获得授权登录链接失败" + err, "danger")
  });
}

const gotoQq = () => {
  window.qc.Login.showPopup({
    appId: "102801348",
    redirectURI: "https://kloping.top/login?t=qq"
  });
}


const gotoReg = () => {
  router.push("/reg")
}

function loginAuth() {
  const url = document.location.toString()
  const n = url.indexOf("?");
  const pu = url.substring(n + 1)
  const armap = new Map()
  pu.split("&").forEach(function (kv) {
    const kvn = kv.split("=")
    let key0 = kvn[0];
    if (key0.startsWith("#")) key0 = key0.substring(1)
    armap.set(key0, kvn[1])
  })
  if (armap.get("msg")) {
    let msg = decodeURI(armap.get("msg"))
    toast(msg, "warning")
    if (armap.size == 1) return
  }
  if (n > 0) {
    loading.value = true
    const loadingf = ElLoading.service({
      lock: true,
      text: 'Loading',
      background: 'rgba(0, 0, 0, 0.7)',
    })
    const t = armap.get("t")
    if (t === "qq") {
      service.get("/auth/qq/login?access_token=" + armap.get("access_token")).then(res => {
        if (res.code === 200) {
          loadingf.close()
          Cookie.set("token", res.token)
          router.push("/")
          toast("登录成功", "success")
          loadUser()
        } else {
          toast(res.msg)
        }
      }).catch(err => {
        console.log(err)
        toast("登录失败:" + err)
      }).finally(() => {
        loadingf.close()
        loading.value = false
      })
    } else if (t === "qqb") {
      service.get("/auth/qq/bind?access_token=" + armap.get("access_token")).then(res => {
        if (res.code === 200) {
          loadingf.close()
          toast("绑定成功", "success")
          Cookie.set("token", res.token)
          router.push("/v0")
        } else {
          toast(res.msg)
        }
      }).catch(err => {
        console.log(err)
        toast("绑定失败:" + err)
      }).finally(() => {
        loadingf.close()
        loading.value = false
      })
    } else {
      // 无p值 github
      service.get("/auth/github/callback?" + pu).then(res => {
        if (res.code === 200) {
          loadingf.close()
          Cookie.set("token", res.token)
          router.push("/")
          toast("登录成功", "success")
          loadUser()
        } else {
          toast(res.msg)
        }
      }).catch(err => {
        console.log(err)
        toast("登录失败:" + err)
      }).finally(() => {
        loadingf.close()
        loading.value = false
      })
    }
  }

}

onMounted(() => {
  loginAuth()
})

onMounted(() => {
  document.getElementById("main0").scrollIntoView();
})
</script>