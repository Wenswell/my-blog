<template>
  <div class="dash-board">
    <!-- adminStore.id: {{ adminStore.id }} -->
    <!-- adminStore.account: {{ adminStore.account }} -->
    <aside class="menus">
      <span class="menus-item" v-for="(item, index) in menus" :key="index" @click="toPage(item.href)">{{ item.name
      }}</span>
    </aside>
    <div class="page">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
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
  .page{
    margin-left: 10rem;
    padding: 0 1rem;
  }
  .menus {
    width: 10rem;
    position: fixed;
    height: 100%;
    border-right: 1px solid #333;

    .menus-item {
      height: 5rem;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      transition: 300ms;

      &:hover {
        font-weight: bold;
        background-color: antiquewhite;
      }
    }
  }
}
</style>