import { post, get } from '../utils/request'
export const addQuestion = (data) => {
  return post('/api/question/add', data)
}
export const getQuestionVOById = (data) => {
  return get('/api/question/get/vo', data)
}
export const listMyQuestionVOByPage = (data) => {
  return post('/api/question/my/list/page/vo', data)
}
export const editQuestion = (data) => {
  return post('/api/question/edit', data)
}
export const deleteQuestion = (data) => {
  return post('/api/question/delete', data)
}
export const aiGenerateQuestion = (data) => {
  return post('/api/question/ai_generate', data)
}