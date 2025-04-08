import { get, post } from '../utils/request'
// 登录-ok
export function loginApi(data) {

  return post('/api/user/login', data)

}
// 注册-ok
export function registerApi(data) {
  return post('/api/user/register', data)
}
//分页查询用户列表 (管理员权限)
export function listuserbypage(data) {
  return post('/api/user/list/page',data)
}
//分页查询用户列表 (用户权限)
export function listUserVOByPage(data) {
  return post('/api/user/list/page/vo',data)
}
// 增加用户-ok
export function adduser(data) {
  return post('/api/user/add', data)
}
// 删除用户-ok
export function deleteuser(data) {
  return post('/api/user/delete', data)
}
//通过id查询用户
export function getuserbyid(data) {
  return get('/api/user/get', data)
}
//通过id查询用户（vo）
export function getUserVOById(data) {
  return get('/api/user/get/vo', data)
}
// 获取当前登录用户信息 -ok
export function getLoginUser() {
  return get('/api/user/get/login')
}
//微信
export function userLoginByWxOpen(data) {
  return get('/api/user/login/wx_open', data)
}
// 用户退出登录  -ok
export function userLogout() {
  return post('/api/user/logout')
}
//更新用户
export function updateUser(data) {
  return post('/api/user/update', data)
}
//修改个人信息-ok 头像未完成
export function updateUserInfo(data) {
  return post('/api/user/update/my', data)
}

export function commonController(data) {
  return post('/api/common/upload', data)
}
