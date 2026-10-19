<style>
/* =============================================
   站点外壳：通栏顶栏 / 册页正文 / 墨色版权页
   ============================================= */

.app-shell {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* ---------------- 加载：一枚朱印 ---------------- */

.loading-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 18px;
  background: rgba(247, 248, 251, 0.62);
  backdrop-filter: blur(22px) saturate(150%);
  -webkit-backdrop-filter: blur(22px) saturate(150%);
}

[data-theme="dark"] .loading-overlay {
  background: rgba(13, 15, 20, 0.66);
}

.loading-overlay .seal {
  animation: seal-breathe 1.4s var(--ease) infinite;
}

.loading-overlay span {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.22em;
  color: var(--ink-3);
}

@keyframes seal-breathe {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.45; transform: scale(0.96); }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 200ms var(--ease);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ---------------- 顶栏 ---------------- */

.site-header {
  position: sticky;
  top: 0;
  z-index: 900;
  background: rgba(255, 255, 255, 0.5);
  border-bottom: 1px solid rgba(255, 255, 255, 0.55);
  box-shadow: 0 12px 30px -26px rgba(30, 38, 54, 0.5);
  backdrop-filter: blur(22px) saturate(180%);
  -webkit-backdrop-filter: blur(22px) saturate(180%);
}

[data-theme="dark"] .site-header {
  background: rgba(19, 22, 28, 0.55);
  border-bottom-color: rgba(255, 255, 255, 0.07);
  box-shadow: 0 12px 30px -22px rgba(0, 0, 0, 0.7);
}

.nav-inner {
  display: flex;
  align-items: center;
  gap: var(--gap-6);
  height: var(--nav-h);
}

/* 品牌：宋体字名 + 等宽域名 */
.nav-brand {
  display: inline-flex;
  align-items: baseline;
  gap: 9px;
  text-decoration: none;
  color: var(--ink);
  flex-shrink: 0;
}

.nav-brand:hover {
  color: var(--ink);
  text-decoration: none;
}

.nav-brand-name {
  font-family: var(--font-display);
  font-size: 21px;
  font-weight: 600;
  letter-spacing: 0.08em;
  line-height: 1;
}

.nav-brand-mark {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.14em;
  color: var(--ink-3);
  padding-left: 9px;
  border-left: 1px solid var(--rule);
  line-height: 1;
}

/* 主导航：小字，靠字距与下划朱线区分当前页 */
.nav-links {
  display: flex;
  align-items: center;
  gap: var(--gap-1);
  list-style: none;
  margin: 0 0 0 auto;
  padding: 0;
}

.nav-link-item {
  position: relative;
}

.nav-link-item > a,
.nav-dropdown-trigger {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: var(--nav-h);
  padding: 0 13px;
  font-size: var(--text-sm);
  font-weight: 400;
  letter-spacing: 0.04em;
  color: var(--ink-2);
  text-decoration: none;
  background: none;
  border: 0;
  cursor: pointer;
  transition: color var(--dur) var(--ease);
}

.nav-link-item > a:hover,
.nav-dropdown-trigger:hover {
  color: var(--ink);
  text-decoration: none;
}

/* 当前页：底部一道 2px 朱线 */
.nav-link-item > a.router-link-active,
.nav-link-item > a.router-link-exact-active {
  color: var(--ink);
}

.nav-link-item > a.router-link-active::after,
.nav-link-item > a.router-link-exact-active::after {
  content: '';
  position: absolute;
  left: 13px;
  right: 13px;
  bottom: -1px;
  height: 2px;
  background: var(--seal);
}

.nav-link-highlight {
  color: var(--seal) !important;
}

.nav-dropdown-trigger .chevron {
  font-size: 8px;
  color: var(--ink-3);
  transition: transform var(--dur) var(--ease);
}

.nav-dropdown-trigger.open .chevron {
  transform: rotate(180deg);
}

/* 关于下拉：玻璃菜单 */
.nav-dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 244px;
  padding: 6px;
  background: var(--glass-strong);
  border: 1px solid var(--glass-line);
  border-radius: var(--r-md);
  box-shadow: var(--glass-shadow), var(--glass-inner);
  backdrop-filter: blur(30px) saturate(180%);
  -webkit-backdrop-filter: blur(30px) saturate(180%);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-6px) scale(0.985);
  transition: opacity var(--dur) var(--ease), transform var(--dur) var(--ease), visibility var(--dur);
  z-index: 20;
  transform-origin: top right;
}

[data-theme="dark"] .nav-dropdown-menu {
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.55);
}

.nav-dropdown-menu.show {
  opacity: 1;
  visibility: visible;
  transform: none;
}

.nav-dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 10px;
  font-size: var(--text-sm);
  color: var(--ink-2);
  text-decoration: none;
  border-radius: 8px;
  border-bottom: 1px solid var(--rule);
}

.nav-dropdown-item:last-of-type {
  border-bottom: 0;
}

.nav-dropdown-item:hover {
  background: var(--paper-2);
  color: var(--ink);
  text-decoration: none;
}

.nav-dropdown-item img {
  width: 22px;
  height: 22px;
  object-fit: cover;
  border-radius: 2px;
  filter: grayscale(1);
  opacity: 0.8;
  transition: filter var(--dur) var(--ease);
}

.nav-dropdown-item:hover img {
  filter: none;
  opacity: 1;
}

.nav-dropdown-version {
  padding: 9px 10px 3px;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.06em;
  color: var(--ink-3);
  border-top: 1px solid var(--rule);
  margin-top: 4px;
}

/* 右侧动作 */
.nav-actions {
  display: flex;
  align-items: center;
  gap: var(--gap-2);
  flex-shrink: 0;
}

.nav-icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 1px solid transparent;
  border-radius: 9px;
  background: transparent;
  color: var(--ink-3);
  font-size: 14px;
  cursor: pointer;
  transition: color var(--dur) var(--ease), border-color var(--dur) var(--ease);
}

.nav-icon-btn:hover {
  color: var(--ink);
  border-color: var(--rule-2);
}

.nav-divider {
  width: 1px;
  height: 18px;
  background: var(--rule);
  margin: 0 6px;
}

/* 用户区块：方角头像 */
.nav-user-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 3px 10px 3px 3px;
  border: 1px solid transparent;
  border-radius: 10px;
  cursor: pointer;
  transition: border-color var(--dur) var(--ease), background var(--dur) var(--ease);
}

.nav-user-badge:hover {
  border-color: var(--rule-2);
  background: var(--paper-2);
}

.nav-avatar {
  width: 26px;
  height: 26px;
  border-radius: 8px;
  object-fit: cover;
}

.nav-username {
  font-size: 12px;
  font-weight: 500;
  color: var(--ink);
  max-width: 92px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.nav-cta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 14px;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.04em;
  border-radius: 9px;
  background: var(--ink);
  color: var(--on-ink);
  border: 1px solid var(--ink);
  text-decoration: none;
  transition: background var(--dur) var(--ease), border-color var(--dur) var(--ease), color var(--dur) var(--ease);
}

.nav-cta:hover {
  background: var(--seal);
  border-color: var(--seal);
  color: #fff;
  text-decoration: none;
}

.nav-login-btn {
  display: inline-flex;
  align-items: center;
  height: 32px;
  padding: 0 14px;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.04em;
  border-radius: 9px;
  border: 1px solid var(--glass-line-2);
  color: var(--ink);
  background: transparent;
  text-decoration: none;
  transition: border-color var(--dur) var(--ease), color var(--dur) var(--ease);
}

.nav-login-btn:hover {
  border-color: var(--seal);
  color: var(--seal);
  text-decoration: none;
}

/* 移动端触发 */
.nav-toggle {
  display: none;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  margin-left: auto;
  border: 1px solid var(--glass-line-2);
  border-radius: 9px;
  background: transparent;
  color: var(--ink);
  font-size: 15px;
  cursor: pointer;
}

/* ---------------- 正文 ---------------- */

.main-content {
  flex: 1;
  width: 100%;
  max-width: var(--w-page);
  margin: 0 auto;
  padding: var(--gap-6) var(--pad-x) var(--gap-8);
}

.main-content-console {
  max-width: 1320px;
}

/* ---------------- 版权页 ---------------- */

.site-footer {
  width: min(calc(100% - var(--pad-x) * 2), var(--w-page));
  margin: var(--gap-8) auto var(--gap-5);
  padding: var(--gap-7) 0 var(--gap-5);
  border-radius: var(--r-lg);
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(18, 21, 27, 0.72);
  color: var(--block-ink-2);
  box-shadow: 0 44px 90px -50px rgba(12, 16, 24, 0.75), inset 0 1px 0 rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(26px) saturate(150%);
  -webkit-backdrop-filter: blur(26px) saturate(150%);
  overflow: hidden;
}

.footer-inner {
  margin: 0 auto;
  padding: 0 clamp(22px, 3.4vw, 40px);
}

.footer-top {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
  gap: var(--gap-7);
  padding-bottom: var(--gap-6);
  border-bottom: 1px solid var(--block-rule);
}

.footer-brand-head {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: var(--gap-4);
}

.footer-brand-head h3 {
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: var(--block-ink);
  margin: 0;
}

.footer-brand-head .seal {
  background: var(--seal);
}

.footer-brand p {
  margin: 0;
  max-width: 34em;
  font-size: var(--text-sm);
  line-height: 1.9;
  color: var(--block-ink-2);
}

.footer-links h4 {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 400;
  letter-spacing: 0.18em;
  color: var(--block-ink-2);
  margin: 0 0 var(--gap-4);
}

.footer-links-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 2px 12px;
}

.friend-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
  font-size: 12px;
  color: var(--block-ink-2);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: color var(--dur) var(--ease);
}

.friend-link:hover {
  color: var(--block-ink);
  text-decoration: none;
}

.friend-link img {
  width: 16px;
  height: 16px;
  border-radius: 2px;
  object-fit: cover;
  filter: grayscale(1);
  opacity: 0.7;
}

.friend-link:hover img {
  filter: none;
  opacity: 1;
}

.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--gap-4);
  flex-wrap: wrap;
  padding-top: var(--gap-4);
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.04em;
  color: var(--block-ink-2);
}

.footer-bottom p {
  margin: 0;
}

.footer-bottom a {
  color: var(--block-ink-2);
  text-decoration: none;
}

.footer-bottom a:hover {
  color: var(--block-ink);
  text-decoration: none;
}

.footer-bottom .sep {
  color: var(--block-rule);
  margin: 0 6px;
}

/* ---------------- 歌单浮层 ---------------- */

#player {
  position: fixed;
  right: var(--gap-4);
  bottom: var(--gap-4);
  z-index: 880;
  width: 328px;
  max-height: 460px;
  overflow: hidden;
  background: var(--glass-strong);
  border: 1px solid var(--glass-line);
  border-radius: var(--r-md);
  box-shadow: var(--glass-shadow), var(--glass-inner);
  backdrop-filter: blur(28px) saturate(180%);
  -webkit-backdrop-filter: blur(28px) saturate(180%);
}

#player.aplayer {
  font-family: var(--font-sans);
}

#player .aplayer-info {
  border-bottom: 1px solid var(--rule);
}

#player .aplayer-list ol li {
  border-top: 1px solid var(--rule);
}

#player .aplayer-list ol li.aplayer-list-light {
  background: var(--paper-2);
}

/* ---------------- 移动端 ---------------- */

.nav-mobile-backdrop,
.nav-mobile-drawer {
  display: none;
}

@media (max-width: 900px) {
  .nav-links,
  .nav-actions {
    display: none;
  }

  .nav-toggle {
    display: inline-flex;
  }

  .nav-mobile-backdrop {
    display: block;
    position: fixed;
    inset: 0;
    z-index: 940;
    background: rgba(21, 26, 34, 0.28);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    opacity: 0;
    visibility: hidden;
    transition: opacity 220ms var(--ease), visibility 220ms;
  }

  .nav-mobile-backdrop.open {
    opacity: 1;
    visibility: visible;
  }

  .nav-mobile-drawer {
    display: flex;
    flex-direction: column;
    flex-direction: column;
    position: fixed;
    top: 0;
    right: 0;
    z-index: 950;
    width: min(360px, 88vw);
    height: 100dvh;
    background: var(--glass-strong);
    border-left: 1px solid var(--glass-line);
    box-shadow: var(--glass-shadow);
    backdrop-filter: blur(30px) saturate(180%);
    -webkit-backdrop-filter: blur(30px) saturate(180%);
    transform: translateX(100%);
    transition: transform 280ms var(--ease);
    overflow-y: auto;
  }

  .nav-mobile-drawer.open {
    transform: none;
  }

  .nav-mobile-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: var(--nav-h);
    padding: 0 var(--gap-4);
    border-bottom: 1px solid var(--rule);
    flex-shrink: 0;
  }

  .nav-mobile-close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border: 1px solid var(--glass-line-2);
    border-radius: 8px;
    background: transparent;
    color: var(--ink);
    cursor: pointer;
  }

  /* 目录式导航：序号 + 宋体条目 */
  .nav-mobile-links {
    padding: var(--gap-4) var(--gap-4) 0;
    display: flex;
    flex-direction: column;
  }

  .nav-mobile-links .nav-link-item > a {
    display: flex;
    align-items: baseline;
    gap: 14px;
    height: auto;
    padding: 15px 0;
    border-bottom: 1px solid var(--rule);
    font-family: var(--font-display);
    font-size: var(--text-lg);
    color: var(--ink);
  }

  .nav-mobile-links .nav-link-item > a::after {
    display: none;
  }

  .nav-mobile-links .nav-link-item > a::before {
    counter-increment: navexc;
    content: counter(navexc, decimal-leading-zero);
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--ink-3);
    letter-spacing: 0.08em;
  }

  .nav-mobile-links {
    counter-reset: navexc;
  }

  .nav-mobile-links .nav-dropdown-trigger {
    display: flex;
    align-items: baseline;
    gap: 14px;
    width: 100%;
    height: auto;
    padding: 15px 0;
    border-bottom: 1px solid var(--rule);
    font-family: var(--font-display);
    font-size: var(--text-lg);
    color: var(--ink);
  }

  .nav-mobile-links .nav-mobile-index {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--ink-3);
    letter-spacing: 0.08em;
  }

  .nav-mobile-links .nav-dropdown-menu {
    position: static;
    display: block;
    min-width: 0;
    border: 0;
    border-top: 1px solid var(--rule);
    box-shadow: none;
    padding: 4px 0 10px;
    opacity: 1;
    visibility: visible;
    transform: none;
    background: transparent;
  }

  .nav-mobile-links .nav-dropdown-menu:not(.show) {
    display: none;
  }

  .nav-mobile-actions {
    margin-top: auto;
    padding: var(--gap-5) var(--gap-4) var(--gap-6);
    border-top: 1px solid var(--rule);
    display: flex;
    flex-direction: column;
    gap: var(--gap-3);
  }

  .nav-mobile-toggles {
    display: flex;
    gap: var(--gap-2);
  }

  .nav-mobile-toggle-btn {
    flex: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    height: 36px;
    font-size: 12px;
    color: var(--ink-2);
    background: var(--glass-thin);
    border: 1px solid var(--glass-line-2);
    border-radius: 10px;
    cursor: pointer;
  }

  .nav-mobile-toggle-btn:hover {
    border-color: var(--seal);
    color: var(--seal);
  }

  .nav-mobile-actions .nav-login-btn,
  .nav-mobile-actions .nav-cta {
    justify-content: center;
    height: 40px;
    width: 100%;
    font-size: 13px;
  }

  .nav-mobile-actions .nav-user-badge {
    justify-content: flex-start;
    border: 1px solid var(--glass-line-2);
    border-radius: 10px;
    padding: 8px;
  }

  .main-content {
    padding-top: var(--gap-5);
  }

  .footer-top {
    grid-template-columns: 1fr;
    gap: var(--gap-6);
  }

  .footer-links-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  #player {
    right: var(--gap-2);
    bottom: var(--gap-2);
    width: calc(100vw - 16px);
    max-width: 300px;
    max-height: 380px;
  }
}

@media (min-width: 901px) {
  .nav-mobile-drawer,
  .nav-mobile-backdrop {
    display: none !important;
  }
}
</style>

<template>
  <div class="app-shell">
    <!-- 全站背景：山水（默认） / 银河 / 城市 / 折光深渊 / 引力场，由背景室的「应用到全站」决定。
         背景室等页面会自己挂载背景；两者在明暗两种主题下都接管全站，
         .galaxy--site 是「全站那一份」的标记，亮色下它会另取一套纸底墨星。 -->
    <Galaxy v-if="showBackdrop && globalBackground === 'galaxy'" :seed="globalBackgroundSeed"
            class="galaxy--site" />
    <City v-else-if="showBackdrop && globalBackground === 'city'" />
    <InkTide v-else-if="showBackdrop && globalBackground === 'ink-tide'" />
    <!-- 引力场：亮色是晨雾浮尘、暗色是深空能量流，两边正文都读得清，
         全站那一份带 .gravity--site，粒子层再收一点，不抢内容 -->
    <Gravity v-else-if="showBackdrop && globalBackground === 'gravity'" class="gravity--site" />
    <Landscape v-else-if="showBackdrop" />

    <!-- 加载：一枚朱印 -->
    <Transition name="fade">
      <div v-if="isLoading && !isDataLoaded" class="loading-overlay">
        <div class="seal">若</div>
        <span>LOADING</span>
      </div>
    </Transition>

    <!-- 顶栏 -->
    <header class="site-header">
      <nav class="shell nav-inner">
        <RouterLink class="nav-brand" to="/">
          <span class="nav-brand-name">若生</span>
          <span class="nav-brand-mark">KLOPING</span>
        </RouterLink>

        <ul class="nav-links">
          <li class="nav-link-item">
            <RouterLink to="/" exact-active-class="router-link-exact-active">文章</RouterLink>
          </li>
          <li class="nav-link-item">
            <RouterLink to="/apis">接口</RouterLink>
          </li>
          <li class="nav-link-item">
            <RouterLink to="/room">音乐厅</RouterLink>
          </li>
          <li class="nav-link-item">
            <RouterLink to="/effects">背景室</RouterLink>
          </li>
          <li class="nav-link-item nav-dropdown">
            <button
              class="nav-dropdown-trigger"
              :class="{ open: aboutOpen }"
              @click="aboutOpen = !aboutOpen"
            >
              关于
              <i class="bi bi-chevron-down chevron"></i>
            </button>
            <div class="nav-dropdown-menu" :class="{ show: aboutOpen }">
              <a class="nav-dropdown-item" target="_blank" href="//wpa.qq.com/msgrd?v=3&amp;uin=3474006766&amp;site=qq&amp;menu=yes">
                <img alt="qq" loading="lazy" src="http://q.qlogo.cn/g?b=qq&nk=3474006766&s=640" />
                QQ · 找作者
              </a>
              <a class="nav-dropdown-item" target="_blank" href="https://qun.qq.com/universal-share/share?ac=1&authKey=vdy2VbaBqujykAveW9LSf1NkHJnEdluyADdeASabqXmW0UMRl7U9DoG38VkxywDx&busi_data=eyJncm91cENvZGUiOiIyNzg2ODE1NTMiLCJ0b2tlbiI6IjAraFJPM2c3SS84cGVmMzFoY3dOL1lsekN4bUtWMi9sNGNtZVo5UEZQdk1HTVZYaVNCZDlNZzdhbWxFZmlKTHIiLCJ1aW4iOiIzNDc0MDA2NzY2In0%3D&data=tytVVzt4Xk59uWCGdQ76HnXvp9pVmUYYu-0hwrupw2FX1nUuBtl8cEGYHMMBeEkG9ui_sK4mYWin_8dpNHhkLg&svctype=4&tempid=h5_group_info">
                <img loading="lazy" src="http://p.qlogo.cn/gh/278681553/278681553/640" />
                QQ 群 · 闲聊
              </a>
              <a class="nav-dropdown-item" target="_blank" href="https://qun.qq.com/universal-share/share?ac=1&authKey=48SHxrAnIPg%2FSB9tcp3yAVFNY0%2BLD9Un4jrDckReN%2F9q2MmxF0PYmsXjd7fVcN%2Fh&busi_data=eyJncm91cENvZGUiOiI3OTQyMzg1NzIiLCJ0b2tlbiI6IklOTlhMNE00b1hsVWxIS1F5cWsyQy93RFVIaXRTRG50SitPbWZTSTJxWTMrM2JkaXVTZXROblVhRDhQMy91RmQiLCJ1aW4iOiIzNDc0MDA2NzY2In0%3D&data=O39jKGFDN6F7w0E9OVEcAm6UWBQN9S1kVqiWPAArsh_-m3E7eYYGOP1Ysz7NOzmF8a1mhrKqXgAo2XggFtUWfg&svctype=4&tempid=h5_group_info">
                <img alt="qq" loading="lazy" src="http://p.qlogo.cn/gh/794238572/794238572/640" />
                QQ 群 · 技术
              </a>
              <a class="nav-dropdown-item" target="_blank" href="https://github.com/kloping">
                <img alt="github" loading="lazy" src="https://avatars.githubusercontent.com/u/87743020?v=4" />
                GitHub
              </a>
              <a class="nav-dropdown-item" target="_blank" href="https://github.com/gdpl2112">
                <img alt="github" loading="lazy" src="https://avatars.githubusercontent.com/u/96173877?s=200&v=4" />
                GitHub 组织
              </a>
              <div class="nav-dropdown-version">front-vue3 · 26.10.19.</div>
            </div>
          </li>
          <li class="nav-link-item">
            <RouterLink to="/sponsors" class="nav-link-highlight">赞助</RouterLink>
          </li>
          <li class="nav-link-item">
            <RouterLink to="/ai">AI 对话</RouterLink>
          </li>
        </ul>

        <div class="nav-actions">
          <button class="nav-icon-btn" @click="toggleTheme" :title="theme === 'dark' ? '切换亮色' : '切换暗色'">
            <i :class="theme === 'dark' ? 'bi bi-sun' : 'bi bi-moon'"></i>
          </button>
          <button class="nav-icon-btn" @click="ttplayer" title="显隐歌单">
            <i class="bi bi-music-note-beamed"></i>
          </button>

          <span class="nav-divider"></span>

          <template v-if="login_state">
            <RouterLink to="/v0" class="nav-login-btn">控制台</RouterLink>
            <div class="nav-user-badge" @click="goToProfile">
              <img :src="userInfo.icon" alt="" class="nav-avatar" />
              <span class="nav-username">{{ userInfo.nickname }}</span>
            </div>
            <RouterLink to="/upload" class="nav-cta">
              <i class="bi bi-pencil"></i> 写文章
            </RouterLink>
            <button class="nav-icon-btn" @click="logout" title="退出登录">
              <i class="bi bi-box-arrow-right"></i>
            </button>
          </template>

          <template v-else>
            <RouterLink to="/login" class="nav-login-btn">登录</RouterLink>
          </template>
        </div>

        <button class="nav-toggle" @click="mobileOpen = !mobileOpen" aria-label="打开菜单">
          <i :class="mobileOpen ? 'bi bi-x-lg' : 'bi bi-list'"></i>
        </button>
      </nav>

    </header>

    <!-- 移动端目录 -->
    <div class="nav-mobile-backdrop" :class="{ open: mobileOpen }" @click="mobileOpen = false"></div>

    <div class="nav-mobile-drawer" :class="{ open: mobileOpen }">
      <div class="nav-mobile-head">
        <RouterLink class="nav-brand" to="/" @click="mobileOpen = false">
          <span class="nav-brand-name">若生</span>
        </RouterLink>
        <button class="nav-mobile-close" @click="mobileOpen = false">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <div class="nav-mobile-links">
        <div class="nav-link-item">
          <RouterLink to="/" @click="mobileOpen = false">文章</RouterLink>
        </div>
        <div class="nav-link-item">
          <RouterLink to="/apis" @click="mobileOpen = false">接口</RouterLink>
        </div>
        <div class="nav-link-item">
          <RouterLink to="/room" @click="mobileOpen = false">音乐厅</RouterLink>
        </div>
        <div class="nav-link-item">
          <RouterLink to="/effects" @click="mobileOpen = false">背景室</RouterLink>
        </div>
        <div class="nav-link-item nav-dropdown">
          <button
            class="nav-dropdown-trigger"
            :class="{ open: aboutOpen }"
            @click="aboutOpen = !aboutOpen"
          >
            <span class="nav-mobile-index">04</span>
            关于
            <i class="bi bi-chevron-down chevron"></i>
          </button>
          <div class="nav-dropdown-menu" :class="{ show: aboutOpen }">
            <a class="nav-dropdown-item" target="_blank" href="//wpa.qq.com/msgrd?v=3&amp;uin=3474006766&amp;site=qq&amp;menu=yes" @click="mobileOpen = false">
              <img alt="qq" loading="lazy" src="http://q.qlogo.cn/g?b=qq&nk=3474006766&s=640" />
              QQ · 找作者
            </a>
            <a class="nav-dropdown-item" target="_blank" href="https://qun.qq.com/universal-share/share?ac=1&authKey=vdy2VbaBqujykAveW9LSf1NkHJnEdluyADdeASabqXmW0UMRl7U9DoG38VkxywDx&busi_data=eyJncm91cENvZGUiOiIyNzg2ODE1NTMiLCJ0b2tlbiI6IjAraFJPM2c3SS84cGVmMzFoY3dOL1lsekN4bUtWMi9sNGNtZVo5UEZQdk1HTVZYaVNCZDlNZzdhbWxFZmlKTHIiLCJ1aW4iOiIzNDc0MDA2NzY2In0%3D&data=tytVVzt4Xk59uWCGdQ76HnXvp9pVmUYYu-0hwrupw2FX1nUuBtl8cEGYHMMBeEkG9ui_sK4mYWin_8dpNHhkLg&svctype=4&tempid=h5_group_info" @click="mobileOpen = false">
              <img loading="lazy" src="http://p.qlogo.cn/gh/278681553/278681553/640" />
              QQ 群 · 闲聊
            </a>
            <a class="nav-dropdown-item" target="_blank" href="https://qun.qq.com/universal-share/share?ac=1&authKey=48SHxrAnIPg%2FSB9tcp3yAVFNY0%2BLD9Un4jrDckReN%2F9q2MmxF0PYmsXjd7fVcN%2Fh&busi_data=eyJncm91cENvZGUiOiI3OTQyMzg1NzIiLCJ0b2tlbiI6IklOTlhMNE00b1hsVWxIS1F5cWsyQy93RFVIaXRTRG50SitPbWZTSTJxWTMrM2JkaXVTZXROblVhRDhQMy91RmQiLCJ1aW4iOiIzNDc0MDA2NzY2In0%3D&data=O39jKGFDN6F7w0E9OVEcAm6UWBQN9S1kVqiWPAArsh_-m3E7eYYGOP1Ysz7NOzmF8a1mhrKqXgAo2XggFtUWfg&svctype=4&tempid=h5_group_info" @click="mobileOpen = false">
              <img alt="qq" loading="lazy" src="http://p.qlogo.cn/gh/794238572/794238572/640" />
              QQ 群 · 技术
            </a>
            <a class="nav-dropdown-item" target="_blank" href="https://github.com/kloping" @click="mobileOpen = false">
              <img alt="github" loading="lazy" src="https://avatars.githubusercontent.com/u/87743020?v=4" />
              GitHub
            </a>
            <a class="nav-dropdown-item" target="_blank" href="https://github.com/gdpl2112" @click="mobileOpen = false">
              <img alt="github" loading="lazy" src="https://avatars.githubusercontent.com/u/96173877?s=200&v=4" />
              GitHub 组织
            </a>
            <div class="nav-dropdown-version">front-vue3 · 26.10.18</div>
          </div>
        </div>
        <div class="nav-link-item">
          <RouterLink to="/sponsors" class="nav-link-highlight" @click="mobileOpen = false">赞助</RouterLink>
        </div>
        <div class="nav-link-item">
          <RouterLink to="/ai" @click="mobileOpen = false">AI 对话</RouterLink>
        </div>
      </div>

      <div class="nav-mobile-actions">
        <div class="nav-mobile-toggles">
          <button class="nav-mobile-toggle-btn" @click="toggleTheme()">
            <i :class="theme === 'dark' ? 'bi bi-sun' : 'bi bi-moon'"></i>
            <span>{{ theme === 'dark' ? '亮色' : '暗色' }}</span>
          </button>
          <button class="nav-mobile-toggle-btn" @click="ttplayer()">
            <i class="bi bi-music-note-beamed"></i>
            <span>歌单</span>
          </button>
        </div>

        <template v-if="login_state">
          <RouterLink to="/v0" class="nav-login-btn" @click="mobileOpen = false">控制台</RouterLink>
          <div class="nav-user-badge" @click="goToProfile(); mobileOpen = false">
            <img :src="userInfo.icon" alt="" class="nav-avatar" />
            <span class="nav-username">{{ userInfo.nickname }}</span>
          </div>
          <RouterLink to="/upload" class="nav-cta" @click="mobileOpen = false">
            <i class="bi bi-pencil"></i> 写文章
          </RouterLink>
          <button class="nav-login-btn" @click="logout(); mobileOpen = false">
            退出登录
          </button>
        </template>
        <template v-else>
          <RouterLink to="/login" class="nav-login-btn" @click="mobileOpen = false">登录</RouterLink>
        </template>
      </div>
    </div>

    <!-- 正文 -->
    <main class="main-content" :class="{'main-content-console': route.path.startsWith('/v0')}">
      <RouterView />
    </main>

    <!-- 版权页 -->
    <footer class="site-footer">
      <div class="footer-inner">
        <div class="footer-top">
          <div class="footer-brand">
            <div class="footer-brand-head">
              <span class="seal">若</span>
              <h3>若生</h3>
            </div>
            <p>
              一个人的记录：写过的东西、开放出去的接口，和一间随时可以坐下的音乐厅。
              全部由若生（kloping）独自维护。
            </p>
          </div>
          <div class="footer-links">
            <h4>友情链接</h4>
            <div class="footer-links-grid">
              <a v-for="e in arr" :key="e.name" :href="e.url" target="_blank" class="friend-link">
                <img :src="e.icon" alt="" />
                <span>{{ e.name }}</span>
              </a>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <p>
            © 2026
            <a href="//wpa.qq.com/msgrd?v=3&amp;uin=3474006766&amp;site=qq&amp;menu=yes" target="_blank">若生</a>
            <span class="sep">/</span>
            <a href="//github.com/kloping" target="_blank">kloping</a>
            <span class="sep">/</span>
            <a :href="'//' + host0" target="_blank">{{ host0 }}</a>
          </p>
          <p>
            <a target="_blank" href="https://beian.miit.gov.cn/">皖ICP备2025088299号-1</a>
          </p>
        </div>
      </div>
    </footer>

    <!-- 歌单 -->
    <div id="player"></div>
  </div>
</template>

<script lang="ts" setup>
import {RouterLink, RouterView, useRoute} from 'vue-router'
import $ from 'jquery';
import {computed, onMounted, ref} from "vue";
import {loadUser, login_state, service, userInfo, userLogout} from "@/axios";
import {toast} from "@/utils/utils";
//@ts-ignore
import APlayer from 'aplayer/dist/APlayer.min';
import router from "@/router";
import City from "@/components/City.vue";
import Galaxy from "@/components/Galaxy.vue";
import Gravity from "@/components/Gravity.vue";
import Landscape from "@/components/Landscape.vue";
import InkTide from "@/components/InkTide.vue";
import {applyTheme, theme, toggleTheme} from "@/utils/theme";
import {globalBackground, globalBackgroundSeed} from "@/utils/background";

const route = useRoute()
// 背景室等页面自己挂载背景，需要在全站壳层里让出位置
const showBackdrop = computed(() => !route.meta.hideBackdrop)

let arr = ref([{color: "blue", url: "localhost", icon: "/icon.jpg", name: "slef"}])
let host0 = ref("")
let isDataLoaded = ref(false)
let isLoading = ref(true)

// 主题与全站背景分别放在 utils/theme.ts 与 utils/background.ts 里，
// 背景室需要用同一个状态来切换全站背景、记忆种子。

// 移动端目录
const mobileOpen = ref(false)
const aboutOpen = ref(false)

function goToProfile() {
  router.push('/v0')
}

service.get("/get-host?url=" + document.location).then(res => {
  host0.value = res.toString()
}).catch(err => {
  console.log(err)
})

service.get("/user/flinks").then(res => {
  arr.value = res as unknown as any[]
}).catch(err => {
  toast("获取友链失败" + err)
})

let ap: APlayer;

onMounted(async () => {
  // 应用初始主题
  applyTheme(theme.value);

  router.beforeEach((to, from, next) => {
    // 只改查询参数（如背景室切换效果）不触发整页加载遮罩
    if (to.path !== from.path) isLoading.value = true;
    mobileOpen.value = false;
    next();
  });

  router.afterEach(() => {
    setTimeout(() => { isLoading.value = false }, 200)
  });

  ap = new APlayer({
    container: document.getElementById('player'),
    autoplay: false,
    listMaxHeight: 280,
    audio: [],
    preload: "none",
    // 播放器主题色跟随站点的朱印色，避免默认浅蓝与整体纸墨观感冲突
    theme: '#be3a28'
  });

  try {
    await loadUser();

    function loadDefaultList() {
      service.get("/api/music/get-music-list").then(function (response) {
        ap.list.add(response)
        ap.list.show()
        setTimeout(function () { ap.list.hide() }, 1500)
      }).catch(function (err) {
        toast("获取音乐失败" + err)
      });
    }

    if (login_state.value) {
      service.get("/api/music/list").then(function (response) {
        let data = response.data
        if (data.length > 0) { ap.list.add(data) }
        else { loadDefaultList() }
      })
    } else {
      loadDefaultList();
    }
  } catch (error) {
    toast("加载用户信息失败" + error);
  } finally {
    // @ts-ignore
    window.ap = ap;
    isDataLoaded.value = true;
    setTimeout(() => { isLoading.value = false }, 600);
  }
})

function ttplayer() {
  $("#player").toggle()
}

function logout() {
  userLogout()
}
</script>
