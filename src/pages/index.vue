<style>
.notice-div0 {
  transition: all 1s ease !important;
  border: 1.5px solid transparent;
  background-color: rgba(255, 255, 255, 0.5);
  opacity: 96%;
  border-radius: 12px;
  color: rgba(0, 0, 0, 0.9);
  animation: a_normal .3s linear forwards;
}

.notice-div0:hover {
  background-color: rgba(255, 255, 255, 0.9);
  opacity: 96%;
  color: rgb(0, 0, 0);
  animation: a_hover .3s linear forwards;
}

@keyframes a_normal {
  0% {
    transform: scale(1.02);
  }

  100% {
    transform: scale(0.98);
  }
}

@keyframes a_hover {
  0% {
    transform: scale(0.98);
  }

  100% {
    transform: scale(1.02);
  }
}
</style>
<template>
  <div class="container" style="width: 90%;">
    <div v-on:click="routerTo(d.id)" v-for="d in data">
      <div class="row shadow-lg p-3 mb-5 rounded notice-div0" style="margin-top: 10px;">
        <div class="col-3 align-middle" style="display: inline-block;">
          <span style="position: absolute" class="badge text-bg-success" v-if="d.sort>0">置顶</span>
          <img referrer="no-referrer" class="card-img-top img-responsive center-block"
               :src="d.icon" style="display: inline-block;max-width: 120px; " alt=".">
        </div>
        <div class="col-9">
          <h5 class="card-title" v-text="d.title"></h5>
          <p class="card-text" v-text="d.authorName"></p>
          <span class="bi bi-eye" v-text="d.views"> </span>
          <p class="card-text"><small class="text-muted" v-text="getF(d.time)"> </small></p>
        </div>
      </div>
    </div>
    <hr>
    <br>
    <div class="row">
      <div class="col-4">
      </div>
      <div class="col-4">
        <nav aria-label="">
          <ul class="pagination justify-content-center">
            <li :class="'page-item '+(pup<=0?'disabled':'')">
              <a class="page-link" v-on:click="showPageDatas(pn-1)"><<</a>
            </li>
            <li v-show="pup>0" class="page-item">
              <a class="page-link" v-on:click="showPageDatas(pn-1)">{{ pn - 1 }}</a>
            </li>
            <li class="page-item active" aria-current="page">
              <a class="page-link">{{ pn }}</a>
            </li>
            <li class="page-item" v-show="pdown>0">
              <a class="page-link" v-on:click="showPageDatas(pn+1)">{{ pn + 1 }}</a></li>
            <li :class="'page-item '+(pdown<=0?'disabled':'')">
              <a class="page-link" v-on:click="showPageDatas(pn+1)">>></a>
            </li>
          </ul>
        </nav>
      </div>
      <div class="col-4"></div>
    </div>
  </div>

</template>

<script lang="ts" setup>
import service from "@/axios";
import {onMounted, ref} from "vue";
import {formatMsgTime} from "@/utils/utils";
import router from "@/router";

let rawdata = ref({current: 1, pages: 1, records: []})
let data = ref([])
let pup = ref(null)
let pdown = ref(null)
let pn = ref(1)

function showPageDatas(p: number) {
  service.get("/notice/gets?pageNum=" + p).then(function (response) {
    rawdata.value = response
    pn.value = p
    pup.value = rawdata.value.current - 1
    pdown.value = rawdata.value.current + 1
    pdown.value = pdown.value > rawdata.value.pages ? -1 : pdown.value
    data.value = rawdata.value.records
  }).catch(function (err) {
    alert(err)
  })

}

function getF(t: number) {
  return formatMsgTime(t)
}

showPageDatas(1)

function routerTo(id: number) {
  router.push({
    path: '/article',
    query: {
      id: id
    }
  })
}
</script>