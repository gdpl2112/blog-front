<template>
  <hr>
  <el-table :data="tableData" style="width: 100%" max-height="250">
    <el-table-column fixed prop="name" label="名字" width="150"/>
    <el-table-column prop="method" label="方法" width="120"/>
    <el-table-column prop="state" label="状态" width="120"/>
    <el-table-column prop="address" label="地址" width="120"/>
    <el-table-column prop="desc" label="描述" width="600"/>
    <el-table-column fixed="right" label="操作" min-width="120">
      <template #default="scope">
        <el-button
            link
            type="primary"
            size="small"
            @click.prevent="deleteRow(scope.$index)"
        >
          Remove
        </el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-button class="mt-4" style="width: 100%" @click="ttff">
    添加/隐藏
  </el-button>
  <hr>
  <el-form id="ff"
           ref="ruleFormRef"
           style="max-width: 600px"
           :model="ruleForm"
           :rules="rules"
           label-width="auto"
           class="demo-ruleForm"
           :size="formSize"
           status-icon
  >
    <el-form-item label="API名" prop="name">
      <el-input v-model="ruleForm.name" placeholder="给予该api名称"/>
    </el-form-item>

    <el-form-item label="状态" prop="state">
      <el-select v-model="ruleForm.state" placeholder="请选择api状态">
        <el-option label="稳定" value="success" class="bg-success bg-opacity-25"/>
        <el-option label="不确定" value="warning" class="bg-warning bg-opacity-25"/>
      </el-select>
    </el-form-item>

    <el-form-item label="请求方式" prop="method">
      <el-select v-model="ruleForm.method" placeholder="请求方式">
        <el-option label="GET" value="GET"/>
        <el-option label="POST" value="POST"/>
      </el-select>
    </el-form-item>

    <el-form-item label="API地址" prop="address">
      <el-input v-model="ruleForm.address" placeholder="api地址"/>
    </el-form-item>

    <el-form-item label="api描述" prop="desc">
      <el-input v-model="ruleForm.desc" type="textarea" placeholder="尽量描述清楚请求参数,格式和返回格式"/>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm(ruleFormRef)">
        提交
      </el-button>
      <el-button @click="resetForm(ruleFormRef)">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import $ from 'jquery'
import {onMounted, reactive, ref} from 'vue'
import type {ComponentSize, FormInstance, FormRules} from 'element-plus'
import service from "@/axios";
import {toast} from "@/utils/utils";

interface RuleForm {
  name: string
  state: string
  method: string
  address: string
  desc: string
}

const formSize = ref<ComponentSize>('default')

const ruleFormRef = ref<FormInstance>()

const ruleForm = reactive<RuleForm>({
  name: '',
  state: '',
  method: '',
  address: '',
  desc: '',
})

const rules = reactive<FormRules<RuleForm>>({
  name: [
    {required: true, message: 'API名称不能空', trigger: 'blur'},
    {min: 2, max: 9, message: '长度控制在2-9', trigger: 'blur'},
  ], address: [
    {required: true, message: 'API地址不能空', trigger: 'blur'},
  ],
  state: [
    {
      required: true,
      message: '选择api状态',
      trigger: 'change',
    },
  ],
  method: [
    {
      required: true,
      message: '选择请求方法',
      trigger: 'change',
    },
  ],
  desc: [
    {required: true, message: '请输入描述', trigger: 'blur'}, {
      min: 6,
      max: 50,
      message: '长度控制在6-50',
      trigger: 'blur'
    },
  ],
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      service.post("/api/add", ruleForm).then(res => {
        if (res.code == 200) {
          toast(res.msg, "success")
          resetForm(formEl)
          service.get("/api/ls").then(res => {
            tableData.value = res
          })
        } else {
          toast(res.msg)
        }
      })
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

onMounted(() => {
  $("#ff").toggle()
})

function ttff() {
  $("#ff").toggle()
}

const tableData = ref([
  {
    name: 'api名',
    state: 'success',
    method: 'GET',
    address: 'http://kloping.top',
    desc: 'dd',
  }
])

service.get("/api/ls").then(res => {
  tableData.value = res
})

const deleteRow = (index: number) => {
  service.get("/api/del?id=" + tableData.value[index].id).then(res => {
    if (res.code == 200) {
      toast(res.msg, "success")
      tableData.value.splice(index, 1)
    } else {
      toast(res.msg)
    }
  });
}
</script>