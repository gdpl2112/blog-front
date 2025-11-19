<style>
body {
  margin: 0;
  background: #333 url("https://file.kloping.top/a5a2bde2-d277-479e-8a21-6ed1c81e6f18.jpg") no-repeat fixed center/cover;
  min-height: 100vh;
}

@media (max-width: 768px) {
  body {
    background-image: url("https://pvzh.giantapp.cn/upload/c06323ff2c0e43fa95e69cb90d9126d7/wallpapers/6892243892d000f81702a4bf/1754407979407_vtH0M.jpg");
    background-size: 100% auto;
  }
}

#main-nav {
  transition: all 1s ease !important;
  border: 3px solid transparent;
  background-color: rgba(183, 229, 223, 0.2);
  border-radius: 7px;
  animation: nav-unhover .3s linear forwards;
}

#main-nav:hover {
  animation: nav-hover .3s linear forwards;
  background-color: rgba(255, 255, 255, .9)
}

@keyframes nav-unhover {
  0% {
    transform: scale(1);
  }

  100% {
    transform: scale(0.98);
  }
}

@keyframes nav-hover {
  0% {
    transform: scale(0.98);
  }

  100% {
    transform: scale(1.00);
  }
}

audio {
  display: none;
}

.yl-img {
  max-width: 25px;
  transition: all 0.8s ease !important;
  border-radius: 999px;
  rotate: 0turn;
}

.yl-img:hover {
  rotate: 1turn;
  max-width: 30px;
}

#bgVideo {
  position: fixed;
  top: 0;
  left: 0;
  min-width: 100%;
  min-height: 100%;
  z-index: -1;
  object-fit: cover;
}

.about-avatar {
  display: inline-block;
  opacity: 0.86;
  max-width: 35px;
  border-radius: 25px;
}

</style>

<template>
  <div class="app">
    <nav id="main-nav" class="z-999 navbar navbar-expand-lg navbar-light">
      <RouterLink class="navbar-brand navbar"
                  style="align-items: center;display: flex;color: #ff4dc3;text-decoration: none;" to="/">
        <img class="d-inline-block align-text-top" src="/favicon.ico"
             alt="kloping`s blog"
             style="opacity: 0.86; border-radius: 999px;max-width: 50px;margin-right: 15px;margin-left: 20px">
        kloping`s blog
      </RouterLink>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
              data-bs-target="#navbarToggleExternalContent" aria-controls="navbarToggleExternalContent"
              aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarToggleExternalContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <RouterLink to="/apis" class="nav-link" aria-current="page">公共API</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/room" class="nav-link" aria-current="page"
                        style="border-radius: 12px;border-width: 2px;border-style: dashed; border-color: #00bf3c;">音乐厅
            </RouterLink>
          </li>
          <li class="nav-item dropdown">
            <div id="navbarDropdown" class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                 data-toggle="dropdown"
                 aria-expanded="false">
              ABOUT
            </div>
            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
              <hr>
              <a class="dropdown-item" target="_blank"
                 href="//wpa.qq.com/msgrd?v=3&amp;uin=3474006766&amp;site=qq&amp;menu=yes">
                <img class="about-avatar" alt="qq" loading="lazy"
                     src="http://q.qlogo.cn/g?b=qq&nk=3474006766&s=640">
                QQ (owner)
              </a>
              <a class="dropdown-item" target="_blank"
                 href="https://qun.qq.com/universal-share/share?ac=1&authKey=vdy2VbaBqujykAveW9LSf1NkHJnEdluyADdeASabqXmW0UMRl7U9DoG38VkxywDx&busi_data=eyJncm91cENvZGUiOiIyNzg2ODE1NTMiLCJ0b2tlbiI6IjAraFJPM2c3SS84cGVmMzFoY3dOL1lsekN4bUtWMi9sNGNtZVo5UEZQdk1HTVZYaVNCZDlNZzdhbWxFZmlKTHIiLCJ1aW4iOiIzNDc0MDA2NzY2In0%3D&data=tytVVzt4Xk59uWCGdQ76HnXvp9pVmUYYu-0hwrupw2FX1nUuBtl8cEGYHMMBeEkG9ui_sK4mYWin_8dpNHhkLg&svctype=4&tempid=h5_group_info">
                <img class="about-avatar" loading="lazy" src="http://p.qlogo.cn/gh/278681553/278681553/640">
                QQ GROUP (闲聊)
              </a>
              <a class="dropdown-item" target="_blank"
                 href="https://qun.qq.com/universal-share/share?ac=1&authKey=48SHxrAnIPg%2FSB9tcp3yAVFNY0%2BLD9Un4jrDckReN%2F9q2MmxF0PYmsXjd7fVcN%2Fh&busi_data=eyJncm91cENvZGUiOiI3OTQyMzg1NzIiLCJ0b2tlbiI6IklOTlhMNE00b1hsVWxIS1F5cWsyQy93RFVIaXRTRG50SitPbWZTSTJxWTMrM2JkaXVTZXROblVhRDhQMy91RmQiLCJ1aW4iOiIzNDc0MDA2NzY2In0%3D&data=O39jKGFDN6F7w0E9OVEcAm6UWBQN9S1kVqiWPAArsh_-m3E7eYYGOP1Ysz7NOzmF8a1mhrKqXgAo2XggFtUWfg&svctype=4&tempid=h5_group_info">
                <img class="about-avatar" alt="qq" loading="lazy"
                     src="http://p.qlogo.cn/gh/794238572/794238572/640">
                QQ GROUP (技术)
              </a>
              <a class="dropdown-item" target="_blank" href="https://github.com/kloping">
                <img class="about-avatar" alt="github" loading="lazy"
                     src="https://avatars.githubusercontent.com/u/87743020?v=4">
                github
              </a>
              <a class="dropdown-item" target="_blank" href="https://github.com/gdpl2112">
                <img class="about-avatar" alt="github" loading="lazy"
                     src="https://avatars.githubusercontent.com/u/96173877?s=200&v=4">
                github organization
              </a>
              <hr>
              <p class="dropdown-item" style="font-size: small">
                front-vue3 update 25/11.19
              </p>
              <p class="dropdown-item" style="font-size: small">
                新增.博客内AI助手.关于列表更新.
              </p>
              <p class="dropdown-item" style="font-size: small">
                新增修改.AI界面优化
              </p>
            </div>
          </li>
          <li class="nav-item">
            <RouterLink style="color: #ff8d3c;" to="/sponsors" class="nav-link" aria-current="page"><b>赞助</b>
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/ai" class="nav-link" aria-current="page">AI对话</RouterLink>
          </li>
        </ul>
        <div v-show="login_state" class="d-flex flex-column"> {{ userInfo.nickname }}</div>
        <img v-show="login_state" class="mr-2" style="opacity: 0.86;max-height: 50px; border-radius: 999px"
             :src="userInfo.icon" alt="icon">
        <div class="form-inline mr-sm-2 my-2">
          <button v-show="login_state" class="mr-2 btn btn-outline-danger font-weight-light" @click="logout">点击登出
          </button>
          <button class="mr-2 btn btn-outline-warning" type="button" @click="ttplayer">显/隐歌单</button>
          <RouterLink to="/v0" class="mr-2 btn btn-outline-success" type="button">个人中心</RouterLink>
          <RouterLink to="/upload" class="mr-2 btn btn-outline-success" type="button">发帖</RouterLink>
        </div>
      </div>
    </nav>

    <div class="container" style="margin-top: 10px">
      <RouterView v-if="isDataLoaded" :apl="ap"></RouterView>
    </div>

    <footer>
      <div style="margin-right: 10px;margin-left: 10px; margin-top: 35px;background-color: rgba(0,6,33,0.4)"
           role="alert" class="opacity-95 alert alert-dark">
        <center style="opacity: 100%;color: white">
          欢迎您的访问 <br>
          <a style="color: #dcf3f2" :href="'//'+host0"> {{ host0 }} </a>
          版权所有 Power by <br>
          <a style="color: #09a0ff" href="//wpa.qq.com/msgrd?v=3&amp;uin=3474006766&amp;site=qq&amp;menu=yes"
             class="alert-link">若生</a>&nbsp;
          <a style="color: rgba(195,195,195,0.99)" href="//github.com/kloping" class="alert-link">kloping</a>
          <br>
          <!--公安备案信息-->
          <a target="_blank" style="color: #f81144;font-size: small" href="https://beian.miit.gov.cn/"
             class="alert-link">皖ICP备2025088299号-1</a>
        </center>
        <br>
        <center>
          <h5 style='color: white' data-toggle="tooltip" data-placement="top" title="添加友链,请联系作者">
            友情链接
          </h5>
          <div id="f-link-d0" class="container justify-content-center">
            <div class="row justify-content-center">
              <a v-for="e in arr"
                 :style="'color:'+e.color" :href="e.url" target="_blank" class="alert-link col-3">
                <img class="yl-img" :src="e.icon" alt=""/>
                {{ e.name }}
              </a>
            </div>
          </div>
        </center>
      </div>
    </footer>

    <div id="player"></div>
  </div>
</template>

<script lang="ts" setup>

import {RouterLink, RouterView} from 'vue-router'
import $ from 'jquery';
import {onMounted, ref} from "vue";
import {loadUser, login_state, service, userInfo, userLogout} from "@/axios";
import {toast} from "@/utils/utils";
import APlayer from 'aplayer/dist/APlayer.min';

let arr = ref([{color: "blue", url: "localhost", icon: "/icon.jpg", name: "slef"}])

let host0 = ref("")

let isDataLoaded = ref(false)

service.get("/get-host?url=" + document.location).then(res => {
  host0.value = res.toString()
}).catch(err => {
  console.log(err)
})

service.get("/user/flinks").then(res => {
  arr.value = res
}).catch(err => {
  toast("获取友链失败" + err)
});

let ap: APlayer;
//挂载完成加载player.
onMounted(async () => {
  ap = new APlayer({
    container: document.getElementById('player'),
    autoplay: false,
    listMaxHeight: 60,
    audio: [],
    preload: "none"
  });
  await loadUser()

  function loadDefaultList() {
    service.get("/api/music/get-music-list").then(function (response) {
      ap.list.add(response)
      ap.list.show()
      setTimeout(function () {
        ap.list.hide()
      }, 1500)
    }).catch(function (err) {
      toast("获取音乐失败" + err)
    });
  }

  if (login_state.value) {
    service.get("/api/music/list").then(function (response) {
      let data = response.data
      if (data.length > 0) {
        ap.list.add(data);
      } else {
        loadDefaultList();
      }
    })
  } else {
    loadDefaultList();
  }

  window.ap = ap
  isDataLoaded.value = true
})

function ttplayer() {
  $("#player").toggle()
}

function logout() {
  userLogout()
}

</script>
<style>

@media (max-width: 1080px) {
  #player {
    width: 250px;
  }
}


@media (min-width: 1080px) {
  #player {
    width: 350px;
  }
}

#player {
  border: 5px solid transparent;
  background-color: rgba(128, 112, 131, 0.34);
  border-radius: 7px;
  animation: normalp .3s linear forwards;
  position: fixed;
  top: 12%;
  right: 1%;
  max-height: 600px;
  overflow-y: scroll;
  z-index: 1031;
}

#player:hover {
  animation: hoverp .3s linear forwards;
  background-color: rgba(255, 255, 255, .9)
}

@keyframes normalp {
  0% {
    transform: scale(1);
    right: 1%;
  }

  100% {
    transform: scale(0.98);
    right: -180px;
  }
}

@keyframes hoverp {
  0% {
    transform: scale(0.98);
    right: -12%;
  }

  100% {
    transform: scale(1.00);
    right: 1%;
  }
}

.app {
  position: relative;
  z-index: 1; /* 确保应用容器在视频之上 */
}
</style>