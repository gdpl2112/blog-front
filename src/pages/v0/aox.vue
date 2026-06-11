<style scoped>
.aox-section h3 {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0 0 var(--space-4);
  color: var(--color-text-primary);
}

.aox-add-btn {
  margin-bottom: var(--space-4);
}

.aox-form {
  background: var(--color-bg-soft);
  border-radius: var(--radius-md);
  padding: var(--space-5);
  margin-bottom: var(--space-5);
  display: none;
}

.aox-form.show {
  display: block;
}
</style>

<template>
  <div class="aox-section">
    <h3>API管理</h3>

    <el-table :data="tableData" style="width:100%" max-height="300">
      <el-table-column fixed prop="name" label="名字" width="140" />
      <el-table-column prop="method" label="方法" width="100" />
      <el-table-column prop="state" label="状态" width="100" />
      <el-table-column prop="address" label="地址" width="120" />
      <el-table-column prop="desc" label="描述" min-width="240" />
      <el-table-column fixed="right" label="操作" width="100">
        <template #default="scope">
          <el-button link type="primary" size="small" @click.prevent="deleteRow(scope.$index)">Remove</el-button>
        </template>
      </el-table-column>
    </el-table>

    <button class="btn-modern aox-add-btn" @click="ttff">
      <i class="bi bi-plus-circle"></i> 添加API
    </button>

    <div id="ff" class="aox-form" :class="{show: formVisible}">
      <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="API名" prop="name">
          <el-input v-model="ruleForm.name" placeholder="API名称" />
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="ruleForm.state" placeholder="选择状态">
            <el-option label="稳定" value="success" />
            <el-option label="不确定" value="warning" />
          </el-select>
        </el-form-item>
        <el-form-item label="请求方式" prop="method">
          <el-select v-model="ruleForm.method" placeholder="请求方式">
            <el-option label="GET" value="GET" />
            <el-option label="POST" value="POST" />
          </el-select>
        </el-form-item>
        <el-form-item label="API地址" prop="address">
          <el-input v-model="ruleForm.address" placeholder="API地址" />
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input v-model="ruleForm.desc" type="textarea" placeholder="参数格式和返回格式" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm(ruleFormRef)" style="background:var(--color-accent);border-color:var(--color-accent);">提交</el-button>
          <el-button @click="resetForm(ruleFormRef)">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import $ from 'jquery'
import {onMounted, reactive, ref} from 'vue'
import type {ComponentSize, FormInstance, FormRules} from 'element-plus'
import service from "@/axios";
import {toast} from "@/utils/utils";

interface RuleForm { name: string; state: string; method: string; address: string; desc: string }
const formSize = ref<ComponentSize>('default')
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({name:'',state:'',method:'',address:'',desc:''})
const rules = reactive<FormRules<RuleForm>>({
  name: [{required:true,message:'不能空',trigger:'blur'},{min:2,max:9,message:'长度2-9',trigger:'blur'}],
  address: [{required:true,message:'不能空',trigger:'blur'}],
  state: [{required:true,message:'选择状态',trigger:'change'}],
  method: [{required:true,message:'选择方法',trigger:'change'}],
  desc: [{required:true,message:'请输入描述',trigger:'blur'},{min:6,max:50,message:'长度6-50',trigger:'blur'}]
})

const formVisible = ref(false)

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid) => {
    if (valid) {
      service.post("/api/add", ruleForm).then((res: any) => {
        if (res.code == 200) { toast(res.msg, "success"); resetForm(formEl); service.get("/api/ls").then((res: any) => { tableData.value = res }) }
        else toast(res.msg)
      })
    }
  })
}
const resetForm = (formEl: FormInstance | undefined) => { if (formEl) formEl.resetFields() }

const tableData = ref([{name:'api名',state:'success',method:'GET',address:'http://kloping.top',desc:'dd'}])
service.get("/api/ls").then((res: any) => { tableData.value = res })

const deleteRow = (index: number) => {
  service.get("/api/del?id=" + tableData.value[index].id).then((res: any) => {
    if (res.code == 200) { toast(res.msg, "success"); tableData.value.splice(index, 1) } else toast(res.msg)
  })
}

function ttff() { formVisible.value = !formVisible.value }
</script>
