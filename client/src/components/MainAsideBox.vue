<template>
  <main class="main-box">
    
    <div class="flex-box" v-if="!defalut">
      <div class="left">
        <slot></slot>
        <slot name="main"></slot>
      </div>
      <aside class="right-top">
        <slot name="top"></slot>
      </aside>
      <aside class="right-bottom">
        <slot name="bottom"></slot>
      </aside>
    </div>

    <footer class="footer">
      BY-NC-SA 3.0 TW
      2010~2023 BLOG ‧ Powered by BLOG
    </footer>
  </main>
</template>

<script setup>
const { defalut } = defineProps({
  defalut: {
    type: Boolean,
    default: false
  }
})

</script>

<style lang="scss" scoped>
.main-box {
  padding-top: $header-height + $gap;
  // max-width: $main-width;
  width: 100%;
  margin-inline: auto;

  // height: calc(100vh - #{$footer-height} );
  overflow: scroll;
  // min-height: calc(100vh - #{$footer-height});
  // min-height: calc(100vh - #{$gap} - #{$header-height} - #{$footer-height});
}

.flex-box {
  min-height: calc(100vh - #{$gap} - #{$mico-gap} - #{$header-height});

  display: flex;
  align-content: flex-start;
  gap: $s-gap;
  margin-inline: auto;
  flex-wrap: wrap;

  .left,
  .right-bottom,
  .right-top {
    width: 100%;
    flex-grow: 1;
    margin-inline: auto;
  }


  .right-top {
    order: -1;
  }

}


@media screen and (min-width:60rem) {
  .flex-box {
    display: grid;
    grid-template-rows: 3rem auto;
    // grid-auto-flow: dense; 
    // grid-auto-rows: minmax(auto, auto);

    justify-content: center;
    column-gap: $gap;

    .left {
      margin-bottom: $gap;
      width: 45rem;
      grid-column: 1 / 2;
      grid-row: 1 / -1;
    }

    .right-top {
      max-width: 15rem;

      grid-column: 2 / 3;
      grid-row: 1 / 2;
    }

    .right-bottom {
      max-width: 15rem;

      grid-column: 2 / 3;
      grid-row: 2 / -1;

    }
  }
}


.footer {
  height: $footer-height;
  background-color: $clr-back;
}
</style>