<template>
    <div style="max-width: 120px;max-height: 30px;position: relative;">
      <el-button type="primary" @click="openPageManager" style="position: absolute;left: 1200px;top: 10px;">页面管理</el-button>
  </div>
  <div class="chat-app">
    <!-- 消息列表 -->

    <div class="chat-container" ref="chatContainer">

      <div v-for="(message, index) in messages" :key="index" :class="['message', message.isAI? 'ai' : 'user']">
        <div class="message-content">
          <div class="message-text">{{ message.text }}</div>
          <div
            class="message-time"
            :class="{ 'user-time': message.isAI, 'ai-time': !message.isAI }"
          >
            {{ formatTime(message.time) }}
          </div>
        </div>
        <el-icon @click="deletemessage(index)" class="delete-btn"><Delete /></el-icon>
      </div>
    </div>

    <div class="input-area">
      <input id="fxx" type="text" v-model="inputMessage" @keyup.enter="sendMessage" placeholder="发消息..." class="message-input">
      <button @click="sendMessage" class="send-button">
        <i class="fas fa-paper-plane"></i> 发送
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { debounce } from 'lodash-es'
import {SendMessageSse, listMessage,deleteMessage} from '@/api/message'

const router = useRouter()
const chatWindowId = ref('') // 使用 ref 定义，以便后续监听变化
const messages = ref([])
const inputMessage = ref('')
const chatContainer = ref(null)

// 打开页面管理
const openPageManager = () => {
  router.push({ name: 'OpenPageManager' })
}
// 格式化时间函数（在script中定义）
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

// 加载历史消息
const loadMessages = async () => {
  try {
    const res = await listMessage({chatWindowsId: chatWindowId.value})
    console.log('历史消息:', res.data.data)
    if (res.data.data && res.data.data.length > 0) {
      // 将API返回的消息转换为组件需要的格式
      messages.value = res.data.data.map(msg => ({
        id: msg.id,
        text: msg.content,
        isAI: msg.type === 1 ,// 假设1是AI消息，0是用户消息
        time: new Date(msg.createTime).getTime() // 转换为时间戳
      }))

      await nextTick()
      scrollToBottom()
    }
  } catch (error) {
    console.error('加载消息失败:', error)
    ElMessage.error('加载历史消息失败')
  }
}

const sendMessage = debounce(async () => {
  if (!inputMessage.value.trim()) {
    ElMessage.warning('消息不能为空哦~');
    return;
  }

  // 添加用户消息
  messages.value.push({
    text: inputMessage.value,
    isAI: false,
    time: new Date().getTime() // 存储时间戳
  });

  const params = {
    chatWindowId: chatWindowId.value,
    content: inputMessage.value,
    type: 0,
  };

  inputMessage.value = '';
  await nextTick();
  scrollToBottom();

  try {
    const { data } = await SendMessageSse(params);
    const aiResponse = generateAIResponse(data);
    messages.value.push({
      text: aiResponse,
      isAI: true,
      time: new Date().getTime() // 存储时间戳
    });

    await nextTick();
    scrollToBottom();
  } catch (error) {
    console.error('发送消息失败:', error);
    messages.value.push({
      text: "哎呀，出错了~ 请再试一次吧 (｡•́︿•̀｡)",
      isAI: true
    });
    await nextTick();
    scrollToBottom();
  }
}, 300, { leading: true, trailing: false });

const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

const generateAIResponse = (response) => {
  if (typeof response === 'string' && !response.startsWith('data:')) {
    return response;
  }

  if (typeof response === 'string' && response.startsWith('data:')) {
    try {
      const jsonStr = response.substring(5);
      const parsed = JSON.parse(jsonStr);

      if (parsed && parsed.message) {
        return parsed.message;
      }
    } catch (e) {
      console.error('解析消息失败:', e);
      return "抱歉，我好像遇到了一些技术问题，请稍后再试~";
    }
  }

  if (response && typeof response === 'object' && response.message) {
    return response.message;
  }
  return "亲爱的，我不太明白你的意思，能再说清楚一点吗？❤️";
}

const deletemessage = async(index) => {
  // 从loadMessages中找到对应的消息的id
  const messageId = messages.value[index];
  if (messageId) {
    // 获取消息的id
    const id = messageId.id;
    const {data:{code}} = await deleteMessage({id:id})
    if(code === 0) {
      ElMessage.success('删除成功')
      loadMessages();
    }
  }
}

// 监听路由参数变化，确保 chatWindowId 正确获取
watch(() => router.currentRoute.value.query.chatId, (newValue) => {
  chatWindowId.value = newValue;
  if (newValue) {
    loadMessages();
  }
})

onMounted(() => {
  if (!sessionStorage.getItem('hasRefreshed')) {
    sessionStorage.setItem('hasRefreshed', 'true');
    location.reload();
    return;
  }
  sessionStorage.setItem('view', 98);
  chatWindowId.value = router.currentRoute.value.query.chatId;
  if (chatWindowId.value) {
    loadMessages();
  }

  ElMessage.success({
    showClose: true,
    message: '温馨提示：可以设置不同体验对象和模型',
  })
});

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
  position: relative; /* 添加相对定位 */
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
