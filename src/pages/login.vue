<style scoped>
.login-page {
  display: flex;
  min-height: 70vh;
  align-items: stretch;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-md);
}

.login-brand {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: var(--space-10) var(--space-8);
  background: linear-gradient(135deg, var(--color-accent), #7c3aed);
  color: white;
}

.login-brand h1 {
  font-size: 2.2rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 0 0 var(--space-3);
}

.login-brand p {
  font-size: 1rem;
  opacity: 0.85;
  margin: 0;
  line-height: 1.6;
  max-width: 32ch;
}

.login-form-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: var(--space-10) var(--space-8);
}

.login-form-wrap h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 var(--space-6);
  color: var(--color-text-primary);
}

.login-form {
  width: 100%;
  max-width: 320px;
}

.login-divider {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  width: 100%;
  margin: var(--space-4) 0;
  color: var(--color-text-tertiary);
  font-size: 0.8rem;
}

.login-divider::before,
.login-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--color-border);
}

.social-btns {
  display: flex;
  gap: var(--space-3);
  width: 100%;
  margin-top: var(--space-3);
}

.social-btn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  cursor: pointer;
  transition: all var(--transition-fast);
  background: var(--color-bg-card);
  color: var(--color-text-primary);
}

.social-btn:hover {
  border-color: var(--color-accent);
  box-shadow: var(--shadow-sm);
}

.social-btn img {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.login-footer-links {
  display: flex;
  gap: var(--space-4);
  margin-top: var(--space-4);
  width: 100%;
  justify-content: center;
}

.login-footer-links a {
  font-size: 0.8rem;
  color: var(--color-text-tertiary);
  cursor: pointer;
  transition: color var(--transition-fast);
}

.login-footer-links a:hover {
  color: var(--color-accent);
}

@media (max-width: 768px) {
  .login-page {
    flex-direction: column;
    min-height: auto;
  }
  .login-brand {
    padding: var(--space-8) var(--space-6);
    text-align: center;
  }
  .login-brand h1 { font-size: 1.6rem; }
  .login-brand p { margin: 0 auto; }
  .login-form-wrap {
    padding: var(--space-8) var(--space-6);
  }
}
</style>

<template>
  <div class="login-page">
    <div class="login-brand">
      <h1>kloping's blog</h1>
      <p>欢迎访问kloping的博客。本站提供API以及用户上传API、发帖等丰富功能。</p>
    </div>
    <div class="login-form-wrap">
      <h2>欢迎回来</h2>
      <el-form ref="formRef" :rules="rules" :model="form" class="login-form">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="用户名/QQ/邮箱" size="large">
            <template #prefix><el-icon><User /></el-icon></template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" show-password v-model="form.password" placeholder="密码" size="large">
            <template #prefix><el-icon><Lock /></el-icon></template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" type="primary" size="large" @click="submitForm" style="width:100%;background:var(--color-accent);border-color:var(--color-accent);">
            登录
          </el-button>
        </el-form-item>
      </el-form>

      <div class="login-divider">第三方登录</div>

      <div class="social-btns">
        <button class="social-btn" @click="gotoGithub">
          <img alt="github" src="https://s.nmxc.ltd/sakurairo_vision/@2.6/display_icon/sora/github.png" />
          GitHub
        </button>
        <button class="social-btn" @click="gotoQq">
          <img alt="qq" src="/tencentqq-icon.png" />
          QQ
        </button>
      </div>

      <div class="login-footer-links">
        <a @click="resetEid()">忘记密码</a>
        <a @click="gotoReg">邮箱注册</a>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, reactive, ref} from 'vue'
import {Lock, User} from '@element-plus/icons-vue'
import {useRouter} from "vue-router";
import {toast} from "@/utils/utils";
import Cookie from "js-cookie"
import service, {loadUser, userLogin} from "@/axios";
import {ElLoading} from "element-plus";

const form = reactive({username: '', password: ''})
const rules = {
  username: [{required: true, message: '请输入用户名', trigger: 'blur'},{min: 3, max: 30, message: '长度在3到30个字符', trigger: 'blur'}],
  password: [{required: true, message: '请输入密码', trigger: 'blur'},{min: 6, max: 24, message: '长度在6到20个字符', trigger: 'blur'}]
}
const formRef = ref(null)
const router = useRouter()
const loading = ref(false)

const submitForm = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      userLogin(form.username, form.password).then((res: any) => {
        if (res.code === 200) {
          Cookie.set("token", res.token)
          toast("登录成功", "success")
          loadUser()
          onLoginSuccess()
        } else toast(res.msg)
      }).catch((err: any) => { toast(err.msg) }).finally(() => { loading.value = false });
    }
  })
}

const resetEid = () => {
  let eid = prompt("请输入已绑定邮箱")
  const loadingf = ElLoading.service({lock: true, text: 'Loading', background: 'rgba(0, 0, 0, 0.7)'})
  service.get("/auth/reset_email?eid=" + eid).then((r0: any) => {
    let res = r0 as any;
    if (res.code === 200) { toast("请检查你的邮箱/切勿重复操作", "success") }
    else toast(res.msg)
  }).catch((err: any) => { toast(err, "danger") }).finally(() => { loadingf.close() });
}

const gotoGithub = () => {
  service.get("/auth/github/login?now=false").then((res: any) => {
    document.location = res.url
  }).catch((err: any) => { toast("获得授权登录链接失败" + err, "danger") });
}

const gotoQq = () => {
  window.qc.Login.showPopup({appId: "102801348", redirectURI: "https://kloping.top/login?t=qq"});
}

const gotoReg = () => { router.push("/reg") }

function onLoginSuccess() {
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
  if (armap.get("redirect_uri")) {
    const redirectUri = decodeURIComponent(armap.get("redirect_uri"))
    router.push(`/authc?app_id=${armap.get("app_id")}&redirect_uri=${encodeURIComponent(redirectUri)}`)
  } else { router.push("/") }
}

function loginAuth() {
  const url = document.location.toString()
  const n = url.indexOf("?");
  if (n <= 0) return
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
  loading.value = true
  const loadingf = ElLoading.service({lock: true, text: 'Loading', background: 'rgba(0, 0, 0, 0.7)'})
  const t = armap.get("t")
  if (t === "qq") {
    service.get("/auth/qq/login?access_token=" + armap.get("access_token")).then((res: any) => {
      if (res.code === 200) {
        Cookie.set("token", res.token); loadUser(); onLoginSuccess()
      } else { toast(res.msg) }
    }).catch((err: any) => { console.log(err) }).finally(() => { loadingf.close(); loading.value = false })
  } else if (t === "qqb") {
    service.get("/auth/qq/bind?access_token=" + armap.get("access_token")).then((res: any) => {
      if (res.code === 200) {
        Cookie.set("token", res.token); toast("绑定成功", "success"); router.push("/v0")
      } else { toast(res.msg) }
    }).catch((err: any) => { toast("绑定失败:" + err) }).finally(() => { loadingf.close(); loading.value = false })
  } else if (!armap.get("app_id")) {
    service.get("/auth/github/callback?" + pu).then((res: any) => {
      if (res.code === 200) {
        Cookie.set("token", res.token); toast("登录成功", "success"); loadUser(); onLoginSuccess()
      } else { toast(res.msg) }
    }).catch((err: any) => { console.log(err) }).finally(() => { loadingf.close(); loading.value = false })
  } else { loadingf.close(); loading.value = false }
}

onMounted(() => {
  loginAuth()
  document.getElementById("main0")?.scrollIntoView();
})
</script>
