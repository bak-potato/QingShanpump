<template>
  <div class="lefymenu">
    <div
      @click="router.push('/SoftwareManagement'); activeMenu = 'SoftwareManagement'"
      class="leftmenu1 mouse"
      :class="{ active: activeMenu === 'SoftwareManagement' }"
    >
      <img class="mouse" width="20px" src="@/icons/yingyongguanli.png">应用创建
    </div>
    <!-- <div
      @click="router.push('/applist'); activeMenu = 'applist'"
      class="leftmenu1 mouse"
      :class="{ active: activeMenu === 'applist' }"
    >
      <img class="mouse" width="20px" src="@/icons/1-5qitazuoye.png">
      应用列表
    </div> -->
  </div>
</template>

<script setup>
import router from '@/router'
import { ref, onMounted } from 'vue'

const activeMenu = ref('')

// 根据当前路由设置初始激活菜单
onMounted(() => {
  const path = router.currentRoute.value.path
  if (path.includes('SoftwareManagement')) activeMenu.value = 'SoftwareManagement'
  else if (path.includes('questionmanage')) activeMenu.value = 'questionmanage'
})
</script>

<style scoped>
.leftmenu1:hover {
  background-color: #f5f5f5;
  border-radius: 25px;
}

.leftmenu1 img {
  margin-top: 10px;
  margin-left: 20px;
  float: left;
}

.leftmenu1 {
  width: 100%;
  position: relative;
  border-radius: 25px;
  margin-top: 10px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  color: #757a8c;
  cursor: pointer;
  transition: background-color 0.3s;
}

.leftmenu1.active {
  background-color: #e6e6e6; /* 比hover状态稍深的颜色 */
  color: #333; /* 文字颜色加深 */
  font-weight: 500; /* 文字加粗 */
}

.lefymenu {
  width: 100%;
}
</style>
