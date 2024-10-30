<template>
  <div class="container" style="background-color: rgba(255,255,255,0.78)">
    <br>
    <button type="button" class="btn btn-danger bi bi-x-square" v-show="deletable"
            data-toggle="modal" data-target="#dtips0"></button>
    <button type="button" :class="'bi bi-bookmark-heart btn '+fClassEnd"
            v-show="lstate" v-on:click="favoritec()"></button>
    <h5 v-show="!lstate">tips:登录可收藏/删除评论</h5>
    <hr/>
    <center><h3 v-text="data.title"></h3></center>
    <hr/>
    <br>
    <div class="row">
      <div class="col-3">
        <p class="text-secondary" v-text="getMsgTime(data.time)"></p>
      </div>
      <div class="col-4">
      </div>
      <div class="col-3">
        <p class="text-secondary" v-text="data.authorName"></p>
      </div>
      <span class="text-success col-2 bi-eye" v-text="data.views"> </span>
    </div>
    <br>
    <br>
    <div class="row">
      <div id="content0" class="col-12">
        <MdPreview v-show="data.type==='md'" :modelValue="data.html"/>
        <div v-show="data.type==='html'" v-html="data.html"></div>
        <hr>
        <br>
      </div>
    </div>
  </div>
  <br>

  <div class="container">
    <div class="row">
    </div>
    <div class="input-group">
      <input type="text" placeholder="评论." id="comment_input" class="form-control" aria-label="Dollar amount ">
      <div class="input-group-append">
        <button class="btn btn-outline-info" type="button" id="comment_but">评论</button>
      </div>
    </div>
    <br>
    <div style="margin-top: 2px" class="d-flex row" v-for="d in cs">
      <div class="col-1"></div>
      <div style="background-color: rgba(220,220,220,0.8);border-radius: 10px;vertical-align: middle;padding-top: 7px"
           class="media col-10">
        <img style="float:left; max-width: 40px; border-radius: 10px" :src="d.icon"
             class="mr-3 align-self-center mx-auto">
        <div>
          <h5 style="color: rgb(0,0,0)" class="mt-0" v-text="d.nickName"></h5>
          <p style="color: rgb(30,30,30)" v-text="d.content"></p>
        </div>
        <a style="float:right;color: rgba(232,41,76,0.91)" v-show="d.c" class="ml-3 bi bi-trash"
           v-on:click="delc(d.commentId)">删除</a>
        <span style="margin-top: 3px; color: rgba(76,76,76,0.95)" class="ml-3 " v-text="formatMsgTime(d.time)"></span>
      </div>
      <div class="col-1"></div>
    </div>
  </div>

  <div class="modal fade" id="tipsModal" tabindex="-1" aria-labelledby="tipsModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="tipsModalLabel">提示</h5>
        </div>
        <div id="tips-content" class="modal-body text-danger">
          <div class="spinner-border text-primary" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade" id="dtips0" tabindex="-1" aria-labelledby="dtips0Label" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="dtips0Label">提示</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <h3 style="color:#dc0551;">确认删除吗</h3>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
          <button type="button" class="btn btn-primary" onclick="deleteNow()">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {useRoute} from "vue-router";
import {formatMsgTime} from "@/utils/utils";
import {ref} from "vue";
import service from "@/axios";

import {MdPreview} from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';


function getMsgTime(time: string) {
  return formatMsgTime(time)
}

const route = useRoute()
const id = route.query.id

let data = ref({})
let lstate = ref(false)
let deletable = ref(false)
let fClassEnd = ref("btn-outline-secondary")

service.get("/ba/notice/get-notice-id?id=" + id).then(function (response) {
  data.value = response
  document.getElementsByTagName("title")[0].innerText = data.value.title
}).catch(function (err) {
  console.log(err);
})

function favoritec() {

}

let cs = ref([])
service.get("/ba/comments/get-comment?nid=" + id).then(function (response) {
  cs = response
}).catch(function (err) {
  alert(err);
})

function delc(id: number) {
  $('#tipsModal').modal('show')
  service.get("/ba/del-comment?id=" + id).then(function (response) {
    setTimeout(function () {
      $('#tipsModal').modal('hide')
    }, 500)
    if (response.data) {
      cs.value = cs.value.filter(function (item) {
        return item.commentId !== id
      });
    }
  }).catch(function (err) {
    setTimeout(function () {
      $('#tipsModal').modal('hide')
    }, 500)
    alert(err);
  })
}
</script>