<template>
  <div class="dash-board">
    <!-- adminStore.id: {{ adminStore.id }} -->
    <!-- adminStore.account: {{ adminStore.account }} -->
    <div class="menus">
      <span class="menus-item" v-for="(item, index) in menus" :key="index" @click="toPage(item.href)">{{ item.name
      }}</span>
    </div>
    <div class="main">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import AdminStore from '@/store/index'
import { useRouter } from 'vue-router';
const router = useRouter()

const adminStore = AdminStore()
const menus = [
  { name: '文章管理', href: '/dash/article' },
  { name: '分类管理', href: '/dash/category' },
  { name: '退出', href: 'logout' },
]

const toPage = (href) => {
  router.push(href)
}


</script>

<style lang="scss" scoped>
.dash-board {
  display: flex;
  height: 100vh;

  .menus {
    flex: 0 0 10rem;
    display: flex;
    border-right: 1px solid #333;
    flex-direction: column;
    align-items: center;

    .menus-item {
      height: 5rem;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;

      &:hover {
        border: 1px solid #333;
      }
    }
  }
}
</style>