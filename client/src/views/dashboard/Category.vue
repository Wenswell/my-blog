<template>
  <div>
    {{ adminStore }}
    <n-button @click="showAddModal = true">添加分类</n-button>
    <n-table class="table" :bordered="false" :single-line="false">
      <thead>
        <tr>
          <th>编号</th>
          <th>名称</th>
          <th>修改</th>
          <th>删除</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(category, index) in categoryList" :key="index">
          <td>{{ category.id }}</td>
          <td>{{ category.type }}</td>
          <td><n-button @click="toUpdate(category)">修改</n-button></td>
          <td><n-button @click="onDelete(category)">删除</n-button></td>
        </tr>
      </tbody>
    </n-table>

    <n-modal v-model:show="showAddModal" preset="dialog" title="Dialog">
      <template #header>
        <span>添加分类</span>
      </template>
      <n-input v-model:value="addCategory.type" placeholder="输入分类名称" />
      <template #action>
        <n-button @click="onAdd">提交</n-button>
      </template>
    </n-modal>

    <n-modal v-model:show="showUpdateModal" preset="dialog" title="Dialog">
      <template #header>
        <span>修改分类</span>
      </template>
      <n-input v-model:value="updateCategory.type" placeholder="输入分类名称" />
      <template #action>
        <n-button @click="onUpdate">提交</n-button>
      </template>
    </n-modal>

  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
const message = inject('message')

import {AdminStore} from '@/store/index'
import api from "@/api";
const adminStore = AdminStore()

const showAddModal = ref(false)
const showUpdateModal = ref(false)
const categoryList = ref([])
const addCategory = reactive({
  type: '',
})
const updateCategory = reactive({
  id: '',
  type: '',
})

const toUpdate = async (category) => {
  showUpdateModal.value = true
  updateCategory.id = category.id
  updateCategory.type = category.type
}

const onUpdate = async () => {
  const result = await api.categoryUpdate({
    id: updateCategory.id,
    type: updateCategory.type,
  })
  if (result.code === 200) {
    loadDatas()
    message.success(result.msg)
    showUpdateModal.value = false
  } else {
    message.error(result.msg)
  }
}

const dialog = inject('dialog')
const onDelete = async (category) => {
  dialog.warning({
    title: "警告",
    content: `是否删除分类 [ ${category.type} ]`,
    positiveText: "删除",
    negativeText: "取消",
    onPositiveClick: async () => {
      const result = await api.categoryDeleteById({id:category.id})
      if (result.code === 200) {
        loadDatas()
        message.success(result.msg)
      } else {
        message.error(result.msg)
      }
    },
    onNegativeClick: () => { }
  });
}

const onAdd = async (id) => {
  const result = await api.categoryAdd({ type: addCategory.type })
  if (result.code === 200) {
    showAddModal.value = false
    loadDatas()
    message.success(result.msg)
  } else {
    message.error(result.msg)
  }
}

onMounted( async() => {
  const res = await api.categoryGet()
  categoryList.value = res.result
})
</script>

<style lang="scss" scoped>
.table {
  max-width: 50rem;
  margin: 0 auto;
}
</style>
