<!-- MainContent.vue -->
<template>
  <el-container>
    <el-header>
      <TopCenter />
    </el-header>
    <!-- 主体内容 -->
    <el-main>
      <NewGuide />
      <LastGuide />
    </el-main>
  </el-container>
</template>

<script setup>
import TopCenter from './RightBody/TopCenter.vue'
import NewGuide from './RightBody/NewGuide.vue'
import LastGuide from './RightBody/LastGuide.vue'
</script>

<style scoped>
.el-main {
  position: relative;
  min-width: 1000px;
  margin-top: 160px;
}
</style>
