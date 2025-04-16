<template>
  <div class="public-notice">
    <div class="notice-card">
      <h2 class="notice-title mouse">最新公告</h2>
      <ul class="notice-list">
        <li v-for="(notice, index) in notices" :key="index" class="notice-item">
          <span class="notice-date mouse">{{ notice.date }}</span>
          <a @click="add(notice.id)" class="notice-link mouse">{{ notice.title }}</a>
        </li>
      </ul>
    </div>

    <!-- 公告详情弹窗 -->
    <el-dialog
    v-model="showDialog"
    :title= "currentNotice.title"
     width="500"
  >
      <span>{{ currentNotice.content}}</span>
      <template #footer>
        <el-button @click="showDialog = false" type="primary">关闭</el-button>
      </template>
   </el-dialog>

  </div>
</template>

<script setup>
import { ref } from 'vue';
// 模拟公告数据
const notices = ref([
  {
    id:1,
    date: '2025-03-20',
    title: '这是一条重要公告的标题',
    content: '这是一条重要公告的详细内容，包含了具体的信息和要求，请大家仔细阅读。'
  },
  {
    id:2,
    date: '2025-03-19',
    title: '另一条公告的标题',
    content: '这是另一条公告的详细内容，可能涉及到一些重要的事项，请大家关注。'
  }
]);
const showDialog = ref(false);
const currentNotice = ref({});
const add = (id) => {
  showDialog.value = true;
  currentNotice.value = notices.value[id-1];
}
</script>

<style lang="less">
.public-notice {
  margin: 0 auto;
  width: 100%;
  max-width: 600px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
}

.notice-card {
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
}

.notice-date {
  color: #999;
  font-size: 14px;
  margin-right: 16px;
  min-width: 80px;
}

.notice-link {
  color: #007bff;
  text-decoration: none;
  font-size: 16px;
  transition: color 0.3s ease;
}

.notice-link:hover {
  color: #0056b3;
  text-decoration: underline;
}
.el-dialog {
.el-dialog__header {
    font-weight: 600px;
    text-align: center;
}
  .el-dialog__footer {
    text-align: center;

  }
}





</style>
