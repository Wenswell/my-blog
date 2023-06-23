<template>
  <div class="home-page">
    <div ref="nav">
      <HomeNav v-model:is-nav-hidden="isNavHidden" class="top-bar" />
    </div>
    <!-- <div class="home-place-holder"></div> -->

    <router-view></router-view>

    <footer class="footer">
      BY-NC-SA 3.0 TW
      2010~2023 BLOG ‧ Powered by BLOG
    </footer>
  </div>
</template>

<script setup>
import HomeNav from '@/components/home-nav.vue'
const nav = ref(null);
const lastScrollTop = ref(0);
const isNavHidden = ref(false);

onMounted(() => {
  window.addEventListener('scroll', () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > lastScrollTop.value && scrollTop > nav.value.offsetHeight) {
      isNavHidden.value = true;
    } else {
      isNavHidden.value = false;
    }
    lastScrollTop.value = scrollTop <= 0 ? 0 : scrollTop;
  }, false);
})





</script>

<style lang="scss" scoped>
.home-page {
  margin: 0 auto;
  background-color: $clr-back-grey;
  min-height: 100svh;
}

.home-place-holder {
  height: $header-height + $gap;
}

.top-bar {}

.footer {
  height: $footer-height;
  background-color: $clr-back;
}
</style>