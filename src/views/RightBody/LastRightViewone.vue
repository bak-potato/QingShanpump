<template>
  <div class="lastright">
    <el-scrollbar height="570px">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <div v-for="i in 5" :key="i" class="skeleton-card">
          <div class="skeleton-icon"></div>
          <div class="skeleton-content">
            <div class="skeleton-title"></div>
            <div class="skeleton-description"></div>
            <div class="skeleton-stats"></div>
          </div>
        </div>
      </div>

      <!-- 实际内容 -->
      <template v-else>
        <el-card
          v-for="item in listData"
          :key="item.id"
          style="min-width: 400px; position: relative; margin: 10px; height: 120px; width: 90%;border-radius: 15px;"
          shadow="hover"
        >
          <div class="app-card-container">
            <div class="app-icon">
              <img :src="item.appIcon" alt="" class="imgg">
            </div>
            <div class="app-content">
              <h3 class="app-title">{{ item.appName }}</h3>
              <p class="app-description">{{ item.appDesc }}</p>

            </div>
            <el-button
              type="primary"
              class="view-btn"
              @click="answer(item.id)"
              size="small"
            >
              查看
            </el-button>
          </div>
        </el-card>
      </template>
    </el-scrollbar>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { listAppVOByPage } from "@/api/app";
import router from '@/router';

// 应用列表数据
const listData = ref([]);
const loading = ref(true); // 新增加载状态

// 渲染应用列表
const renderAppList = async() => {
  try {
    loading.value = true;
    const res = await listAppVOByPage({page: null});
    listData.value = res.data.data.records.filter(item => item.reviewMessage !== null);
  } catch (error) {
    console.error('加载应用列表失败:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  renderAppList();
});

const answer = (id) => {
  sessionStorage.setItem('view', 99);
  router.push({
    path: '/answer',
    query: {
      id: id
    }
  });
  setTimeout(() => {
    window.location.reload();
  }, 100);
};
</script>

<style scoped>
.lastright {
  height: 600px;
  background-color: #ffffff;
}

.app-card-container {
  display: flex;
  height: 100px;
  padding: 10px;
  position: relative;
}

.app-icon {
  width: 80px;
  height: 80px;
  margin-right: 15px;
}

.app-icon img {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  object-fit: cover;
}

.app-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.app-title {
  font-size: 16px;
  font-weight: bold;
  margin: 0;
  color: #333;
}

.app-description {
  font-size: 12px;
  color: #666;
  margin: 5px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.app-stats {
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 12px;
  color: #757a8c;
}

.app-stats img {
  margin-right: 5px;
  vertical-align: middle;
}

.view-btn {
  position: absolute;
  right: 15px;
  bottom: 15px;
  top: 20px;
  padding: 8px 20px;
  border-radius: 15px;
  background-color: #5147ff;
  border: none;
}

.view-btn:hover {
  background-color: #4538ff;
}

:deep(.el-card__body) {
  padding: 0;
  height: 100%;
}

/* 加载动画样式 */
.loading-container {
  padding: 10px;
}

.skeleton-card {
  display: flex;
  height: 140px;
  margin-bottom: 10px;
  padding: 15px;
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.skeleton-icon {
  width: 80px;
  height: 80px;
  margin-right: 15px;
  background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
  background-size: 400% 100%;
  border-radius: 10px;
  animation: skeleton-loading 1.4s ease infinite;
}

.skeleton-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.skeleton-title {
  width: 60%;
  height: 20px;
  background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
  background-size: 400% 100%;
  animation: skeleton-loading 1.4s ease infinite;
  border-radius: 4px;
}

.skeleton-description {
  width: 90%;
  height: 36px;
  margin-top: 10px;
  background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
  background-size: 400% 100%;
  animation: skeleton-loading 1.4s ease infinite;
  border-radius: 4px;
}

.skeleton-stats {
  width: 80%;
  height: 16px;
  margin-top: 10px;
  background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
  background-size: 400% 100%;
  animation: skeleton-loading 1.4s ease infinite;
  border-radius: 4px;
}

@keyframes skeleton-loading {
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
}
</style>
