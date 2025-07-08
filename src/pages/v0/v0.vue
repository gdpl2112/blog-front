<template>
  <el-row class="tac bg-teal-50 bg-opacity-50">
    <el-col :lg="4" :md="1">
      <h5 class="mb-2">
        <div class="alert alert-primary" role="alert">
          选项栏
        </div>
      </h5>
      <el-menu default-active="1" class="el-menu-vertical-demo"
               @open="handleOpen" @close="handleClose">
        <RouterLink to="/v0/info" style="text-decoration: none;">
          <el-menu-item index="1">
            <el-icon>
              <setting/>
            </el-icon>
            <span>账号设置</span>
          </el-menu-item>
        </RouterLink>
        <RouterLink to="/v0/articles" style="text-decoration: none;">
          <el-menu-item index="2">
            <el-icon>
              <document/>
            </el-icon>
            <span>文章管理</span>
          </el-menu-item>
        </RouterLink>
        <RouterLink to="/v0/aox" style="text-decoration: none;">
          <el-menu-item index="3">
            <el-icon>
              <icon-menu/>
            </el-icon>
            <span>API管理</span>
          </el-menu-item>
        </RouterLink>

<!--        <RouterLink to="/v0/bgi" style="text-decoration: none;">-->
<!--          <el-menu-item index="4">-->
<!--            <el-icon><Picture /></el-icon>-->
<!--            <span>背景图管理</span>-->
<!--          </el-menu-item>-->
<!--        </RouterLink>-->

        <RouterLink to="/v0/pnote" style="text-decoration: none;">
          <el-menu-item index="5">
            <el-icon><Notebook /></el-icon>
            <span>密码本</span>
          </el-menu-item>
        </RouterLink>

        <RouterLink v-if="roles.includes('admin')" to="/v0/adminv0" style="text-decoration: none;">
          <el-menu-item index="6">
            <el-icon>
              <setting/>
            </el-icon>
            <span>管理</span>
          </el-menu-item>
        </RouterLink>
      </el-menu>
    </el-col>
    <el-col :lg="1" :md="0">
    </el-col>
    <el-col :lg="19" :md="1">
      <RouterView/>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import {RouterLink, RouterView} from 'vue-router'

import {Document, Menu as IconMenu, Notebook, Setting, Picture} from "@element-plus/icons-vue";
import {onMounted, ref} from "vue";
import service from "@/axios";

const handleOpen = (key: string, keyPath: string[]) => {
}
const handleClose = (key: string, keyPath: string[]) => {
}

const roles = ref(['user'])
onMounted(() => {
  service.get("/auth/role").then((res) => {
    roles.value = res
  })
})
</script>
