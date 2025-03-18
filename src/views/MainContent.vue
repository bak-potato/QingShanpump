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
import TopCenter from './TopCenter.vue'
import NewGuide from './NewGuide.vue'
import LastGuide from './LastGuide.vue'
</script>

<style scoped>
.el-main {
  position: relative;
  min-width: 1000px;
  margin-top: 160px;
}
</style>
