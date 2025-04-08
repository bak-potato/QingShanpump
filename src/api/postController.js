import axios from 'axios'

export const addPost = (data) => {
  return axios.post('/api/post/add', data)
}

export const deletePost = (data) => {
  return axios.post('/api/post/delete', data)
}

export const editPost = (data) => {
  return axios.post('/api/post/edit', data)
}

export const getPostVOById = (data) => {
  return axios.get('/api/post/get/vo', data)
}

export const listPostByPage = (data) => {
  return axios.post('/api/post/list/page', data)
}

export const listPostVOByPage = (data) => {
  return axios.post('/api/post/list/page/vo', data)
}

export const listMyPostVOByPage = (data) => {
  return axios.post('/api/post/my/list/page/vo', data)
}

export const searchPostVOByPage = (data) => {
  return axios.post('/api/post/search/page/vo', data)
}

export const updatePost = (data) => {
  return axios.post('/api/post/update', data)
}
