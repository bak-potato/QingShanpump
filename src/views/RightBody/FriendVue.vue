<template>
  <div class="chat-container">
    <!-- 聊天头部 -->
    <div class="chat-header">
      <div class="chat-header-avatar">
        <img :src="currentChat.avatar" :alt="currentChat.name">
      </div>
      <div class="chat-header-info">
        <div class="chat-header-name">{{ currentChat.name }}</div>
        <div class="chat-header-status">{{ currentChat.status }}</div>
      </div>
      <div class="chat-header-actions">
        <button @click="startCall">📞</button>
        <button @click="searchMessages">🔍</button>
        <button @click="showMoreOptions">⋮</button>
      </div>
    </div>

    <!-- 消息区域 -->
    <div class="messages" ref="messagesContainer">
      <div
        v-for="(message, index) in messages"
        :key="index"
        class="message"
        :class="{ 'received': !message.sent, 'sent': message.sent }"
      >
        <div class="message-avatar" v-if="!message.sent">
          <img :src="currentChat.avatar" :alt="currentChat.name">
        </div>
        <div class="message-content">
          <div class="message-bubble">{{ message.text }}</div>
          <div class="message-time">{{ formatTime(message.time) }}</div>
        </div>
      </div>
    </div>

    <!-- 消息输入区域 -->
    <div class="message-input-area">
      <button class="emoji-button" @click="toggleEmojiPicker">😊</button>
      <button class="attachment-button" @click="openAttachmentMenu">📎</button>
      <textarea
        class="message-input"
        v-model="newMessage"
        placeholder="输入消息..."
        @keydown.enter.exact.prevent="sendMessage"
        @input="adjustTextareaHeight"
        ref="messageInput"
      ></textarea>
      <button class="send-button" @click="sendMessage">➤</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChatInterface',
  props: {
    currentChat: {
      type: Object,
      required: true,
      default: () => ({
        id: 1,
        name: '张三',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        status: '在线'
      })
    },
    initialMessages: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      messages: [
        { text: '你好，最近怎么样？', sent: false, time: new Date(Date.now() - 3600000) },
        { text: '我很好，谢谢关心！项目进展顺利吗？', sent: true, time: new Date(Date.now() - 3540000) },
        { text: '项目进展很顺利，我们已经完成了第一阶段的工作。下周我们会开始第二阶段的开发。', sent: false, time: new Date(Date.now() - 3500000) },
        { text: '太好了！有什么需要我协助的吗？', sent: true, time: new Date(Date.now() - 3480000) },
        { text: '如果你有时间的话，可以帮忙看一下UI设计稿吗？我把链接发给你。', sent: false, time: new Date(Date.now() - 3450000) }
      ],
      newMessage: '',
      showEmojiPicker: false
    }
  },
  mounted() {
    // 如果有初始消息，合并到消息列表
    if (this.initialMessages.length > 0) {
      this.messages = [...this.initialMessages, ...this.messages];
    }
    this.scrollToBottom();
  },
  methods: {
    sendMessage() {
      if (this.newMessage.trim() === '') return;

      const message = {
        text: this.newMessage,
        sent: true,
        time: new Date()
      };

      this.messages.push(message);
      this.newMessage = '';
      this.$nextTick(() => {
        this.scrollToBottom();
        this.resetTextareaHeight();
      });

      // 可以在这里添加发送消息到服务器的逻辑
      // this.$emit('send-message', message);

      // 模拟回复
      setTimeout(() => {
        this.messages.push({
          text: '收到你的消息了，我会尽快回复！',
          sent: false,
          time: new Date()
        });
        this.scrollToBottom();
      }, 1000);
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.messagesContainer;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    },
    formatTime(date) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },
    adjustTextareaHeight() {
      const textarea = this.$refs.messageInput;
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    },
    resetTextareaHeight() {
      const textarea = this.$refs.messageInput;
      textarea.style.height = '40px';
    },
    toggleEmojiPicker() {
      this.showEmojiPicker = !this.showEmojiPicker;
      // 实际项目中可以集成emoji选择器
    },
    openAttachmentMenu() {
      // 实现附件菜单逻辑
      console.log('打开附件菜单');
    },
    startCall() {
      console.log('开始通话');
    },
    searchMessages() {
      console.log('搜索消息');
    },
    showMoreOptions() {
      console.log('显示更多选项');
    }
  },
  watch: {
    currentChat: {
      handler(newVal) {
        // 当聊天对象变化时，可以加载对应的消息
        console.log('切换到聊天:', newVal.name);
        this.scrollToBottom();
      },
      immediate: true
    }
  }
}
</script>

<style scoped>
.chat-container {
  width: 1400px;
  height: 95vh;
  margin: 20px auto;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 聊天头部 */
.chat-header {
  padding: 15px 20px;
  border-bottom: 1px solid #eaeaea;
  display: flex;
  align-items: center;
}

.chat-header-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #ddd;
  margin-right: 15px;
  overflow: hidden;
}

.chat-header-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.chat-header-info {
  flex: 1;
}

.chat-header-name {
  font-weight: bold;
}

.chat-header-status {
  font-size: 12px;
  color: #777;
}

.chat-header-actions {
  display: flex;
}

.chat-header-actions button {
  background: none;
  border: none;
  cursor: pointer;
  margin-left: 15px;
  color: #777;
  font-size: 18px;
  transition: color 0.2s;
}

.chat-header-actions button:hover {
  color: #0084ff;
}

/* 消息区域 */
.messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #f9f9f9;
}

.message {
  display: flex;
  margin-bottom: 15px;
}

.message.received {
  justify-content: flex-start;
}

.message.sent {
  justify-content: flex-end;
}

.message-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #ddd;
  margin-right: 10px;
  overflow: hidden;
  flex-shrink: 0;
}

.message-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.message-content {
  max-width: 60%;
}

.message.sent .message-content {
  text-align: right;
}

.message-bubble {
  padding: 12px 15px;
  border-radius: 18px;
  line-height: 1.4;
  font-size: 14px;
  position: relative;
  word-break: break-word;
}

.received .message-bubble {
  background-color: white;
  color: #333;
  border: 1px solid #eaeaea;
}

.sent .message-bubble {
  background-color: #0084ff;
  color: white;
}

.message-time {
  font-size: 11px;
  color: #999;
  margin-top: 5px;
}

/* 消息输入区域 */
.message-input-area {
  padding: 15px;
  border-top: 1px solid #eaeaea;
  display: flex;
  align-items: center;
  background-color: white;
}

.message-input {
  flex: 1;
  border: 1px solid #eaeaea;
  border-radius: 20px;
  padding: 10px 15px;
  outline: none;
  resize: none;
  height: 40px;
  max-height: 120px;
  font-size: 14px;
  transition: height 0.2s;
}

.message-input:focus {
  border-color: #0084ff;
}

.emoji-button, .attachment-button {
  background: none;
  border: none;
  color: #777;
  font-size: 20px;
  margin-right: 10px;
  cursor: pointer;
  transition: color 0.2s;
}

.emoji-button:hover, .attachment-button:hover {
  color: #0084ff;
}

.send-button {
  background-color: #0084ff;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  margin-left: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.send-button:hover {
  background-color: #0073e6;
}
</style>
