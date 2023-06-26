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

import dayjs from 'dayjs' //import dayjs in your main.js
app.provide('dayjs', dayjs)

app.provide('message', message)
app.provide('dialog', dialog)
app.provide('notification', notification)
// app.provide('serverURL', axios.defaults.baseURL)

app.mount('#app')
// createApp(App).use(router).use(createPinia()).mount('#app')
