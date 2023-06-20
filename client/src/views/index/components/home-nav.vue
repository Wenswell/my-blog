<template>
  <nav class="nav" :class="{ 'hidden': isNavHidden }">
    <span class="nav-title">
      网站标题 {{ isNavHidden }}s
    </span>
    <div class="nav-right">
      <div class="nav-right-item" @click="router.push(item.href)" v-for="item in topBarItem">
        <n-icon class="nav-right-item-icon" size="1rem" :component="item.icon" />
        {{ item.title }}
      </div>

    </div>
  </nav>
</template>

<script setup>
import { HomeOutline, FilterCircleOutline, PricetagsOutline, ArchiveOutline, WalkOutline, SettingsOutline, } from "@vicons/ionicons5";
import { useRouter } from 'vue-router';
const router = useRouter()
const topBarItem = [
  { title: '主页', icon: HomeOutline, href: '/home' },
  { title: '分类', icon: FilterCircleOutline, href: '/category' },
  { title: '标签', icon: PricetagsOutline, href: '/tag' },
  { title: '归档', icon: ArchiveOutline, href: '/archive' },
  { title: '关于', icon: WalkOutline, href: '/about' },
  { title: '后台', icon: SettingsOutline, href: '/login' },
]

const {isNavHidden} = defineProps({
  isNavHidden: {
    type: Boolean,
    required: true
  }
})

</script>

<style lang="scss" scoped>
// 顶部导航
.nav {
  &.hidden {
    transform: translateY(-100%);
  }

  position: fixed;
  transition:all 300ms;
  z-index: 10;
  width: 100%;
  height: $header-height;
  padding-inline: $gap;
  background: $light;
  font-size: 1rem;

  &-title {
    font-size: $fs--big;
    position: absolute;
  }

  &-right {
    display: flex;
    justify-content: flex-end;
    height: 100%;

    &-item {
      @extend .center--text;
      gap: 2px;
      min-width: 5rem;
      transition: all 350ms ease;
      position: relative;
      z-index: 1;

      &::before {
        content: '';
        position: absolute;
        bottom: 0px;
        left: 0px;
        width: 100%;
        height: 0%;
        background-color: $primary-transp;
        transition: height 0.3s ease;
        z-index: -1;
      }

      &:hover {
        background-color: $primary-transp;
        color: $primary-color;
      }

      &:hover::before {
        height: 100%;
      }

    }
  }


}
</style>