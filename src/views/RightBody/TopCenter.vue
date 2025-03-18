<template>
  <div class="topcenter ">
  <div class="block text-center gd">
    <span class="demonstration">
    </span>
    <el-carousel height="220px">
      <el-carousel-item >
        <div class="divbac"></div>

      </el-carousel-item>
      <el-carousel-item >
        <div class="divbac"></div>

      </el-carousel-item>
      <el-carousel-item >
        <div class="divbac"></div>

      </el-carousel-item>

      <el-carousel-item >
        <div class="divbac"></div>

      </el-carousel-item>
    </el-carousel>
  </div>

  </div>


</template>

<style scoped>
.divbac{
  width: 100%;
  height: 100%;
  background-image: url('@/images/asdfg.png');
  background-size: 100% 100%;
}
.el-carousel{
  border-radius: 25px;

}
.el-carousel__item{
  border-radius: 25px;

}

.topcenter{
  min-width: 1200px;
  max-width: 1500px;
display: flex;
margin: 0px auto;
justify-content: center;
height: 230px;
}
.gd{
  width: 1400px;
  margin-top: 1vh;
  height: 220px;
}
.demonstration {
  color: var(--el-text-color-secondary);
}

.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
