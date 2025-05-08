import { defineStore } from 'pinia';

export const useUserStore = defineStore("message", {
  state: () => ({
    // 新增参数存储对象（初始值与滑块默认值一致）
    chatParams: {
      max_tokens: 100,    // 对应 value4
      temperature: 1,     // 对应 value5（假设滑块范围 0-2，此处初始值 1）
      top_p: 1            // 对应 value6（假设滑块范围 0-1，此处初始值 1）
    }
  }),
  actions: {
    // 新增更新参数的方法（可选，用于批量更新）
    login(params) {
      this.chatParams = { ...this.chatParams, ...params };
      console.log(this.chatParams)
    }
  }
});
