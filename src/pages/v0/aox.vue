<style scoped>
/* =============================================
   接口管理：清单 + 新增表单
   ============================================= */

.panel-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--gap-4);
  padding-bottom: 10px;
  border-bottom: 1px solid var(--rule-2);
  margin-bottom: var(--gap-5);
}

.panel-head h2 {
  font-size: var(--text-md);
  letter-spacing: 0.06em;
  margin: 0;
}

.panel-head span {
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  letter-spacing: 0.08em;
  color: var(--ink-3);
}

.table-tools {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--gap-4);
  margin: var(--gap-5) 0;
}

.table-tools .hint {
  font-size: var(--text-xs);
  color: var(--ink-3);
}

.add-form {
  border: 1px solid var(--glass-line);
  border-radius: var(--r-md);
  padding: var(--gap-5);
  margin-top: var(--gap-5);
  background: var(--glass-thin);
}

.add-form h3 {
  font-size: var(--text-base);
  font-weight: 600;
  letter-spacing: 0.04em;
  margin: 0 0 var(--gap-4);
}

.add-form :deep(.el-form-item) {
  margin-bottom: 12px;
}

.form-actions {
  display: flex;
  gap: var(--gap-2);
}

.method-cell {
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  letter-spacing: 0.06em;
  color: var(--ink-2);
}

.addr-cell {
  font-family: var(--font-mono);
  font-size: 11.5px;
  color: var(--ink-3);
  overflow-wrap: anywhere;
}
</style>

<template>
  <div class="ink-in">
    <div class="panel-head">
      <h2>接口管理</h2>
      <span>{{ tableData.length }} 条</span>
    </div>

    <el-table :data="tableData" style="width: 100%" max-height="340">
      <el-table-column prop="name" label="名称" width="130" />
      <el-table-column label="方法" width="80">
        <template #default="{ row }"><span class="method-cell">{{ row.method }}</span></template>
      </el-table-column>
      <el-table-column label="状态" width="90">
        <template #default="{ row }">
          <span class="chip" :class="row.state === 'success' ? 'chip--ok' : ''">{{ row.state }}</span>
        </template>
      </el-table-column>
      <el-table-column label="地址" width="150">
        <template #default="{ row }"><span class="addr-cell">{{ row.address }}</span></template>
      </el-table-column>
      <el-table-column prop="desc" label="描述" min-width="220" show-overflow-tooltip />
      <el-table-column label="" width="72" align="right">
        <template #default="{ $index }">
          <el-button link type="danger" size="small" @click.prevent="deleteRow($index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="table-tools">
      <span class="hint">新增的接口会出现在公开的接口目录里。</span>
      <button class="btn btn--sm" @click="ttff">
        <i :class="formVisible ? 'bi bi-x' : 'bi bi-plus'"></i>
        {{ formVisible ? '收起表单' : '新增接口' }}
      </button>
    </div>

    <div v-if="formVisible" class="add-form">
      <h3>新增接口</h3>
      <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="84px" style="max-width: 560px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="ruleForm.name" placeholder="2–9 个字" />
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="ruleForm.state" placeholder="选择状态" style="width: 100%">
            <el-option label="稳定" value="success" />
            <el-option label="不确定" value="warning" />
          </el-select>
        </el-form-item>
        <el-form-item label="请求方式" prop="method">
          <el-select v-model="ruleForm.method" placeholder="请求方式" style="width: 100%">
            <el-option label="GET" value="GET" />
            <el-option label="POST" value="POST" />
          </el-select>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="ruleForm.address" placeholder="https://" />
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input v-model="ruleForm.desc" type="textarea" :rows="3" placeholder="参数格式和返回格式" />
        </el-form-item>
        <el-form-item>
          <div class="form-actions">
            <el-button type="primary" @click="submitForm(ruleFormRef)">提交</el-button>
            <el-button @click="resetForm(ruleFormRef)">重置</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {reactive, ref} from 'vue'
import type {FormInstance, FormRules} from 'element-plus'
import service from "@/axios";
import {toast} from "@/utils/utils";

interface RuleForm { name: string; state: string; method: string; address: string; desc: string }
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
