import { post } from '@/utils/request'
// 点赞
export const doThumb = (data) => {
  return post('/api/post_thumb/', data)
}
