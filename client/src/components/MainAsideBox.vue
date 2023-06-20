<template>
    <main class="center-box">
      <div class="center-main">
        <slot name="main"></slot>
      </div>
      <aside class="center-aside">
        <slot name="aside"></slot>
      </aside>
    </main>
</template>

<style lang="scss" scoped>
.center-box {
  margin-inline: auto;
  width: $main-width;
  display: flex;
  gap: $gap;
  min-height: calc(100vh - #{$gap} - #{$header-height} - #{$footer-height});

  .center-aside {
    flex: 0 0 20em;
    display: flex;
    flex-direction: column;

  }

  .center-main {
    flex: 1;
  }

}
</style>