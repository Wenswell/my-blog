<template>
  <main class="main-box">
    <slot></slot>
    <div class="grid-box" v-if="!defalut">
      <div class="center-main">
        <slot name="main"></slot>
      </div>
      <aside class="center-aside">
        <slot name="aside"></slot>
      </aside>
    </div>
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
  max-width: $main-width;
  margin-inline: auto;
  min-height: calc(100vh - #{$footer-height});
  // min-height: calc(100vh - #{$gap} - #{$header-height} - #{$footer-height});
}

.grid-box {
  display: grid;
  grid-template-columns: 1fr 20rem;
  gap: $gap;

  .center-aside {
    display: flex;
    flex-direction: column;

  }

  .center-main {
    width: 100%;
  }

}
</style>