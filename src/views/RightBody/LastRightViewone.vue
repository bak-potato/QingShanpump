<template>
  <div class="lastright">
    <el-scrollbar height="670px">
      <el-card
        v-for="item in listData"
        :key="item.id"
        style="min-width: 400px; position: relative; margin: 10px; height: 140px; width: 90%;border-radius: 15px;"
        shadow="hover"
      >
        <div class="app-card-container">
          <div class="app-icon">
            <img :src="item.appIcon" alt="" class="imgg">
          </div>
          <div class="app-content">
            <h3 class="app-title">{{ item.appName }}</h3>
            <p class="app-description">{{ item.appDesc }}</p>
            <div class="app-stats">
              <span><img width="16px" height="16px" src="@/icons/navbar_guanzhong.png"> {{ item.views || '304.7k' }}</span>
              <span><img width="16px" height="16px" src="@/icons/31pinglun.png"> {{ item.comments || '304.7k' }}</span>
              <span><img width="16px" height="16px" src="@/icons/shoucang.png"> {{ item.favorites || '304.7k' }}</span>
            </div>
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
    </el-scrollbar>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { listAppVOByPage } from "@/api/app";
import router from '@/router';

// 应用列表数据
const listData = ref([]);

// 渲染应用列表
const renderAppList = async() => {
  const res = await listAppVOByPage({page: null});
  listData.value = res.data.data.records.filter(item => item.reviewMessage !== null);
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
  height: 100%;
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
</style>
