import axios from 'axios'
import router from '@/router'
import { AdminStore } from '@/store/index'
const adminStore = AdminStore()

const serverURL = 'http://192.168.1.5:3123/'
// const serverURL = 'http://localhost:3123/'

axios.defaults.baseURL = serverURL

function test(configTEST) {
  return axios.request(configTEST)
}

// 在响应拦截器中使用axios无法添加headers
function sendRequest(url, method, headers, data) {
  if ((method === 'get' || method === 'delete') && data) {
    const queryString = Object.keys(data)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
      .join('&');
    url += `?${queryString}`;
    data=''
  }  
  return new Promise(function (resolve, reject) {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    for (const key in headers) {
      xhr.setRequestHeader(key, headers[key]);
    }
    xhr.onload = function () {
      if (xhr.status === 200) {
        const responseData = JSON.parse(xhr.responseText);
        resolve(responseData);
      } else {
        reject(new Error('请求失败'));
      }
    };
    xhr.onerror = function () {
      reject(new Error('请求失败'));
    }
    xhr.send(data);
  });
}
// 请求地址，请求方式，提交的数据
export default async (url, method, submitData, isUpload) => {

  const AxiosInstance = axios.create({
    timeout: 10000,
  });

  // 拦截请求
  AxiosInstance.interceptors.request.use(config => {
    const { access, refresh } = adminStore.getToken
    if (refresh) {
      config.headers.accessToken = access ?? ''
      config.headers.refreshToken = refresh ?? ''
    }
    if(isUpload){
      config.headers['Content-Type'] = 'multipart/form-data'
      console.log("isUpload---config.headers", config.headers)
    }
    return config
  })

  AxiosInstance.interceptors.response.use(

    response => {
      if (response?.data?.code == 204) {
        adminStore.updateAccessToken(response?.data?.data?.accesstoken)
        const { access, refresh } = adminStore.getToken
        const safeURL = response.config.url[0] == '/' ? response.config.url.slice(1) : response.config.url
        const data =( response.config.method === 'get' || response.config.method === 'delete')?response.config.params:response.config.data
        return sendRequest(serverURL + safeURL, response.config.method, {
          'accessToken': access,
          'refreshToken': refresh,
          'Content-Type': 'application/json'
        }, data).then(res => {
          console.log('xhr:', res)
          return res
        })
      }
      if (response?.data?.code == 401) {
        // 跳转到登录页面
        const fullPath = encodeURIComponent(router?.currentRoute?.value?.fullPath)
        router.push('/login?redirectUrl=' + fullPath)  

      }
      return response?.data
    }
  )

  try {
    return await AxiosInstance({
      url,
      method,
      // method参数：get,Get,GET  转换成小写再来判断
      [method.toLowerCase() === 'get' || method.toLowerCase() === 'delete' ? 'params' : 'data']: submitData
    })
  } catch (error) {
    console.log('请求错误：', error)
  }
}