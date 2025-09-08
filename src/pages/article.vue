<template>
  <div class="container" style="background-color: rgba(255,255,255,0.78)">
    <br>
    <button type="button" class="btn btn-danger bi bi-x-square" v-show="deletable"
            data-toggle="modal" @click="remove"><span>删除</span></button>

    <button type="button" :class="'bi bi-file-earmark-lock btn '+pClassEnd"
            v-show="deletable" data-toggle="modal" @click="_private" style="margin: 5px;">
      <span>私有</span>
    </button>


    <button type="button" :class="'bi bi-bookmark-heart btn '+fClassEnd"
            v-show="login_state" v-on:click="favorite()" style="margin-left: 5px"><span>收藏</span></button>

    <h5 v-show="!login_state">tips:登录可收藏/删除评论</h5>
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
        <button class="btn btn-outline-info" type="button" @click="commentDo">评论</button>
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
        <a style="float:right;color: rgba(232,41,76,0.91)" v-show="d.c0" class="ml-3 bi bi-trash"
           v-on:click="del(d.commentId)">删除</a>
        <span style="margin-top: 3px; color: rgba(76,76,76,0.95)" class="ml-3 " v-text="formatMsgTime(d.time)"></span>
      </div>
      <div class="col-1"></div>
    </div>
  </div>

  <div class="modal fade" id="dtips0" tabindex="-1" aria-labelledby="dtips0Label" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="dtips0Label">提示</h5>
        </div>
        <div class="modal-body">
          <h3 style="color:#dc0551;">确认删除吗</h3>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="deleteNow()">确定</button>
        </div>
      </div>
    </div>
  </div>

  <div class="modal fade" id="dtips1" tabindex="-1" aria-labelledby="dtips1Label" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="dtips1Label">提示</h5>
        </div>
        <div class="modal-body">
          <h3 style="color:#dc0551;">{{ dtips1text }}</h3>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">取消</button>
          <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="privateNow()">确定</button>
        </div>
      </div>
    </div>
  </div>


</template>

<script lang="ts" setup>
import {useRoute} from "vue-router";
import {formatMsgTime, toast} from "@/utils/utils";
import {onMounted, ref} from "vue";
import service, {login_state} from "@/axios";

import {MdPreview} from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';
import router from "@/router";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle.min"
import $ from "jquery";

function getMsgTime(time: string) {
  return formatMsgTime(time)
}

const route = useRoute()
const id = route.query.id

let data = ref({})
let fClassEnd = ref("btn-outline-secondary")
let pClassEnd = ref("btn-outline-secondary")

service.get("/notice/get-notice-id?id=" + id).then(function (response) {
  data.value = response
  document.getElementsByTagName("title")[0].innerText = data.value.title
}).catch(function (err) {
  console.log(err);
})

function favorite() {
  service.get("/notice/favorite?id=" + id).then(function (response) {
    fClassEnd.value = response ? "btn-primary" : "btn-outline-secondary"
  }).catch(function (err) {
    console.log(err);
  })
}

const cs = ref([])

service.get("/comments/get-comment?nid=" + id).then(function (response) {
  cs.value = response
}).catch(function (err) {
  alert(err);
})

function del(id: number) {
  service.get("/comments/del-comment?id=" + id).then(function (response) {
    if (response) {
      cs.value = cs.value.filter((d) => d.commentId !== id);
      toast("删除完成!", "success")
    }
  }).catch(function (err) {
    console.log(err)
    toast("删除异常")
  })
}

function remove() {
  new bootstrap.Modal('#dtips0', {keyboard: false}).show()
}

function deleteNow() {
  service.get("/notice/delete?id=" + id).then(function (response) {
    if (response.toString() === "OK") {
      toast("删除成功", "success")
      router.push("/")
    }
  }).catch(function (err) {
    console.log(err)
    toast("删除异常")
  })
}

let dtips1text = ref("确定设置为仅自己可见吗?")

function _private() {
  if (privated.value) {
    dtips1text.value = "确定取消仅自己可见吗?"
  } else {
    dtips1text.value = "确定设置为仅自己可见吗?"
  }
  new bootstrap.Modal('#dtips1', {keyboard: false}).show()
}

function privateNow() {
  service.get("/notice/private?id=" + id).then(function (response) {
    if (response.toString() === "OK") {
      toast("设置成功", "success")
    }
    privated.value = response
    if (privated.value) {
      pClassEnd.value = "btn-secondary"
    } else {
      pClassEnd.value = "btn-outline-secondary"
    }
  }).catch(function (err) {
    console.log(err)
    toast("设置异常")
  })
}

let deletable = ref(false)

let privated = ref(false)

onMounted(() => {
  if (login_state.value) {
    service.get("/notice/favorited?id=" + id).then(function (response) {
      fClassEnd.value = response ? "btn-primary" : "btn-outline-secondary"
    }).catch(function (err) {
      console.log(err);
    })

    service.get("/notice/deletable?id=" + id).then(function (response) {
      deletable.value = response
    }).catch(function (err) {
      console.log(err);
    })

    service.get("/notice/privated?id=" + id).then(function (response) {
      privated.value = response
      if (privated.value) {
        pClassEnd.value = "btn-secondary"
      } else {
        pClassEnd.value = "btn-outline-secondary"
      }
    }).catch(function (err) {
      console.log(err);
    })
  }
})

function commentDo() {
  if (!login_state.value) {
    toast("请先登录")
    router.push("/login");
  } else {
    const content = $("#comment_input").val();
    const formData = new FormData();
    formData.append('nid', id);
    formData.append('body', content);
    service.post("/comments/pcm", formData).then(response => {
      cs.value.push(response)
    }).catch(err => {
    })
  }
}


</script>
