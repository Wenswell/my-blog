<template>
  <div class="box-blog">
    <!--———— 1.2 文章卡片列表 ——————-->
    <button class="blog plain" :style="{ cursor: (editModel ? 'default' : 'pointer') }" @click="toDetail(blog.id)"
      v-for="(blog, index) in blogList">

      <!--———— 1.2.1 文章 标题 ——————-->
      <div class="blog-top-title" v-text="blog.title" />
      <div class="blog-up">
        <!--———— 1.2.2 文章 分类 ——————-->
        <!-- <span class="blog-up-category" v-text="blog.type" /> -->
        <span class="blog-up-category">
          <n-icon class="icon" size="1rem" :component="FolderOpenOutline" />
          <span @click.stop="toTagOrCate('category', blog.category_id)" class="item-text" v-text="blog.type" />
        </span>
        <!-- <span style="opacity: 0.5;" v-if="!blog.type">法外之徒</span> -->
        <!--———— 1.2.3 文章 tags ——————-->
        <span class="blog-up-tags" v-if="blog.tags.length">
          <n-icon class="icon" size="1rem" :component="PricetagsOutline" />
          <span @click.stop="toTagOrCate('tags', item)" class="tags-item item-text" v-for="item in blog.tags"
            v-text="item" />
        </span>
      </div>
      <!--———— 1.2.4 文章 desc ——————-->
      <div class="blog-desc" v-text="blog.description" />
      <!--———— 1.2.5 文章 发布时间 ——————-->
      <div class="blog-time">
        {{ formatTimestamp(blog.create_time) }}
        <!--———— 1.2.6 文章 修改时间 ——————-->
        <span v-if="blog.last_edit_time" class="blog-time-edit">
          ( updated {{ formatTimestamp(blog.last_edit_time) }} )
        </span>
        <br>
      </div>

      <template v-if="editModel">
        <n-button @click="toUpdate(blog.id)" tertiary type="info">修改</n-button>
        <n-button @click="onDelete(blog.id, blog.title)" tertiary type="error">删除</n-button>
      </template>
    </button>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { FolderOpenOutline, PricetagsOutline } from "@vicons/ionicons5";
import { useRoute, useRouter } from 'vue-router';
const message = inject('message')
const route = useRoute()
const router = useRouter()

// 格式化显示时间
const dayjs = inject("dayjs")
const formatTimestamp = (timestamp) => {
  const now = dayjs();
  const date = dayjs(timestamp);
  const formatString = now.year() === date.year() ? 'MMM D' : 'YY年M月D日';
  return date.format(formatString);
}

const { editModel } = defineProps({
  blogList: {
    type: Object,
    required: true
  },
  tabValue: {
    type: String,
  },
  editModel: {
    type: Boolean,
    default: false
  }
})

onMounted(() => {
  // message.success(1)
  if (editModel) {
    toDetail = () => { }
  }
})

let isTagsTwice = false
let isCategoryTwice = false
const toTagOrCate = (page, params) => {

  if (page == 'tags') {
    if (isTagsTwice == params) {
      router.push({ name: 'tags', query: { tags: params } })
    } else if (isTagsTwice != params) {
      message.info('再点一次', { duration: 850 })
      isTagsTwice = params
      isCategoryTwice = false
    }
  }

  if (page == 'category') {
    if (isCategoryTwice == params) {
      router.push({ name: 'category', params: { type: params } })
    } else if (isCategoryTwice != params) {
      message.info('再点一次', { duration: 850 })
      isCategoryTwice = params
      isTagsTwice = false
    }
  }

}

let toDetail = (id) => {
  router.push(`/detail/${id}`)
}

// 前往更新页面
const emit = defineEmits(['load-blog', 'change-tab', 'update-article'])
const toUpdate = (id) => {
  emit('update-article', id)
}


// 删除文章
const dialog = inject('dialog')
const onDelete = async (id, title) => {
  dialog.warning({
    title: "警告",
    content: `是否删除文章 [ ${title} ]`,
    positiveText: "删除",
    negativeText: "取消",
    onPositiveClick: async () => {
      const result = await axios.delete(`/blog/_token/delete?id=${id}`)
      if (result.data.code === 200) {
        message.success(`文章 [ ${title} ] ${result.data.msg}`)
        emit('load-blog')
      } else {
        message.error(result.data.msg)
      }
    },
    onNegativeClick: () => { }
  });
}
</script>

<style lang="scss" scoped>
// 博客列表容器
.box-blog {
  display: flex;
  flex-direction: column;
  gap: $gap;
}

// 博客列表卡片s
.blog {
  display: flex;
  flex-direction: column;
  text-align: start;
  gap: $s-gap;
  padding: $s-gap;
  color: $clr-text-pri;
  background-color: $clr-back;
  border: $mico-gap solid transparent;
  transition: all 300ms;

  &:hover {
    border: $mico-gap solid $primary-color;
  }

  // 卡片 博客标题
  &-top-title {
    font-size: $fs-big;
    line-height: $fs-large;
    word-break: break-all;
  }

  // 卡片 博客分类、tag
  &-up {
    display: flex;
    z-index: 2;

    // 卡片 博客分类
    &-category {
      display: flex;
      align-items: center;

      .item-text {
        white-space: nowrap
      }
    }

    // 卡片 博客tags
    &-tags {
      display: flex;
      align-items: center;
      margin-inline: $s-gap;
      flex-wrap: wrap;

      .tags-item {
        margin-right: $s-gap;

        &::before {
          content: '#';
          opacity: 0.5;
        }
      }
    }

    .item-text:hover {
      color: $primary-color;
      text-decoration: underline $primary-color solid;
    }

    .icon {
      margin-right: $mico-gap;
    }

  }

  &-desc {
    color: $clr-text-sec;
  }

}
</style>