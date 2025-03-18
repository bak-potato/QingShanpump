<template>
  <div class="newguide" :style="{ display: isVisible ? 'flex' : 'none' }">
    <div class="newguidein">
      <!-- 第一行文字 -->
      <div class="ffont">
        <div>新手指南</div>
        <div><img width="16px" src="../icons/xiangyoula.png"></div>
        <div> <img @click="handleclose" src="../icons/guanbi.png" width="20px" ></div>
      </div>
      <!-- 内容 -->
      <div class="fcontent">
        <el-card >
          <div class="shanji">
            什么是山清
          </div>
        </el-card>
        <el-card >
          <div class="shanji">
            快速开始
          </div>
        </el-card>
        <el-card >
          <div class="shanji">
            产品动态
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 定义一个响应式变量来控制元素的显示状态
const isVisible = ref(true);

const handleclose = () => {
  // 将状态设置为隐藏
  isVisible.value = false;
  // 存储状态到本地存储
  localStorage.setItem('newguideVisible', 'false');
};

onMounted(() => {
  // 从本地存储获取状态
  const storedValue = localStorage.getItem('newguideVisible');
  if (storedValue === 'false') {
    // 如果本地存储的值为 false，设置为隐藏状态
    isVisible.value = false;
  }
});
</script>

<style scoped>
.shanji{
  color: white;
  position: absolute;
  bottom: 20px;
  font-size: 16px;
}
.el-card{
  position: relative;
  width: 31%;
  min-width: 300px;
  background-image: url('@/images/20250313191013.png');
  background-size: 100% 100%;
  height: 200px;
  margin: 1%;
  border-radius: 25px;
}
.fcontent{
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  border-radius: 25px;
  height: 100%;
}
.ffont div:first-child{
  font-size: 20px;
  float: left;
  margin-left: 20px;
}
.ffont div:last-child{
margin-top: 10px;
float: right;
margin-right: 20px;

}
.ffont div:nth-child(2){
  font-size: 20px;
  float: left;
  margin-top: 1px;
  margin-left: 5px;
}
.ffont{
  width: 100%;
  height: 24px;
  margin-bottom: 10px;

}
.newguidein{
  overflow: hidden;
min-width: 1350px;
max-width: 1500px;
  height: 250px;
}
.newguide{
  position: relative;
margin: 0px auto;
display: flex;
justify-content: center
}

</style>
