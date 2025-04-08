import { post } from '../utils/request'
export const addQuestion = (data) => {
  return post('/api/question/add', data)
}
