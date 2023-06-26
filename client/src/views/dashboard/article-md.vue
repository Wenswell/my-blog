<template>
  <div class="md-page">
    <div class="info" v-text="topInfo">

    </div>

    <div class="top">
      <div class="top-left">
        <n-input class="top-title" v-model:value="addArticle.title" placeholder="标题" />
        <n-input v-model:value="addArticle.description" type="textarea" :maxlength="200" show-count
          placeholder="文章描述，不要太长" />
      </div>
      <div class="top-right">
        <n-select class="top-category" v-model:value="addArticle.categoryId" :options="categoryOptions"
          placeholder="选择分类" />

        <TagSelect class="selector" :updateOriginTag="updateArticle.tags" v-model:valueModel="addArticle.tags" />

        <n-button type="primary" :disabled="!addArticle.title.length" class="top-btn" @click="onAdd">提交</n-button>
      </div>
    </div>

    <md-editor class="editor" v-model="addArticle.content" @onChange="onChange" @onUploadImg="onUploadImg"
      @onSave="onSave" />
  </div>
</template>

<script setup>
import { MdEditor } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import TagSelect from "@/components/TagSelect.vue";
import api from "@/api";
const message = inject('message')

const emit = defineEmits(['load-blog', 'change-tab'])
const { updateArticle } = defineProps({
  updateArticle: {
    type: Object,
    required: true
  }
})

let addArticle = reactive({
  id: 0,
  title: '',
  categoryId: undefined,
  tags: '',
  content: '## 二级标题',
  description: '',
})

// 任何更改
let timeoutId = null;
const onChange = (val) => {
  console.log("val", val);
  // 如果已经有一个定时器在计时，则重置它
  if (timeoutId) clearTimeout(timeoutId);

  // 设置一个新的定时器，在 3 秒后执行操作
  timeoutId = setTimeout(() => {
    console.log("操作执行了");
    onSave(addArticle.content)
    // 在这里执行所需的操作
    timeoutId = null;
  }, 3000);
};

// 点击保存
const onSave = (v, h) => {
  console.log(v);
  message.success('保存')
  if (h) {

    h.then((html) => {
      console.log(html);
    });
  }
}
// 上传图片
const onUploadImg = async (files, callback) => {
  const res = await Promise.all(
    files.map((file) => {
      return new Promise((rev, rej) => {
        const form = new FormData();
        form.append('file', file);
        api.uploadImg({ form })
          .then((res) => rev(res))
          .catch((error) => rej(error));
      });
    })
  );
  callback(res.map((item) => {
    if (item.code != 200) {
      message.warning(item.msg)
      return ''
    } else {
      message.success('图片上传成功')
      return `${api.baseURL}${item?.data[0]}`
    }
  }));
};


// 删除已经上传的文章内容
const resetInput = () => {
  addArticle.id = 0
  addArticle.title = ''
  addArticle.categoryId = undefined
  addArticle.tags = ''
  addArticle.content = '## 二级标题'
  addArticle.description = ''
  emit('load-blog')
  emit('change-tab', 'list')
}


const onAdd = async () => {
  try {
    if (Boolean(addArticle.id)) {
      const { id, title, categoryId, content, description, ...rest } = addArticle
      const sendUpdatedBlog = { id, title, categoryId, content, description }

      const result = await api.blogUpdate(sendUpdatedBlog)
      if (result.code === 200) {
        message.success(`文章 [ ${addArticle.title} ] ${result.msg}`)
        resetInput()
      } else {
        message.error(result.msg)
      }
    } else {
      const { id, ...rest } = addArticle;
      const result = await api.blogAdd({ ...rest })

      if (result.code === 200) {
        message.success(`文章 [ ${addArticle.title} ] ${result.msg}`)
        resetInput()
      } else {
        message.error(result.msg)
      }
    }

  } catch (error) {
    console.log("error", error)
    message.error(error.response.data.msg)
  }
}

// 加载分类
const categoryOptions = ref([])
const loadCategory = async () => {
  const result = await api.categoryGet()
  categoryOptions.value = result.result.map(item => {
    return {
      label: item.type,
      value: item.id
    };
  });
}

let topInfo = ref('')
onMounted(() => {
  loadCategory()
  // 如果ID不是默认的0说明是修改文章
  if (Boolean(updateArticle?.id)) {
    // console.log("updateArticle?.id", updateArticle?.id)
    // console.log("addArticle?.id", addArticle?.id)
    // console.log("updateArticle", updateArticle)
    // console.log("addArticle", addArticle)
    if (updateArticle?.id !== addArticle.id) topInfo.value = `修改文章 [ ${updateArticle.title} ]`
    // addArticle = { ...addArticle, ...updateArticle }
    Object.assign(addArticle, updateArticle)
    addArticle.categoryId = updateArticle.category_id
    // console.log("addArticle", addArticle)
  } else topInfo.value = `新增文章`

})
</script>
<style lang="scss" scoped>
.top {
  display: flex;
  gap: $gap;
  margin-block: $gap;

  >* {
    display: flex;
    gap: $gap;

    flex: 1;
    flex-direction: column;
  }

}
</style>
