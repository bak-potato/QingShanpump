
import { post } from '../utils/request'
import axios from 'axios';
export const addScoringResult = (data) => {
  return post('/api/scoringResult/add', data)
}
export const editScoringResult = (data) => {
  return post('/api/scoringResult/edit', data)
}
export const listMyScoringResultVOByPage = (data) => {
  return post('/api/scoringResult/my/list/page/vo', data)
}
export const deleteScoringResult = (data) => {
  return post('/api/scoringResult/delete', data)
}
export const getScoringResultVOById = (params) => {
  return axios.get('/api/scoringResult/get/vo', { params });
}
