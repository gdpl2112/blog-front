<template>
  <center>
    <h2 style="font-weight: bold;color: black;background: rgba(254,253,255,0.45)">API 列表</h2>
  </center>
  <center><h5 style="background: rgba(254,253,255,0.45)"> 接口仅用于娱乐 禁止用于非法用途 </h5></center>
  <div class="container">
    <div class="row-12" id="api_list" style="background: rgba(239,239,239,0.75)">
      <ul class="list-group">
        <li class="list-group-item list-group-item-action list-group-item-danger" aria-current="true">
          <h4>
            <center>API列表</center>
          </h4>
        </li>
        <li v-for="(e,i) in list" class="list-group-item"
            style="margin: 5px; border-radius: 5px;opacity: 80%">

          <div :class="'alert alert-'+e.state" style="float: right">{{ e.state }}</div>
          <div :class="'alert alert-'+e.state" style="float: right">{{ e.method }}</div>
          <div :class="'alert alert-'+(e.author==='kloping'?'primary':'warning')"
               style="float: right">{{ e.author }}
          </div>
          <div class="card-body">
            <h5 style="color: black" class="card-title"
                v-text="e.name + (e.state === 'success' ? ' ' : ('('+e.state+')'))"></h5>
            <p style="color:#473f3f;" class="card-text" v-text="e.desc"></p> 接口示例
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
        </li>
      </ul>
    </div>
  </div>

</template>

<script lang="ts" setup>
import {ref} from "vue";
import service from "@/axios";

let list = ref([])
service.get("/api/list").then(function (response) {
  list.value = response;
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
</script>