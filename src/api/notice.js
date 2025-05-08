// src/api/notice.js
import { post } from '@/utils/request'
import request from '@/utils/request'
export const cxgglist = (data) => {
  return post('/api/notice/query', data)
}
export const updategg = (data) => {
  return post('/api/notice/admin/update', data)
}

export function deletegg(data) {
  return request({
    url: '/api/notice/admin/delete',
    method: 'post',
    data
  })
}
export const addgg = (data) => {
  return post('/api/notice/admin/add', data)
}
