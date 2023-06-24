<template>
  <n-input :loading="loading" clearable @clear="searchAll" v-model:value="keyword" @keyup.enter="toSearch"
    class="search-input" placeholder="按下回车键搜索">
    <template #suffix>
      <n-icon :class="{ hidding: loading }" class="search-icon" @click="toSearch" :component="Search" />
    </template>
  </n-input>
</template>

<script setup>
import { Search } from "@vicons/ionicons5";
import { onMounted, ref } from "vue";
// const message = inject('message')

// 同步 关键词 至 父组件
const { valueModel } = defineProps({
  valueModel: { type: String }
})



const clearKeyword = () => {
  keyword.value = null
}
defineExpose({
  clearKeyword
})
const emit = defineEmits(['update:value-model', 'search-keyword'])
let keyword = ref(null)
// watchEffect(() => {
//   emit('update:value-model', keyword.value);
// });
import { useRoute, useRouter } from 'vue-router';
const route = useRoute()
const router = useRouter()
onMounted(() => {
  if (route.query.keyword) keyword.value = route.query.keyword
})
import { updateQueryParameter } from '@/utils/index'
const searchAll = () => {
  // console.log("clearKeyword", clearKeyword)
  emit('update:value-model', '');
  updateQueryParameter(route, router, 'keyword', '', '')
  // clearKeyword()
  // emit('update:value-model', keyword.value);
}
let loading = ref(false)
let timer = null
const toSearch = () => {
  // if (!keyword.value) message.info('全部内容')
  if (timer) return
  loading.value = true
  updateQueryParameter(route, router, 'keyword', keyword.value, keyword.value)
  emit('update:value-model', keyword.value);
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
    z-index: 2;
    margin-right: -15px;
    padding-right: 5px 10px;
    transition: all 300ms;

    &.hidding {
      zoom: 0.1;
      opacity: 0.1;
    }

    &:hover {
      color: $primary-color;
    }
  }
}
</style>