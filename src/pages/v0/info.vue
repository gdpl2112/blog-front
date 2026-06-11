<style scoped>
.info-section {
  margin-bottom: var(--space-6);
}

.info-section h3 {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0 0 var(--space-4);
  color: var(--color-text-primary);
}

.info-grid {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--space-3) var(--space-6);
  font-size: 0.9rem;
}

.info-label {
  color: var(--color-text-tertiary);
  font-weight: 500;
}

.info-value {
  color: var(--color-text-primary);
}

.info-value.clickable {
  cursor: pointer;
  color: var(--color-accent);
}

.info-value.clickable:hover {
  text-decoration: underline;
}

.avatar-wrap {
  text-align: center;
  margin-bottom: var(--space-6);
}

.avatar-img {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-full);
  object-fit: cover;
  cursor: pointer;
  border: 3px solid var(--color-border);
  transition: all var(--transition-fast);
}

.avatar-img:hover {
  border-color: var(--color-accent);
}

.form-section {
  background: var(--color-bg-soft);
  border-radius: var(--radius-md);
  padding: var(--space-5);
  margin-bottom: var(--space-4);
}

.form-section h4 {
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0 0 var(--space-3);
  color: var(--color-text-primary);
}

.form-section .tip {
  font-size: 0.8rem;
  color: var(--color-text-tertiary);
  margin-bottom: var(--space-3);
}
</style>

<template>
  <div>
    <div class="info-section">
      <h3>账号信息</h3>
      <div class="avatar-wrap">
        <el-upload :show-file-list="false" :before-upload="beforeAvatarUpload" :on-success="handleAvatarSuccess">
          <img :src="userInfo.icon" class="avatar-img" alt="avatar" />
        </el-upload>
        <div style="font-size:0.8rem;color:var(--color-text-tertiary);margin-top:var(--space-2);">点击更换头像</div>
      </div>
      <div class="info-grid">
        <span class="info-label">博客ID</span>
        <span class="info-value clickable" @click="tipsBlogId">{{ userInfo.userId }}</span>
        <span class="info-label">昵称</span>
        <span class="info-value clickable" @click="modifyNick">{{ userInfo.nickname }}</span>
        <span class="info-label">邮箱</span>
        <span class="info-value">{{ userInfo.eid || '未绑定' }}</span>
        <span class="info-label">QQ</span>
        <span class="info-value">{{ userInfo.qid || '未绑定' }}</span>
        <span class="info-label">注册方式</span>
        <span class="info-value"><span class="tag tag-accent">{{ userInfo.type }}</span></span>
      </div>
    </div>

    <!-- Bind email -->
    <div v-if="userInfo.eid === ''" class="form-section">
      <h4>绑定邮箱</h4>
      <p class="tip">邮箱为空时可绑定</p>
      <el-form ref="eidFormRef" :model="edvfm" label-width="80px" style="max-width:400px;">
        <el-form-item prop="email" label="邮箱" :rules="[{required:true,message:'邮箱不可空',trigger:'blur'},{type:'email',message:'格式不正确',trigger:'blur'}]">
          <el-input v-model="edvfm.email" />
        </el-form-item>
        <el-form-item label="验证码">
          <div style="display:flex;gap:8px;">
            <el-input v-model="edvfm.code" type="text" style="flex:1;" />
            <el-button :loading="reqLoading" @click="reqCode(eidFormRef)">发送</el-button>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm(eidFormRef)" style="background:var(--color-accent);border-color:var(--color-accent);">绑定</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- Bind QQ -->
    <div v-if="!userInfo.qoId" class="form-section">
      <h4>绑定QQ</h4>
      <p class="tip">若账号已经注册则将覆盖</p>
      <el-button @click="gotoQqb" style="margin-top:var(--space-2);">
        <img alt="qq" src="/tencentqq-icon.png" style="width:20px;height:20px;margin-right:6px;" /> QQ登录绑定
      </el-button>
    </div>

    <!-- Bind QQ number -->
    <div v-if="userInfo.qid <= 0" class="form-section">
      <h4>绑定QQ号</h4>
      <p class="tip">绑定QQ号仅为了方便登录账号，无其他作用</p>
      <el-form ref="qqFormRef" :model="qqValidateForm" label-width="60px" style="max-width:300px;">
        <el-form-item label="QQ" :rules="[{type:'number',message:'必须是纯数字'}]">
          <el-input v-model.number="qqValidateForm.qq" type="text" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitQq(qqFormRef)" style="background:var(--color-accent);border-color:var(--color-accent);">绑定</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- Modify blog ID -->
    <div v-if="userInfo.modify_bid" class="form-section">
      <h4>修改博客ID</h4>
      <p class="tip">修改博客ID需谨慎，可能影响相关链接</p>
      <el-form ref="bidFormRef" :model="bidValidateForm" label-width="80px" style="max-width:300px;">
        <el-form-item label="博客ID" prop="bid" :rules="[{required:true,message:'不能为空',trigger:'blur'},{pattern:/^[a-zA-Z0-9._-]+$/,message:'只能包含字母、数字、点(.)、下划线(_)或连字符(-)',trigger:'blur'},{min:7,max:12,message:'长度7-12位',trigger:'blur'}]">
          <el-input v-model="bidValidateForm.bid" type="text" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitBid(bidFormRef)" style="background:var(--color-accent);border-color:var(--color-accent);">修改</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- Password -->
    <div class="form-section">
      <h4>密码修改</h4>
      <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="100px" style="max-width:400px;">
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
          <el-button type="primary" @click="submitFormPass(ruleFormRef)" style="background:var(--color-accent);border-color:var(--color-accent);">提交</el-button>
          <el-button @click="resetFormPass(ruleFormRef)">重置</el-button>
          <el-button type="warning" @click="dialogVisible = true">忘记密码</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-dialog v-model="dialogVisible" title="密码重置" width="400">
      <p>将通过邮箱重置你的账号为随机密码。若邮箱未绑定此操作将失败。</p>
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
