<template>
  <div>
    RichTextEditor.vue - my-blog - Visual Studio Code [管理员]
    <!-- {{ props }} -->
    <div style="border: 1px solid #ccc">
      <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" />
      <Editor style="height: 500px; overflow-y: hidden;" v-model="valueHtml" :defaultConfig="editorConfig" :mode="mode"
        @onCreated="handleCreated" @onChange="handleChange" />
    </div>
  </div>
</template>

<script setup>
import { inject, onBeforeUnmount, onMounted, onUpdated, ref, shallowRef } from "vue"
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css' // 引入 css

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()

const toolbarConfig = { excludeKeys: ['uploadVideo'] }

const editorConfig = { placeholder: '请输入内容...' }
// 配置图片上传功能 https://www.wangeditor.com/v5/menu-config.html#基本配置
const serverURL = inject('serverURL')
const kb = 1024
editorConfig.MENU_CONF = {}
editorConfig.MENU_CONF['uploadImage'] = {
  server: serverURL + 'rich_editor_upload',
  // 单个文件的最大体积限制，默认为 2M
  maxFileSize: 1 * 1024 * kb, // 1M
  // 最多可上传几个文件，默认为 100
  maxNumberOfFiles: 10,
  // 小于该值就插入 base64 格式（而不上传），默认为 0
  base64LimitSize: 10 * kb // 10kb

}
editorConfig.MENU_CONF['insertImage'] = {
  parseImageSrc: (src) => {
    console.log("src", src)
    // 拼接URL片段成完整的地址
    if (src.includes('http') || src.startsWith('data:image')) {
      return src;
    } else {
      return `${serverURL}${src}`;
    }
  }
}

const mode = ref('default') // 或 'simple'

// 内容 HTML
const valueHtml = ref()

const handleCreated = (editor) => {
  editorRef.value = editor // 记录 editor 实例，重要！
}

const props = defineProps({
  valueModel: {
    type: String,
    default: '',
  }
})

const emit = defineEmits(['update:value-model'])

const handleChange = (editor) => {
  emit('update:value-model', valueHtml.value)
  console.log("valueHtml.value", valueHtml.value)
}

onMounted(() => {
  console.log("onMounted RichTextEditor.vue")
  // 默认展示父组件中的初始值
  const initialContent = props.valueModel
  console.log("props", props)
  setTimeout(() => {
    valueHtml.value = initialContent
  });
});

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})
</script>

<style lang="scss" scoped></style>