<template>
  <div class="home-page">
    <div id="header" ref="nav">
      <HomeNav v-model:is-nav-hidden="isNavHidden" class="top-bar" />
    </div>
    <!-- <div class="home-place-holder"></div> -->
    <router-view></router-view>

  </div>
</template>

<script setup>
import HomeNav from '@/components/HomeNav.vue'
const nav = ref(null);
const lastScrollTop = ref(0);
const isNavHidden = ref(false);

import { onBeforeRouteUpdate } from 'vue-router'

onBeforeRouteUpdate(() => {
  window.scrollTo(0, 20)
})


onMounted(() => {

  const options = {
    // root:null,
    threshold:0,
    rootMargin: "50px"
  }
  
  const header = document.querySelector('#header')
  console.log("header", header)
  
  const sectionOneObserver = new IntersectionObserver((entries,sectionOneObserver)=>{
    entries.forEach(entry =>{
      if(entry.isIntersecting){
        console.log("isIntersecting entry", entry)
      } else{
        // header.classList.add('scrolled')
        console.log("!entry", entry)
  
      }
  
    })
  },options)
  sectionOneObserver.observe(header)


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
.scrolled{
  background-color: red;

}


.home-page {
  margin: 0 auto;
  background-color: $clr-back-grey;
  min-height: 100dvh;
}

.home-place-holder {
  height: $header-height + $gap;
}

.top-bar {}
</style>