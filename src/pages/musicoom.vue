<script setup lang="ts">

import $ from 'jquery';

import {onMounted, reactive, ref} from "vue";
import service from "@/axios";
import {getTimeMs, toast} from "@/utils/utils";
import parseLyrics from "@/api/lyric";

let now_id = ref("")

let lyric = ref("")
let lyrics = ref([""])

let nowLyrics = ref([])
let info = ref({})

const ap = reactive(window.ap)

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

  let getLyricing = false

  function loadRes(et: number = 2000) {
    setTimeout(() => {
      const ad0 = ap.list.audios[ap.list.index];
      iee.attr("src", ad0.cover)
      if (ad0.songId) {
        now_id.value = ad0.songId
      } else now_id.value = ad0.id
      info.value = ad0
      if (!ad0.lyric) {
        if (!getLyricing) {
          getLyricing = true
          service.get(`/api/music/get-lrc-by-id?id=${now_id.value}`).then((r) => {
            lyric.value = r;
            lyrics.value = parseLyrics(r)
            ad0.lyric = r;
          }).catch((e) => {
            toast("获取歌词失败:" + e)
          }).finally(() => {
            getLyricing = false
          })
        }
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
        percentage.value = Number(((ap.audio.currentTime / ap.audio.duration) * 100).toFixed(2))
      }
    }
    if (now_id.value !== ap.list.audios[ap.list.index].id) {
      loadRes(0)
    }
  }, 102)
})

let percentage = ref(0)

function onPercentChange(p: number) {
  ap.seek(p / 100 * ap.audio.duration)
}

function getFormatToolTip(v: number) {
  return getTimeMs((v / 100 * ap.audio.duration).toFixed(0)) + '/' + getTimeMs(ap.audio.duration.toFixed(0))
}

const dialogVisible = ref(false)

const search = ref('')
//搜索中
const searchLoading = ref(false)
//是否是移除选项
const rmop = ref(true)
//私有歌单
let isPri = false

const handlePoi = (index: number, row) => {
  service.get(`/api/music/point?id=${row.id}&name=${row.name}&arts=${row.artist}`).then((r) => {
    if (r.code == 200) {
      toast("添加成功!", "success")
      if (isPri) {
        ap.list.add(r.data)
      } else {
        toggleList(true, false)
      }
    } else {
      toast(r.msg)
    }
  }).catch(e => {
    console.log(e)
  });
}

const handleRmp = (index: number, row) => {
  service.get(`/api/music/rmp?id=${row.id}`).then((r) => {
    if (r.code == 200) {
      toast("移除成功!", "success")
      tableData.value.splice(index, 1)
      ap.list.remove(index)
    } else {
      toast(r.msg)
    }
  }).catch(e => {
    console.log(e)
  });
}

const tableData = ref([
  {
    id: '0',
    name: '歌曲示例名',
    artists: '歌手示例名'
  }
])

onMounted(() => {
  service.get("/user/login_state").then(response => {
    if (response == true) {
      service.get("/api/music/list").then((r) => {
        if (r.code == 200) {
          tableData.value = r.data
        }
      }).catch(function (err) {
        toast("获取音乐失败" + err)
      });
    }
  }).catch(err => {
    toast("获取登录信息失败")
  })
})

function onSearch() {
  if (search.value.length == 0) {
    service.get("/api/music/list").then((r) => {
      if (r.code == 200) {
        tableData.value = r.data
        rmop.value = true
      }
    }).catch(function (err) {
      toast("获取音乐失败" + err)
    });
  } else {
    rmop.value = false
    searchLoading.value = true
    service.get(`/api/music/search?keyword=${search.value}`).then((r) => {
      tableData.value = r
    }).catch((e) => {
      toast("搜索失败:" + e)
    }).finally(() => {
      searchLoading.value = false
    })
  }
}

function toggleList(pri: Boolean, tips: Boolean = true) {
  if (pri) {
    service.get("/api/music/list").then((r) => {
      if (r.code == 200) {
        ap.list.clear()
        ap.list.add(r.data)
        isPri = true
        if (tips) toast("切换成功", "success")
      } else {
        toast("切换失败:" + r.msg)
      }
    }).catch((e) => {
      toast("切换失败:" + e)
    })
  } else {
    service.get("/api/music/get-music-list").then(function (response) {
      ap.list.clear()
      ap.list.add(response)
      isPri = false
      if (tips) toast("切换成功", "success")
    }).catch(function (err) {
      toast("获取音乐失败" + err)
    });
  }
}
</script>
<template>
  <el-row class="min-h-screen" id="froom">

    <div style="position: absolute;width: 40%;left: 35%;top: 3%;">
      <h3>{{ info.name }}</h3>
      <h4>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;---{{ info.artist }}</h4>
    </div>

    <div style="position: absolute; left: 2%;top: 3%;">
      <el-button type="info" plain @click="dialogVisible = true">
        点击搜索
      </el-button>
      <el-button type="primary" plain @click="toggleList(true)">
        切换个人歌单
      </el-button>
      <el-button type="primary" plain @click="toggleList(false)">
        切换默认歌单
      </el-button>
    </div>

    <div style="position: absolute;bottom: 8%;left: 10%;width: 80%" class="slider-demo-block">
      <span class="demonstration">{{
          getTimeMs(ap.audio.currentTime.toFixed(0)) + '/' + getTimeMs(ap.audio.duration.toFixed(0))
        }}</span>
      <el-slider @change="onPercentChange" :format-tooltip="getFormatToolTip" v-model="percentage"/>
    </div>

    <div style="position: absolute;bottom: 14%;left: 40%;width: 30%" class="mb-4">
      <div>
        <el-button @click="ap.skipBack()" type="info" round plain>上一曲</el-button>
        <el-button @click="ap.toggle()" type="info" round plain>播放/暂停</el-button>
        <el-button @click="ap.skipForward()" type="info" round plain>下一曲</el-button>
      </div>
    </div>

    <el-col :lg="8" :md="12" class="bg-opacity-95 bg-zinc-500  flex items-center justify-center">
      <div style="margin-top: -180px" class="square" @click="ap.toggle()">
        <img id="icon-img" class="rounded-full square" alt="1" src=""/>
      </div>
    </el-col>
    <el-col :lg="16" :md="12" class="bg-opacity-95 bg-zinc-500 flex items-center justify-content-center">
      <div style="margin-top: -180px;left: 10%; width: 80%">
        <div style="background-color: rgba(255,255,255,0.02);color: rgba(213,222,244,0.9);" class="items-center"
             role="alert" v-for="(e,i) in nowLyrics">
          <h4 :class="'l-'+i"> {{ e.content }}</h4>
        </div>
      </div>
    </el-col>
    <el-dialog v-model="dialogVisible" title="搜音乐" width="500" draggable align-center>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="search" placeholder="搜索歌单"/>
        </el-form-item>
        <el-form-item>
          <el-button :loading="searchLoading" type="primary" @click="onSearch">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" style="width: 100%;height: 400px">
        <el-table-column label="曲名" prop="name"/>
        <el-table-column label="歌手名" prop="artist"/>
        <el-table-column align="right">

          <template #header>
            <div v-html="rmop?'移除从个人歌单':'添加至个人歌单'"></div>
          </template>

          <template #default="scope">
            <el-button v-if="!rmop" size="small" type="primary" @click="handlePoi(scope.$index, scope.row)">
              ＋
            </el-button>

            <el-button v-if="rmop" size="small" type="danger" @click="handleRmp(scope.$index, scope.row)">
              －
            </el-button>

          </template>

        </el-table-column>

      </el-table>
    </el-dialog>

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