<template>
  <div class="common-layout">
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="300px" height="100vh">
        <LefyBody></LefyBody>
      </el-aside>

      <!-- 主内容区域 -->
       <RouterView />
    </el-container>
  </div>
</template>

<script setup>
import LefyBody from './LefyBody.vue'
// import MainContent from './MainContent.vue'  // 导入新组件
</script>
