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
const axios = inject('axios')
const message = inject('message')

import {AdminStore} from '@/store/index'
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
  const result = await axios.put('/category/_token/update', {
    id: updateCategory.id,
    type: updateCategory.type,
  })
  if (result.data.code === 200) {
    loadDatas()
    message.success(result.data.msg)
    showUpdateModal.value = false
  } else {
    message.error(result.data.msg)
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
      const result = await axios.delete(`/category/_token/delete?id=${category.id}`)
      if (result.data.code === 200) {
        loadDatas()
        message.success(result.data.msg)
      } else {
        message.error(result.data.msg)
      }
    },
    onNegativeClick: () => { }
  });
}

const onAdd = async (id) => {
  const result = await axios.post('/category/_token/add', { type: addCategory.type })
  if (result.data.code === 200) {
    showAddModal.value = false
    loadDatas()
    message.success(result.data.msg)
  } else {
    message.error(result.data.msg)
  }
}


onMounted(() => {
  loadDatas()
})

const loadDatas = async () => {
  const res = await axios.get('/category/get')

  categoryList.value = res.data.result
  console.log("categoryList.value", categoryList.value)

  //   {
  //     "code": 200,
  //     "msg": "获取成功",
  //     "result": [
  //         {
  //             "id": 446763298160709,
  //             "type": "无1"
  //         },
  //         {
  //             "id": 446763511984197,
  //             "type": "收集"
  //         },
  //         {
  //             "id": 446764355108933,
  //             "type": "生活"
  //         },
  //         {
  //             "id": 446771860516933,
  //             "type": "学习"
  //         },
  //         {
  //             "id": 446776307593285,
  //             "type": "服务器"
  //         },
  //         {
  //             "id": 446806359834693,
  //             "type": "前端"
  //         },
  //         {
  //             "id": 446806416830533,
  //             "type": "后端"
  //         },
  //         {
  //             "id": 446806688526405,
  //             "type": "今天"
  //         },
  //         {
  //             "id": 446806703591493,
  //             "type": "明天"
  //         },
  //         {
  //             "id": 446806721044549,
  //             "type": "昨天"
  //         }
  //     ]
  // }
}


</script>

<style lang="scss" scoped>
.table {
  max-width: 50rem;
  margin: 0 auto;
}
</style>
