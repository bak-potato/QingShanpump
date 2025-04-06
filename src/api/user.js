import { post } from '../utils/request'

export function loginApi(data) {

  return post('/api/user/login', data)

}
