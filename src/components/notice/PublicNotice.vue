<template>
  <div class="notice-card">
    <h2 class="notice-title mouse">最新公告</h2>
    <ul class="notice-list">
      <li v-for="(notice, index) in notices" :key="index" class="notice-item">
        <span class="notice-date mouse">{{ formatTime(notice.createTime) }}</span>
        <a @click="showNoticeDetail(notice.id)" class="notice-link mouse">{{ notice.title }}</a>
      </li>
    </ul>
  </div>

  <!-- 公告详情弹窗 -->
  <el-dialog
    v-model="showDialog"
    width="500"
  >
    <p style="font-size: 24px; text-align: center; margin-top: -20px;">{{ currentNotice.title }}</p>
    <div class="notice-detail">
      <div class="notice-content">{{ currentNotice.context }}</div>
      <p class="notice-time">发布时间: {{ formatDetailTime(currentNotice.createTime) }}</p>

    </div>
    <template #footer>
      <el-button @click="showDialog = false" type="primary">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { cxgglist } from '../../api/notice';

// 定义公告列表
const notices = ref([]);
const showDialog = ref(false);
const currentNotice = ref({});

// 显示公告详情
const showNoticeDetail = (id) => {
  showDialog.value = true;
  currentNotice.value = notices.value.find(notice => notice.id === id);
}

// 时间格式 (列表显示用) - 年-月-日 HH:mm
const formatTime = (time) => {
  if (!time) return '';
  const date = new Date(time);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

// 时间格式 (弹窗显示用) - 与列表一致
const formatDetailTime = (time) => {
  return formatTime(time); // 使用相同的格式化函数
}

onMounted(async () => {
  try {
    const res = await cxgglist({
      current: 1,
      pageSize: 10
    });
    notices.value = res.data.data.records;
  } catch (error) {
    console.error('获取公告列表失败:', error);
  }
});
</script>

<style lang="less" scoped>
.notice-card {
  height: 550px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 100%;
}

.notice-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
  text-align: center;
}

.notice-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.notice-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  padding: 8px 0;
  border-bottom: 1px dashed #eee;
}

.notice-date {
  color: #999;
  font-size: 14px;
  margin-right: 16px;
  min-width: 140px; /* 增加宽度以适应新的时间格式 */
}

.notice-link {
  color: #007bff;
  text-decoration: none;
  font-size: 16px;
  transition: color 0.3s ease;
  cursor: pointer;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-align: left;
  text-overflow: ellipsis;
}

.notice-link:hover {
  color: #0056b3;
  text-decoration: underline;
}

.notice-detail {
  padding: 10px;

  .notice-time {
    color: #999;
    float: right;
    font-size: 14px;
    margin-bottom: 15px;
  }

  .notice-content {
    line-height: 1.6;
    white-space: pre-wrap;
  }
}

:deep(.el-dialog) {
  .el-dialog__header {
    font-weight: 600;
    text-align: center;
  }

  .el-dialog__footer {
    text-align: center;
  }
}

.mouse {
  cursor: pointer;
}
</style>
