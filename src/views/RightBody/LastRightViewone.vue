<template>
  <div class="lastright">
<el-scrollbar height="670px">
 <el-card  v-for="item in 20" :key="item" style="min-width: 400px; position: relative; margin: 10px; height: 140px; width: 90%;border-radius: 15px;" shadow="hover">
<div class="lrf mouse">
</div>
<div class="lrr ">
  <div class="lrr1 mouse">图文生成工具
    <div class="lrr2 clickable">
      <img  width="12px" src="@/icons/wenjianxiazaicopy.png">
      应用</div>
  </div>
  <div class="lrr3">
<img width="16px" src="@/icons/50309213222.png" >&nbsp; @山清官方
  </div>
  <div class="lrr4">
    这是一个图文生成工具，你可以通过输入文字生成图片，也可以通过输入图片生成文字。
  </div>
</div>
  <div class="hrt1"></div>

<div class="ftca">
<img width="16px" class="mouse" height="16px" src="@/icons/navbar_guanzhong.png" > <p>304.7k</p>
<img width="16px" class="mouse" height="16px" src="@/icons/31pinglun.png" > <p>304.7k</p>
<img width="16px" class="mouse" height="16px" src="@/icons/shoucang.png" > <p>304.7k</p>

</div>
 </el-card>
</el-scrollbar>

  </div>
</template>

<script setup>
</script>
<style scoped>
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
  position: absolute;
  bottom: 13px;
  line-height: 16px;
}
.hrt1{
  height: 1px;
  top: 105px;
  margin: 0px auto;
  margin-left: 5%;
  width: 90%;
  background-color: #ebedff;
  position: absolute;
}

.lrr4{
  font-size: 13px;
  height: 40px;
  color: #999999;
  overflow: hidden;
  text-overflow: ellipsis;
}
.lrr3 img{
  float: left;
  margin-top: 2px;
  border-radius: 25px;
}
.lrr3{
  height: 20px;
  line-height: 20px;
  font-size: 12px;
  color: #999999;
}
.lrr2 img{
  width: 12px;
  float: left;
  margin-left: 12px;
  height: 12px;
  margin-top: 6px;
}
.lrr2{
  position: absolute;
  right: 2px;
  top: 2px;
  font-size: 12px;
  border-radius: 10px;
  text-align: center;
  line-height: 24px;
  height: 24px;
  width: 62px;
  color: #4d53e8;
  background-color: #e6e9ff;
}
.lrr1{
  font-size: 18px;
  font-weight: bold;
}
.lrr{
  position: absolute;
  left: 100px;
  height: 80px;
  top: 10px;
  width: 80%;
}
:deep(.el-card__body) {
  padding: 0;
}

.lrf{
  width: 80px;
  background-color: antiquewhite;
  background-image: url("@/icons/img1.png");
  background-size: 100% 100%;
  height: 80px;
  position:absolute;
  left: 10px;
  top: 10px;
  border-radius: 10px;
}
</style>
