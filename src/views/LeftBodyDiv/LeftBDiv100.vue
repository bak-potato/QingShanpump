<template>
  <div class="lefymenu">
    <div
      @click="router.push('/usermanage1'); activeMenu = 'usermanage1'"
      class="leftmenu1"
      :class="{ active: activeMenu === 'usermanage1' }"
    >
      <img width="20px" src="@/icons/yonghuguanli.png">用户管理
    </div>
    <div
      @click="router.push('/ApplicationManagement'); activeMenu = 'ApplicationManagement'"
      class="leftmenu1"
      :class="{ active: activeMenu === 'ApplicationManagement' }"
    >
      <img width="20px" src="@/icons/a-yingyongguanli1.png">
      应用管理
    </div>
     <div
      @click="router.push('/ForumManView'); activeMenu = 'ForumManView'"
      class="leftmenu1"
      :class="{ active: activeMenu === 'ForumManView' }"
    >
      <img width="20px" src="@/icons/wodetiezi.png">
      论坛管理
    </div>
    <div
      @click="router.push('/VueDataAnalyticsPanel'); activeMenu = 'VueDataAnalyticsPanel'"
      class="leftmenu1"
      :class="{ active: activeMenu === 'VueDataAnalyticsPanel' }"
    >
      <img width="20px" src="@/icons/tongjifenxi.png">
      统计分析
    </div>
    <div
      @click="router.push('/ApplicationReview'); activeMenu = 'ApplicationReview'"
      class="leftmenu1"
      :class="{ active: activeMenu === 'ApplicationReview' }"
    >
      <img width="20px" src="@/icons/shenhe.png">
      应用审核
    </div>
  </div>
</template>

<script setup>
import router from '@/router'
import { ref, onMounted } from 'vue'

const activeMenu = ref('')

// 根据当前路由设置初始激活菜单
onMounted(() => {
  const path = router.currentRoute.value.path
  if (path.includes('usermanage1')) activeMenu.value = 'usermanage1'
  else if (path.includes('ApplicationManagement')) activeMenu.value = 'ApplicationManagement'
  else if (path.includes('VueDataAnalyticsPanel')) activeMenu.value = 'VueDataAnalyticsPanel'
  else if (path.includes('ApplicationReview')) activeMenu.value = 'ApplicationReview'
  else if (path.includes('ForumManView')) activeMenu.value = 'ForumManView'

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
