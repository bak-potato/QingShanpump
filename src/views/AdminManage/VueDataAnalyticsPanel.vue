<template>
  <div class="DataBody">
    <div class="DAtaFirst">
      <el-card style="position: relative; width: 330px;  border-radius: 20px; background-color: #c85970; border: none;">
        <p>
          共上架应用
        </p>
        <h1>
          2005
        </h1>
        <h2>
          自2023年10月1日起
        </h2>
        <img width="100px" src="../../icons/yingyong.png">
      </el-card>
      <el-card style="position: relative; width: 330px;border-radius: 20px;background-color: #88c7ef; border: none;">
        <p>
          今日总使用数
        </p>
        <h1>
          89757
        </h1>
        <h2>
          较昨日  <img style="opacity: 1; position: relative; top: 2px; left: 10px;" width="15px" src="../../icons/tisheng.png">&nbsp;&nbsp;&nbsp;4.8%
        </h2>
        <img width="100px" src="../../icons/shiyongcishu.png">
      </el-card>
      <el-card style=" position: relative; width: 330px;border-radius: 20px;background-color: #8e6beb; border: none;">
        <p>
          今日活跃用户
        </p>
        <h1>
          324
        </h1>
        <h2>
          较昨日  <img style="opacity: 1; position: relative; top: 2px; left: 10px;" width="15px" src="../../icons/tisheng.png">&nbsp;&nbsp;&nbsp;8%
        </h2>
        <img width="100px" src="../../icons/zaixianrenshu.png">
      </el-card>
      <el-card style="position: relative; width: 330px;border-radius: 20px;background-color: #3fc8a9; border: none;">
        <p>
          总用户数
        </p>
        <h1>
          34653
        </h1>
        <h2>
          今日新增用户&nbsp;&nbsp; 23<img style="opacity: 1; position: absolute; right: -20px;top: 2px;" width="20px" src="../../icons/yonghu.png" >
        </h2>
        <img width="100px" src="../../icons/yonghu.png">
      </el-card>
    </div>
    <div class="DataSecond">
      <el-card style="width: 1010px; height: 500px; border-radius: 25px;">
        <div class="buttonbody">
          <el-button  :class="{ 'is-active': activeButton === 'week' }" @click="updateChart('week')" type="primary">一周</el-button>
          <el-button  :class="{ 'is-active': activeButton === 'month' }" @click="updateChart('month')" type="primary">一个月</el-button>
          <el-button  :class="{ 'is-active': activeButton === 'halfYear' }" @click="updateChart('halfYear')" type="primary">半年</el-button>
          <el-button  :class="{ 'is-active': activeButton === 'year' }" @click="updateChart('year')" type="primary">一年</el-button>
        </div>
        <div id="chart" style="width: 1000px; height: 400px;"></div>
      </el-card>

        <el-card style="  width: 328px; height: 500px; border-radius: 25px; margin-left: 10px;">
  <div class="announcement-container">
    <h3 style="margin: 0 0 15px 0; font-size: 18px; color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px;">
      <i class="el-icon-warning" style="color: #E6A23C; margin-right: 8px;"></i>
      系统公告与Bug反馈
    </h3>

    <div class="announcement-list">
      <el-scrollbar height="400px" noresize>

      <div v-for="(item, index) in announcements" :key="index" class="announcement-item">
        <div class="announcement-header">
          <span class="announcement-type" :style="{backgroundColor: item.type === 'error' ? '#F56C6C' : '#67C23A'}">
            {{ item.type === 'error' ? '错误' : 'Bug' }}
          </span>
          <span class="announcement-time">{{ item.time }}</span>
        </div>
        <div class="announcement-content">{{ item.content }}</div>
        <div class="announcement-user">提交者: {{ item.user }}</div>
      </div>
      </el-scrollbar>

    </div>
  </div>
</el-card>

      </div>


      <div class="DataThird">

        <el-card style="position: relative; width: 750px; height: 500px; border-radius: 25px; box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);">
    <!-- <h2 style="text-align: center; color: #333; font-size: 20px; margin: 15px 0; font-weight: 500;">应用排行榜</h2> -->
    <el-table
      :data="rankList"
      style="width: 700px; margin: 0 auto;"
      :header-cell-style="{background:'#f5f7fa', color:'#606266'}"
      :cell-style="{padding:'12px 0'}"
      stripe
      highlight-current-row
    >
      <el-table-column label="排名" width="100px">
        <template #default="{ $index }">
          <div class="rank-cell">
            <span v-if="$index < 3" class="medal">
              <el-icon v-if="$index === 0" color="#FFD700"><Medal /></el-icon>
              <el-icon v-if="$index === 1" color="#C0C0C0"><Medal /></el-icon>
              <el-icon v-if="$index === 2" color="#CD7F32"><Medal /></el-icon>
            </span>
            <span :class="['rank-number', {top3: $index < 3}]">{{ $index + 1 }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="创作者" prop="uploader">
        <template #default="{ row }">
          <div class="uploader-cell">
            <el-avatar :size="30" :src="`https://robohash.org/${row.uploader}`" />
            <span class="uploader-name">{{ row.uploader }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="应用类型" prop="type">
        <template #default="{ row }">
          <el-tag :type="getTagType(row.type)" effect="light">
            {{ row.type }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="答题次数" prop="answerCount">
        <template #default="{ row }">
          <div class="count-cell">
            <el-icon><View /></el-icon>
            <span>{{ formatCount(row.answerCount) }}</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
</el-card>
      </div>


  </div>
</template>

<script setup>
import { ElCard } from 'element-plus';
import * as echarts from 'echarts';
import { onMounted } from 'vue';
import { ref } from 'vue';
import { Medal, View } from '@element-plus/icons-vue'

// 在 setup 中添加以下方法
const getTagType = (type) => {
  const typeMap = {
    '学习': 'primary',
    '娱乐休闲': 'success',
    '心理测试': 'warning',
    '生活实用': '',
    '智力挑战': 'danger',
    '科普': 'info',
    '其他': ''
  }
  return typeMap[type] || ''
}

const formatCount = (count) => {
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + '万'
  }
  return count
}
const rankList = ref([
  {
    uploader: '用户A',
    type: '学习',
    answerCount: 100324
  },
  {
    uploader: '用户B',
    type: '娱乐休闲',
    answerCount: 80324324
  },
  {
    uploader: '用户C',
    type: '心理测试',
    answerCount: 602343242
  },
  {
    uploader: '用户D',
    type: '生活实用',
    answerCount: 402342342
  },
  {
    uploader: '用户E',
    type: '智力挑战',
    answerCount: 203424
  },
  {
    uploader: '用户F',
    type: '科普',
    answerCount: 1032442
  },
  {
    uploader: '用户G',
    type: '其他',
    answerCount: 52342
  }
]);
const activeButton = ref('week'); // 默认选中“一周”

const announcements = ref([
  {
    type: 'error',
    time: '2023-11-15 14:30',
    content: '用户登录接口偶尔出现500错误',
    user: '张工程师'
  },
  {
    type: 'bug',
    time: '2023-11-14 09:15',
    content: '数据导出功能在Safari浏览器中无法使用',
    user: '李测试'
  },
  {
    type: 'error',
    time: '2023-11-13 16:45',
    content: '后台任务队列有时会卡死',
    user: '王运维'
  },
  {
    type: 'bug',
    time: '2023-11-12 11:20',
    content: '移动端页面在iOS 15上布局错乱',
    user: '赵设计师'
  },
   {
    type: 'bug',
    time: '2023-11-12 11:20',
    content: '移动端页面在iOS 15上布局错乱',
    user: '赵设计师'
  }
]);
// 模拟数据
const data = {
  week: [120, 200, 150, 80, 70, 110, 130],
  month: [100, 150, 200, 180, 160, 140, 120, 110, 130, 150, 170, 190, 200, 180, 160, 140, 120, 110, 130, 150, 170, 190, 200, 180, 160, 140, 120, 110, 130, 150],
  halfYear: [100, 120, 110, 130, 140, 150, 160, 170, 180, 190, 200, 210].slice(0, 6),
  year: [100, 120, 110, 130, 140, 150, 160, 170, 180, 190, 200, 210]
};

// 默认显示一周数据
let currentData = data.week;
let xAxisData = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

// 配置项
const option = {
  title: {
    text: '在线人数趋势图',
    left: 'left'
  },
  tooltip: {
    trigger: 'axis'
  },
  xAxis: {
    type: 'category',
    data: xAxisData
  },
  yAxis: {
    type: 'value'
  },
  series: [{
    name: '数据',
    type: 'line',
    data: currentData,
    smooth: true,
    lineStyle: {
      width: 3,
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: '#2c86e1' }, // 渐变起始颜色
        { offset: 1, color: '#ff943c' }  // 渐变结束颜色
      ])
    },
    areaStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: 'rgba(44, 134, 225, 0.7)' }, // 渐变起始颜色
        { offset: 1, color: 'rgba(44, 134, 255, 0.1)' }  // 渐变结束颜色
      ])
    }
  }]
};

let myChart;

const initChart = () => {
  const chartDom = document.getElementById('chart');
  myChart = echarts.init(chartDom);
  myChart.setOption(option);
};

// 更新图表函数
const updateChart = (range) => {
  activeButton.value = range; // 更新选中状态
  switch (range) {
    case 'week':
      currentData = data.week;
      xAxisData = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
      break;
    case 'month':
      currentData = data.month;
      xAxisData = Array.from({ length: 30 }, (_, i) => `${i + 1}号`);
      break;
    case 'halfYear':
      currentData = data.halfYear;
      xAxisData = ['1月', '2月', '3月', '4月', '5月', '6月'];
      break;
    case 'year':
      currentData = data.year;
      xAxisData = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
      break;
  }

  // 更新图表
  myChart.setOption({
    xAxis: { data: xAxisData },
    series: [{ data: currentData }]
  });
};

onMounted(() => {
  initChart();
    rankList.value.sort((a, b) => b.answerCount - a.answerCount);
  updateChart('week'); // 初始化时显示一周数据
});
</script>

<style scoped>
.DataThird {
  width: 1350px;
  height: 500px;
  margin-top: 10px;
}

.rank-cell {
  display: flex;
  align-items: center;
  justify-content: center;
}

.medal {
  margin-right: 8px;
}

.rank-number {
  font-weight: bold;
  font-size: 16px;
}

.rank-number.top3 {
  color: #409EFF;
}

.uploader-cell {
  display: flex;
  align-items: center;
}

.uploader-name {
  margin-left: 10px;
}

.count-cell {
  display: flex;
  align-items: center;
  color: #606266;
}

.count-cell i {
  margin-right: 5px;
  color: #409EFF;
}

.el-table {
  border-radius: 10px;
}

.el-table::before {
  height: 0;
}

.el-table--striped .el-table__body tr.el-table__row--striped td {
  background-color: #fafafa;
}

.el-table__body tr:hover>td {
  background-color: #f5f7fa !important;
}

.el-tag {
  border-radius: 12px;
  padding: 0 10px;
  height: 24px;
  line-height: 24px;
}
.DataThird{
  width: 1350px;
  height: 500px;
  margin-top: 10px;
}
.announcement-container {
  padding: 15px;
  height: 500px;
  overflow: auto;
  position: absolute;
  display: flex;
  flex-direction: column;
}

.announcement-list {
  flex: 1;
  overflow-y: auto;
}

.announcement-item {
  padding: 12px 0;
  border-bottom: 1px dashed #eee;
}

.announcement-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.announcement-type {
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.announcement-time {
  font-size: 12px;
  color: #999;
}

.announcement-content {
  margin: 5px 0;
  line-height: 1.5;
}

.announcement-user {
  font-size: 12px;
  color: #666;
  text-align: right;
}
.buttonbody {
  display: flex;
  gap: 0; /* 确保按钮之间无间隙 */
  justify-content: center;
  margin-bottom: 20px;
}

/* 默认白色按钮样式 */
.buttonbody .el-button {
  margin: 0 !important;
  border-radius: 0;
  padding: 10px 20px;
  font-weight: bold;
  transition: all 0.3s;
  border: 1px solid #dcdfe6; /* 添加浅灰色边框 */
  background-color: white; /* 默认背景白色 */
  color: #606266; /* 默认文字灰色 */
}

/* 第一个按钮左侧圆角 */
.buttonbody .el-button:first-child {
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}

/* 最后一个按钮右侧圆角 */
.buttonbody .el-button:last-child {
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}

/* 悬停效果 */
.buttonbody .el-button:hover {
  border-color: #c6e2ff;
  color: #409eff;
}

/* 激活（选中）状态的按钮 - 蓝色背景 */
.buttonbody .el-button.is-active {
  background-color: #409eff !important;
  border-color: #409eff;
  color: white !important;
}
.DataSecond{
  width: 1350px;
  display: flex;
  margin-top: 10px;
  height: 500px;
}
.el-card img{
  position: absolute;
  opacity: 0.5;
  right: 20px;
  top: 50px;
}
.el-card h2{
  font-size: 16px;
  font-family: '思源宋体';
  color: white;
  bottom: 30px;
  position: absolute;
}
.el-card h1{
  font-size: 50px;
  font-family: '思源宋体';
  top: 50px;
  color: white;
  position: absolute;
}
.el-card p{
  font-size: 16px;
  color: white;
  position: absolute;
  top: 20px;
  left:20px;
}
.DAtaFirst{
  position: relative;
  width: 1350px;
  display: flex;
  justify-content: space-between;
  height: 200px;
}
.DataBody{
  width: 1350px;
  height: 1000px;
  margin-top: 1vh;
}
</style>
