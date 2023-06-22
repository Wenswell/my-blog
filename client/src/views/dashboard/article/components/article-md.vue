<template>
  <div class="test" style="position: fixed; right: 1rem;top: 1rem;background-color:antiquewhite;">
    article-md.vue - my-blog - Visual Studio Code [管理员]addArticle.tags{{ addArticle.tags }}
    <br>
    updateArticle{{ updateArticle.tags }}
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

      <TagSelect class="selector" v-model:valueModel="addArticle.tags" />
      
      <n-button type="primary" :disabled="!addArticle.title.length" class="top-btn" @click="onAdd">提交</n-button>
    </div>
  </div>

  <md-editor class="editor" v-model="addArticle.content" @onChange="onChange" @onUploadImg="onUploadImg"
    @onSave="onSave" />
</template>

<script setup>
import { MdEditor } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import TagSelect from "@/components/TagSelect.vue";
const message = inject('message')


const emit = defineEmits(['load-blog', 'change-tab'])
const { updateArticle } = defineProps({
  updateArticle: {
    type: Object,
    required: true
  }
})

let addArticle = reactive({
  title: '',
  categoryId: undefined,
  tags: '',
  content: '## 二级标题',
  description:'',
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
const axios = inject('axios')
const onUploadImg = async (files, callback) => {
  const res = await Promise.all(
    files.map((file) => {
      return new Promise((rev, rej) => {
        const form = new FormData();
        form.append('file', file);

        axios
          .post('/_token/upload', form, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          .then((res) => rev(res))
          .catch((error) => rej(error));
      });
    })
  );
  callback(res.map((item) => {
    if (item.data.code != 200) {
      message.warning(item.data.msg)
      return ''
    } else {
      message.success('图片上传成功')
      return `${axios.defaults.baseURL}${item?.data?.data[0]}`
    }
  }));
};



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

// 加载分类
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
  if(updateArticle?.tags){
    const stringTag = updateArticle.tags
    const JSONtoArray = JSON.parse(stringTag)
    addArticle = updateArticle
    addArticle.tags = JSONtoArray
  }
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
