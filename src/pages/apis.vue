<script lang="ts" setup>
import {onMounted, ref} from "vue";
import service from "@/axios";
import $ from 'jquery'
import {copyTextElement} from '@/utils/utils'

let list = ref([])

const rawList = ref([])

service.get("/api/list").then(function (response) {
  list.value = response;
  rawList.value = response;
}).catch(function (err) {
  alert(err);
})

function copyTextToClipboard(id: number) {
  const eid = "#input-" + id
  copyTextElement(eid)
}

function inputChange(e: Event, s: string) {
  e.target.value = s
}

onMounted(() => {
  $("#search0").change(function () {
    let text = $(this).val();
    if (text === undefined) {
      list.value = rawList.value;
    } else {
      list.value = rawList.value.filter((e) => {
        return JSON.stringify(e).toLowerCase().indexOf(text.toLocaleLowerCase()) !== -1
      })
    }
  })
})
</script>
<template>
  <div class="alert alert-danger opacity-75 justify-content-center align-content-md-center"
       style="left: 20%; width: 60%;border-radius: 10px; margin: 10px;" aria-current="true">
    <h4><center>API列表</center></h4>
  </div>
  <div class="container">
    <div class="row" id="api_list" style="background: rgba(239,239,239,0.75);border-radius: 10px">
      <hr class="mt-3">
      <center><p> 接口仅用于娱乐 禁止用于非法用途</p></center>
      <hr class="mb-3">
      <div class="col-2"></div>
      <div class="col-8 mb-3">
        <form class="d-flex">
          <input id="search0" class="form-control me-2" type="search" placeholder="过滤">
          <button class="btn btn-outline-success" type="button">filter</button>
        </form>
      </div>
      <hr>
      <div class="col-lg-6 col-md-12" v-for="(e,i) in list">
        <div class="api-card-container">
          <div class="alert alert-light api-main-card" role="alert">
            <div :class="'alert alert-' + e.state + ' api-state-tag'" style="float: right">
              {{ e.state }}
            </div>
            <div :class="'alert alert-' + e.state + ' api-method-tag'" style="float: right">
              {{ e.method }}
            </div>
            <div :class="'alert alert-' + (e.author === 'kloping' ? 'primary' : 'warning') + ' api-author-tag'"
                 style="float: right">
              {{ e.author }}
            </div>
            <div class="card-body">
              <h5 style="color: black" class="card-title api-title">
                {{ e.name + (e.state === 'success' ? ' ' : ('(' + e.state + ')')) }}
              </h5>
              <p style="color:#473f3f;min-height: 72px" class="card-text api-description">
                {{ e.desc }}
              </p>
              接口示例
              <div class="input-group mb-3">
                <input :id="'input-'+e.id" @change="inputChange($event,e.address)"
                       style="color:#3e2929;" type="text" class="form-control api-input"
                       placeholder="api地址展示" aria-label="api地址展示"
                       aria-describedby="button-copyc" :value="e.address">
                <div class="input-group-append">
                  <button v-on:click="copyTextToClipboard(e.id,e.address)"
                          class="btn btn-outline-secondary api-button" type="button"
                          id="button-copyc">
                    copy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 子元素动画样式 */
.api-state-tag, .api-method-tag {
  transition: all 0.3s ease-in-out;
  transform-origin: center right;
}

.api-author-tag {
  transition: background-color 0.3s ease;
}

/* 添加卡片悬停效果 */
.api-card-container {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  will-change: transform, box-shadow;
  opacity: 0.85;
}

.api-card-container:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
  opacity: 1;
}

/* 保持原有样式 */
.alert {
  transition: all 0.3s ease;
}

.api-title {
  transition: color 0.3s ease;
}

.api-description {
  opacity: 0.85;
  transition: opacity 0.3s ease;
}

.api-input {
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.api-button {
  transition: transform 0.2s ease;
}

/* 悬停增强效果 */
.api-card-container:hover .api-state-tag {
  transform: scale(1.02) translateY(-3px);
  background-color: #bbf3c2;
  color: #f61257;
}

.api-card-container:hover .api-method-tag {
  transform: scale(1.02) translateY(-2px);
  background-color: #c8e5ea;
  color: #f425b2;
}

.api-card-container:hover .api-author-tag {
  transform: scale(1.02) translateY(-1px);
  background-color: #d0d6e4;
  color: #750be6;
}

.api-card-container:hover .api-title {
  color: #a10025;
}

.api-card-container:hover .api-description {
  opacity: 1;
}

.api-card-container:hover .api-input {
  border-color: #80bdff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.api-card-container:hover .api-button {
  transform: translateX(3px);
}
</style>