import { post, get } from '../utils/request'
// import qs from 'qs'
export const addUserAnswer = (data) => {
  return post('/api/userAnswer/add', data)
}
export const listQuestionVOByPage = (data) => {
  return post('/api/question/list/page/vo', data)
}
export const getUserAnswerVOById = (data) => {
  // const params = qs.stringify(data)
  // ?${ params }/
  return get(`/api/userAnswer/get/vo`, data)
}
export const listMyUserAnswerVOByPage = (data) => {
  return post('/api/userAnswer/my/list/page/vo', data)
}
