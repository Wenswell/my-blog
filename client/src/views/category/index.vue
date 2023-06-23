<template>
<MainAsideBox>
  <template v-slot:main>
    
  </template>
  <template v-slot:aside>
    <div class="category">
      <div class="category-item center--text" v-for="cate in categoryOptions" @click="message.info(cate.id)">
        {{ cate.type }}
      </div>
    </div>
  </template>
</MainAsideBox>
</template>

<script setup>
import MainAsideBox from "@/components/MainAsideBox.vue";


// 加载分类
const message = inject('message')
const axios = inject('axios')
const categoryOptions = ref([])
const loadCategory = async () => {
  const result = await axios.get('/category/get')
  console.log("result", result)
  categoryOptions.value = result.data.result
  // categoryOptions.value = result.data.result.map(item => {
  //   return {
  //     label: item.type,
  //     value: item.id
  //   };
  // });
}

onMounted(() => {
  loadCategory()
})
</script>

<style lang="scss" scoped>
.category {

  padding-bottom: 1rem;

  display: flex;
  flex-wrap: wrap;
  gap: $gap;
  justify-content: center
}

.category-item {
  flex-basis: 20%;
  background-color: $primary-color;
}
</style>