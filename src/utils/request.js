import service from './axios'

function get(url, params) {
  return service.get(url, { params })
}
function post(url, data) {
  return service.post(url, data)
}

export { get, post }
