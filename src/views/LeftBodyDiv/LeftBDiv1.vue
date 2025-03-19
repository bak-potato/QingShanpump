<template>
  <div class="lefymenu">
    <div @click="router.push('/SoftwareManagement')" class="leftmenu1">
      <img width="20px" src="@/icons/yingyongguanli.png">应用管理
    </div>
     <div @click="router.push('/questionmanage')" class="leftmenu1">
      <img width="20px" src="@/icons/1-5qitazuoye.png">

      题目管理
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
