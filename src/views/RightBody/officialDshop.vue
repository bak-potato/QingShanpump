我已经按照QRCode  请帮我在第一个卡片中添加一个分享功能  单机后出现一个弹窗 并且显示二维码
<template>
  <div class="container">
    <!-- 插入图片 -->
    <div>
      <img src="/src/images/RC.jpg" alt="智能体广场" width="20px" class="img" />
    </div>
    <h2 class="title">xxxxx</h2>
    <p class="description">您可以在智能体广场，查看或体验基于模板创建的智能体，这些智能体由智谱官方发布，涉及各类行业及开发者使用场景。</p>
    <div class="box">
      <el-tabs v-model="activeName" type="card" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="全部" name="all"></el-tab-pane>
        <el-tab-pane label="商业服务" name="business"></el-tab-pane>
        <el-tab-pane label="写作辅助" name="writing"></el-tab-pane>
        <el-tab-pane label="工作提效" name="efficiency"></el-tab-pane>
        <el-tab-pane label="教育辅助" name="education"></el-tab-pane>
        <el-tab-pane label="生活助手" name="life"></el-tab-pane>
        <el-tab-pane label="其他" name="other"></el-tab-pane>
      </el-tabs>
      <el-card  style="max-width: 480px" @click="handleAIf" class="clickable-card">
        <div style="display: flex;">
          <div class="agent-icon" style="background-color: #5a67d8;"></div>
          <div class="head">
            <h3 class="agent-name">客服小谱</h3>
            <p class="agent-id">ID:18544 | 来自 xxxxx</p>
          </div>
        </div>
        <p class="agent-desc">智谱开放平台AI智能客服魔镜体，知识库内容为专有知识不支持复制，需替换自有知识库</p>
        <div class="agent-tags">
          <span class="tag">商业服务</span>
          <span class="tag">工作提效</span>
        </div>
        <div style="display: flex;justify-content: space-between;">
          <p class="agent-date">2024-11-10 发布</p>
          <div class="agent-type">对话型</div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref,onMounted } from 'vue';
import { ElTabs, ElTabPane } from 'element-plus';
import router from '@/router';
const handleClick = (tab, event) => {
  console.log(tab, event)
}
const handleAIf = () => {
  router.push('/AIGirlfriend');
}
const activeName = ref('all');
onMounted(() => {
  console.log('组件已挂载');
  sessionStorage.setItem('view', 97);

})
</script>

<style>
.box {
  width: 100%;
  height: 700px;
  max-height: 100%;
}

.img {
  width: 100%;
  height: 160px;
  border-radius: 10px;
}

.container {
  width: 100%;
  height: 100%;
  padding: 20px;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.description {
  color: #666;
  margin-bottom: 20px;
}

.category-tabs {
  margin-bottom: 20px;
}

.head {
  margin-left: 20px;
}

.agent-icon {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  margin-bottom: 8px;
}

.agent-name {
  font-size: 16px;
  margin-bottom: 4px;
}

.agent-id {
  color: #999;
  font-size: 14px;
  margin-bottom: 8px;
}

.agent-desc {
  color: #666;
  font-size: 14px;
  margin-bottom: 12px;
}

.agent-tags {
  margin-bottom: 20px;
}

.tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  background: #f5f8ff;
  color: #333;
  font-size: 12px;
  margin-right: 6px;
}

.agent-date {
  color: #999;
  font-size: 14px;
  margin-bottom: 8px;
}

.agent-type {
  font-size: 14px;
  color: #666;
  padding: 4px 8px;
  border-radius: 4px;
  background: #f5f8ff;
}

/* 添加卡片交互样式 */
.clickable-card {
  cursor: pointer;
  /* 鼠标变成手型 */
  transition: transform 0.2s ease;
  /* 添加过渡动画 */
}

.clickable-card:hover {
  transform: scale(1.05);
  /* 鼠标悬停时卡片缩放 */
}
</style>
