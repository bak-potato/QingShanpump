<!-- MainContent.vue -->
<template>
  <el-container>
    <el-header style="height: auto;">
      <TopCenter />
    </el-header>
    <!-- 主体内容 -->
    <el-main>
      <LastGuide />
    </el-main>
  </el-container>
</template>

<script setup>
import TopCenter from '@/views/RightBody/TopCenter.vue'
import LastGuide from '@/views/RightBody/LastGuide.vue'
</script>

<style scoped>
*{
  overflow-x: hidden;
}
.el-main {
  position: relative;
  min-width: 1000px;
}
</style>
