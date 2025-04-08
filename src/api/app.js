import { get, post } from '../utils/request'
// 增加应用-ok
export const addApp = (data) => {
  return post('/api/app/add', data)
}

export const deleteApp = (data) => {
  return post('/api/app/delete', data)
}

export const editApp = (data) => {
  return post('/api/app/edit', data)
}
// 获取应用详情通过id（vo）
export const getAppVOById = (data) => {
  return get('/api/app/get/vo', data)
}
// 获取应用列表通过id
export const listAppByPage = (data) => {
  return post('/api/app/list/page', data)
}
// 获取应用列表通过页码（vo）
export const listAppVOByPage = (data) => {
  return post('/api/app/list/page/vo', data)
}
// 获取我的应用列表通过页码（vo）
export const listMyAppVOByPage = (data) => {
  return post('/api/app/my/list/page/vo', data)
}

export const updateApp = (data) => {
  return post('/api/app/update', data)
}

export const common = (data) => {
  return post('/api/common/upload', data)
}
