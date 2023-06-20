<template>
  <nav class="nav grid--margin">
    <div class="nav-left">
      <span @click="router.push(item.href)" class="nav-left-item" v-for="item in topBarItem" v-text="item.title"></span>

    </div>
    <div class="nav-right">
      <n-input :class="{ hidden: hiddenSearch }" class="nav-right-search-bar" @keyup.enter="toSearch"
        v-model:value="keyword" type="text" placeholder="输入关键词" />
      <n-button :loading="loading" class="nav-right-search-btn" @click="toSearch">
        <template #icon>
          <n-icon size="1rem" :component="Search" />
        </template>
        搜索
      </n-button>
    </div>
  </nav>
</template>

<script setup>

const message = inject('message')
import { Search } from "@vicons/ionicons5";
import { useRouter } from 'vue-router';
const router = useRouter()

const topBarItem = reactive([
  { title: '主页', href: '/home' },
  { title: '分类', href: '/category' },
  { title: '标签', href: '/tag' },
  { title: '归档', href: '/archive' },
  { title: '关于', href: '/about' },
  { title: '后台', href: '/login' },
])

const emit = defineEmits(['search-keyword'])
// 搜索文章
let keyword = ref('')
let hiddenSearch = ref(true)
let loading = ref(false)
let timer = null
const toSearch = () => {
  if (hiddenSearch.value) {
    hiddenSearch.value = false
    return
  }
  if (!keyword.value) {
    message.info('空白搜不了')
    return
  }
  if (timer) return
  loading.value = true
  emit('search-keyword', 12)
  timer = setTimeout(async () => {
    // 这里是需要节流的代码
    loading.value = false
    timer = null
  }, 500)
}

</script>

<style lang="scss" scoped>
// 顶部导航
.nav {
  max-height: 10rem;
  grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));

  &-left {
    display: flex;
    max-width: 20rem;
    justify-content: space-around;

    &-item {
      @extend .center--text;
      flex: 1;
      transition: all 300ms;
      padding-bottom: 0;
      border-bottom: 1px solid transparent;

      &:hover {
        color: $primary-color;
        padding-bottom: 0.1rem;
        border-color: $primary-color ;
      }
    }
  }

  &-right {
    display: flex;
    gap: $gap;
    justify-content: flex-end;

    &-search-bar {
      width: 100%;
      transition: all 200ms;

      &.hidden {
        // outline: solid;
        width: 0;
        opacity: 0;
        // border-color:transparent;
      }

      // grid-column: 0/-1; 


    }
  }

}
</style>