<style>
td {
  word-break: break-all;
  word-wrap: break-word;
}
</style>
<template>
  <el-descriptions title="已登录用户信息" direction="vertical" border style="margin-top: 20px">

    <el-descriptions-item :rowspan="2" width="150" label="头像(点击更改)" align="center">
      <el-upload
          class="avatar-uploader"
          action="/user/upload_img"
          :show-file-list="false"
          :before-upload="beforeAvatarUpload"
          :on-success="handleAvatarSuccess">
        <el-image :src="user.icon" class="avatar"/>
      </el-upload>
    </el-descriptions-item>

    <el-descriptions-item label="昵称(唯一)">{{ user.nickname }}</el-descriptions-item>
    <el-descriptions-item label="邮箱">{{ user.eid }}</el-descriptions-item>
    <el-descriptions-item label="QQ">{{ user.qid }}</el-descriptions-item>
    <el-descriptions-item label="注册方式">
      <el-tag size="small">{{ user.type }}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item label="annex">隐藏
    </el-descriptions-item>
  </el-descriptions>

  <el-form v-show="user.eid===''" ref="eidFormRef" style="max-width: 400px"
           :model="edvfm"
           label-width="auto" class="demo-dynamic mt-2">
    tips: 仅当github登录后 邮箱空时才可绑定
    <el-form-item prop="email" label="绑定邮箱"
                  :rules="[
        {
          required: true,
          message: '邮箱地址不可空',
          trigger: 'blur',
        },
        {
          type: 'email',
          message: '请检查邮箱格式',
          trigger: ['blur', 'change'],
        },
      ]">
      <el-input v-model="edvfm.email"/>
    </el-form-item>

    <el-form-item label="验证码">
      <el-input
          v-model.number="edvfm.code"
          type="text"/>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submitForm(eidFormRef)">绑定</el-button>
      <el-button :loading="reqLoading" @click="reqCode(eidFormRef)">请求验证码</el-button>
    </el-form-item>
  </el-form>

  <el-form v-show="user.qid==0"
           ref="qqFormRef"
           style="max-width: 600px"
           :model="qqValidateForm"
           label-width="auto"
           class="demo-ruleForm">
    tips: 仅当github登录后 qid为空时才可绑定
    <el-form-item
        label="QQ"
        :rules="[
        { type: 'number', message: 'QQ账号必须是纯数字' },
      ]"
    >
      <el-input
          v-model.number="qqValidateForm.qq"
          type="text"
          autocomplete="off"/>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitQq(qqFormRef)">绑定</el-button>
    </el-form-item>
  </el-form>

  <el-form
      ref="ruleFormRef"
      style="max-width: 600px"
      :model="ruleForm"
      status-icon
      :rules="rules"
      label-width="auto"
      class="demo-ruleForm"
  >
    <hr>
    密码修改
    <el-form-item label="旧密码" prop="opass">
      <el-input show-password type="password" v-model="ruleForm.opass"/>
      <template #prefix>
        <el-icon>
          <Lock/>
        </el-icon>
      </template>
    </el-form-item>

    <el-form-item label="新密码" prop="pass">
      <el-input show-password v-model="ruleForm.pass" type="password" autocomplete="off"/>
      <template #prefix>
        <el-icon>
          <Lock/>
        </el-icon>
      </template>
    </el-form-item>

    <el-form-item label="确认新密码" prop="checkPass">
      <el-input show-password v-model="ruleForm.checkPass" type="password" autocomplete="off"/>
      <template #prefix>
        <el-icon>
          <Lock/>
        </el-icon>
      </template>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submitFormPass(ruleFormRef)">
        提交
      </el-button>
      <el-button @click="resetFormPass(ruleFormRef)">Reset</el-button>
      <el-button type="warning" @click="dialogVisible = true">忘记密码</el-button>
    </el-form-item>
  </el-form>
  <el-dialog v-model="dialogVisible" title="密码重置" width="400">
    <span>将通过邮箱重置你的账号为随机密码<br>若邮箱未绑定此操作将失败!</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button :loading="dialogLoading" type="danger" @click="forgetPass()">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import service from "@/axios";
import {toast} from "@/utils/utils";
import {reactive, ref} from "vue";
import type {FormInstance, FormRules, UploadProps} from "element-plus";
import {Lock} from '@element-plus/icons-vue'

const user = ref({})
service.get("/auth/info").then((res) => {
  user.value = res
}).catch((err) => {
  toast("获取登录信息失败,请尝试重新登录")
})

const handleAvatarSuccess: UploadProps['onSuccess'] = (
    response
) => {
  service.post("/user/upload_head_img", {url: response}).then((res) => {
    if (res.code == 200) {
      toast(res.msg, "success");
      user.value.icon = response
    } else toast(res.msg)
  })
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    toast('仅支持上传jpg或png格式图片')
    return false
  } else if (rawFile.size / 1024 / 1024 > 3) {
    toast('图片大小超过3MB!')
    return false
  }
  return true
}

const eidFormRef = ref<FormInstance>()

const edvfm = reactive<{
  email: string, code: string
}>({
  email: '', code: ''
})

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid && edvfm.code !== '') {
      service.get(`/auth/bind?eid=${edvfm.email}&code=${edvfm.code}`).then((res) => {
        if (res.code == 200) {
          toast(res.msg, "success")
          user.value.eid = edvfm.email
        } else toast(res.msg)
      }).catch((err) => {
        toast(err, "warning")
      })
    } else {
      toast("请确保邮箱正确和验证码完整")
    }
  })
}

const reqLoading = ref(false)

const reqCode = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      reqLoading.value = true
      service.get("/auth/reqbind?eid=" + edvfm.email).then((res) => {
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

const qqFormRef = ref<FormInstance>()

const qqValidateForm = reactive({
  qq: '',
})

const submitQq = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      service.get("/auth/bindqq?qid=" + qqValidateForm.qq).then((res) => {
        if (res.code == 200) {
          toast(res, "success")
          user.value.qid = qqValidateForm.qq
        } else toast(res.msg)
      }).catch((err) => {
        toast(err)
      });
    } else {
      toast("请确保QQ填写正确")
    }
  })
}
// 以下修改密码段

const ruleFormRef = ref<FormInstance>()

const checkpass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    return callback(new Error('旧密码不能为空'))
  }
}

const validatePass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('新密码不能为空'))
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
    callback(new Error('请确认新密码'))
  } else if (value !== ruleForm.pass) {
    callback(new Error("新密码输入不匹配"))
  } else {
    callback()
  }
}

const ruleForm = reactive({
  pass: '',
  checkPass: '',
  opass: '',
})

const rules = reactive<FormRules<typeof ruleForm>>({
  pass: [{validator: validatePass, trigger: 'blur'}],
  checkPass: [{validator: validatePass2, trigger: 'blur'}],
})

const submitFormPass = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      service.post("/auth/changepass", {opass: ruleForm.opass, pass: ruleForm.pass}).then((res) => {
        if (res.code == 200) {
          toast(res.msg, "success")
          resetFormPass(formEl)
        } else toast(res.msg)
      }).catch((err) => {
            toast(err, "warning")
      });
    } else {
      toast("请确保所有信息填写正确")
    }
  })
}

const resetFormPass = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

const dialogVisible = ref(false)
const dialogLoading = ref(false)

function forgetPass() {
  dialogLoading.value = true
  service.get("/auth/forgetpass").then((res) => {
    if (res.code == 200) {
      toast(res.msg, "success")
    } else toast(res.msg)
  }).finally(() => {
    dialogVisible.value = false
    dialogLoading.value = false
  })
}

</script>