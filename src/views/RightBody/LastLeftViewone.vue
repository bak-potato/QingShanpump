<template>
  <div class="LastLeftViewone">

<el-scrollbar height="600px">
    <!-- <div v-for="item in 20" :key="item" class="scrollbar-demo-item">{{ item }}</div> -->
    <div class="shanji"  v-for="item in 20" :key="item">
      <div class="ftx">
<img width="20px" height="20px" src="@/icons/20250314204717.png" ><p>山清API @ShanQingAPI</p>
 <el-button>+ 关注</el-button>
<div class="h2c">向你推荐</div>

</div>
<el-card style="width: 90%;margin: 10px auto; height: 80px;" shadow="hover" class="ftc">

<img class="ftcimg" width="48px" height="48px" src="@/images/20250314210839.png" >
<p class="ftcp">文案改写</p>
<div class="ftca">
<img width="16px" height="16px" src="@/icons/navbar_guanzhong.png" > <p>304.7k</p>
<img width="16px" height="16px" src="@/icons/31pinglun.png" > <p>304.7k</p>
<img width="16px" height="16px" src="@/icons/shoucang.png" > <p>304.7k</p>

</div>
</el-card>

    </div>



  </el-scrollbar>


  </div>
</template>
<script setup>

</script>

<style scoped>

:deep(.el-card__body) {
  padding: 0;
}

.ftca p{
  float: left;
    font-size: 18px;
  margin-left: 10px;
  margin-top: 6px;
}
.ftca img{
  float: left;
  margin-top: 5px;
margin-left: 10px;
}
.ftca{
  color: #757a8c;
  margin-top: 5px;
  height: 16px;
  line-height: 16px;
}
.ftcp {
  font-size: 18px;
  margin-left: 80px;
  margin-top: 6px;
}
.ftcimg{
  margin-left: 10px;
  float: left;
  margin: 10px;
  border-radius: 5px;
}
.h2c{
  color: #757a8c;
  font-size: 14px;
  margin-right: 20px;
  float: right;
}
.el-button{
  margin-top: 0px;
  width: 60px;
  height: 30px;
  font-size: 12px;
  margin-left: 20px;
color: #8984ff;
  background-color: #e6e9ff;
}
.el-button:hover{
  background-color: #ced2f1;
  color: #8984ff;
}
.ftx p{
  display: inline-block;
  margin-left: 3px;
  margin-top: 2px;
  color: #757a8c;
  font-size: 14px;
}
.ftx img{
  margin-left: 10px;
  float: left;
  margin-top: 3px;
  border-radius: 25px;
}
.ftx{
  width: 100%;
  height: 24px;
}
.shanji{
  width: 100%;
  margin: 10px;
  height: 130px;
}
.LastLeftViewone{
  width: 98%;
  height: auto;
  margin: 10px auto;
  }
</style>
