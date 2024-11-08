<script setup lang="ts">

import $ from 'jquery';

import {onMounted, ref} from "vue";
import service from "@/axios";
import {toast} from "@/utils/utils";
import parseLyrics from "@/api/lyric";

let now_id = ref("")

let lyric = ref("")
let lyrics = ref([""])

let nowLyrics = ref([])
let info = ref({})

const ap = window.ap

onMounted(() => {
  document.getElementById("froom").scrollIntoView();

  let iee = $("#icon-img");
  //旋转关键
  let rting = 0;
  let rn = 0

  function animateBox() {
    iee.animate({
      rotate: '+=7deg'
    }, 500, "linear",);
  }

  function loadRes(et: number = 2000) {
    setTimeout(() => {
      const ad0 = ap.list.audios[ap.list.index];
      iee.attr("src", ad0.cover)
      now_id.value = ad0.id
      info.value = ad0
      if (!ad0.lyric) {
        service.get(`/get-lrc-by-id?id=${now_id.value}`).then((r) => {
          lyric.value = r;
          lyrics.value = parseLyrics(r)
          ad0.lyric = r;
        }).catch((e) => {
          toast("获取歌词失败:" + e)
        })
      } else {
        const r = ad0.lyric
        lyric.value = r;
        lyrics.value = parseLyrics(r)
        ad0.lyric = r;
      }
    }, et)
  }

  loadRes()

  setInterval(() => {
    if (ap.audio.paused == false) {
      rting++;
      if (rting % 5 == 0) {
        animateBox()
        nowLyrics.value = getNearst(ap.audio.currentTime * 1000)
        percentage.value = ((ap.audio.currentTime / ap.audio.duration) * 100).toFixed(2)
      }
    }
    if (now_id.value !== ap.list.audios[ap.list.index].id) {
      loadRes(0)
    }
  }, 102)
})

function togglePlay() {
  ap.toggle()
}

function getNearst(time: number, nextn: number = 3) {
  let outs = []
  let ns = false
  let ul = null;
  let ull = null;
  for (let i = 0; i < lyrics.value.length; i++) {
    let ee = lyrics.value[i]
    if (ns) {
      if (outs.length >= (nextn + 2)) {
        break
      }
      outs.push(ee)
    }
    if (ee.timestamp > time) {
      ns = true
      if (ull != null) outs.push(ull)
      if (ul != null) outs.push(ul)
      outs.push(ee)
    }
    ull = ul;
    ul = ee;
  }
  return outs
}

let percentage = ref(0)
</script>
<template>
  <el-row class="min-h-screen" id="froom">
    <div style="position: absolute;width: 40%;left: 35%;top: 3%;">
      <h3>{{ info.name }}</h3>
      <h4>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;---{{ info.artist }}</h4>
    </div>
    <el-col :lg="8" :md="12" class="bg-opacity- bg-zinc-500  flex items-center justify-center">
      <div style="margin-top: -180px" class="square" @click="togglePlay()">
        <img id="icon-img" class="rounded-full square" alt="1" src=""/>
      </div>
    </el-col>
    <el-col :lg="16" :md="12" class="bg-opacity-100 bg-zinc-500 flex items-center justify-content-center">
      <div style="margin-top: -180px;left: 10%; width: 80%">
        <div style="background-color: rgba(255,255,255,0.02);color: rgba(213,222,244,0.9);" class="items-center"
             role="alert" v-for="(e,i) in nowLyrics">
          <h4 :class="'l-'+i"> {{ e.content }}</h4>
        </div>
      </div>
    </el-col>

    <el-progress style="position: absolute;width: 80%;left: 10%;bottom: 4%"
                 :text-inside="true" :stroke-width="26" :percentage="percentage"/>
  </el-row>
</template>

<style scoped>
.l-0 {
  color: rgba(158, 172, 197, 0.7);
}

.l-1 {
  color: rgba(247, 250, 253, 0.98);
}

.square {
  position: absolute;
  width: 320px;
  height: 320px;
  transform: rotate(30deg);
}
</style>