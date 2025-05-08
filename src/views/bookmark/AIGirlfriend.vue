<template>
  <!-- 页面的最外层容器，设置最大宽度、最大高度和相对定位 -->
  <div style="max-width: 120px;max-height: 30px;position: relative;">
    <!-- 页面管理按钮，点击时调用 openPageManager 方法，设置按钮样式和位置 -->
    <el-button type="primary" @click="openPageManager"
      style="position: absolute;left: 1200px;top: 10px;">页面管理</el-button>
  </div>
  <div class="chat-app">
    <!-- 消息列表 -->
    <!-- 聊天容器，使用 ref 引用，用于滚动到底部 -->
    <div class="chat-container" ref="chatContainer">
      <!-- 遍历消息列表，根据消息的 isAI 属性添加不同的类名 -->
      <div v-for="(message, index) in messages" :key="index" :class="['message', message.isAI ? 'ai' : 'user']">
        <!-- 消息内容容器 -->
        <div class="message-content">
          <!-- 消息文本 -->
          <div class="message-text">{{ message.text }}</div>
          <!-- 消息时间，根据消息的 isAI 属性添加不同的类名 -->
          <div class="message-time" :class="{ 'user-time': message.isAI, 'ai-time': !message.isAI }">
            {{ formatTime(message.time) }}
          </div>
        </div>
        <!-- 删除按钮，点击时调用 deletemessage 方法删除对应消息 -->
        <el-icon @click="deletemessage(index)" class="delete-btn">
          <Delete />
        </el-icon>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="input-area">
      <!-- 输入框，使用 v-model 双向绑定 inputMessage，按下回车键时调用 sendMessage 方法 -->
      <input id="fxx" type="text" v-model="inputMessage" @keyup.enter="sendMessage" placeholder="发消息..."
        class="message-input">
      <!-- 发送按钮，点击时调用 sendMessage 方法 -->
      <button @click="sendMessage" class="send-button">
        <i class="fas fa-paper-plane"></i> 发送
      </button>
    </div>
  </div>
</template>

<script setup>
// 引入 Vue 相关的响应式和生命周期函数
import { ref, onMounted, nextTick, watch } from 'vue'
// 引入 Vue Router 相关函数
import { useRouter } from 'vue-router'
// 引入 Element Plus 的消息提示组件
import { ElMessage } from 'element-plus'
// 引入 lodash-es 的防抖函数
import { debounce } from 'lodash-es'
// 引入自定义的 API 函数
import { SendMessage, listMessage, deleteMessage } from '@/api/message'
// 引入用户相关的 Vuex Store
import { useUserStore } from '@/store/message'
// 获取用户相关的 Vuex Store 实例
const userStore = useUserStore()
// 监听用户相关的聊天参数变化，深度监听并在组件初始化时立即执行回调
watch(
  () => userStore.chatParams,
  (newParams) => {
    console.log('参数更新:', newParams);
    // 可添加参数变化后的逻辑（如提示用户）
  },
  { deep: true, immediate: true }
);
// 获取 Vue Router 实例
const router = useRouter()
// 定义聊天窗口 ID 的响应式变量
const chatWindowId = ref('') // 使用 ref 定义，以便后续监听变化
// 定义消息列表的响应式变量
const messages = ref([])
// 定义输入消息的响应式变量
const inputMessage = ref('')
// 定义聊天容器的引用
const chatContainer = ref(null)
// 定义敏感词列表的响应式变量
const sensitiveWords = ref([
  // 一、违法犯罪类
  "毒品", "枪支", "赌博", "走私", "抢劫", "盗窃", "诈骗", "洗钱", "傻逼", "sb",
  "傻逼", "贱货", "去死", "垃圾", "诽谤", "造谣", "人身攻击", 'cnm', '二逼', '二b','你妈逼', '草你妈', '滚',
  // 二、色情低俗类
  "色情", "淫秽", "嫖娼", "露点", "AV", "约炮", "性交易", "低俗表演",
  // 三、暴力恐怖类
  "爆炸", "杀人", "恐怖袭击", "暴力威胁", "血腥", "肢解", "炸弹",
  // 四、政治敏感类（严格遵循法律法规）
  "颠覆国家", "分裂主义", "法轮功", "港独", "台独", "反华",
  // 五、恶意广告与虚假信息
  "刷单", "诈骗", "免费领取", "点击领取", "中奖", "病毒链接", "虚假宣传",
  // 六、侮辱诽谤与脏话
  "傻×", "贱货", "去死", "垃圾", "诽谤", "造谣", "人身攻击",
  // 七、其他不当内容
  "吸毒", "酒驾", "违禁品", "反动", "虚假信息", "恶意攻击"
]);
// 打开页面管理的方法，跳转到名为 'OpenPageManager' 的路由
const openPageManager = () => {
  router.push({ name: 'OpenPageManager' })
}
// 格式化时间的函数，根据时间戳返回格式化后的时间字符串
const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();
  const isThisYear = date.getFullYear() === today.getFullYear();
  const padZero = (n) => String(n).padStart(2, '0');
  const hh = padZero(date.getHours());
  const mm = padZero(date.getMinutes());
  if (isToday) {
    return `${hh}:${mm}`;
  } else {
    const month = padZero(date.getMonth() + 1);
    const day = padZero(date.getDate());
    if (isThisYear) {
      return `${month}-${day} ${hh}:${mm}`;
    } else {
      const year = date.getFullYear();
      return `${year}-${month}-${day} ${hh}:${mm}`;
    }
  }
};
// 加载历史消息的异步函数
const loadMessages = async () => {
  try {
    // 调用 listMessage API 获取历史消息
    const res = await listMessage({ chatWindowsId: chatWindowId.value })
    console.log('历史消息:', res.data.data)
    if (res.data.data && res.data.data.length > 0) {
      // 将 API 返回的消息转换为组件需要的格式
      messages.value = res.data.data.map(msg => ({
        id: msg.id,
        text: msg.content,
        isAI: msg.type === 1,// 假设1是AI消息，0是用户消息
        time: new Date(msg.createTime).getTime() // 转换为时间戳
      }))

      await nextTick()
      // 滚动到聊天容器底部
      scrollToBottom()
    }
  } catch (error) {
    console.error('加载消息失败:', error)
    // 显示加载历史消息失败的提示
    ElMessage.error('加载历史消息失败')
  }
}
// 发送消息的防抖函数
const sendMessage = debounce(async () => {
  const inputText = inputMessage.value.trim(); // 提取输入内容
  if (!inputText) {
    // 消息为空时显示提示
    ElMessage.warning('消息不能为空哦~');
    return;
  }
  // 敏感词检测逻辑改进
  //  统一转小写进行检测和汉字匹配
  const lowerCaseInput = inputText.toLowerCase();
  const hasSensitiveWord = sensitiveWords.value.some(word =>
    lowerCaseInput.includes(word.toLowerCase()) // 支持子字符串匹配
  );

  if (hasSensitiveWord) {
    // 包含敏感词时显示提示并清空输入框
    ElMessage.warning('消息中包含敏感词，请重新输入！');
    inputMessage.value = '';  // 正确清空输入框
    return; // 阻止后续执行
  }

  // 添加用户消息（仅在检查通过后执行）
  messages.value.push({
    text: inputText,
    isAI: false,
    time: new Date().getTime()
  });
  const params = {
    chatWindowId: chatWindowId.value,
    content: inputText,
    type: 0,
    max_tokens: userStore.chatParams.max_tokens,
    temperature: userStore.chatParams.temperature,
    top_p: userStore.chatParams.top_p
  };
  console.log('发送消息:', params);
  // 清空输入框
  inputMessage.value = '';
  await nextTick();
  // 滚动到聊天容器底部
  scrollToBottom();

  try {
    // 调用 SendMessage API 发送消息并获取 AI 响应
    const { data } = await SendMessage(params);
    console.log('AI响应:', data);
    const aiResponse = generateAIResponse(data);
    // 添加 AI 响应消息
    messages.value.push({
      text: aiResponse,
      isAI: true,
      time: new Date().getTime()
    });
    await nextTick();
    // 滚动到聊天容器底部
    scrollToBottom();
  } catch (error) {
    console.error('发送消息失败:', error);
    // 发送消息失败时添加错误提示消息
    messages.value.push({
      text: "哎呀，出错了~ 请再试一次吧 (｡•́︿•̀｡)",
      isAI: true
    });
    await nextTick();
    scrollToBottom();
  }
}, 300, { leading: true, trailing: false });

// 滚动到聊天容器底部的函数
const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

// 生成 AI 响应的函数，根据 API 返回的数据生成相应的响应文本
const generateAIResponse = (response) => {
  if (response && response.data && response.data.aiMessage) {
    return response.data.aiMessage;
  }

  return "亲爱的，我不太明白你的意思，能再说清楚一点吗？❤️";
}

// 删除消息的异步函数
const deletemessage = async (index) => {
  // 从loadMessages中找到对应的消息的id
  const messageId = messages.value[index];
  if (messageId) {
    // 获取消息的id
    const id = messageId.id;
    const { data: { code } } = await deleteMessage({ id: id })
    if (code === 0) {
      // 删除成功时显示提示并重新加载消息
      ElMessage.success('删除成功')
      loadMessages();
    }
  }
}

// 监听路由参数变化，确保 chatWindowId 正确获取并在变化时加载消息
watch(() => router.currentRoute.value.query.chatId, (newValue) => {
  chatWindowId.value = newValue;
  if (newValue) {
    loadMessages();
  }
})

// 组件挂载完成后的生命周期钩子函数
onMounted(() => {
  if (!sessionStorage.getItem('hasRefreshed')) {
    sessionStorage.setItem('hasRefreshed', 'true');
    location.reload();
    return;
  }
  sessionStorage.setItem('view', 98);
  // 获取路由参数中的 chatId 并赋值给 chatWindowId
  chatWindowId.value = router.currentRoute.value.query.chatId;
  if (chatWindowId.value) {
    // 如果 chatWindowId 存在则加载历史消息
    loadMessages();
  }

  // 显示温馨提示
  ElMessage.success({
    showClose: true,
    message: '温馨提示：可以设置不同体验对象和模型',
  })
});

// 路由切换完成后的钩子函数，移除 sessionStorage 中的 hasRefreshed 项
router.afterEach(() => {
  sessionStorage.removeItem('hasRefreshed');
});
</script>


<style scoped>
/* 样式保持不变，移除所有包含 .chat-app.pink-mode 及其相关选择器的样式 */
.chat-app {
  width: 1300px;
  margin: 50px auto 0;
  padding: 30px;
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.08);
  height: 90vh;
  display: flex;
  flex-direction: column;
  border: 1px solid white;
  transition: all 0.3s ease;
}

.mode-switch {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px 20px;
  background-color: #f8f8f8;
  border-radius: 25px;
  align-self: flex-end;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 30px;
  margin-right: 15px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 30px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 22px;
  width: 22px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked+.slider {
  background-color: #ff85a2;
}

input:checked+.slider:before {
  transform: translateX(30px);
}

.mode-label {
  font-size: 16px;
  color: #666;
  font-weight: 500;
}

.chat-container {
  flex: 1;
  overflow-y: auto;
  padding: 30px;
  background-color: white;
  border-radius: 15px;
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.message {
  max-width: 75%;
  animation: fadeIn 0.5s ease;
  border-radius: 15px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.06);
  position: relative; /* 添加相对定位*/
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message.user {
  align-self: flex-end;
}

.message-content {
  padding: 18px 22px;
  line-height: 1.6;
  transition: all 0.3s ease;
  position: relative; /* 为时间定位提供参考 */
}

.user .message-content {
  background-color: #ffffff;
  border-bottom-right-radius: 10px;
}

.ai .message-content {
  background-color: #f5f5f5;
  border-bottom-left-radius: 10px;
}

.message-text {
 font-size: 18px;
 color: #333;
 min-width: 30px;
}

.ai .message-text {
  color: #000000;
}

.input-area {
  display: flex;
  gap: 15px;
  padding: 18px;
  background-color: white;
  border-radius: 20px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid #ffecec;
  transition: all 0.3s ease;
}

.message-input {
  flex: 1;
  padding: 16px 20px;
  border: 1px solid #ffd6d6;
  border-radius: 25px;
  outline: none;
  font-size: 18px;
  transition: all 0.3s;
  background-color: white;
}

.message-input:focus {
  border-color: white;
  box-shadow: 0 0 0 3px rgba(255, 157, 181, 0.2);
}

.send-button {
  padding: 14px 28px;
  border: none;
  border-radius: 25px;
  background-color: #42a5f5;
  color: white;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.send-button:hover {
  background: linear-gradient(135deg, white, white);
  transform: translateY(-2px);
  color: #000000;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.send-button i {
  margin-right: 10px;
}

.chat-container::-webkit-scrollbar {
  width: 10px;
}

.chat-container::-webkit-scrollbar-track {
  background: #fff0f0;
  border-radius: 10px;
}

.chat-container::-webkit-scrollbar-thumb {
  background: #ffb6c1;
  border-radius: 10px;
}

.chat-container::-webkit-scrollbar-thumb:hover {
  background: white;
}
/* 隐藏删除按钮 */
.delete-btn {
  display: none;
  cursor: pointer; /* 鼠标样式设为手状 */
  position: absolute; /* 设置为绝对定位 */
  top: 10px; /* 调整位置 */
  right: 10px; /* 调整位置 */
  z-index: 1; /* 调整层级 */
}

/* 鼠标悬停在消息容器上时显示删除按钮 */
.message:hover .delete-btn {
  display: inline-block;
}

.message-time {
  min-width: 40px;
  font-size: 12px;
  color: #999;
  position: absolute;
  bottom: 4px; /* 调整垂直位置 */
}

.user-time {
  right: 8px; /* 用户消息时间在右下角 */
}

.ai-time {
  left: 8px; /* AI消息时间在左下角 */
}
</style>
