import { post } from '@/utils/request'

// 收藏
export const doPostFavour = (data) => {
  return post('/api/post_favour/', data)
}

export const listFavourPostByPage = (data) => {
  return post('/api/post_favour/list/page', data)
}

export const listMyFavourPostByPage = (data) => {
  return post('/api/post_favour/my/list/page', data)
}
