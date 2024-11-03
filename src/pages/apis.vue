<template>
  <center><h5 style="background: rgba(254,253,255,0.45)"> 接口仅用于娱乐 禁止用于非法用途 </h5></center>
  <div class="alert alert-danger opacity-75" aria-current="true">
    <h4>
      <center>API列表</center>
    </h4>
  </div>
  <div class="container">
    <div class="row" id="api_list" style="background: rgba(239,239,239,0.75);border-radius: 10px">
      <hr class="mt-3">
      <div class="col-2"></div>
      <div class="col-8 mb-3">
        <form class="d-flex">
          <input id="search0" class="form-control me-2" type="search" placeholder="过滤">
          <button class="btn btn-outline-success" type="button">filter</button>
        </form>
      </div>
      <hr>
      <div class="col-lg-6 col-md-12" v-for="(e,i) in list">
        <div class="alert alert-light" role="alert"
             style="border-radius: 20px;opacity: 80%">
          <div :class="'alert alert-'+e.state" style="float: right">{{ e.state }}</div>
          <div :class="'alert alert-'+e.state" style="float: right">{{ e.method }}</div>
          <div :class="'alert alert-'+(e.author==='kloping'?'primary':'warning')"
               style="float: right">{{ e.author }}
          </div>
          <div class="card-body">
            <h5 style="color: black" class="card-title"
                v-text="e.name + (e.state === 'success' ? ' ' : ('('+e.state+')'))"></h5>
            <p style="color:#473f3f;min-height: 72px" class="card-text" v-text="e.desc"></p>
            接口示例
            <div class="input-group mb-3">
              <input :id="'input-'+e.id" @change="inputChange($event,e.address)" style="color:#a58989;"
                     type="text" class="form-control"
                     placeholder="api地址展示"
                     aria-label="api地址展示" aria-describedby="button-copyc" :value="e.address">
              <div class="input-group-append">
                <button v-on:click="copyTextToClipboard(e.id,e.address)" class="btn btn-outline-secondary"
                        type="button" id="button-copyc">copy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, ref} from "vue";
import service from "@/axios";
import $ from 'jquery'

let list = ref([])

const rawList = ref([])

service.get("/api/list").then(function (response) {
  list.value = response;
  rawList.value = response;
}).catch(function (err) {
  alert(err);
})

function copyTextToClipboard(id: number) {
  const range = document.createRange();
  range.selectNode(document.querySelector("#input-" + id));
  const selection = window.getSelection();
  if (selection.rangeCount > 0) selection.removeAllRanges();
  selection.addRange(range);
  document.execCommand('Copy');
  alert('文本已成功复制到剪贴板');
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