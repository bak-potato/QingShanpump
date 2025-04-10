
import { post } from '../utils/request'
export const addUserAnswer = (data) => {
  return post('/api/userAnswer/add', data)
}
export const listQuestionVOByPage = (data) => {
  return post('/api/question/list/page/vo', data)
}
