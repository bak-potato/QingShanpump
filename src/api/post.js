import { post, get } from '../utils/request'

export const addPostApi = (data) => {
  return post('/api/post/add', data)
}

export const editPostApi = (data) => {
  return post('/api/post/edit', data)
}

export const listUserPostApi = (data) => {
  return post('/api/post/my/list/page/vo', data)
}

export const deletePostApi = (data) => {
  return post('/api/post/delete', data)
}

export const getPostByIdApi = (data) => {
  return get('/api/post/get/vo', data)
}
