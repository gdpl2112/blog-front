<style scoped>
/* =============================================
   账号设置：一页登记表
   ============================================= */

.sec {
  margin-bottom: var(--gap-7);
}

.sec-h {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--gap-4);
  padding-bottom: 10px;
  border-bottom: 1px solid var(--rule-2);
  margin-bottom: var(--gap-5);
}

.sec-h h2 {
  font-size: var(--text-md);
  letter-spacing: 0.06em;
  margin: 0;
}

.sec-h span {
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  letter-spacing: 0.08em;
  color: var(--ink-3);
}

/* 身份卡 */
.identity {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: var(--gap-6);
  align-items: start;
}

.avatar-box {
  text-align: center;
}

.avatar-img {
  width: 88px;
  height: 88px;
  object-fit: cover;
  border: 1px solid var(--rule);
  border-radius: 8px;
  cursor: pointer;
  filter: grayscale(0.1);
  transition: filter var(--dur) var(--ease), border-color var(--dur) var(--ease);
}

.avatar-img:hover {
  filter: none;
  border-color: var(--ink);
}

.avatar-note {
  margin: 6px 0 0;
  font-size: var(--text-2xs);
  color: var(--ink-3);
}

.info-grid {
  display: grid;
  grid-template-columns: 76px minmax(0, 1fr);
  gap: 0;
  border-top: 1px solid var(--rule);
}

.info-grid dt,
.info-grid dd {
  margin: 0;
  padding: 9px 0;
  border-bottom: 1px solid var(--rule);
  font-size: var(--text-sm);
}

.info-grid dt {
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  letter-spacing: 0.1em;
  color: var(--ink-3);
  line-height: 2.2;
}

.info-grid dd {
  color: var(--ink);
  overflow-wrap: anywhere;
}

.info-grid dd.editable {
  cursor: pointer;
  color: var(--seal);
}

.info-grid dd.editable:hover {
  text-decoration: underline;
  text-underline-offset: 3px;
}

/* 表单块 */
.block {
  padding: var(--gap-5) 0;
  border-bottom: 1px solid var(--rule);
}

.block:last-child {
  border-bottom: 0;
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

.inline-form {
  max-width: 420px;
}

.inline-form :deep(.el-form-item) {
  margin-bottom: 10px;
}

.code-row {
  display: flex;
  gap: 8px;
  width: 100%;
}

@media (max-width: 640px) {
  .identity {
    grid-template-columns: 1fr;
    gap: var(--gap-4);
  }

  .avatar-box {
    text-align: left;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .avatar-note {
    margin: 0;
  }

  .avatar-img {
    width: 64px;
    height: 64px;
  }
}
</style>

<template>
  <div class="ink-in">
    <!-- 账号 -->
    <section class="sec">
      <div class="sec-h">
        <h2>账号</h2>
        <span>点击可编辑的项即可修改</span>
      </div>

      <div class="identity">
        <div class="avatar-box">
          <el-upload :show-file-list="false" :before-upload="beforeAvatarUpload" :on-success="handleAvatarSuccess">
            <img :src="userInfo.icon" class="avatar-img" alt="头像" />
          </el-upload>
          <p class="avatar-note">点击更换头像</p>
        </div>

        <dl class="info-grid">
          <dt>博客 ID</dt>
          <dd class="editable" @click="tipsBlogId">{{ userInfo.userId }}</dd>
          <dt>昵称</dt>
          <dd class="editable" @click="modifyNick">{{ userInfo.nickname }}</dd>
          <dt>邮箱</dt>
          <dd>{{ userInfo.eid || '未绑定' }}</dd>
          <dt>QQ</dt>
          <dd>{{ userInfo.qid || '未绑定' }}</dd>
          <dt>注册方式</dt>
          <dd><span class="chip">{{ userInfo.type }}</span></dd>
        </dl>
      </div>
    </section>

    <!-- 安全与绑定 -->
    <section class="sec">
      <div class="sec-h">
        <h2>安全与绑定</h2>
      </div>

      <!-- 绑定邮箱 -->
      <div v-if="userInfo.eid === ''" class="block">
        <h3>绑定邮箱</h3>
        <p class="tip">邮箱为空时可以绑定，绑定后可用于找回密码。</p>
        <el-form ref="eidFormRef" :model="edvfm" label-width="64px" class="inline-form">
          <el-form-item prop="email" label="邮箱" :rules="[{required:true,message:'邮箱不可空',trigger:'blur'},{type:'email',message:'格式不正确',trigger:'blur'}]">
            <el-input v-model="edvfm.email" placeholder="name@example.com" />
          </el-form-item>
          <el-form-item label="验证码">
            <div class="code-row">
              <el-input v-model="edvfm.code" type="text" style="flex: 1" placeholder="6 位验证码" />
              <el-button :loading="reqLoading" @click="reqCode(eidFormRef)">发送</el-button>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm(eidFormRef)">绑定</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 绑定QQ -->
      <div v-if="!userInfo.qoId" class="block">
        <h3>绑定 QQ 登录</h3>
        <p class="tip">若该 QQ 已注册过账号，绑定后会覆盖原有绑定关系。</p>
        <button class="btn" @click="gotoQqb">
          <img alt="qq" src="/tencentqq-icon.png" style="width: 14px; height: 14px;" /> QQ 登录绑定
        </button>
      </div>

      <!-- 绑定QQ号 -->
      <div v-if="userInfo.qid <= 0" class="block">
        <h3>绑定 QQ 号</h3>
        <p class="tip">仅用于登录账号，不做其他用途。</p>
        <el-form ref="qqFormRef" :model="qqValidateForm" label-width="40px" class="inline-form">
          <el-form-item label="QQ" :rules="[{type:'number',message:'必须是纯数字'}]">
            <el-input v-model.number="qqValidateForm.qq" type="text" placeholder="QQ 号" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitQq(qqFormRef)">绑定</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 修改博客ID -->
      <div v-if="userInfo.modify_bid" class="block">
        <h3>修改博客 ID</h3>
        <p class="tip">修改后原有链接可能失效，请谨慎操作。</p>
        <el-form ref="bidFormRef" :model="bidValidateForm" label-width="64px" class="inline-form">
          <el-form-item label="博客ID" prop="bid" :rules="[{required:true,message:'不能为空',trigger:'blur'},{pattern:/^[a-zA-Z0-9._-]+$/,message:'只能包含字母、数字、点(.)、下划线(_)或连字符(-)',trigger:'blur'},{min:7,max:12,message:'长度7-12位',trigger:'blur'}]">
            <el-input v-model="bidValidateForm.bid" type="text" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitBid(bidFormRef)">修改</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 密码 -->
      <div class="block">
        <h3>修改密码</h3>
        <p class="tip">修改后当前设备不会被退出，其他设备需要重新登录。</p>
        <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="88px" class="inline-form">
          <el-form-item label="旧密码" prop="opass">
            <el-input show-password type="password" v-model="ruleForm.opass">
              <template #prefix><el-icon><Lock /></el-icon></template>
            </el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="pass">
            <el-input show-password type="password" v-model="ruleForm.pass">
              <template #prefix><el-icon><Lock /></el-icon></template>
            </el-input>
          </el-form-item>
          <el-form-item label="确认新密码" prop="checkPass">
            <el-input show-password type="password" v-model="ruleForm.checkPass">
              <template #prefix><el-icon><Lock /></el-icon></template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitFormPass(ruleFormRef)">提交</el-button>
            <el-button @click="resetFormPass(ruleFormRef)">重置</el-button>
            <el-button type="warning" @click="dialogVisible = true">忘记密码</el-button>
          </el-form-item>
        </el-form>
      </div>
    </section>

    <el-dialog
      append-to-body v-model="dialogVisible" title="重置密码" width="420" align-center>
      <p>系统会向已绑定的邮箱发送一个随机密码。邮箱未绑定时此操作会失败。</p>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button :loading="dialogLoading" type="danger" @click="forgetPass()">确定重置</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {service, userInfo} from "@/axios";
import {toast} from "@/utils/utils";
import {reactive, ref} from "vue";
import type {FormInstance, FormRules, UploadProps} from "element-plus";
import {Lock} from '@element-plus/icons-vue'

const gotoQqb = () => { window.qc.Login.showPopup({appId:"102801348",redirectURI:"https://kloping.top/login?t=qqb"}); }
const handleAvatarSuccess: UploadProps['onSuccess'] = (response) => {}
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') toast('仅支持jpg或png');
  else if (rawFile.size / 1024 / 1024 > 3) toast('图片超过3MB');
  else { const formData = new FormData(); formData.append('file', rawFile); service.post("/user/upload_head_img", formData).then((res: any) => { if (res.code == 200) { toast(res.msg, "success"); userInfo.value.icon = res.url } else toast(res.msg) }) }
  return false
}

const eidFormRef = ref<FormInstance>()
const edvfm = reactive({email:'', code:''})
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid && edvfm.code !== '') {
      service.get(`/auth/bind?eid=${edvfm.email}&code=${edvfm.code}`).then((res: any) => {
        if (res.code == 200) { toast(res.msg, "success"); userInfo.value.eid = edvfm.email } else toast(res.msg)
      }).catch((err) => toast(err, "warning"))
    } else toast("请确保邮箱和验证码正确")
  })
}
const reqLoading = ref(false)
const reqCode = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validateField('email', (valid) => {
    if (valid) { reqLoading.value = true; service.get("/auth/reqbind?eid=" + edvfm.email).then((res: any) => toast(res, "warning")).catch((err) => toast("发送失败:" + err)).finally(() => { reqLoading.value = false }) }
    else toast("请确保邮箱正确")
  })
}

const qqFormRef = ref<FormInstance>()
const bidFormRef = ref<FormInstance>()
const qqValidateForm = reactive({qq: ''})
const bidValidateForm = reactive({bid: userInfo.value.userId || ''})
const submitQq = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) { service.get("/auth/bindqq?qid=" + qqValidateForm.qq).then((res: any) => { if (res.code == 200) { toast(res, "success"); userInfo.value.qid = Number(qqValidateForm.qq) } else toast(res.msg) }).catch((err) => toast(err)) }
    else toast("请确保QQ正确")
  })
}
const submitBid = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) { service.post("/auth/modifyBolgId", {t: bidValidateForm.bid}).then((res: any) => { if (res.code == 200) { toast(res.msg, "success"); userInfo.value.userId = bidValidateForm.bid; userInfo.value.modify_bid = false } else toast(res.msg) }).catch((err) => toast(err)) }
    else toast("请确保博客ID正确")
  })
}

const ruleFormRef = ref<FormInstance>()
const validatePass = (rule: any, value: any, callback: any) => { if (value === '') callback(new Error('新密码不能为空')); else { if (ruleForm.checkPass !== '') ruleFormRef.value?.validateField('checkPass'); callback() } }
const validatePass2 = (rule: any, value: any, callback: any) => { if (value === '') callback(new Error('请确认新密码')); else if (value !== ruleForm.pass) callback(new Error("密码不匹配")); else callback() }
const ruleForm = reactive({pass:'', checkPass:'', opass:''})
const rules = reactive<FormRules>({pass:[{validator:validatePass,trigger:'blur'}],checkPass:[{validator:validatePass2,trigger:'blur'}]})
const submitFormPass = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) { service.post("/auth/changepass", {opass: ruleForm.opass, pass: ruleForm.pass}).then((res: any) => { if (res.code == 200) { toast(res.msg, "success"); resetFormPass(formEl) } else toast(res.msg) }).catch((err) => toast(err, "warning")) }
    else toast("请确保信息填写正确")
  })
}
const resetFormPass = (formEl: FormInstance | undefined) => { if (formEl) formEl.resetFields() }

const dialogVisible = ref(false)
const dialogLoading = ref(false)
function forgetPass() { dialogLoading.value = true; service.get("/auth/forgetpass").then((res: any) => { if (res.code == 200) toast(res.msg, "success"); else toast(res.msg) }).finally(() => { dialogVisible.value = false; dialogLoading.value = false }) }
function tipsBlogId() { service.get("/auth/modifyBolgIdTips").then((res: any) => { if (res.code == 200) { toast(res.msg, "success"); userInfo.value.modify_bid = true } else { toast(res.msg); userInfo.value.modify_bid = false } }) }
function modifyNick() { const nick = prompt('请输入要修改的昵称', ''); if (nick === null || nick === '') return; service.post("/auth/modifyNick", {t: nick}).then((res: any) => { if (res.code == 200) { toast(res.msg, "success"); userInfo.value.nickname = nick } else toast(res.msg) }); }
</script>
