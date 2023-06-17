import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { createDiscreteApi } from "naive-ui";
import 'normalize.css'

import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:3123/'
const { message, notification, dialog } = createDiscreteApi(["message", "dialog", "notification"])

const app = createApp(App)

app.provide('axios', axios)
app.provide('message', message)
app.provide('dialog', dialog)
app.provide('notification', notification)

app.use(createPinia())
app.use(router)
app.mount('#app')
// createApp(App).use(router).use(createPinia()).mount('#app')
