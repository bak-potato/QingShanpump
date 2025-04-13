
import { post, get } from '../utils/request'
export const addUserAnswer = (data) => {
  return post('/api/userAnswer/add', data)
}
export const listQuestionVOByPage = (data) => {
  return post('/api/question/list/page/vo', data)
}
export const getUserAnswerVOById = (data) => {
  return get('/api/userAnswer/get/vo', data)
}
