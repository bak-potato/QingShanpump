<template>
  <div class="lefymenu">
    <div @click="router.push('/usermanage1')" class="leftmenu1">
      <img width="20px" src="@/icons/yonghuguanli.png">用户管理
    </div>
     <!-- <div @click="router.push('/usermanage')" class="leftmenu1">
      <img width="20px" src="@/icons/huidaguanli.png">

      回答管理
    </div> -->
     <div @click="router.push('/ApplicationManagement')" class="leftmenu1">
      <img width="20px" src="@/icons/a-yingyongguanli1.png">

      应用管理
    </div>
     <div @click="router.push('/VueDataAnalyticsPanel')" class="leftmenu1">
      <img width="20px" src="@/icons/tongjifenxi.png">

      统计分析
    </div>
   </div>
</template>

<script setup>
import router from '@/router'

</script>
<style scoped>
.leftmenu1:hover{
  background-color: #f5f5f5;
  border-radius: 25px;
}
.leftmenu1 img{
  margin-top: 10px;
  margin-left: 20px;
  float: left;
}
.leftmenu1{
  width: 100%;
  position: relative;
  border-radius: 25px;
  margin-top: 10px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  color: #757a8c;
}
.lefymenu{
  width: 100%;
}
</style>
