<template>
  <div class="friend-search-container">
    <div class="search-header">
      <h2>添加好友</h2>
      <div class="search-bar">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="输入用户ID或用户名"
          @keyup.enter="searchUsers"
        />
        <button class="search-button" @click="searchUsers">
          <span>搜索</span>
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path fill="currentColor" d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
        </button>
      </div>
    </div>

    <div class="search-results">
      <div v-if="isLoading" class="loading-indicator">
        <div class="spinner"></div>
        <span>搜索中...</span>
      </div>

      <div v-else-if="searchResults.length > 0" class="results-list">
        <div v-for="user in searchResults" :key="user.id" class="user-card">
          <div class="user-avatar">
            <img :src="user.avatar" :alt="user.name" />
          </div>
          <div class="user-info">
            <div class="user-name">{{ user.name }}</div>
            <div class="user-id">ID: {{ user.id }}</div>
          </div>
          <button
            class="add-button"
            :class="{ 'added': isFriend(user.id) }"
            @click="handleAddFriend(user.id)"
            :disabled="isFriend(user.id)"
          >
            {{ isFriend(user.id) ? '已添加' : '添加' }}
          </button>
        </div>
      </div>

      <div v-else-if="searchPerformed && searchResults.length === 0" class="no-results">
        <svg viewBox="0 0 24 24" width="48" height="48">
          <path fill="#ccc" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
        </svg>
        <p>没有找到匹配的用户</p>
      </div>

      <div v-else class="search-hint">
        <svg viewBox="0 0 24 24" width="48" height="48">
          <path fill="#ccc" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-.5-13h1v6h-1zm0 8h1v2h-1z"/>
        </svg>
        <p>输入用户ID或用户名搜索好友</p>
      </div>
    </div>

    <!-- 添加成功提示 -->
    <transition name="slide-up">
      <div v-if="showSuccessToast" class="toast-message">
        <svg viewBox="0 0 24 24" width="20" height="20">
          <path fill="#4CAF50" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
        </svg>
        <span>{{ successMessage }}</span>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 模拟的用户数据库
const mockUsers = [
  { id: '1001', name: '张三', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { id: '1002', name: '李四', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { id: '1003', name: '王五', avatar: 'https://randomuser.me/api/portraits/men/68.jpg' },
  { id: '1004', name: '赵六', avatar: 'https://randomuser.me/api/portraits/women/65.jpg' },
  { id: '1005', name: '钱七', avatar: 'https://randomuser.me/api/portraits/men/22.jpg' }
];

const searchQuery = ref('');
const searchResults = ref([]);
const isLoading = ref(false);
const searchPerformed = ref(false);
const showSuccessToast = ref(false);
const successMessage = ref('');

// 检查是否已经是好友
const isFriend = (userId) => {
  return mockUsers.some(friend => friend.id === userId);
};

// 搜索用户
const searchUsers = async () => {
  if (!searchQuery.value.trim()) return;

  isLoading.value = true;
  searchPerformed.value = true;

  // 模拟API请求延迟
  await new Promise(resolve => setTimeout(resolve, 800));

  // 模拟搜索逻辑 (实际项目中替换为API调用)
  const query = searchQuery.value.toLowerCase();
  searchResults.value = mockUsers.filter(user =>
    user.id.toLowerCase().includes(query) ||
    user.name.toLowerCase().includes(query)
  );

  isLoading.value = false;
};

// 添加好友
const handleAddFriend = (userId) => {
  const user = mockUsers.find(u => u.id === userId);
  if (!user) return;

  // 在实际项目中，这里应该调用API添加好友
  console.log('添加好友:', user);

  // 显示成功提示
  successMessage.value = `已发送好友请求给 ${user.name}`;
  showSuccessToast.value = true;

  // 3秒后自动隐藏提示
  setTimeout(() => {
    showSuccessToast.value = false;
  }, 3000);

  // 更新搜索结果中的按钮状态
  if (!searchResults.value.some(u => u.id === userId && isFriend(userId))) {
    searchResults.value = searchResults.value.map(u =>
      u.id === userId ? { ...u, isAdded: true } : u
    );
  }
};
</script>

<style scoped>
.friend-search-container {
  width: 1400px;
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.search-header {
  margin-bottom: 30px;
  text-align: center;
}

.search-header h2 {
  margin: 0 0 20px;
  color: #333;
  font-size: 24px;
}

.search-bar {
  display: flex;
  max-width: 600px;
  margin: 0 auto;
  border-radius: 25px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.search-bar input {
  flex: 1;
  padding: 12px 20px;
  border: 1px solid #ddd;
  border-right: none;
  border-radius: 25px 0 0 25px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s;
}

.search-bar input:focus {
  border-color: #4a90e2;
}

.search-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 0 25px 25px 0;
  cursor: pointer;
  transition: background-color 0.3s;
}

.search-button:hover {
  background-color: #3a7bc8;
}

.search-button span {
  margin-right: 8px;
}

.search-results {
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #666;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #4a90e2;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.results-list {
  width: 100%;
  max-width: 800px;
}

.user-card {
  display: flex;
  align-items: center;
  padding: 15px;
  margin-bottom: 10px;
  background-color: #f9f9f9;
  border-radius: 8px;
  transition: background-color 0.3s;
}

.user-card:hover {
  background-color: #f0f0f0;
}

.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 15px;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-info {
  flex: 1;
}

.user-name {
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}

.user-id {
  font-size: 14px;
  color: #777;
}

.add-button {
  padding: 8px 20px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.add-button:hover:not(:disabled) {
  background-color: #3a7bc8;
}

.add-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.add-button.added {
  background-color: #4CAF50;
}

.no-results, .search-hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #777;
  padding: 40px 0;
}

.no-results p, .search-hint p {
  margin-top: 15px;
  font-size: 16px;
}

.toast-message {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  z-index: 1000;
}

.toast-message svg {
  margin-right: 10px;
}

.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from, .slide-up-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}
</style>
