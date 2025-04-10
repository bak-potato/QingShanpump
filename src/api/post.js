import { post, get } from '../utils/request'
// 增加帖子
export const addPostApi = (data) => {
  return post('/api/post/add', data)
}
// 编辑帖子
export const editPostApi = (data) => {
  return post('/api/post/edit', data)
}
// 获取帖子列表
export const listUserPostApi = (data) => {
  return post('/api/post/my/list/page/vo', data)
}
// 删除帖子
export const deletePostApi = (data) => {
  return post('/api/post/delete', data)
}
// 通过id获取帖子详情
export const getPostByIdApi = (data) => {
  return get('/api/post/get/vo', data)
}
