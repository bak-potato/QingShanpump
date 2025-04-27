import { post } from '@/utils/request'
import { get } from 'lodash-es'
export const addChatWindows = (data) => {
    return post('/api/chatWindows/add', data)
}
export const deleteChatWindows = (data) => {
    return post('/api/chatWindows/delete', data)
}
export const listMyChatWindowsVOByPage = (data) => {
    return post('/api/chatWindows/my/list/page/vo', data)
}
export const listMyChatWindows = (data) => {
    return get('/api/chatWindows/mylist', data)
}
export const editChatWindows = (data) => {
    return post('/api/chatWindows/edit', data)

}
export const listChatWindowsByPage = (data) => {
  return post('/api/chatWindows/list/page', data)
}
