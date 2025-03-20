<template>
<div class="dshop">
<div class="dshoptitle">
<p class="dshoptitle1 ">项目商店</p>
  <div class="search-container">
    <!-- 输入框 + 搜索按钮 -->
    <el-input
      style="border-radius: 25px;"
      v-model="keyword"
      placeholder="搜索"
      clearable
      @keyup.enter="handleSearch"
    >

    </el-input>
  </div>
    <el-button class="dstt2" type="primary">上架应用</el-button>
</div>
<div class="dshoptitlet">
  <div class="dshoptitlet2">
<p class="dsa">
🎨DeepSeek驱动，开启图文制作AutoPilot模式

</p>
<br>
<p class="dsa2">
图文工厂，让你不再为内容发愁

</p>
    <el-button class="elbut1" type="primary">立即聊聊</el-button>
  </div>
  <div class="dshoptitlet3">

<div class="dsimg1">
 <el-row>
    <el-col :span="6">
      <el-statistic title="共上架应用" :value="268500" />
    </el-col>
    <el-col :span="6">
      <el-statistic :value="138">
        <template #title>
          <div style="display: inline-flex; align-items: center">
            当前用户数
            <el-icon style="margin-left: 4px" :size="12">
              <Male />
            </el-icon>
          </div>
        </template>
        <template #suffix>/100</template>
      </el-statistic>
    </el-col>
    <el-col :span="6">
      <el-statistic title="全站得分" :value="outputValue" />
    </el-col>
    <el-col :span="6">
      <el-statistic title="今日提交数" :value="562">
        <template #suffix>
          <el-icon style="vertical-align: -0.125em">
            <ChatLineRound />
          </el-icon>
        </template>
      </el-statistic>
    </el-col>
  </el-row>
</div>
  </div>

</div>
<div class="dshoptitleta">
 <el-card shadow="hover" v-for="item in 20" :key="item"  style="max-width: 480px">
  <div class="dshoptitleta2"></div>
</el-card>
</div>
</div>
</template>

<script setup>
import { ref } from 'vue';

const keyword = ref('');

const handleSearch = () => {
  if (!keyword.value.trim()) return;
  console.log('搜索关键词:', keyword.value);
  // 调用搜索 API 或处理逻辑
};
import { useTransition } from '@vueuse/core';
import { ChatLineRound, Male } from '@element-plus/icons-vue';

const source = ref(0);
const outputValue = useTransition(source, {
  duration: 1500,
});
source.value = 172000;
</script>

<style scoped>
.el-col {
  text-align: center;
}
/* .dshoptitleta2{

} */
.el-card{
  width: 320px;
  height: 220px;
  margin-top: 30px;
}
.dshoptitleta{
  max-width: 1350px ;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 30px;
  width: 100%;
  /* margin-top: 30px; */
  height: 220px;
  position: relative;
}
.elbut1{
  margin-left: 20px;
  font-size: 16px;
  width: 150px;
  height: 40px;
  margin-top: 20px;
  border-radius: 20px;
  background-color: #000000;
}
.dsimg1{
  width: 100%;
  margin-top: 30px;
  height: 100%;
  border-radius: 10px;
  /* background-image: url(../images/20250316213326.png); */
  background-size: 100% 100%;
}
.dshoptitlet3{
  width: 40%;
  right: 0px;
  height: 220px;
  position: absolute;
}
.dshoptitlet2{
  height: 220px;
  margin-top: 30px;

  width: 60%;
  left: 0px;
  position: absolute;
}
.dsa2{
  margin-left: 20px;
  margin-top: 50px;
  color: rgb(150, 150, 150);
}
.dsa{
  margin-left: 20px;
  margin-top: 10px;
  font-weight: bold;
  color: rgb(0, 0, 0);
  font-size: 33px;
}

.dshoptitlet{
  width: 100%;
  margin-top: 10px;
  position: relative;
  height: 270px;
}
.dstt2:hover{
  background-color: #4538ff;
}
.dstt2{
  float: right;
  margin-right: 20px;
  border-radius: 10px;
  background-color: #5147ff;
  border: none;
}
.el-input{
  border-radius: 20px;
}
.search-container {
  float: left;
  margin-left: 300px;
  width: 400px;  /* 按需调整宽度 */
}
.dshoptitle1{
  margin-left: 20px;
  color: black;
  float: left;
  line-height: 30px;
  font-size: 20px;
}
.dshoptitle{
  width: 100%;
margin-top: 30px;
  height: 30px;
  /* background-color: #343030; */
}
.dshop{
  min-width: 1350px;
  margin: 0px auto;
  /* background-color: #9c4242; */
}
</style>
