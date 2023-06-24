// Vue
import { createApp } from 'vue'
const app = createApp(App)
import App from './App.vue'
// 初始CSS
import 'initialize-css/dist/_initialize.scss'
// import './asset/style/style.scss'
// 路由
import router from './router'
app.use(router)
// pinia
import { createPinia } from 'pinia'
app.use(createPinia())
// naive-ui
import { createDiscreteApi } from "naive-ui";
const { message, notification, dialog } = createDiscreteApi(["message", "dialog", "notification"])
// axios
import axios from 'axios'
axios.defaults.baseURL = 'http://192.168.1.5:3123/'

// 引入store
import AdminStore from '@/store/index'
const adminStore = AdminStore()

// 使用拦截器添加token
axios.interceptors.request.use((config)=>{
  config.headers.accessToken = adminStore.accessToken 
  config.headers.refreshToken = adminStore.refreshToken 
  return config
})

import dayjs from 'dayjs' //import dayjs in your main.js
app.provide('dayjs', dayjs)

app.provide('axios', axios)
app.provide('message', message)
app.provide('dialog', dialog)
app.provide('notification', notification)
// app.provide('serverURL', axios.defaults.baseURL)

app.mount('#app')
// createApp(App).use(router).use(createPinia()).mount('#app')
