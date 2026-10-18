<style scoped>
/* =============================================
   登录：左墨右纸的扉页
   ============================================= */

.entry-page {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 400px;
  min-height: calc(100vh - var(--nav-h) - 232px);
  border: 1px solid var(--glass-line);
  border-radius: var(--r-lg);
  background: var(--glass);
  box-shadow: var(--glass-shadow), var(--glass-inner);
  backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-sat));
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-sat));
  overflow: hidden;
}

/* 左侧墨块 */
.entry-side {
  position: relative;
  background: linear-gradient(158deg, rgba(30, 35, 44, 0.94) 0%, rgba(13, 16, 22, 0.97) 100%);
  color: var(--block-ink);
  padding: var(--gap-7) var(--gap-6);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: var(--gap-7);
  overflow: hidden;
}

.entry-side .seal {
  width: 44px;
  height: 44px;
  font-size: 23px;
}

.entry-side h1 {
  font-family: var(--font-display);
  font-size: clamp(26px, 3vw, 36px);
  font-weight: 600;
  letter-spacing: 0.1em;
  line-height: 1.4;
  margin: var(--gap-5) 0 var(--gap-4);
  color: var(--block-ink);
}

.entry-side p {
  margin: 0;
  max-width: 24em;
  font-size: var(--text-sm);
  line-height: 2;
  color: var(--block-ink-2);
}

.entry-side-links {
  display: flex;
  flex-wrap: wrap;
  gap: var(--gap-4);
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  letter-spacing: 0.1em;
}

.entry-side-links a {
  color: var(--block-ink-2);
  text-decoration: none;
}

.entry-side-links a:hover {
  color: var(--block-ink);
  text-decoration: none;
}

/* 右侧表单 */
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
  margin-bottom: 14px;
}

.divider {
  display: flex;
  align-items: center;
  gap: var(--gap-3);
  margin: var(--gap-5) 0 var(--gap-4);
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  letter-spacing: 0.14em;
  color: var(--ink-3);
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--rule);
}

.social-btns {
  display: flex;
  gap: var(--gap-2);
}

.social-btn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  height: 42px;
  font-size: var(--text-sm);
  color: var(--ink);
  background: var(--glass-thin);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid var(--rule-2);
  border-radius: 8px;
  cursor: pointer;
  transition: border-color var(--dur) var(--ease), color var(--dur) var(--ease);
}

.social-btn:hover {
  border-color: var(--ink);
  color: var(--ink);
}

.social-btn img {
  width: 16px;
  height: 16px;
  object-fit: contain;
  filter: grayscale(1);
  opacity: 0.75;
}

.social-btn:hover img {
  filter: none;
  opacity: 1;
}

.form-foot {
  display: flex;
  justify-content: space-between;
  gap: var(--gap-3);
  margin-top: var(--gap-5);
  font-size: var(--text-xs);
}

.form-foot a {
  color: var(--ink-3);
  cursor: pointer;
}

.form-foot a:hover {
  color: var(--seal);
  text-decoration: none;
}

@media (max-width: 860px) {
  .entry-page {
    grid-template-columns: 1fr;
    min-height: auto;
  }

  .entry-side {
    padding: var(--gap-6) var(--gap-5);
    gap: var(--gap-5);
  }

  .entry-side h1 {
    font-size: 24px;
    margin: var(--gap-4) 0 8px;
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
        <span class="seal">若</span>
        <h1>回到这里<br />继续写下去</h1>
        <p>登录后可以收藏文章、发表评论、把接口收进自己的清单，也能进控制台整理已经写过的东西。</p>
      </div>
      <div class="entry-side-links">
        <a href="https://github.com/kloping" target="_blank">GITHUB</a>
        <a href="//wpa.qq.com/msgrd?v=3&amp;uin=3474006766&amp;site=qq&amp;menu=yes" target="_blank">QQ 3474006766</a>
      </div>
    </aside>

    <section class="entry-form">
      <h2>登录</h2>
      <p class="sub">用户名、QQ 号或邮箱都可以。</p>

      <el-form ref="formRef" :rules="rules" :model="form" class="form-block">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="用户名 / QQ / 邮箱" size="large">
            <template #prefix><el-icon><User /></el-icon></template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" show-password v-model="form.password" placeholder="密码" size="large">
            <template #prefix><el-icon><Lock /></el-icon></template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" type="primary" size="large" @click="submitForm" style="width: 100%">
            登录
          </el-button>
        </el-form-item>
      </el-form>

      <div class="divider">或使用</div>

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

      <div class="form-foot">
        <a @click="resetEid()">忘记密码</a>
        <a @click="gotoReg">还没有账号，去注册</a>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, reactive, ref} from 'vue'
import {Lock, User} from '@element-plus/icons-vue'
import {useRouter} from "vue-router";
import {toast} from "@/utils/utils";
import service, {loadUser, setAuthToken, userLogin} from "@/axios";
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
          setAuthToken(res.token)
          toast("登录成功", "success")
          loadUser().then((loggedIn) => {
            if (loggedIn) onLoginSuccess()
            else toast('登录状态验证失败，请重试', 'error')
          })
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
        setAuthToken(res.token); loadUser(); onLoginSuccess()
      } else { toast(res.msg) }
    }).catch((err: any) => { console.log(err) }).finally(() => { loadingf.close(); loading.value = false })
  } else if (t === "qqb") {
    service.get("/auth/qq/bind?access_token=" + armap.get("access_token")).then((res: any) => {
      if (res.code === 200) {
        setAuthToken(res.token); toast("绑定成功", "success"); router.push("/v0")
      } else { toast(res.msg) }
    }).catch((err: any) => { toast("绑定失败:" + err) }).finally(() => { loadingf.close(); loading.value = false })
  } else if (!armap.get("app_id")) {
    service.get("/auth/github/callback?" + pu).then((res: any) => {
      if (res.code === 200) {
        setAuthToken(res.token); toast("登录成功", "success"); loadUser(); onLoginSuccess()
      } else { toast(res.msg) }
    }).catch((err: any) => { console.log(err) }).finally(() => { loadingf.close(); loading.value = false })
  } else { loadingf.close(); loading.value = false }
}

onMounted(() => {
  loginAuth()
  document.getElementById("main0")?.scrollIntoView();
})
</script>
