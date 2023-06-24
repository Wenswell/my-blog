<template>
  <div class="tags-box">
    <div @click="searchAll" class="tag-title center--text">
      <n-icon color="gray" size="1rem" :component="PricetagsOutline" />
      标签
    </div>
    <template v-if="isShowAll">
      <span :style="{ zoom: Math.log10(tag.count + 1) + 0.6 }" @click="onAddTag(tag.name)"
        :class="{ active: localTagSet.has(tag.name) }" class="tag center--text" v-for="tag in getTags">
        {{ tag.name }}
        <span class="tag-count">{{ tag.count }}</span>
      </span>
    </template>

    <template v-if="!isShowAll">
      <span @click="onAddTag(tag.name)" :class="{ active: localTagSet.has(tag.name) }" class="tag center--text"
        v-for="tag in getTags">
        {{ tag.name }}
      </span>
    </template>
  </div>
</template>

<script setup>
import { PricetagsOutline } from "@vicons/ionicons5";
import { useRoute, useRouter } from 'vue-router';

const route = useRoute()
const router = useRouter()
// 绑定至子组件用于搜索
// 转一份 set 方便查找去重
let localTagSet = ref(null)

const { tagsRef, isShowAll } = defineProps({
  tagsRef: { type: Object },
  isShowAll: { type: Boolean, default: false }
})
watchEffect(() => {
  console.log('tagsRef:', tagsRef)
  localTagSet.value = new Set(tagsRef.value)
  if (route.query.tags) localTagSet.value = new Set(route.query.tags.split(','))
  if (tagsRef.value) emit('update:tags-ref', tagsRef.value);
})
const emit = defineEmits(['update:tags-ref', 'search-all'])

const searchAll = () => {
  tagsRef.value = []
  router.push({ query: '' })
  emit('search-all')
}


// 用于展示、点击添加
import { updateQueryParameter } from '@/utils/index'
const getTags = ref([])
const onAddTag = (tag) => {
  const uniqueTags = localTagSet.value
  // 已选中则去除，未选中则添加
  uniqueTags.has(tag) ? uniqueTags.delete(tag) : uniqueTags.add(tag);
  tagsRef.value = [...uniqueTags];
  updateQueryParameter(route, router, 'tags', tagsRef.value.length, tagsRef.value.join(','))
  // loadBlog();
}
const axios = inject('axios')
onMounted(() => {
  // 加载标签
  axios.get('/blog/get_tags').then(result => {
    const randomCount = Math.floor(Math.random() * (10 - 5 + 1)) + 5;
    getTags.value = isShowAll ?
      result.data.result
      : result.data.result
        .sort(() => Math.random() - 0.5)
        .slice(0, randomCount)
    console.log("getTags", getTags)
    if (route.query.tags.length) {
      const tags = route.query.tags.split(',');
      tags.forEach(tag => {
        const tags = route.query.tags.split(',');
        tags.reduce((result, tag) => {
          const index = getTags.value.findIndex(x => x.name === tag);
          if (index === -1) {
            getTags.value.unshift({ name: tag, count: 0 });
          } else {
            getTags.value[index].count += 1;
          }
          return result;
        }, result);
      });
      // getTags.value.push(...route.query.tags.split(','));
    }
  })
})
</script>

<style lang="scss" scoped>
.tags-box {
  margin-bottom: $gap;
  display: block;

  .tag-title {
    height: $gap*2;
    padding-left: $s-gap;
    gap: $s-gap;
    justify-content: normal;
    overflow: hidden;
    position: relative;
    transition: all 50ms transform 200ms;

    @extend .active-effect-enlarge;

    &:hover {
      color: transparent;
    }

    &::after {
      transition-property: all, color;
      transition-duration: 50ms, 150ms;
      content: '点击移除全部标签';
      color: $clr-back-grey;
      position: absolute;
      left: 5rem;
      white-space: nowrap;
      zoom: 0.8;
    }

    &:hover::after {
      color: $clr-text-pri;
      content: '点击移除全部标签 (查看全部)';
      left: 2.5rem;
    }
  }

  .tag {
    padding-inline: calc($s-gap/2) $s-gap ;
    margin-top: $s-gap;
    margin-right: $s-gap;
    display: inline-block;
    @extend .active-effect;
    position: relative;

    &::before {
      content: '#';
      opacity: 0.3;
    }

    &-count {
      font-weight: bold;
      position: absolute;
      right: -2%;
      top: 30%;
      color: $primary-transp-2;
      mix-blend-mode: multiply;

    }
  }
}
</style>