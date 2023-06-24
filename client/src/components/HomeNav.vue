<template>
  <header class="header" :class="{ 'hidden': isNavHidden }">
    <div class="header-title">
      my-blog {{ isNavHidden }}
    </div>
    <input type="checkbox" id="nav-toggle" class="nav-toggle">
    <nav class="header-nav">
      <ul>
        <button :class="{ active: item.name == route.name }" class="nav-item center--text" @click="toPage(item)"
          v-for="item in topBarItem">
          <n-icon class="nav-item-icon" size="1rem" :component="item.icon" />
          {{ item.title }}
        </button>
      </ul>
    </nav>
    <label for="nav-toggle" class="nav-toggle-label">
      <n-icon class="nav-item-icon" size="2rem" :component="Menu" />
    </label>
  </header>
</template>

<script setup>
import { Menu, HomeOutline, FilterCircleOutline, PricetagsOutline, ArchiveOutline, WalkOutline, SettingsOutline, } from "@vicons/ionicons5";
import { useRoute, useRouter } from 'vue-router';
const route = useRoute()
const router = useRouter()
const topBarItem = [
  { title: '主页', icon: HomeOutline, href: '/home', name: 'home', },
  { title: '分类', icon: FilterCircleOutline, href: '/category', name: 'category', },
  { title: '标签', icon: PricetagsOutline, href: '/tags', name: 'tags', },
  // { title: '归档', icon: ArchiveOutline, href: '/archive',name:'archive', },
  { title: '关于', icon: WalkOutline, href: '/about', name: 'about', },
  { title: '后台', icon: SettingsOutline, href: '/login', name: 'login', },
]

const toPage = (item) => {
  item.name == route.name ? '' : router.push(item.href)
}

const { isNavHidden } = defineProps({
  isNavHidden: {
    type: Boolean,
    required: true
  }
})

</script>

<style lang="scss" scoped>
.header {
  &.hidden {
    // transform: translateY(-100%);
  }

  background-color: $clr-back;
  position: fixed;
  z-index: 10;
  width: 100%;
  text-align: center;
  transition: all 300ms;
  height: $header-height;
  // padding-inline: $gap;
}

.header-title {
  font-size: $fs-large;
  height: 100%;
  line-height: $header-height;

}

.header-nav {
  background-color: $clr-back;
  width: 100%;
  position: absolute;
  top: 100%;
  left: 0;
  transform: scale(1, 0);
  transform-origin: top;
  transition: transform 200ms ease-in-out;

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .nav-item {
    // @extend .active-effect;
    width: 100%;
    justify-content: flex-start;
    padding-left: $gap;
    padding-block: $s-gap;
    opacity: 0;
    transition: opacity 100ms ease-in-out;
    font-size: 1rem;
    gap: $s-gap;

    &.active {
      background-color: $primary-color;
      color: $clr-back;
      transform: scale(1);
    }
  }
}

.nav-toggle {
  display: none;

  &:checked~.header-nav {
    display: block;
    transform: scale(1, 1);

    .nav-item {
      opacity: 1;
      transition: opacity 150ms ease-in-out 50ms;
    }

  }
}

.nav-toggle-label {
  position: absolute;
  top: 0;
  left: 0;
  margin-left: $gap;
  height: 100%;
  @extend .center--text;
}

@media screen and (min-width: 60rem) {
  .nav-toggle-label {
    display: none;
  }

  .header {
    display: grid;
    grid-template-columns: 1fr auto minmax(30rem, 5fr) 1fr;
  }

  .header-title {
    grid-column: 2 / span 1;
  }

  .header-nav {
    all: unset;
    grid-column: 3 / 4;
    display: flex;
    justify-content: flex-end;

    .nav-item {
      opacity: 1;
      padding-inline: 2vw;
      position: relative;

      &::before {
        content: '';
        position: absolute;
        bottom: 0px;
        left: 0px;
        width: 100%;
        height: 0%;
        background-color: $primary-transp-0;
        transition: height 0.3s cubic-bezier(0, 0.5, 0.5, 1);
        z-index: -1;
      }

      &:hover {
        background-color: $primary-transp-0;
        color: $primary-color;
      }

      &:hover::before {
        height: 100%;
      }

      &.active {
        cursor: auto;

        &:hover {
          background-color: $primary-color;
          color: $clr-back;

        }
      }

    }

    ul {
      display: flex;
    }
  }
}
</style>