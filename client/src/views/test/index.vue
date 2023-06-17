<template>
  <div>
    <span>
      name: {{ person.name }}
    </span>
    <br>
    <span>
      age: {{ person.age }}
    </span>
    <br>
    <button @click="person.changeName">更改name</button>
    <br>
    <button @click="person.changeAge">更改age</button>
  </div>
</template>

<script>
import { reactive, ref, watch } from 'vue';

export default {
  setup() {
    let num = ref(123)
    let person = reactive({
      name: 'asfd',
      age: 500
    })
    person.changeName = () => {
      person.name = person.name + '!'
    }
    person.changeAge = () => {
      person.age = person.age + 10
    }


    watch(person, (n, o) => {
      console.log('person被改变了', n, o)
    })

    watch(
      () => ({ ...person }),
      (n, o) => {
      console.log('person被改变了+结构赋值', n, o)
    })

    return {
      num,
      person
    }
  }
}
</script>

<style lang="scss" scoped></style>