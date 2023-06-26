<template>
  <div class="home-page">
    <div id="header" ref="nav">
      <HomeNav />
    </div>
    <!-- <div class="home-place-holder"></div> -->
    <router-view></router-view>

  </div>
</template>

<script setup>
import HomeNav from '@/components/HomeNav.vue'
const nav = ref(null);

import { onBeforeRouteUpdate } from 'vue-router'

onBeforeRouteUpdate(() => {
  // window.scrollTo(0, 20)
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


})





</script>

<style lang="scss" scoped>
.scrolled{
  background-color: red;
}


.home-page {
  background: #C9CCD3; 
  background-image: linear-gradient(-180deg, rgba(255,255,255,0.50) 0%, rgba(0,0,0,0.50) 100%); 
  background-blend-mode: lighten;
  margin: 0 auto;
  background-color: $clr-back-grey;
  min-height: 100dvh;
}

// .home-place-holder {
//   height: $header-height + $gap;
// }

</style>