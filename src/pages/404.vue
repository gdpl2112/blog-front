<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  text-align: center;
}

.not-found h1 {
  font-size: 6rem;
  font-weight: 800;
  letter-spacing: -0.04em;
  margin: 0;
  background: linear-gradient(135deg, var(--color-accent), #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}

.not-found p {
  font-size: 1.1rem;
  color: var(--color-text-secondary);
  margin: var(--space-4) 0 var(--space-8);
}
</style>

<template>
  <div class="not-found">
    <h1>404</h1>
    <p>你找的页面走丢了~</p>
    <router-link to="/" class="btn-modern btn-modern-primary">回到首页</router-link>
  </div>
</template>
