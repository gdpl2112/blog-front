<script setup lang="ts">

import $ from 'jquery';

import {onMounted, reactive, ref} from "vue";
import service from "@/axios";
import {getTimeMs, toast} from "@/utils/utils";
import parseLyrics, {getNearst} from "@/api/lyric";

let now_id = ref("")

let lyric = ref("")
let lyrics = ref([])

let nowLyrics = ref([])
let info = ref({})

let cover0 = ref("")

const ap = reactive(window.ap)

onMounted(() => {
  //调整界面到整个屏幕都是音乐组件
  document.getElementById("froom").scrollIntoView();

  let im0 = $('.avatar-img img')[0];
  let iee = $("#icon-img");
  //旋转关键
  let rting = 0;

  function animateBox() {
    if (im0 == null) {
      //是其保持方形
      im0 = $('.avatar-img img')[0];
      const $img = $(im0);
      const width = $img.width() || 0;
      $img.height(width);
    }
    iee.animate({
      rotate: '+=7deg'
    }, 800, "linear",);
  }

  let getLyricing = false

  function loadRes(et: number = 2000) {
    setTimeout(() => {
      const ad0 = ap.list.audios[ap.list.index];
      cover0.value = ad0.cover
      if (ad0.songId) now_id.value = ad0.songId
      else now_id.value = ad0.id
      info.value = ad0
      if (!ad0.lyric) {
        if (!getLyricing) {
          getLyricing = true
          service.get(`/api/music/get-lrc-by-id?id=${now_id.value}&type=${listType}`).then((r) => {
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
      if (rting % 8 == 0) {
        animateBox()
        nowLyrics.value = getNearst(ap.audio.currentTime * 1000, 6, lyrics.value)

        percentage.value = Number(((ap.audio.currentTime / ap.audio.duration) * 100).toFixed(2))
      }
    }
    if (now_id.value !== ap.list.audios[ap.list.index].id) {
      loadRes(0)
    }
  }, 101)

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

let percentage = ref(0)

function onPercentChange(p: number) {
  ap.seek(p / 100 * ap.audio.duration)
}

function getFormatToolTip(v: number) {
  return getTimeMs((v / 100 * ap.audio.duration).toFixed(0)) + '/' + getTimeMs(ap.audio.duration.toFixed(0))
}

const dialogVisible0 = ref(false)
const dialogVisibleRoom = ref(false)
const dialogVisibleList = ref(false)

const search = ref('')
//搜索中
const searchLoading = ref(false)
//是否是移除选项
const rmop = ref(true)
//私有歌单
let isPri = false

/**
 * 添加歌
 * @param index
 * @param row
 */
const handlePoi = (index: number, row) => {
  service.get(`/api/music/point?id=${row.id}&name=${row.name}&arts=${row.artist}`).then((r) => {
    if (r.code == 200) {
      toast("添加成功!", "success")
      if (isPri) {
        ap.list.add(r.data)
      }
    } else {
      toast(r.msg)
    }
  }).catch(e => {
    console.log(e)
  });
}
/**
 * 移除歌
 * @param index
 * @param row
 */
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

//切换歌单
let toggleListLoading = ref(false)
let listType: String = "163"

const handleSuccess = (data: Array, type: String) => {
  data.filter((item) => {
    item.url = item.url + "&type=" + type;
  });
  ap.list.clear();
  ap.list.add(data);
  listType = type;
  isPri = type === "pri";
  toast("切换成功", "success");
};

const handleError = (error: String) => {
  toast(`切换失败: ${error}`, "error");
};

const handleFinally = () => {
  toggleListLoading.value = false;
  dialogVisibleList.value = false;
};

function toggleList(type: String = "pri", tips: Boolean = true) {
  if (lived.value && !livemd.value) return;
  if (lived.value && livemd) {
    if (type !== "pri") {
      toast("当前处于一起听状态，无法切换到非个人歌单")
      return
    }
  }
  if (listType == type) {
    toggleListLoading.value = false;
    dialogVisibleList.value = false;
    return;
  }
  toggleListLoading.value = true;

  if (type === "pri") {
    service.get("/api/music/list").then((r) => {
      if (r.code === 200) {
        handleSuccess(r.data, type);
      } else {
        handleError(r.msg);
      }
    }).catch(handleError).finally(handleFinally);
  } else {
    service.get(`/api/music/get-music-list?type=${type}`).then((response) => {
      handleSuccess(response, type);
    }).catch(handleError).finally(handleFinally);
  }
}


//处于一起听
let lived = ref(false)
//一起听的房主可操作
let livemd = ref(false)
let roomdata = ref({})

function createRoom() {
  toast("稍后更新,敬请期待;")
}

function exitRoom() {

}

let rooms = ref([])

function loadRooms() {
  service.get("/api/music/lives").then((r) => {
    if (r.code == 200) {
      rooms.value = r.data
    } else {
      toast(r.msg)
    }
  }).catch(e => {

  });
}

const joinRoom = () => {
  toast("嗯?你是怎么做到的?")
}
</script>

<template>
  <el-row class="min-h-screen bg-opacity-75 bg-zinc-500" id="froom">
    <div style="position: absolute; left: 2%;top: 3%;">

      <el-button v-if="!lived||livemd" type="info" plain @click="dialogVisible0 = true">
        点击搜索
      </el-button>
      <el-button v-if="!lived||livemd" type="primary" plain @click="dialogVisibleList = true">
        切换歌单
      </el-button>
      <el-button v-if="!lived" type="primary" plain @click="createRoom()">
        创建一起听
      </el-button>
      <el-button v-if="!lived" type="success" plain @click="loadRooms();dialogVisibleRoom = true">
        加入一起听
      </el-button>
      <el-button v-if="lived" type="danger" plain @click="exitRoom()">
        退出一起听
      </el-button>
    </div>

    <div class="container row min-h-screen ">
      <div class="row align-self-start text-center">
        <div class="col-lg-4 col-md-12" @click="ap.toggle();" style="margin-top: 100px;">
          <el-avatar class="avatar-img" style="width: 85%;height: auto" id="icon-img" :src="cover0"/>
        </div>
        <div class="col-lg-7 col-md-12" style="margin-top: 4%;">
          <div class="row">
            <h3>{{ info.name }}</h3>
            <h5 style="color: rgba(172,174,175,0.95);margin-left: 80px;margin-top: 10px">---{{ info.artist }}</h5>
          </div>
          <div class="row" style="margin-top: 20px;">
            <div style="background-color: rgba(255,255,255,0.02);color: rgba(213,222,244,0.9);" class="items-center"
                 role="alert" v-for="(e,i) in nowLyrics">
              <el-tooltip
                  class="box-item"
                  effect="dark"
                  :content="getTimeMs((e.timestamp/1000).toFixed(0))"
                  placement="left-start">
                <h4 :class="'l-'+i" v-on:click="ap.seek(e.timestamp/1000);"> {{ e.content }}</h4>
              </el-tooltip>
            </div>
          </div>
        </div>
      </div>

      <div class="row align-self-end mb-5 mt-4">
        <div v-if="lived" style="width: 100%;color: black" class="mb-4 col-12 ml-5 text-center">
          {{ roomdata.name }}
        </div>
        <div v-if="lived" style="width: 100%" class="mb-4 col-12 ml-5 text-center">
          <span v-for="e in roomdata.icons">
            <el-avatar style="width:auto;height: 40px" id="icon-img" :src="e"/>
          </span>
        </div>
        <div style="width: 100%" class="mb-4 col-12 ml-5 text-center">
          <el-button @click="ap.skipBack();" type="info" round plain>上一曲</el-button>
          <el-button @click="ap.toggle();" type="info" round plain>播放/暂停</el-button>
          <el-button @click="ap.skipForward();" type="info" round plain>下一曲</el-button>
        </div>
        <div class="slider-demo-block col-12 ml-5 text-center">
          <span class="demonstration">{{
              getTimeMs(ap.audio.currentTime.toFixed(0)) + '/' + getTimeMs(ap.audio.duration.toFixed(0))
            }}</span>
          <div style="width: 80%;margin-left: 10%" class="text-center">
            <el-slider @change="onPercentChange" :format-tooltip="getFormatToolTip" v-model="percentage"/>
          </div>
        </div>
      </div>
    </div>

    <el-dialog v-model="dialogVisible0" title="搜音乐" width="500" draggable align-center>
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
            <el-button v-if="!rmop" size="small" type="primary" @click="handlePoi(scope.$index, scope.row)">＋
            </el-button>
            <el-button v-if="rmop" size="small" type="danger" @click="handleRmp(scope.$index, scope.row)">－</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog v-model="dialogVisibleRoom" title="一起听(加入者操作不会同步到房主)" width="500" draggable align-center>
      <el-table :data="rooms" style="width: 100%;height: 400px">
        <el-table-column label="房名" prop="name"/>
        <el-table-column label="在线人数" prop="count"/>
        <el-table-column align="right">
          <template #header>
            <div>操作</div>
          </template>
          <template #default="scope">
            <el-button size="small" type="primary" @click="joinRoom()">加入</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog :body-class="'text-center'" v-model="dialogVisibleList" title="切换平台热歌榜" width="500" draggable
               align-center>
      <el-row justify="center" class="mb-1">
        <el-button :loading="toggleListLoading" type="danger" @click="toggleList('163')">网易云音乐热歌榜</el-button>
      </el-row>
      <el-row justify="center" class="mb-1">
        <el-button :loading="toggleListLoading" type="success" @click="toggleList('qq')">QQ音乐热歌榜</el-button>
      </el-row>
      <el-row justify="center" class="mb-1">
        <el-button :loading="toggleListLoading" type="primary" @click="toggleList('kg')">酷狗音乐热歌榜</el-button>
      </el-row>
      <el-row justify="center" class="mb-1">
        <el-button :loading="toggleListLoading" type="info" @click="toggleList()">个人歌单</el-button>
      </el-row>
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
</style>
