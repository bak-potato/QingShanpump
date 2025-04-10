// src/api/api.js
import axios from 'axios'
import qs from 'qs'
// 创建axios实例
const api = axios.create({
  baseURL: '/api', // 后端API基础地址
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
})

// 请求拦截器
api.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么，例如添加token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    if (config.url.includes('/user/get')) {
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
      console.log(222)
      config.data = qs.stringify(config.data)
    }
    return config
  },
  error => {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  response => {
    // 对响应数据做点什么
    return response.data
  },
  error => {
    // 对响应错误做点什么
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 处理未授权
          console.log('401')
          break
        case 404:
          // 处理未找到
          console.log('404')

          break
        // 其他状态码处理

      }
    }
    return Promise.reject(error)
  }
)

// 导出常用的HTTP方法
export default {
  get(url, params) {
    return api.get(url, { params })
  },
  post(url, data) {
    return api.post(url, data)
  },
  put(url, data) {
    return api.put(url, data)
  },
  delete(url) {
    return api.delete(url)
  }
}
