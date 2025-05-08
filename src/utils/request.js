import service from 'axios'
import axios from 'axios'

function get(url, params) {
  return service.get(url, { params })
}
function post(url, data) {
  return service.post(url, data)
}

const request = (config) => {
  return axios({
    ...config,
    headers: {
      // 根据实际情况设置请求头，如添加 token 等
      'Content-Type': 'application/x-www-form-urlencoded',
      ...config.headers
    }
  })
}

export default request
export { get, post }
