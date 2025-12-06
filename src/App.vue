<style>
/* 基础样式 */
body {
  margin: 0;
  min-height: 100vh;
  background-color: #333; /* 添加默认背景色防止加载延迟闪现 */
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
}

/* 大屏幕（桌面端） */
@media (min-width: 769px) {
  body {
    background-image: url("https://img.cdn1.vip/i/6933cb9943b14_1765002137.webp");
    background-size: cover; /* 保持比例填满屏幕 */
  }
}

/* 小屏幕（移动端） */
@media (max-width: 768px) {
  body {
    background-image: url("https://img.cdn1.vip/i/6933cbdc32eb9_1765002204.webp") ;
    background-size: cover; /* 保持比例适应屏幕 铺满屏幕 */
    background-position: top center; /* 根据图片内容调整对齐方式 */
  }
}

/* 加载动画样式 - 更复杂的双环脉冲效果 */
.loading-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(5px);
}

.loading-spinner {
  position: relative;
  width: 120px;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-spinner::before,
.loading-spinner::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

.loading-spinner::before {
  width: 100%;
  height: 100%;
  border: 4px solid transparent;
  border-top-color: #ff4dc3;
  border-right-color: #ff4dc3;
  animation: spin 2s linear infinite;
}

.loading-spinner::after {
  width: 80px;
  height: 80px;
  border: 4px solid transparent;
  border-bottom-color: #00bf3c;
  border-left-color: #00bf3c;
  animation: spin 1.5s linear infinite reverse;
}

.loading-text {
  position: absolute;
  font-size: 16px;
  color: #fff;
  font-weight: bold;
  animation: text-fade 2s ease-in-out infinite;
  text-shadow: 0 0 10px rgba(255, 77, 195, 0.8);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.05);
  }
}

@keyframes text-fade {
  0%, 100% {
    opacity: 0.7;
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}

/* 导航栏样式优化 */
#main-nav {
  transition: all 0.5s ease !important;
  border: 3px solid transparent;
  background-color: rgba(183, 229, 223, 0.2);
  border-radius: 7px;
  animation: nav-unhover .3s linear forwards;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

#main-nav:hover {
  animation: nav-hover .3s linear forwards;
  background-color: rgba(255, 255, 255, .9);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
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

/* 导航项按钮样式 - 增强版 */
.nav-button {
  position: relative;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  padding: 10px 20px;
  margin: 0 6px;
  border-radius: 25px;
  color: #333;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.3));
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.nav-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 77, 195, 0.4), transparent);
  transition: all 0.6s ease;
}

.nav-button:hover::before {
  left: 100%;
}

.nav-button:hover {
  color: #ff4dc3;
  font-weight: bold;
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 25px rgba(255, 77, 195, 0.3);
  border-color: rgba(255, 77, 195, 0.5);
}

.nav-button:active {
  transform: translateY(-1px) scale(0.98);
}

/* 音乐厅特殊样式 - 增强版 */
.music-room {
  border: 2px dashed #00bf3c !important;
  background: linear-gradient(135deg, rgba(0, 191, 60, 0.1), rgba(0, 191, 60, 0.2)) !important;
  position: relative;
}

.music-room::after {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border: 2px dashed transparent;
  border-radius: 27px;
  background: linear-gradient(60deg, #00bf3c, #00e047, #00bf3c) border-box;
  mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  -webkit-mask-composite: xor;
  animation: border-rotate 4s linear infinite;
  pointer-events: none;
}

@keyframes border-rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.music-room:hover {
  background: linear-gradient(135deg, rgba(0, 191, 60, 0.2), rgba(0, 191, 60, 0.3)) !important;
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 25px rgba(0, 191, 60, 0.3);
}

/* 赞助按钮特殊样式 - 增强版 */
.sponsor-button {
  color: #ff8d3c !important;
  font-weight: bold;
  background: linear-gradient(135deg, rgba(255, 141, 60, 0.1), rgba(255, 141, 60, 0.2)) !important;
  border: 1px solid rgba(255, 141, 60, 0.3) !important;
}

.sponsor-button:hover {
  background: linear-gradient(135deg, rgba(255, 141, 60, 0.2), rgba(255, 141, 60, 0.3)) !important;
  color: #ff6a00 !important;
  box-shadow: 0 8px 25px rgba(255, 141, 60, 0.3);
  border-color: rgba(255, 141, 60, 0.5) !important;
}

/* 下拉菜单样式优化 */
.dropdown-menu {
  background: rgba(255, 255, 255, 0.95) !important;
  border: 1px solid rgba(255, 77, 195, 0.2) !important;
  border-radius: 15px !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15) !important;
  animation: dropdown-fade 0.3s ease-out;
  backdrop-filter: blur(10px);
}

@keyframes dropdown-fade {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-item {
  transition: all 0.3s ease;
  border-radius: 10px !important;
  margin: 4px;
}

.dropdown-item:hover {
  background-color: rgba(255, 77, 195, 0.1) !important;
  transform: translateX(5px);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .nav-button {
    padding: 8px 16px;
    margin: 4px 0;
    width: 100%;
    text-align: center;
  }
  
  /* 确保品牌名称在移动端正确居中 */
  .navbar-brand {
    margin: 0 auto !important;
    position: relative;
    left: 0 !important;
    transform: none !important;
    justify-content: center !important;
  }
  
  /* 修复移动端导航栏布局 */
  #main-nav {
    position: relative;
  }
  
  /* 调整移动端菜单按钮位置 */
  .navbar-toggler {
    position: absolute;
    top: 50%;
    right: 15px;
    transform: translateY(-50%);
    z-index: 1000;
    margin: 0;
  }
  
  /* 确保容器正常工作 */
  .container-fluid {
    padding-right: 70px !important;
    padding-left: 15px !important;
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
    <!-- 加载动画组件 - 增强版 -->
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner">
        <span class="loading-text">加载中...</span>
      </div>
    </div>
    
    <nav id="main-nav" class="z-999 navbar navbar-expand-lg navbar-light">
      <div class="container-fluid d-flex justify-content-between align-items-center w-100 px-3">
        <RouterLink class="navbar-brand nav-button flex-shrink-0"
                    style="display: flex; align-items: center; justify-content: center; color: #ff4dc3; text-decoration: none;"
                    to="/">
          <img class="d-inline-block align-text-top me-2"
               src="/favicon.ico"
               alt="kloping`s blog"
               style="opacity: 0.86; border-radius: 999px; max-width: 40px;">
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
            <RouterLink to="/apis" class="nav-link nav-button" aria-current="page">公共API</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/room" class="nav-link nav-button music-room" aria-current="page">音乐厅
            </RouterLink>
          </li>
          <li class="nav-item dropdown">
            <div id="navbarDropdown" class="nav-link nav-button dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown"
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
                front-vue3 update 25/12.06
              </p>
              <p class="dropdown-item" style="font-size: small">
                主体界面优化,壁纸更新
              </p>
            </div>
          </li>
          <li class="nav-item">
            <RouterLink to="/sponsors" class="nav-link nav-button sponsor-button" aria-current="page"><b>赞助</b>
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/ai" class="nav-link nav-button" aria-current="page">AI对话</RouterLink>
          </li>
        </ul>
        <div v-show="login_state" class="d-flex flex-column"> {{ userInfo.nickname }}</div>
        <img v-show="login_state" class="mr-2" style="opacity: 0.86;max-height: 50px; border-radius: 999px"
             :src="userInfo.icon" alt="icon">
        <div class="form-inline mr-sm-2 my-2">
          <button v-show="login_state" class="mr-2 btn btn-outline-danger font-weight-light nav-button" @click="logout">点击登出
          </button>
          <button class="mr-2 btn btn-outline-warning nav-button" type="button" @click="ttplayer">显/隐歌单</button>
          <RouterLink to="/v0" class="mr-2 btn btn-outline-success nav-button" type="button">个人中心</RouterLink>
          <RouterLink to="/upload" class="mr-2 btn btn-outline-success nav-button" type="button">发帖</RouterLink>
        </div>
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

import {RouterLink, RouterView, useRouter} from 'vue-router'
import $ from 'jquery';
import {onMounted, ref} from "vue";
import {loadUser, login_state, service, userInfo, userLogout} from "@/axios";
import {toast} from "@/utils/utils";
import APlayer from 'aplayer/dist/APlayer.min';

let arr = ref([{color: "blue", url: "localhost", icon: "/icon.jpg", name: "slef"}])

let host0 = ref("")

let isDataLoaded = ref(false)

// 加载状态
let isLoading = ref(true)

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
  // 获取路由实例
  const router = useRouter();
  
  // 监听路由切换，显示加载动画
  router.beforeEach((to, from, next) => {
    isLoading.value = true;
    next();
  });
  
  // 监听路由切换完成，隐藏加载动画
  router.afterEach(() => {
    // 延迟隐藏以确保动画可见
    isLoading.value = false;
  });
  
  ap = new APlayer({
    container: document.getElementById('player'),
    autoplay: false,
    listMaxHeight: 60,
    audio: [],
    preload: "none"
  });
  
  try {
    await loadUser();
    
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
  } catch (error) {
    toast("加载用户信息失败" + error);
  } finally {
    window.ap = ap;
    isDataLoaded.value = true;
    // 首次加载完成后隐藏加载动画
    setTimeout(() => {
      isLoading.value = false;
    }, 800);
  }
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