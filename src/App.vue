<style>

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

@media (max-width: 1080px) {
  body {
    background-image: url("/api/image/rand0?p=1");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-attachment: fixed;
  }
}


@media (min-width: 1080px) {
  body {
    width: 100%;
    height: 100%;
    background: url("/api/image/rand0?p=0") no-repeat center center fixed;
    background-size: 100%;
    -webkit-background-size: cover;
    -o-background-size: cover;
  }
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

</style>

<template>
  <div class="app">
    <nav id="main-nav" class="navbar navbar-expand-lg navbar-light">
      <RouterLink class="navbar-brand navbar"
                  style="align-items: center;display: flex;color: #b845e7;text-decoration: none;" to="/index">
        <img class="d-inline-block align-text-top" src="/favicon.ico"
             alt="kloping`s blog"
             style="opacity: 0.86; border-radius: 999px;max-width: 50px;margin-right: 15px;margin-left: 20px">
        kloping`s blog
      </RouterLink>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarToggleExternalContent" aria-controls="navbarToggleExternalContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarToggleExternalContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <RouterLink to="/index" active-class="active" class="nav-link" aria-current="page">首页</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/api" class="nav-link" aria-current="page">API</RouterLink>
          </li>
          <li class="nav-item dropdown">
            <div class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
                 aria-expanded="false">
              关于
            </div>
            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
              <a class="dropdown-item" target="_blank"
                 href="//wpa.qq.com/msgrd?v=3&amp;uin=3474006766&amp;site=qq&amp;menu=yes">
                <img style="opacity: 0.86;max-width: 35px" alt="qq" loading="lazy"
                     src="https://s.nmxc.ltd/sakurairo_vision/@2.6/display_icon/sora/qq.png">
                QQ
              </a>
              <a class="dropdown-item" target="_blank"
                 href="http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=Bk2IrDI969mNd-R5G30Ridw9yeou0Mqd&authKey=TCtcOWnwzFw3NfZn%2F9XAXtRmPquOdFbRQmAAFFnf18WXusQBWqt8TFyoJpVVktj2&noverify=0&group_code=278681553">
                <img style="opacity: 0.86;max-width: 35px" alt="qq" loading="lazy"
                     src="https://s.nmxc.ltd/sakurairo_vision/@2.6/display_icon/sora/qq.png">
                QQ GROUP
              </a>
              <a class="dropdown-item" target="_blank" href="https://github.com/kloping">
                <img style="opacity: 0.86;max-width: 35px" alt="github" loading="lazy"
                     src="https://s.nmxc.ltd/sakurairo_vision/@2.6/display_icon/sora/github.png">
                github
              </a>
              <a class="dropdown-item" target="_blank" href="https://github.com/gdpl2112">
                <img style="opacity: 0.86;max-width: 35px" alt="github" loading="lazy"
                     src="https://s.nmxc.ltd/sakurairo_vision/@2.6/display_icon/sora/github.png">
                github organization
              </a>
            </div>
          </li>
          <li class="nav-item mr-sm-2" style="margin-right: 8px">
            <a @click="jumpToflink" class="nav-link">友链</a>
          </li>
        </ul>

        <div class="form-inline mr-sm-2 my-2">
          <RouterLink to="/v0" class=" mr-2 btn btn-outline-success" type="button">个人中心</RouterLink>
          <RouterLink to="/upload" class=" mr-2 btn btn-outline-success" type="button">发布帖子</RouterLink>
        </div>
      </div>
    </nav>

    <div class="container">
      <RouterView></RouterView>
    </div>

    <footer>
      <div style="margin-right: 10px;margin-left: 10px; margin-top: 35px;background-color: rgba(0,6,33,0.4)"
           role="alert" class="opacity-95 alert alert-dark">
        <center style="opacity: 100%;color: white">
          欢迎您的访问 <br>
          {{ host0 }} 版权所有 Power by <br>
          <a style="color: #93c3da" href="//wpa.qq.com/msgrd?v=3&amp;uin=3474006766&amp;site=qq&amp;menu=yes"
             class="alert-link">若生</a>
          <a style="color: #93c3da" href="//github.com/kloping" class="alert-link">kloping</a>
        </center>
        <br>
        <center>
          <h5 style='color: white' data-toggle="tooltip" data-placement="top" title="添加友链,请联系作者">
            友情链接
          </h5>
          <div id="f-link-d0" class="container justify-content-center">
            <div class="row justify-content-center">
              <a v-for="e in arr" :style="'color:'+e.color" :href="e.url" class="alert-link col-3">
                <img class="yl-img" :src="e.icon" alt=""/>
                {{ e.name }}
              </a>
            </div>
          </div>
        </center>
      </div>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import {RouterLink, RouterView} from 'vue-router'
import $ from 'jquery';
import {ref} from "vue";
import service from "@/axios";

let arr = ref([{color: "blue", url: "localhost", icon: "/icon.jpg", name: "slef"}])
let host0 = ref("")
service.get("/ba/get-host?url=" + document.location).then(res => {
  host0.value = res.toString()
}).catch(err => {
  alert(err)
})

service.get("/ba/flinks").then(res => {
  arr.value = res
}).catch(err => {
  alert(err)
});

function jumpToflink() {
  $("html, body").animate({
    scrollTop: $("#f-link-d0").offset().top
  }, {duration: 100, easing: "swing"});
  return false;
}
</script>
