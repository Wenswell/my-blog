<template>
  <div>
    <n-dynamic-tags v-model:value="tagsRef">
      <template #input="{ submit, deactivate }">
        <n-auto-complete ref="autoCompleteInstRef" v-model:value="inputValueRef" :options="autoOptions" placeholder="标签"
          size="small" :clear-after-select="true" :get-show="() => true" @select="submit($event)" @blur="deactivate" />
      </template>
      <template #trigger="{ activate, disabled }">
        <n-button size="small" type="primary" dashed :disabled="disabled" @click="activate()">
          <template #icon>
            ➕
          </template>
          标签
        </n-button>
      </template>
    </n-dynamic-tags>
    tagSet{{ tagSet }}
  </div>
</template>

<script setup>
import { ref, watch, nextTick, reactive, computed } from "vue";

// 选中的标签列表
const tagsRef = ref([]);


// 父组件接收的标签列表
const {valueModel} = defineProps({
  valueModel: {default: ''}
})
// 同步 选中的标签列表 至 父组件
const emit = defineEmits(['update:value-model'])
watchEffect(() => {
  emit('update:value-model', JSON.stringify(tagsRef.value));
});

// 标签列表
const getTags = ref([])

// auto-complete 输入框自动显示后 1. 获取焦点; 2. 默认显示全部标签
const autoCompleteInstRef = ref(null);
watch(autoCompleteInstRef, (value) => {
  if (value)
    nextTick(() => {

      const filtergetTags = getTags.value.filter(item =>{
        return !tagSet.value.has(item)
      })

      autoOptions = filtergetTags

      value.focus()
    });
});


// 转一份 set 方便查找去重
const tagSet = computed(() => {
  return new Set(tagsRef.value)
})

// auto-complete 输入框的值
let inputValueRef = ref("");
// auto-complete 输入框的弹窗选项
let autoOptions = reactive([])
// 更新输入框的值
watchEffect(() => {
  // 过滤出输入值匹配到的标签
  const filteredArrOrgin = getTags.value.filter(item => {
    return item.includes(inputValueRef.value)
  })

  const filteredArr=filteredArrOrgin.filter(item=>{
    return !tagSet.value.has(item)
  })


  // 没有匹配标签的时候将输入值作为标签
  if (!filteredArr.length&&!tagSet.value.has(inputValueRef.value)) filteredArr.unshift(inputValueRef.value)
  // 更新下拉框选项
  autoOptions = filteredArr
});


// 加载标签
const axios = inject('axios')
const loadTags = async () => {
  const result = await axios.get('/blog/get_tags')
  getTags.value = result.data.result
}
onMounted(() => {
  loadTags()
  console.log("valueModel", valueModel)
})
</script>

<style lang="scss" scoped></style>