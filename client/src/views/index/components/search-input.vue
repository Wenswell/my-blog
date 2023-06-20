<template>
  <n-input v-model:value="keyword" @keyup.enter="toSearch" class="search-input" placeholder="搜索">
    <template #suffix>
      <n-icon class="search-icon" @click="toSearch" :component="Search" />
    </template>
  </n-input>
</template>

<script setup>
import { Search } from "@vicons/ionicons5";
const message = inject('message')
const emit = defineEmits(['search-keyword'])

let keyword = ref('')
let loading = ref(false)
let timer = null
const toSearch = () => {
  if (!keyword.value) message.info('全部内容')
  if (timer) return
  loading.value = true
  emit('search-keyword', keyword)
  timer = setTimeout(async () => {
    // 这里是需要节流的代码
    loading.value = false
    timer = null
  }, 500)
}
</script>

<style lang="scss" scoped>
.search-input {
  width: 100%;

  .search-icon {
    cursor: pointer;
  }
}
</style>