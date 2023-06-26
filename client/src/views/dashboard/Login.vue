<template>
  <!--———— 0. 登录框 + 标题 ——————-->
  <n-card class="login-page" :bordered="false" title="管理后台登录">
    <!--———— 1. 表单 ——————-->
    <button @click="router.push('/')" class="back-btn">返回主页</button>
    <n-form :model="admin" :rules="rules">
      <!--———— 1.1 表单 账号 ——————-->
      <n-form-item label="账号" path="account">
        <n-input :maxlength="12" v-model:value="admin.account" placeholder="输入账号" />
      </n-form-item>
      <!--———— 1.2 表单 密码 ——————-->
      <n-form-item label="密码" path="password">
        <n-input :maxlength="18" v-model:value="admin.password" type="password" placeholder="输入密码" />
      </n-form-item>
    </n-form>
    <template #footer>
      <!--———— 1.3 表单 登录按钮 + 储存信息 ——————-->
      <div class="footer">
        <button class="footer-button" @click="login" :disabled="!isValid" type="primary">登录</button>
        <n-checkbox v-model:checked="admin.remember" label="记住账号密码" />
      </div>
    </template>
  </n-card>
  admin{{ admin }}
  <br>
  <br>
  adminStore.user{{ user }}
</template>

<script setup>
import { computed, inject, onMounted, reactive } from 'vue';
import { AdminStore } from '@/store/index'
import { storeToRefs } from 'pinia';
const adminStore = AdminStore()
const { user } = storeToRefs(adminStore)
import { useRouter } from 'vue-router';
const router = useRouter()

import api from '@/api';
const message = inject('message')


const rules = {
  account: [
    { required: true, message: '请输入账号', trigger: ["input", "blur"] },
    { min: 3, max: 12, message: `账号长度 3 ~ 12 个字符`, trigger: ["input", "blur"] },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: ["input", "blur"] },
    { min: 6, max: 18, message: `密码长度 6 ~ 18 个字符`, trigger: ["input", "blur"] },
  ],
}

const isValid = computed(() => admin.account.length >= 3 && admin.account.length <= 12 && admin.password.length >= 6 && admin.password.length <= 18);

const admin = reactive({
  account: '',
  password: '',
  remember: false,
})

const login = async () => {
  const result = await api.login({
    account: admin.account,
    password: admin.password,
  })

  if (result.code === 200) {
    let { account = '', password = '' } = admin.remember ? admin : {};
    adminStore.updateUserInfo({ ...result.data, account, password });
    message.success(result.msg)
    router.push('/dash')
  } else {
    message.error(result.msg)
  }
}

onMounted(async () => {
  const localInfo = adminStore.getUserInfo
  if (localInfo.refreshToken) {
    // 先验证token
    const result = await api.token({})
    if (result.code === 200) {
      router.push('/dash')
    }
  }
  if (localInfo.id) { // 默认为0
    admin.account = localInfo.account
    admin.password = localInfo.password
  }
  admin.remember = !!localInfo.account
})
</script>

<style lang="scss" scoped>
.login-page {
  max-width: 30rem;
  margin: 3rem auto;
  position: relative;

  .back-btn {
    @extend .center--text;
    @extend .active-effect;
    position: absolute;
    padding: $gap;
    top: $s-gap;
    right: $gap;
  }

  .footer {
    display: flex;
    align-items: center;
    gap: $gap;
    flex-wrap: wrap;

    .footer-button {
      @extend .center--text;
      @extend .active-effect;
      flex: 1;
      width: 20vw;
      padding: $gap;
      border: 1px solid $primary-color;
      background-color: $clr-back;
      color: $primary-color;
      cursor: pointer;
      transition: all 200ms;

      &[disabled] {
        opacity: 0.3;
        pointer-events: none;
      }

      &:hover {
        color: $clr-back;
        background-color: $primary-color;

      }

    }
  }
}
</style>