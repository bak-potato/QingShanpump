import { post } from '../utils/request'
export const addScoringResult = (data) => {
  return post('/api/scoringResult/add', data)
}
