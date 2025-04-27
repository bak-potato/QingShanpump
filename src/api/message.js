import { post } from '../utils/request'
import axios from 'axios';
import qs from 'qs'
export const addMessage = (data) => {
  return post('/api/message/add', data)
}
export const deleteMessage = (data) => {
  return post('/api/message/delete', data)
}
export const editMessage = (data) => {
  return post(`/api/message/edit`, data)
}
export const getMessageVOById = (data) => {
  return axios.get('/api/message/get/vo', data)
}
export const listMessageByPage = (data) => {
  return post('/api/message/list/page', data)
}
export const listMessageVOByPage = (data) => {
  return post('/api/message/list/page/vo', data)
}
export const listMessage = (params) => {
  return axios.post('/api/message/listMessage', qs.stringify(params))
}
export const listMyMessageVOByPage = (data) => {
  return post('/api/message/my/list/page/vo', data)
}
export const SendMessage = (data) => {
  return post('/api/message/sendMessage', data)
}

export const SendMessageAsync = (data) => {
  return axios.get('/api/message/sendMessageAsync', data)
}

export const SendMessageSse = (params) => {
  return axios.get('/api/message/sendMessageSse', { params })
}

export const updateMessage = (data) => {
  return post('/api/message/update', data)
}

