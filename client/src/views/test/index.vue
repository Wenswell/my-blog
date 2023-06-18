<template>
  <div>
    <div>
      <span> name: {{ person.name }}</span><br>
      <span> age: {{ person.age }}</span><br>
      <button @click="person.changeName">更改name</button><br>
      <button @click="person.changeAge">更改age</button><br>
    </div>


    <n-form ref="formRef" inline :label-width="80" :model="formValue" :rules="rules">
      <n-form-item label="姓名" path="user.name">
        <n-input v-model:value="formValue.user.name" placeholder="输入姓名" />
      </n-form-item>
      <n-form-item label="年龄" path="user.age">
        <n-input v-model:value="formValue.user.age" placeholder="输入年龄" />
      </n-form-item>
      <n-form-item label="电话号码" path="phone">
        <n-input v-model:value="formValue.phone" placeholder="电话号码" />
      </n-form-item>
      <n-form-item>
        <n-button attr-type="button" @click="handleValidateClick">
          验证
        </n-button>
      </n-form-item>
    </n-form>
  </div>
</template>

<script>
import { reactive, ref, watch } from 'vue';

export default {
  setup() {
    let num = ref(123)
    let person = reactive({ name: 'asfd', age: 500 })
    person.changeName = () => { person.name = person.name + '!' }
    person.changeAge = () => { person.age = person.age + 10 }
    watch(person, (n, o) => { console.log('person被改变了', n, o) })
    watch(() => ({ ...person }), (n, o) => { console.log('person被改变了+结构赋值', n, o) })

    const formRef = ref(null);
    const formValue = ref({
      user: {
        name: '',
        age: '',
      },
      phone: '',
    })

    const rules = {
      user: {
        name: {
          required: true,
          message: "请输入姓名",
          trigger: "blur"
        },
        age: {
          required: true,
          message: "请输入年龄",
          trigger: ["input", "blur"]
        }
      },
      phone: {
        required: true,
        message: "请输入电话号码",
        trigger: ["input"]
      }
    }

    const message = inject('message')
    const handleValidateClick = async (e) => {
      e.preventDefault()
      try {
        await formRef.value.validate()
        message.success('Valid')
      } catch (err) {
        console.log(err)
        message.error('Invalid')
      }
    }


    return {

      formRef,
      formValue,
      rules,
      handleValidateClick,

      num,
      person
    }
  }
}
</script>

<style lang="scss" scoped></style>