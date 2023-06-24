<template>
  <div class="home-page">
    <HomeNav v-model:is-nav-hidden="isNavHidden" class="top-bar" />
    <div class="home-place-holder"></div>

    <router-view></router-view>

    <footer class="footer">
      BY-NC-SA 3.0 TW
      2010~2023 BLOG ‧ Powered by BLOG
    </footer>
  </div>
</template>

<script setup>
import HomeNav from './components/home-nav.vue'

// if (page == pageInfo.page || page > pageInfo.pageCount || page <= 0) return
//   window.scrollTo({
//     top: 0,
//     behavior: 'auto'
//   })
</script>

<style lang="scss" scoped>
.home-page {
  margin: 0 auto;
  background-color: $light-grey;
  min-height: 100svh;
}

.home-place-holder {
  height: $header-height + $gap;
}

.top-bar {}

.footer {
  height: $footer-height;
  background-color: $light;
}
</style>