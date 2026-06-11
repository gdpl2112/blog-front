<style>
/* =============================================
   App Layout - Redesigned v2
   ============================================= */

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  min-height: 100vh;
  overflow-x: hidden;
}

/* 背景壁纸 + 半透明遮罩层 */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: -1;
  background:
    linear-gradient(
      rgba(248, 249, 252, 0.42),
      rgba(248, 249, 252, 0.42)
    ),
    url('/f/a12333dddff.png') center / cover no-repeat fixed;
}

@media (max-width: 768px) {
  body::before {
    background:
      linear-gradient(
        rgba(248, 249, 252, 0.42),
        rgba(248, 249, 252, 0.42)
      ),
      url('/f/26-0112-640.png') top center / cover no-repeat fixed;
  }
}

html[data-theme="dark"] body::before {
  background:
    linear-gradient(
      rgba(15, 17, 23, 0.55),
      rgba(15, 17, 23, 0.55)
    ),
    url('/f/a12333dddff.png') center / cover no-repeat fixed;
}

html[data-theme="dark"] body {
  background-color: #0f1117;
}

@media (max-width: 768px) {
  html[data-theme="dark"] body::before {
    background:
      linear-gradient(
        rgba(15, 17, 23, 0.55),
        rgba(15, 17, 23, 0.55)
      ),
      url('/f/26-0112-640.png') top center / cover no-repeat fixed;
  }
}

/* Loading */
.loading-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 17, 23, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.loading-ring {
  width: 48px;
  height: 48px;
  border: 3px solid rgba(255, 255, 255, 0.08);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: loading-spin 0.8s linear infinite;
}

@keyframes loading-spin {
  to { transform: rotate(360deg); }
}

/* =============================================
   Navigation v3 - Layered glass, pill nav, active indicator
   ============================================= */

.site-header {
  position: sticky;
  top: var(--space-4);
  z-index: 1000;
  max-width: calc(var(--max-width) + var(--space-12));
  margin: 0 auto;
  padding: 0 var(--space-6);
}

/* Outer glow layer */
.nav-outer-glow {
  position: absolute;
  inset: -1px;
  border-radius: var(--radius-xl);
  background: linear-gradient(
    135deg,
    rgba(79, 110, 247, 0.08),
    rgba(139, 92, 246, 0.06),
    rgba(79, 110, 247, 0.04)
  );
  pointer-events: none;
  z-index: -1;
}

[data-theme="dark"] .nav-outer-glow {
  background: linear-gradient(
    135deg,
    rgba(107, 138, 255, 0.10),
    rgba(141, 164, 255, 0.06),
    rgba(107, 138, 255, 0.04)
  );
}

/* Main nav shell */
.nav-glass {
  position: relative;
  display: flex;
  align-items: center;
  height: var(--nav-height);
  padding: 0 var(--space-5);
  /* Deeper glass: more opacity + stronger blur */
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(20px) saturate(190%) brightness(1.02);
  -webkit-backdrop-filter: blur(20px) saturate(190%) brightness(1.02);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: var(--radius-xl);
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.03),
    0 8px 32px rgba(79, 110, 247, 0.04);
  transition: all var(--transition-base);
}

.nav-glass:hover {
  background: rgba(255, 255, 255, 0.82);
}

[data-theme="dark"] .nav-glass {
  background: rgba(20, 23, 35, 0.82);
  border-color: rgba(255, 255, 255, 0.07);
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.15),
    0 8px 32px rgba(0, 0, 0, 0.1);
}

[data-theme="dark"] .nav-glass:hover {
  background: rgba(20, 23, 35, 0.9);
}

/* ======== BRAND ======== */
.nav-brand {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  text-decoration: none;
  flex-shrink: 0;
  margin-right: var(--space-6);
  transition: transform var(--transition-fast);
}

.nav-brand:hover {
  transform: scale(1.03);
}

.nav-brand img {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  object-fit: cover;
  box-shadow: 0 2px 8px rgba(79, 110, 247, 0.18);
}

.nav-brand-text {
  font-weight: 750;
  font-size: 1.1rem;
  letter-spacing: -0.03em;
  background: linear-gradient(135deg, #4f6ef7 0%, #7c3aed 60%, #a78bfa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ======== NAV LINKS ======== */
.nav-links {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-link-item {
  position: relative;
}

.nav-link-item a {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: 8px 16px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  text-decoration: none;
  border-radius: var(--radius-full);
  transition: all var(--transition-base);
}

.nav-link-item a::after {
  content: '';
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%) scaleX(0);
  width: 20px;
  height: 2.5px;
  border-radius: 2px;
  background: var(--color-accent);
  transition: transform var(--transition-base);
}

.nav-link-item a:hover {
  color: var(--color-accent);
  background: var(--color-accent-soft);
}

.nav-link-item a:hover::after {
  transform: translateX(-50%) scaleX(1);
}

.nav-link-item a.router-link-active {
  color: var(--color-accent);
  background: var(--color-accent-soft);
  font-weight: 600;
}

.nav-link-item a.router-link-active::after {
  transform: translateX(-50%) scaleX(1);
}

/* Highlight variant (sponsor) */
.nav-link-highlight {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(234, 179, 8, 0.08)) !important;
  color: #d97706 !important;
  font-weight: 600 !important;
}

.nav-link-highlight:hover {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(234, 179, 8, 0.14)) !important;
  color: #b45309 !important;
  transform: translateY(-1px);
}

.nav-link-highlight::after {
  background: #d97706 !important;
}

/* ======== DROPDOWN (icon-btn trigger) ======== */
.nav-dropdown {
  position: relative;
}

.nav-dropdown-trigger {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  border: none;
  border-radius: var(--radius-full);
  background: none;
  cursor: pointer;
  transition: all var(--transition-base);
}

.nav-dropdown-trigger:hover {
  color: var(--color-accent);
  background: var(--color-accent-soft);
}

.nav-dropdown-trigger .chevron {
  font-size: 0.6rem;
  transition: transform var(--transition-fast);
}

.nav-dropdown-trigger.open .chevron {
  transform: rotate(180deg);
}

.nav-dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 220px;
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  padding: var(--space-2);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-6px) scale(0.97);
  transition: all 200ms cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 100;
  transform-origin: top right;
}

.nav-dropdown-menu.show {
  opacity: 1;
  visibility: visible;
  transform: translateY(0) scale(1);
}

.nav-dropdown-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: 10px 14px;
  font-size: 0.85rem;
  color: var(--color-text-primary);
  text-decoration: none;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
  margin-bottom: 1px;
}

.nav-dropdown-item:hover {
  background: var(--color-accent-soft);
  color: var(--color-accent);
  transform: translateX(3px);
}

.nav-dropdown-item img {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  object-fit: cover;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
}

.nav-dropdown-version {
  padding: 8px 14px;
  font-size: 0.7rem;
  color: var(--color-text-tertiary);
  text-align: center;
  border-top: 1px solid var(--color-border-light);
  margin-top: var(--space-1);
  padding-top: 10px;
}

/* ======== RIGHT-SIDE ACTIONS ======== */
.nav-actions {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  margin-left: var(--space-6);
  flex-shrink: 0;
}

.nav-icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  background: var(--color-bg-soft);
  color: var(--color-text-tertiary);
  cursor: pointer;
  transition: all var(--transition-fast);
  font-size: 1.05rem;
  position: relative;
}

.nav-icon-btn:hover {
  color: var(--color-accent);
  border-color: var(--color-accent-soft);
  background: var(--color-accent-soft);
}

.nav-icon-btn:active {
  transform: scale(0.94);
}

/* Divider between icon actions and user area */
.nav-divider {
  width: 1px;
  height: 24px;
  background: var(--color-border);
  margin: 0 var(--space-1);
}

/* User badge */
.nav-user-badge {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: 5px 12px 5px 5px;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--transition-fast);
  border: 1px solid transparent;
}

.nav-user-badge:hover {
  background: var(--color-accent-soft);
  border-color: var(--color-accent-soft);
}

.nav-avatar {
  width: 30px;
  height: 30px;
  border-radius: 9px;
  object-fit: cover;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
}

.nav-username {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--color-text-primary);
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* CTA button in nav */
.nav-cta {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 7px 18px;
  font-size: 0.82rem;
  font-weight: 600;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, var(--color-accent), #7c3aed);
  color: white;
  border: none;
  text-decoration: none;
  cursor: pointer;
  transition: all var(--transition-base);
  box-shadow: 0 2px 10px rgba(79, 110, 247, 0.25);
}

.nav-cta:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(79, 110, 247, 0.35);
  color: white;
}

.nav-cta:active {
  transform: scale(0.96);
}

.nav-cta-ghost {
  background: var(--color-bg-card);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
  box-shadow: none;
  padding: 7px 16px;
}

.nav-cta-ghost:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
  box-shadow: var(--shadow-sm);
}

/* Login button */
.nav-login-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: 8px 18px;
  font-size: 0.85rem;
  font-weight: 600;
  border-radius: var(--radius-full);
  border: 1.5px solid var(--color-accent);
  color: var(--color-accent);
  background: transparent;
  text-decoration: none;
  cursor: pointer;
  transition: all var(--transition-base);
}

.nav-login-btn:hover {
  background: var(--color-accent);
  color: white;
  box-shadow: 0 4px 12px rgba(79, 110, 247, 0.3);
}

/* ======== MOBILE ======== */
.nav-toggle {
  display: none;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid var(--color-border);
  background: var(--color-bg-soft);
  border-radius: var(--radius-sm);
  cursor: pointer;
  color: var(--color-text-primary);
  font-size: 1.1rem;
  transition: all var(--transition-fast);
  margin-left: auto;
}

.nav-toggle:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

/* =============================================
   Main content area
   ============================================= */

.main-content {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: var(--space-6);
  min-height: calc(100vh - var(--nav-height) - 200px);
}

/* Global glass: any card or section gets frosted */
.main-content *[style*="var(--color-bg-card)"],
.main-content .v0-content,
.main-content .post-card,
.main-content .quote-card,
.main-content .api-card,
.main-content .comments-section,
.main-content .article-body,
.main-content .sponsor-table-wrap,
.main-content .qr-card,
.main-content .info-section,
.main-content .form-section,
.main-content .article-group,
.main-content .form-card,
.main-content .admin-section,
.main-content .upload-form,
.main-content .update-form {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

/* =============================================
   Footer
   ============================================= */

.site-footer {
  margin-top: var(--space-16);
  padding: var(--space-12) var(--space-6);
  background: var(--color-bg-elevated);
  border-top: 1px solid var(--color-border);
}

.footer-inner {
  max-width: var(--max-width);
  margin: 0 auto;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-12);
}

.footer-brand h3 {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 var(--space-2);
  letter-spacing: -0.02em;
  color: var(--color-text-primary);
}

.footer-brand p {
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  margin: 0;
  line-height: 1.7;
}

.footer-links h4 {
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0 0 var(--space-4);
  color: var(--color-text-primary);
}

.footer-links-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-2);
}

.friend-link {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: 6px 10px;
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  text-decoration: none;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.friend-link:hover {
  background: var(--color-accent-soft);
  color: var(--color-accent);
}

.friend-link img {
  width: 20px;
  height: 20px;
  border-radius: var(--radius-full);
  object-fit: cover;
}

.footer-bottom {
  margin-top: var(--space-8);
  padding-top: var(--space-6);
  border-top: 1px solid var(--color-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.footer-bottom p {
  margin: 0;
  color: var(--color-text-tertiary);
  font-size: 0.8rem;
}

.footer-bottom a {
  color: var(--color-text-tertiary);
  transition: color var(--transition-fast);
}

.footer-bottom a:hover {
  color: var(--color-accent);
}

/* =============================================
   APlayer styling
   ============================================= */

#player {
  position: fixed;
  top: calc(var(--nav-height) + var(--space-4) + var(--space-4));
  right: var(--space-4);
  z-index: 999;
  width: 340px;
  max-height: 480px;
  border-radius: var(--radius-md);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-xl);
  border: 1px solid var(--color-border);
  background: var(--color-bg-card);
  transition: all var(--transition-base);
}

#player .aplayer-list {
  overflow-y: auto !important;
}

#player.aplayer {
  font-family: var(--font-sans);
}

/* =============================================
   Responsive
   ============================================= */

/* ======== MOBILE DRAWER (slide-over) ======== */
@media (max-width: 768px) {
  .site-header {
    top: 0;
    padding: 0 var(--space-3);
    max-width: 100%;
  }

  .nav-glass {
    border-radius: var(--radius-lg);
    padding: 0 var(--space-4);
  }

  .nav-outer-glow {
    border-radius: var(--radius-lg);
  }

  .nav-toggle {
    display: flex;
  }

  /* Hide desktop links on mobile */
  .nav-links-desktop {
    display: none !important;
  }

  .nav-actions-desktop {
    display: none !important;
  }

  /* Mobile overlay backdrop */
  .nav-mobile-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    z-index: 998;
    opacity: 0;
    visibility: hidden;
    transition: opacity 250ms ease;
  }

  .nav-mobile-backdrop.open {
    opacity: 1;
    visibility: visible;
  }

  /* Mobile slide-over drawer */
  .nav-mobile-drawer {
    position: fixed;
    top: 0;
    right: 0;
    width: min(320px, 85vw);
    height: 100vh;
    height: 100dvh;
    z-index: 999;
    background: var(--color-bg-elevated);
    border-left: 1px solid var(--color-border);
    box-shadow: var(--shadow-xl);
    padding: var(--space-6);
    overflow-y: auto;
    transform: translateX(100%);
    transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1);
    display: flex;
    flex-direction: column;
  }

  .nav-mobile-drawer.open {
    transform: translateX(0);
  }

  [data-theme="dark"] .nav-mobile-backdrop {
    background: rgba(0, 0, 0, 0.6);
  }

  .nav-mobile-drawer-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--space-6);
    padding-bottom: var(--space-4);
    border-bottom: 1px solid var(--color-border);
  }

  .nav-mobile-drawer-header .nav-brand {
    margin-right: 0;
  }

  .nav-mobile-close {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    background: var(--color-bg-soft);
    color: var(--color-text-primary);
    cursor: pointer;
    font-size: 1.1rem;
  }

  .nav-mobile-links {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    flex: 1;
  }

  .nav-mobile-links .nav-link-item a {
    width: 100%;
    justify-content: flex-start;
    padding: 12px 16px;
    font-size: 0.95rem;
    border-radius: var(--radius-md);
  }

  .nav-mobile-links .nav-link-item a::after {
    display: none;
  }

  .nav-mobile-links .nav-dropdown-trigger {
    width: 100%;
    justify-content: flex-start;
    padding: 12px 16px;
    font-size: 0.95rem;
    border-radius: var(--radius-md);
  }

  .nav-mobile-links .nav-dropdown-menu {
    position: static;
    box-shadow: none;
    border: none;
    margin-top: 2px;
    padding: 0 0 0 var(--space-4);
    background: transparent;
    min-width: unset;
    /* Keep show-driven visibility so ABOUT is collapsible */
  }

  /* Mobile: hide dropdown unless .show is present */
  .nav-mobile-links .nav-dropdown-menu:not(.show) {
    opacity: 0;
    visibility: hidden;
    max-height: 0;
    overflow: hidden;
  }

  .nav-mobile-links .nav-dropdown-menu.show {
    opacity: 1;
    visibility: visible;
    transform: none;
    max-height: 600px;
    transition: all 250ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .nav-mobile-actions {
    margin-top: var(--space-6);
    padding-top: var(--space-5);
    border-top: 1px solid var(--color-border);
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .nav-mobile-actions .nav-icon-btn {
    display: none;
  }

  .nav-mobile-toggles {
    display: flex;
    gap: var(--space-2);
  }

  .nav-mobile-toggle-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    padding: 10px 14px;
    font-size: 0.85rem;
    font-weight: 500;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-bg-soft);
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .nav-mobile-toggle-btn:hover {
    border-color: var(--color-accent);
    color: var(--color-accent);
    background: var(--color-accent-soft);
  }

  .nav-mobile-actions .nav-cta {
    justify-content: center;
    padding: 10px 20px;
    font-size: 0.9rem;
  }

  .nav-mobile-actions .nav-login-btn {
    justify-content: center;
    padding: 10px 20px;
    font-size: 0.9rem;
  }

  .nav-mobile-actions .nav-user-badge {
    border-radius: var(--radius-md);
    padding: 10px 14px;
  }

  .footer-grid {
    grid-template-columns: 1fr;
    gap: var(--space-8);
  }

  .footer-links-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .footer-bottom {
    flex-direction: column;
    text-align: center;
  }

  #player {
    width: 280px;
    right: var(--space-2);
    max-height: 400px;
  }
}

@media (min-width: 769px) {
  .nav-mobile-drawer,
  .nav-mobile-backdrop {
    display: none !important;
  }
}

@media (max-width: 480px) {
  .footer-links-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>

<template>
  <div class="app-root" :data-theme="theme">
    <!-- Loading overlay -->
    <Transition name="fade">
      <div v-if="isLoading" class="loading-overlay">
        <div class="loading-ring"></div>
      </div>
    </Transition>

    <!-- Header / Navigation -->
    <header class="site-header">
      <nav class="nav-glass">
        <div class="nav-outer-glow"></div>

        <RouterLink class="nav-brand" to="/">
          <img src="/favicon.ico" alt="kloping's blog" />
          <span class="nav-brand-text">kloping's blog</span>
        </RouterLink>

        <!-- Desktop Nav Links -->
        <ul class="nav-links nav-links-desktop">
          <li class="nav-link-item">
            <RouterLink to="/">首页</RouterLink>
          </li>
          <li class="nav-link-item">
            <RouterLink to="/apis">公共API</RouterLink>
          </li>
          <li class="nav-link-item">
            <RouterLink to="/room">音乐厅</RouterLink>
          </li>
          <li class="nav-link-item nav-dropdown">
            <button
              class="nav-dropdown-trigger"
              :class="{ open: aboutOpen }"
              @click="aboutOpen = !aboutOpen"
            >
              ABOUT
              <i class="bi bi-chevron-down chevron"></i>
            </button>
            <div class="nav-dropdown-menu" :class="{ show: aboutOpen }">
              <a class="nav-dropdown-item" target="_blank" href="//wpa.qq.com/msgrd?v=3&amp;uin=3474006766&amp;site=qq&amp;menu=yes">
                <img alt="qq" loading="lazy" src="http://q.qlogo.cn/g?b=qq&nk=3474006766&s=640" />
                QQ (owner)
              </a>
              <a class="nav-dropdown-item" target="_blank" href="https://qun.qq.com/universal-share/share?ac=1&authKey=vdy2VbaBqujykAveW9LSf1NkHJnEdluyADdeASabqXmW0UMRl7U9DoG38VkxywDx&busi_data=eyJncm91cENvZGUiOiIyNzg2ODE1NTMiLCJ0b2tlbiI6IjAraFJPM2c3SS84cGVmMzFoY3dOL1lsekN4bUtWMi9sNGNtZVo5UEZQdk1HTVZYaVNCZDlNZzdhbWxFZmlKTHIiLCJ1aW4iOiIzNDc0MDA2NzY2In0%3D&data=tytVVzt4Xk59uWCGdQ76HnXvp9pVmUYYu-0hwrupw2FX1nUuBtl8cEGYHMMBeEkG9ui_sK4mYWin_8dpNHhkLg&svctype=4&tempid=h5_group_info">
                <img loading="lazy" src="http://p.qlogo.cn/gh/278681553/278681553/640" />
                QQ GROUP (闲聊)
              </a>
              <a class="nav-dropdown-item" target="_blank" href="https://qun.qq.com/universal-share/share?ac=1&authKey=48SHxrAnIPg%2FSB9tcp3yAVFNY0%2BLD9Un4jrDckReN%2F9q2MmxF0PYmsXjd7fVcN%2Fh&busi_data=eyJncm91cENvZGUiOiI3OTQyMzg1NzIiLCJ0b2tlbiI6IklOTlhMNE00b1hsVWxIS1F5cWsyQy93RFVIaXRTRG50SitPbWZTSTJxWTMrM2JkaXVTZXROblVhRDhQMy91RmQiLCJ1aW4iOiIzNDc0MDA2NzY2In0%3D&data=O39jKGFDN6F7w0E9OVEcAm6UWBQN9S1kVqiWPAArsh_-m3E7eYYGOP1Ysz7NOzmF8a1mhrKqXgAo2XggFtUWfg&svctype=4&tempid=h5_group_info">
                <img alt="qq" loading="lazy" src="http://p.qlogo.cn/gh/794238572/794238572/640" />
                QQ GROUP (技术)
              </a>
              <a class="nav-dropdown-item" target="_blank" href="https://github.com/kloping">
                <img alt="github" loading="lazy" src="https://avatars.githubusercontent.com/u/87743020?v=4" />
                github
              </a>
              <a class="nav-dropdown-item" target="_blank" href="https://github.com/gdpl2112">
                <img alt="github" loading="lazy" src="https://avatars.githubusercontent.com/u/96173877?s=200&v=4" />
                github organization
              </a>
              <div class="nav-dropdown-version">front-vue3 update 26.06.11</div>
            </div>
          </li>
          <li class="nav-link-item">
            <RouterLink to="/sponsors" class="nav-link-highlight">赞助</RouterLink>
          </li>
          <li class="nav-link-item">
            <RouterLink to="/ai">AI对话</RouterLink>
          </li>
        </ul>

        <!-- Desktop Actions -->
        <div class="nav-actions nav-actions-desktop">
          <button class="nav-icon-btn" @click="toggleTheme" :title="theme === 'dark' ? '切换亮色' : '切换暗色'">
            <i :class="theme === 'dark' ? 'bi bi-sun' : 'bi bi-moon'"></i>
          </button>
          <button class="nav-icon-btn" @click="ttplayer" title="显隐歌单">
            <i class="bi bi-music-note-beamed"></i>
          </button>

          <span class="nav-divider"></span>

          <!-- Logged in -->
          <template v-if="login_state">
            <RouterLink to="/v0" class="nav-login-btn">个人中心</RouterLink>
            <div class="nav-user-badge" @click="goToProfile">
              <img :src="userInfo.icon" alt="" class="nav-avatar" />
              <span class="nav-username">{{ userInfo.nickname }}</span>
            </div>
            <RouterLink to="/upload" class="nav-cta">
              <i class="bi bi-pencil-square"></i> 发帖
            </RouterLink>
            <button class="nav-icon-btn" @click="logout" title="退出登录">
              <i class="bi bi-box-arrow-right"></i>
            </button>
          </template>

          <!-- Not logged in -->
          <template v-else>
            <RouterLink to="/login" class="nav-login-btn">登录</RouterLink>
          </template>
        </div>

        <!-- Mobile toggle -->
        <button class="nav-toggle" @click="mobileOpen = !mobileOpen" aria-label="Toggle menu">
          <i :class="mobileOpen ? 'bi bi-x-lg' : 'bi bi-list'"></i>
        </button>
      </nav>

      <!-- Mobile Backdrop -->
      <div class="nav-mobile-backdrop" :class="{ open: mobileOpen }" @click="mobileOpen = false"></div>

      <!-- Mobile Drawer -->
      <div class="nav-mobile-drawer" :class="{ open: mobileOpen }">
        <div class="nav-mobile-drawer-header">
          <RouterLink class="nav-brand" to="/" @click="mobileOpen = false">
            <img src="/favicon.ico" alt="kloping's blog" />
            <span class="nav-brand-text">kloping's blog</span>
          </RouterLink>
          <button class="nav-mobile-close" @click="mobileOpen = false">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <div class="nav-mobile-links">
          <div class="nav-link-item">
            <RouterLink to="/" @click="mobileOpen = false">首页</RouterLink>
          </div>
          <div class="nav-link-item">
            <RouterLink to="/apis" @click="mobileOpen = false">公共API</RouterLink>
          </div>
          <div class="nav-link-item">
            <RouterLink to="/room" @click="mobileOpen = false">音乐厅</RouterLink>
          </div>
          <div class="nav-link-item nav-dropdown">
            <button
              class="nav-dropdown-trigger"
              :class="{ open: aboutOpen }"
              @click="aboutOpen = !aboutOpen"
            >
              ABOUT
              <i class="bi bi-chevron-down chevron"></i>
            </button>
            <div class="nav-dropdown-menu" :class="{ show: aboutOpen }">
              <a class="nav-dropdown-item" target="_blank" href="//wpa.qq.com/msgrd?v=3&amp;uin=3474006766&amp;site=qq&amp;menu=yes" @click="mobileOpen = false">
                <img alt="qq" loading="lazy" src="http://q.qlogo.cn/g?b=qq&nk=3474006766&s=640" />
                QQ (owner)
              </a>
              <a class="nav-dropdown-item" target="_blank" href="https://qun.qq.com/universal-share/share?ac=1&authKey=vdy2VbaBqujykAveW9LSf1NkHJnEdluyADdeASabqXmW0UMRl7U9DoG38VkxywDx&busi_data=eyJncm91cENvZGUiOiIyNzg2ODE1NTMiLCJ0b2tlbiI6IjAraFJPM2c3SS84cGVmMzFoY3dOL1lsekN4bUtWMi9sNGNtZVo5UEZQdk1HTVZYaVNCZDlNZzdhbWxFZmlKTHIiLCJ1aW4iOiIzNDc0MDA2NzY2In0%3D&data=tytVVzt4Xk59uWCGdQ76HnXvp9pVmUYYu-0hwrupw2FX1nUuBtl8cEGYHMMBeEkG9ui_sK4mYWin_8dpNHhkLg&svctype=4&tempid=h5_group_info" @click="mobileOpen = false">
                <img loading="lazy" src="http://p.qlogo.cn/gh/278681553/278681553/640" />
                QQ GROUP (闲聊)
              </a>
              <a class="nav-dropdown-item" target="_blank" href="https://qun.qq.com/universal-share/share?ac=1&authKey=48SHxrAnIPg%2FSB9tcp3yAVFNY0%2BLD9Un4jrDckReN%2F9q2MmxF0PYmsXjd7fVcN%2Fh&busi_data=eyJncm91cENvZGUiOiI3OTQyMzg1NzIiLCJ0b2tlbiI6IklOTlhMNE00b1hsVWxIS1F5cWsyQy93RFVIaXRTRG50SitPbWZTSTJxWTMrM2JkaXVTZXROblVhRDhQMy91RmQiLCJ1aW4iOiIzNDc0MDA2NzY2In0%3D&data=O39jKGFDN6F7w0E9OVEcAm6UWBQN9S1kVqiWPAArsh_-m3E7eYYGOP1Ysz7NOzmF8a1mhrKqXgAo2XggFtUWfg&svctype=4&tempid=h5_group_info" @click="mobileOpen = false">
                <img alt="qq" loading="lazy" src="http://p.qlogo.cn/gh/794238572/794238572/640" />
                QQ GROUP (技术)
              </a>
              <a class="nav-dropdown-item" target="_blank" href="https://github.com/kloping" @click="mobileOpen = false">
                <img alt="github" loading="lazy" src="https://avatars.githubusercontent.com/u/87743020?v=4" />
                github
              </a>
              <a class="nav-dropdown-item" target="_blank" href="https://github.com/gdpl2112" @click="mobileOpen = false">
                <img alt="github" loading="lazy" src="https://avatars.githubusercontent.com/u/96173877?s=200&v=4" />
                github organization
              </a>
              <div class="nav-dropdown-version">front-vue3 update 26.06.09</div>
            </div>
          </div>
          <div class="nav-link-item">
            <RouterLink to="/sponsors" class="nav-link-highlight" @click="mobileOpen = false">赞助</RouterLink>
          </div>
          <div class="nav-link-item">
            <RouterLink to="/ai" @click="mobileOpen = false">AI对话</RouterLink>
          </div>
        </div>

        <div class="nav-mobile-actions">
          <!-- Theme & Music toggles -->
          <div class="nav-mobile-toggles">
            <button class="nav-mobile-toggle-btn" @click="toggleTheme(); mobileOpen = false">
              <i :class="theme === 'dark' ? 'bi bi-sun' : 'bi bi-moon'"></i>
              <span>{{ theme === 'dark' ? '亮色模式' : '暗色模式' }}</span>
            </button>
            <button class="nav-mobile-toggle-btn" @click="ttplayer(); mobileOpen = false">
              <i class="bi bi-music-note-beamed"></i>
              <span>显隐歌单</span>
            </button>
          </div>

          <template v-if="login_state">
            <RouterLink to="/v0" class="nav-login-btn" @click="mobileOpen = false">个人中心</RouterLink>
            <div class="nav-user-badge" @click="goToProfile(); mobileOpen = false">
              <img :src="userInfo.icon" alt="" class="nav-avatar" />
              <span class="nav-username">{{ userInfo.nickname }}</span>
            </div>
            <RouterLink to="/upload" class="nav-cta" @click="mobileOpen = false">
              <i class="bi bi-pencil-square"></i> 发帖
            </RouterLink>
            <button class="nav-cta nav-cta-ghost" @click="logout(); mobileOpen = false">
              <i class="bi bi-box-arrow-right"></i> 退出登录
            </button>
          </template>
          <template v-else>
            <RouterLink to="/login" class="nav-login-btn" @click="mobileOpen = false">登录</RouterLink>
          </template>
        </div>
      </div>
    </header>

    <!-- Main content -->
    <main class="main-content">
      <RouterView :apl="ap" />
    </main>

    <!-- Footer -->
    <footer class="site-footer">
      <div class="footer-inner">
        <div class="footer-grid">
          <div class="footer-brand">
            <h3>kloping's blog</h3>
            <p>欢迎访问kloping的博客。本站提供API以及用户上传API、发帖等丰富功能。由若生(kloping)维护。</p>
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
            &copy; 2026&nbsp;
            <a href="//wpa.qq.com/msgrd?v=3&amp;uin=3474006766&amp;site=qq&amp;menu=yes" target="_blank">若生</a>
            &nbsp;/&nbsp;
            <a href="//github.com/kloping" target="_blank">kloping</a>
            &nbsp;·&nbsp;
            <a :href="'//'+host0" target="_blank">{{ host0 }}</a>
          </p>
          <p>
            <a target="_blank" href="https://beian.miit.gov.cn/">皖ICP备2025088299号-1</a>
          </p>
        </div>
      </div>
    </footer>

    <!-- Music player -->
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
let isLoading = ref(true)

// Theme
const theme = ref(localStorage.getItem('blog-theme') || 'light')

function applyTheme(t: string) {
  document.documentElement.setAttribute('data-theme', t)
}

function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  localStorage.setItem('blog-theme', theme.value)
  applyTheme(theme.value)
}

// Mobile
const mobileOpen = ref(false)
const aboutOpen = ref(false)

function goToProfile() {
  const router = useRouter()
  router.push('/v0')
}

service.get("/get-host?url=" + document.location).then(res => {
  host0.value = res.toString()
}).catch(err => {
  console.log(err)
})

service.get("/user/flinks").then(res => {
  arr.value = res
}).catch(err => {
  toast("获取友链失败" + err)
})

let ap: APlayer;

onMounted(async () => {
  // Apply initial theme
  applyTheme(theme.value);

  const router = useRouter();

  router.beforeEach((to, from, next) => {
    isLoading.value = true;
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
    preload: "none"
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
