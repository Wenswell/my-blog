<template>
  <n-form>
    <div class="top grid--margin">
      <n-input class="top-title" v-model:value="addArticle.title" placeholder="标题" />
      <n-select class="top-category" v-model:value="addArticle.categoryId" :options="categoryOptions"
        placeholder="选择分类" />
      <n-button type="primary" :disabled="!addArticle.title.length" class="top-btn" @click="onAdd">提交</n-button>
    </div>
    <n-form-item label="内容">
      <RichTextEditorVue v-model:valueModel="addArticle.content" />
    </n-form-item>
  </n-form>
</template>

<script setup>
import { reactive } from 'vue';
import RichTextEditorVue from "@/components/RichTextEditor.vue";


const addArticle = reactive({
  categoryId: undefined,
  title: '',
  content: '',
})

const axios = inject('axios')
const message = inject('message')
const emit = defineEmits(['load-blog', 'change-tab'])

const onAdd = async () => {
  try {
    const result = await axios.post('/blog/_token/add', addArticle)
    // console.log("addArticle", addArticle)
    if (result.data.code === 200) {
      message.success(`文章 [ ${addArticle.title} ] ${result.data.msg}`)
      addArticle.categoryId = undefined
      addArticle.title = ''
      addArticle.content = ''
      emit('load-blog')
      emit('change-tab', 'list')
    } else {
      message.error(result.data.msg)
    }
  } catch (error) {
    console.log("error", error)
    message.error(error.response.data.msg)
  }
}


const categoryOptions = ref([])
const loadCategory = async () => {
  const result = await axios.get('/category/get')
  categoryOptions.value = result.data.result.map(item => {
    return {
      label: item.type,
      value: item.id
    };
  });
}
onMounted(() => {
  loadCategory()
})
</script>

<style lang="scss" scoped>
.top {
  grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
  margin: $gap 0;

  &-title {
    grid-column: 1 / span 3;
  }

}
</style>