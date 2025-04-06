// src/api/auth.js
import request from '@/utils/request'

export function loginApi(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

export function registerApi(data) {
  return request({
    url: '/auth/register',
    method: 'post',
    data
  })
}

export function getUserInfoApi() {
  return request({
    url: '/user/info',
    method: 'get'
  })
}
