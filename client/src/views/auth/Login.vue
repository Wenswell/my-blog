<template>
  <!--———— 0. 登录框 + 标题 ——————-->
  <n-card class="login-page" :bordered="false" title="管理后台登录">
    <!--———— 1. 表单 ——————-->
    <n-form :model="admin" :rules="rules">
      <!--———— 1.1 表单 账号 ——————-->
      <n-form-item label="账号" path="account">
        <n-input v-model:value="admin.account" placeholder="输入账号" />
      </n-form-item>
      <!--———— 1.2 表单 密码 ——————-->
      <n-form-item label="密码" path="password">
        <n-input v-model:value="admin.password" type="password" placeholder="输入密码" />
      </n-form-item>
    </n-form>
    <template #footer>
      <!--———— 1.3 表单 登录按钮 + 储存信息 ——————-->
      <div class="footer">
        <n-button class="footer-button" @click="login" :disabled="!isValid" type="primary">登录</n-button>
        <n-checkbox v-model:checked="admin.remember" label="记住我" />
      </div>
    </template>
  </n-card>
</template>

<script setup>
import { computed, inject, reactive } from 'vue';
import AdminStore from '@/store/index'
import { useRouter } from 'vue-router';
const router = useRouter()

const axios = inject('axios')
const message = inject('message')

const adminStore = AdminStore()

const rules = {
  account: [
    { required: true, message: '请输入账号', trigger: ["input", "blur"] },
    { min: 3, max: 12, message: `账号长度 3 ~ 12 个字符`, trigger: ["input", "blur"] },
  ],
  password: [
    { required: true, message: '请输入账号', trigger: ["input", "blur"] },
    { min: 6, max: 18, message: `密码长度 6 ~ 18 个字符`, trigger: ["input", "blur"] },
  ],
}

const isValid = computed(() => admin.account.length >= 3 && admin.account.length <= 12 && admin.password.length >= 6 && admin.password.length <= 18);

const admin = reactive({
  account: localStorage.getItem('account') || '',
  password: localStorage.getItem('password') || '',
  remember: Boolean(localStorage.getItem('remember')) || false,
})

const login = async () => {
  const result = await axios.post('/admin/login', {
    account: admin.account,
    password: admin.password,
  })

  if (result.data.code === 200) {
    adminStore.id = result.data.data.id
    adminStore.account = result.data.data.account
    adminStore.accessToken = result.data.data.accessToken
    adminStore.refreshToken = result.data.data.refreshToken
    if (admin.remember) {
      localStorage.setItem('account', admin.account)
      localStorage.setItem('password', admin.password)
      localStorage.setItem('remember', Number(admin.remember))
    }
    message.success(result.data.msg)
    router.push('/dash')
  } else {
    message.error(result.data.msg)
  }
}

</script>

<style lang="scss" scoped>
.login-page {
  max-width: 30rem;
  margin: 3rem auto;

  .footer {
    display: flex;
    align-items: center;
    gap: 2rem;
    .footer-button{
      padding: 1rem 2rem;
    }
  }
}
</style>