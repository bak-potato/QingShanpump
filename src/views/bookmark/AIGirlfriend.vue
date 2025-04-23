<template>
  <div class="chat-app" :class="{ 'pink-mode': isPinkMode }">
    <div class="mode-switch">
      <label class="switch">
        <input type="checkbox" v-model="isPinkMode">
        <span class="slider round"></span>
      </label>
      <span class="mode-label">粉色模式</span>
    </div>

    <div class="chat-container" ref="chatContainer">
      <div v-for="(message, index) in messages" :key="index" :class="['message', message.isAI ? 'ai' : 'user']">
        <div class="message-content">
          <div class="message-text">{{ message.text }}</div>
        </div>
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
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { debounce } from 'lodash-es'

const router = useRouter()
const isPinkMode = ref(false)
const messages = ref([
  { text: "亲爱的，你终于来啦~ 今天过得怎么样呀？❤️", isAI: true }
])
const inputMessage = ref('')
const chatContainer = ref(null)

const sendMessage = debounce(async () => {
    if (!inputMessage.value.trim()) {
    ElMessage.warning('消息不能为空哦~')
    return
  }
  if (!inputMessage.value.trim()) return

  // 添加用户消息
  messages.value.push({
    text: inputMessage.value,
    isAI: false
  })

  const userMessage = inputMessage.value
  inputMessage.value = ''

  await nextTick()
  scrollToBottom()

  // 模拟AI响应
  setTimeout(async () => {
    messages.value.push({
      text: generateAIResponse(userMessage),
      isAI: true
    })

    await nextTick()
    scrollToBottom()
  }, 800)
}, 300, { leading: true, trailing: false })

const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

const generateAIResponse = (userInput) => {
  const responses = [
    `嗯嗯，${userInput}... 人家觉得这个问题好有趣呢~ (◕‿◕✿)`,
    `宝贝，${userInput}这个问题让我想到... 你觉得呢？`,
    `(。・ω・。) ${userInput}... 人家也在想这个问题呢~`,
    `亲爱的，关于${userInput}... 我觉得可以这样... 你觉得呢？`,
    `(｡♥‿♥｡) 你问${userInput}呀... 让我想想哦~`,
    `唔... ${userInput}... 人家觉得最重要的是你的感受呢~`,
    `嘻嘻，${userInput}... 你总是问这么可爱的问题 ❤️`,
    `(づ｡◕‿‿◕｡)づ ${userInput}... 人家好喜欢和你聊天呢~`
  ]
  return responses[Math.floor(Math.random() * responses.length)]
}
setTimeout(() => {
  const onFocus = document.getElementById('fxx');
  onFocus.focus();
},500)
// 初始问候
onMounted(() => {
  // 检查是否已经刷新过


  sessionStorage.setItem('view', 98);

  if (!sessionStorage.getItem('hasRefreshed')) {
    sessionStorage.setItem('hasRefreshed', 'true');
    // 延迟1s后刷新页面
    setTimeout(() => {
      window.location.reload();
    }, 50);
  } else {
    ElMessage.success({
      showClose: true,
      message: '温馨提示：可以设置不同体验对象和模型',
    })
    // 正常执行其他初始化逻辑
    setTimeout(() => {
      messages.value.push({
        text: "人家等你好久啦~ 有什么想和我聊的吗？(✿◠‿◠)",
        isAI: true
      });
      scrollToBottom();
    }, 1500);
  }
});
router.afterEach(() => {
  sessionStorage.removeItem('hasRefreshed');
});
</script>

<style scoped>
.chat-app {
  width: 1300px;
  margin: 20px auto 0;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 15px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.05);
  height: 90vh;
  display: flex;
  flex-direction: column;
  border: 1px solid white;
  transition: all 0.3s ease;
}

.chat-app.pink-mode {
  background-color: #fff0f5;
  border-color: #ffb6c1;
  box-shadow: 0 2px 20px rgba(255, 182, 193, 0.2);
}

.mode-switch {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  padding: 8px 15px;
  background-color: #f8f8f8;
  border-radius: 20px;
  align-self: flex-end;
}

.pink-mode .mode-switch {
  background-color: #ffecec;
}

.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
  margin-right: 10px;
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
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
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
  transform: translateX(26px);
}

.mode-label {
  font-size: 14px;
  color: #666;
}

.pink-mode .mode-label {
  color: #d23669;
}

.chat-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background-color: white;
  border-radius: 12px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: all 0.3s ease;
}

.pink-mode .chat-container {
  background-color: #fff5f7;
  border: 1px solid #ffd6e0;
}

.message {
  max-width: 75%;
  animation: fadeIn 0.3s ease;
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
  padding: 14px 18px;
  border-radius: 12px;
  line-height: 1.6;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.user .message-content {
  background-color: #ffffff;
  border-bottom-right-radius: 4px;
}

.pink-mode .user .message-content {
  background-color: #ffecec;
}

.ai .message-content {
  background-color: #f5f5f5;
  border-bottom-left-radius: 4px;
}

.pink-mode .ai .message-content {
  background-color: #ffd6e0;
}

.message-text {
  font-size: 16px;
  color: #333;
}

.ai .message-text {
  color: #000000;
}

.pink-mode .ai .message-text {
  color: #8a2a52;
}

.input-area {
  display: flex;
  gap: 12px;
  padding: 15px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
  border: 1px solid #ffecec;
  transition: all 0.3s ease;
}

.pink-mode .input-area {
  background-color: #fff0f5;
  border-color: #ffb6c1;
  box-shadow: 0 2px 10px rgba(255, 182, 193, 0.2);
}

.message-input {
  flex: 1;
  padding: 14px 18px;
  border: 1px solid #ffd6d6;
  border-radius: 25px;
  outline: none;
  font-size: 16px;
  transition: all 0.3s;
  background-color: white;
}

.pink-mode .message-input {
  border-color: #ffb6c1;
  background-color: #fffafb;
}

.message-input:focus {
  border-color: white;
  box-shadow: 0 0 0 2px rgba(255, 157, 181, 0.2);
}

.pink-mode .message-input:focus {
  border-color: #ff85a2;
  box-shadow: 0 0 0 2px rgba(255, 133, 162, 0.3);
}

.send-button {
  padding: 12px 24px;
  border: none;
  border-radius: 20px;
  background-color: #42a5f5;
  color: white;
  cursor: pointer;
  font-size: 15px;
  transition: all 0.3s;
}

.pink-mode .send-button {
  background: linear-gradient(135deg, #ff85a2, #ff6b8b);
}

.send-button:hover {
  background: linear-gradient(135deg, white, white);
  transform: translateY(-2px);
  color: #000000;
}

.pink-mode .send-button:hover {
  background: linear-gradient(135deg, #ff6b8b, #ff477e);
}

.send-button i {
  margin-right: 8px;
}

/* 自定义滚动条 */
.chat-container::-webkit-scrollbar {
  width: 8px;
}

.chat-container::-webkit-scrollbar-track {
  background: #fff0f0;
  border-radius: 10px;
}

.pink-mode .chat-container::-webkit-scrollbar-track {
  background: #ffe0e8;
}

.chat-container::-webkit-scrollbar-thumb {
  background: #ffb6c1;
  border-radius: 10px;
}

.chat-container::-webkit-scrollbar-thumb:hover {
  background: white;
}

.pink-mode .chat-container::-webkit-scrollbar-thumb:hover {
  background: #ff85a2;
}
</style>
