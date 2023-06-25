import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

const STORE_NAME = 'auth_info'

// useStore 可以是 useUser、useCart 之类的任何东西
// 第一个参数是应用程序中 store 的唯一 id
const AdminStore = defineStore('admin', {
  state: () => {
    return {
      user: useStorage(STORE_NAME,
        {
          id: 0,
          account: '',
          password: '',
          accessToken: '',
          refreshToken: '',
        },
        localStorage,
        { mergeDefaults: true, },
      )
    }
  },
  actions: {
    updateUserInfo(newInfo) {
      this.user = {
        ...this.user,
        ...newInfo,
      }
    },
    updateAccessToken(newToken){
      this.user.accessToken = newToken
    }
  },
  getters: {
    getUserInfo(state) {
      return state.user
    },
    getToken(state) {
      return {
        access: state.user.accessToken,
        refresh: state.user.refreshToken,
      }
    },
  },
})

export { AdminStore }