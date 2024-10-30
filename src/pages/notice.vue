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
      </div>
    </div>
  </div>
  <br>
  <!--  <div id="comment_q" class="container">-->
  <!--    <div class="row">-->
  <!--    </div>-->
  <!--    <div class="input-group">-->
  <!--      <input type="text" placeholder="评论." id="comment_input" class="form-control" aria-label="Dollar amount ">-->
  <!--      <div class="input-group-append">-->
  <!--        <button class="btn btn-outline-info" type="button" id="comment_but">评论</button>-->
  <!--      </div>-->
  <!--    </div>-->
  <!--    <br>-->
  <!--    <div style="margin-top: 5px" class="row" v-for="d in cs">-->
  <!--      <div class="col-1"></div>-->
  <!--      <div style="background-color: rgba(94,145,152,0.7);border-radius: 10px;vertical-align: middle;"-->
  <!--           class="media col-10">-->
  <!--        <img style="max-width: 40px; border-radius: 10px" :src="d.icon" class="mr-3 align-self-center mx-auto "-->
  <!--             alt=".">-->
  <!--        <div style="margin-left: 8px" class="media-body">-->
  <!--          <h5 class="mt-0" v-text="d.nickName"></h5>-->
  <!--          <p style="display: inline-block" v-text="d.content"></p>-->
  <!--        </div>-->
  <!--        <a style="margin-top: 3px" v-show="d.c0" class="ml-3 bi bi-trash badge badge-danger"-->
  <!--           v-on:click="delc(d.commentId)">删除</a>-->
  <!--        <br>-->
  <!--        <span style="margin-top: 3px; color: #cb8bab" class="ml-3 " v-text="formatMsgTime(d.time)"></span>-->
  <!--      </div>-->
  <!--      <div class="col-1"></div>-->
  <!--    </div>-->
  <!--  </div>-->

  <!--  <div class="modal fade" id="tipsModal" tabindex="-1" aria-labelledby="tipsModalLabel" aria-hidden="true">-->
  <!--    <div class="modal-dialog">-->
  <!--      <div class="modal-content">-->
  <!--        <div class="modal-header">-->
  <!--          <h5 class="modal-title" id="tipsModalLabel">提示</h5>-->
  <!--        </div>-->
  <!--        <div id="tips-content" class="modal-body text-danger">-->
  <!--          <div class="spinner-border text-primary" role="status">-->
  <!--            <span class="sr-only">Loading...</span>-->
  <!--          </div>-->
  <!--        </div>-->
  <!--      </div>-->
  <!--    </div>-->
  <!--  </div>-->

  <!--  <div class="modal fade" id="dtips0" tabindex="-1" aria-labelledby="dtips0Label" aria-hidden="true">-->
  <!--    <div class="modal-dialog">-->
  <!--      <div class="modal-content">-->
  <!--        <div class="modal-header">-->
  <!--          <h5 class="modal-title" id="dtips0Label">提示</h5>-->
  <!--          <button type="button" class="close" data-dismiss="modal" aria-label="Close">-->
  <!--            <span aria-hidden="true">&times;</span>-->
  <!--          </button>-->
  <!--        </div>-->
  <!--        <div class="modal-body">-->
  <!--          <h3 style="color:#dc0551;">确认删除吗</h3>-->
  <!--        </div>-->
  <!--        <div class="modal-footer">-->
  <!--          <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>-->
  <!--          <button type="button" class="btn btn-primary" onclick="deleteNow()">确定</button>-->
  <!--        </div>-->
  <!--      </div>-->
  <!--    </div>-->
  <!--  </div>-->
</template>

<script lang="ts" setup>
import $ from 'jquery';
import {useRoute} from "vue-router";
import {formatMsgTime} from "@/utils/utils";
import {ref} from "vue";
import service from "@/axios";

import 'highlight.js';
import 'highlight.js/scss/atom-one-dark.scss';
import {marked} from "marked";

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
  if (data.value.type === "md") {
    data.value.html = marked(data.value.html)
  }
  $("#content0").html(data.value.html)
  document.getElementsByTagName("title")[0].innerText = data.value.title
}).catch(function (err) {
  console.log(err);
})

function favoritec() {

}

let cs = ref([])

</script>