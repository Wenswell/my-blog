<template>
  <!--———— 0. 后台管理 ——————-->
  <div class="dash-board">
    <!--———— 1. 左边栏 菜单 ——————-->
    <aside class="menus">
      <span class="menus-item center--text" v-for="(item, index) in menus" :class="{ active: route.path == item.href }"
        :key="index" @click="toPage(item.href)">{{
          item.name
        }}</span>
    </aside>
    <!--———— 2. 右边 主体 ——————-->
    <div class="page">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
const route = useRoute()
const router = useRouter()

// import AdminStore from '@/store/index'
// const adminStore = AdminStore()

const menus = [
  { name: '文章管理', href: '/dash/article' },
  { name: '分类管理', href: '/dash/category' },
  { name: '退出', href: '/login' },
]

const toPage = (href) => {
  router.push(href)
}


</script>

<style lang="scss" scoped>
.dash-board {
  .page {
    margin-left: 10rem;
    padding: 0 1rem;
  }

  .menus {
    width: 10rem;
    position: fixed;
    height: 100%;
    border-right: 1px solid $light-grey;

    &-item {
      height: 5rem;
      cursor: pointer;
      width: 100%;
      transition: all 350ms, font-weight 50ms;
      border: 3px solid transparent;

      &.active {
        color: $primary-color;
        background-color: $primary-transp;
        border-left-color: $primary-color;
      }

      &:hover {
        font-weight: bold;
      }
    }
  }
}
</style>