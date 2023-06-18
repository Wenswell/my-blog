<template>
  <div>

    <n-h1>
      {{ blogDetail.title }}
    </n-h1>

    <div class="content" v-html="blogDetail.content"></div>
    blogDetail
    {{ blogDetail.id }}
    {{ blogDetail.category_id }}
    {{ blogDetail.content }}
    {{ blogDetail.create_time }}
  </div>
</template>

<script setup>
const axios = inject('axios')
const message = inject('message')

import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute()
console.log("route", route)
console.log("route", route.query)
console.log("route",)

let blogDetail = ref({

})

const loadBlogById = async () => {
  const result = await axios.get(`/blog/detail?id=${route.query.id}`)
  if (result.data.code === 200) {
    blogDetail.value = result.data.result[0]
    message.success(result.data.msg)
  } else {
    message.error(result.data.msg)
  }

}

onMounted(() => {
  loadBlogById()
})


</script>

<style lang="scss" scoped></style>