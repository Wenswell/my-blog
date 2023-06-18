<template>
  <div class="login-page">
    <n-card title="管理后台登录">

      <n-form :model="admin" :rules="rules">

        <n-form-item label="账号" path="account">
          <n-input v-model:value="admin.account" placeholder="输入账号" />
        </n-form-item>

        <n-form-item label="密码" path="password">
          <n-input v-model:value="admin.password" type="password" placeholder="输入密码" />
        </n-form-item>

      </n-form>
      <template #footer>

        <n-button @click="login" :disabled="!isValid" type="primary">登录</n-button>
        <n-checkbox v-model:checked="admin.remember" label="记住我" />

      </template>
    </n-card>

  </div>
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
    { min: 5, max: 18, message: `密码长度 5 ~ 18 个字符`, trigger: ["input", "blur"] },
  ],
}

const isValid = computed(() => admin.account.length > 3 && admin.account.length < 12 && admin.password.length > 5 && admin.password.length < 18);

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


  /**
  result.data
{
    "code": 500,
    "msg": "登录失败, 检查账号或密码"
}
{
    "code": 200,
    "msg": "登录成功",
    "data": {
        "id": 1,
        "account": "admin",
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjg3MDA4ODg4LCJleHAiOjE2ODcwMTI0ODh9.emOwwra9JdwRe_bF6nVGQUz2R0-IQ-loe9FtcdbMwtw",
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjg3MDA4ODg4LCJleHAiOjE2ODc2MTM2ODh9.BsTu_pMtrzbfS7XLsxBkPx3Jb1cSrWUYc5x55qlIpII"
    }
}
  */

}

</script>

<style lang="scss" scoped>
.login-page {
  width: 30rem;
  margin: 3rem auto 0;
}
</style>