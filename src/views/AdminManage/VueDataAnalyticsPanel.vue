<template>
  <!-- 数据展示主体部分 -->
  <div class="DataBody">
    <!-- 第一行数据卡片 -->
    <div class="DAtaFirst">
      <!-- 上架应用数量卡片 -->
      <el-card style="position: relative; width: 330px;  border-radius: 20px; background-color: #c85970; border: none;">
        <p>共上架应用</p>
        <h1>2005</h1>
        <h2>自2023年10月1日起</h2>
        <img width="100px" src="../../icons/yingyong.png">
      </el-card>

      <!-- 今日使用数卡片 -->
      <el-card style="position: relative; width: 330px;border-radius: 20px;background-color: #88c7ef; border: none;">
        <p>今日总使用数</p>
        <h1>89757</h1>
        <h2>较昨日 <img style="opacity: 1; position: relative; top: 2px; left: 10px;" width="15px" src="../../icons/tisheng.png">&nbsp;&nbsp;&nbsp;4.8%</h2>
        <img width="100px" src="../../icons/shiyongcishu.png">
      </el-card>

      <!-- 活跃用户卡片 -->
      <el-card style="position: relative; width: 330px;border-radius: 20px;background-color: #8e6beb; border: none;">
        <p>今日活跃用户</p>
        <h1>324</h1>
        <h2>较昨日 <img style="opacity: 1; position: relative; top: 2px; left: 10px;" width="15px" src="../../icons/tisheng.png">&nbsp;&nbsp;&nbsp;8%</h2>
        <img width="100px" src="../../icons/zaixianrenshu.png">
      </el-card>

      <!-- 总用户数卡片 -->
      <el-card style="position: relative; width: 330px;border-radius: 20px;background-color: #3fc8a9; border: none;">
        <p>总用户数</p>
        <h1>34653</h1>
        <h2>今日新增用户&nbsp;&nbsp; 23<img style="opacity: 1; position: absolute; right: -20px;top: 2px;" width="20px" src="../../icons/yonghu.png"></h2>
        <img width="100px" src="../../icons/yonghu.png">
      </el-card>
    </div>

    <!-- 第二行数据展示 -->
    <div class="DataSecond">
      <!-- 趋势图卡片 -->
      <el-card style="width: 1010px; height: 500px; border-radius: 25px;">
        <div class="buttonbody">
          <el-button :class="{ 'is-active': activeButton === 'week' }" @click="updateChart('week')" type="primary">一周</el-button>
          <el-button :class="{ 'is-active': activeButton === 'month' }" @click="updateChart('month')" type="primary">一个月</el-button>
          <el-button :class="{ 'is-active': activeButton === 'halfYear' }" @click="updateChart('halfYear')" type="primary">半年</el-button>
          <el-button :class="{ 'is-active': activeButton === 'year' }" @click="updateChart('year')" type="primary">一年</el-button>
        </div>
        <div id="chart" style="width: 1000px; height: 400px;"></div>
      </el-card>

      <!-- 公告卡片 -->
      <el-card style="width: 328px; height: 500px; border-radius: 25px; margin-left: 10px;">
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

    <!-- 第三行数据展示 -->
    <div class="DataThird">
      <!-- 应用排行榜卡片 -->
      <el-card style="position: relative; width: 750px; height: 500px; border-radius: 25px; box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);">
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
              <el-tag :type="getTagType(row.type) || 'primary'" effect="light">
                {{ row.type }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="应用名称" prop="appName" width="150px">
            <template #default="{ row }">
              <div class="app-name">
                <span>{{ row.appName }}</span>
              </div>
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

      <!-- 饼图卡片 -->
      <el-card style="overflow: visible; width: 600px; height: 500px; margin-left: 10px; border-radius: 25px; padding: 20px;">
        <div id="pieChart" style="overflow: visible; margin: 0px auto; width: 500px; height: 450px; overflow: visible;"></div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
// 导入必要的组件和库
import { ElCard } from 'element-plus';
import * as echarts from 'echarts';
import { onMounted } from 'vue';
import { ref } from 'vue';
import { Medal, View } from '@element-plus/icons-vue'

// 应用类型分布数据
const typeDistribution = [
  { value: 25, name: '心理测试' },
  { value: 18, name: '生活实用' },
  { value: 22, name: '娱乐休闲' },
  { value: 15, name: '科普' },
  { value: 12, name: '智力挑战' },
  { value: 30, name: '学习' },
  { value: 8, name: '其他' }
];

/**
 * 初始化饼图
 */
const initPieChart = () => {
  // 获取DOM元素并初始化图表
  const chartDom = document.getElementById('pieChart');
  const pieChart = echarts.init(chartDom);

  // 检查DOM元素是否存在
  if (!chartDom) {
    console.error('Pie chart container not found');
    return;
  }

  // 设置最小高度
  chartDom.style.minHeight = '400px';

  // 饼图配置项
  const option = {
    title: {
      text: '应用类型分布',
      left: 'center',
      top: 0,
      textStyle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c}个 ({d}%)',
      backgroundColor: 'rgba(255,255,255,0.9)',
      borderColor: '#ddd',
      borderWidth: 1,
      padding: [10, 15],
      textStyle: {
        color: '#333'
      },
      extraCssText: 'box-shadow: 0 2px 8px rgba(0,0,0,0.1);'
    },
    legend: {
      orient: 'horizontal', // 水平方向
      bottom: 10, // 距离底部10px
      left: 'center', // 水平居中
      itemGap: 10, // 图例项间距
      textStyle: {
        fontSize: 10
      }
    },
    series: [
      {
        name: '应用类型',
        type: 'pie',
        radius: ['30%', '55%'],
        center: ['50%', '45%'], // 调整中心位置，为图例留出空间
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 6,
          borderColor: '#fff',
          borderWidth: 2,
          shadowBlur: 5,
          shadowColor: 'rgba(0, 0, 0, 0.1)'
        },
        label: {
          show: true,
          formatter: '{b}: {d}%',
          fontSize: 10,
          color: '#666'
        },
        emphasis: {
          scale: true,
          scaleSize: 5,
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.2)'
          },
          label: {
            show: true,
            fontWeight: 'bold',
            fontSize: 14
          }
        },
        labelLine: {
          show: true,
          length: 10,
          length2: 15,
          smooth: 0.2
        },
        data: typeDistribution,
        color: [
          '#6E87F0',
          '#5FD3B3',
          '#FFB64D',
          '#FF7D7D',
          '#A881FC',
          '#4DC5F1',
          '#9D9D9D'
        ],
        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDelay: function () {
          return Math.random() * 200;
        }
      }
    ]
  };

  // 设置图表尺寸和选项
  pieChart.resize();
  pieChart.setOption(option);

  // 添加窗口大小变化事件监听，标记为 passive
  window.addEventListener('resize', function() {
    pieChart.resize();
  }, { passive: true });

  // 获取echarts实例的画布元素
  const canvas = pieChart.getZr().canvas;
  if (canvas) {
    canvas.addEventListener('mousewheel', function () {
      // 这里可以添加你需要的逻辑
    }, { passive: true });
    canvas.addEventListener('wheel', function () {
      // 这里可以添加你需要的逻辑
    }, { passive: true });
  }
};

/**
 * 获取标签类型对应的样式
 * @param {string} type - 应用类型
 * @returns {string} - 对应的样式类型
 */
const getTagType = (type) => {
  const typeMap = {
    '学习': 'primary',
    '娱乐休闲': 'success',
    '心理测试': 'warning',
    '生活实用': 'info',
    '智力挑战': 'danger',
    '科普': 'info',
    '其他': 'info'
  };
  return typeMap[type] || 'info';
};

/**
 * 格式化数字显示
 * @param {number} count - 数字
 * @returns {string} - 格式化后的字符串
 */
const formatCount = (count) => {
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + '万';
  }
  return count;
};

// 排行榜数据
const rankList = ref([
  {
    appName: '英语单词挑战',
    uploader: '用户A',
    type: '学习',
    answerCount: 100324
  },
  {
    appName: '电影知识',
    uploader: '用户B',
    type: '娱乐休闲',
    answerCount: 80324324
  },
  {
    appName: 'MBTI人格测试',
    uploader: '用户C',
    type: '心理测试',
    answerCount: 602343242
  },
  {
    appName: '动物时间',
    uploader: '用户D',
    type: '生活实用',
    answerCount: 402342342
  },
  {
    appName: '帽子戏法',
    uploader: '用户E',
    type: '智力挑战',
    answerCount: 203424
  },
  {
    appName: '科学大爆炸',
    uploader: '用户F',
    type: '科普',
    answerCount: 1032442
  },
  {
    appName: '冷知识',
    uploader: '用户G',
    type: '其他',
    answerCount: 52342
  }
]);

// 当前激活的时间范围按钮
const activeButton = ref('week');

// 公告数据
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

// 当前显示的数据和x轴数据
let currentData = data.week;
let xAxisData = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

// 图表配置项
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
      // color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      //   { offset: 0, color: '#2c86e1' },
      //   { offset: 1, color: '#ff943c' }
      // ])
    },
    areaStyle: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: 'rgba(44, 134, 225, 0.7)' },
        { offset: 1, color: 'rgba(44, 134, 255, 0.1)' }
      ])
    }
  }]
};

let myChart; // 图表实例

/**
 * 初始化趋势图
 */
const initChart = () => {
  const chartDom = document.getElementById('chart');
  myChart = echarts.init(chartDom);
  myChart.setOption(option);

  // 获取echarts实例的画布元素
  const canvas = myChart.getZr().canvas;
  if (canvas) {
    canvas.addEventListener('mousewheel', function () {
      // 这里可以添加你需要的逻辑
    }, { passive: true });
    canvas.addEventListener('wheel', function () {
      // 这里可以添加你需要的逻辑
    }, { passive: true });
  }
};

/**
 * 更新图表数据
 * @param {string} range - 时间范围 ('week', 'month', 'halfYear', 'year')
 */
const updateChart = (range) => {
  activeButton.value = range; // 更新选中状态

  // 根据选择的时间范围更新数据和x轴标签
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

  // 更新图表数据
  myChart.setOption({
    xAxis: { data: xAxisData },
    series: [{ data: currentData }]
  });
};

// 组件挂载时初始化
onMounted(() => {
  initChart(); // 初始化趋势图
  rankList.value.sort((a, b) => b.answerCount - a.answerCount); // 排序排行榜
  updateChart('week'); // 默认显示一周数据

  // 延迟初始化饼图，确保DOM完全渲染
  setTimeout(() => {
    initPieChart();
  }, 100);
});
</script>


<style scoped>
/* 全局样式 */
canvas {
  overflow: visible;
}

/* 第三行数据容器样式 */
.DataThird {
  width: 1350px;
  display: flex;
  height: 500px;
  margin-top: 10px;
}

/* 排名单元格样式 */
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

/* 上传者单元格样式 */
.uploader-cell {
  display: flex;
  align-items: center;
}

.uploader-name {
  margin-left: 10px;
}

/* 计数单元格样式 */
.count-cell {
  display: flex;
  align-items: center;
  color: #606266;
}

.count-cell i {
  margin-right: 5px;
  color: #409EFF;
}

/* 表格样式 */
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

/* 标签样式 */
.el-tag {
  border-radius: 12px;
  padding: 0 10px;
  height: 24px;
  line-height: 24px;
}

/* 公告容器样式 */
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

/* 时间范围按钮组样式 */
.buttonbody {
  display: flex;
  gap: 0;
  justify-content: center;
  margin-bottom: 20px;
}

/* 按钮默认样式 */
.buttonbody .el-button {
  margin: 0 !important;
  border-radius: 0;
  padding: 10px 20px;
  font-weight: bold;
  transition: all 0.3s;
  border: 1px solid #dcdfe6;
  background-color: white;
  color: #606266;
}

/* 第一个按钮圆角 */
.buttonbody .el-button:first-child {
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}

/* 最后一个按钮圆角 */
.buttonbody .el-button:last-child {
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}

/* 按钮悬停效果 */
.buttonbody .el-button:hover {
  border-color: #c6e2ff;
  color: #409eff;
}

/* 激活状态按钮样式 */
.buttonbody .el-button.is-active {
  background-color: #409eff !important;
  border-color: #409eff;
  color: white !important;
}

/* 第二行数据容器样式 */
.DataSecond {
  width: 1350px;
  display: flex;
  margin-top: 10px;
  height: 500px;
}

/* 卡片图片样式 */
.el-card img {
  position: absolute;
  opacity: 0.5;
  right: 20px;
  top: 50px;
}

/* 卡片文本样式 */
.el-card h2 {
  font-size: 16px;
  font-family: '思源宋体';
  color: white;
  bottom: 30px;
  position: absolute;
}

.el-card h1 {
  font-size: 50px;
  font-family: '思源宋体';
  top: 50px;
  color: white;
  position: absolute;
}

.el-card p {
  font-size: 16px;
  color: white;
  position: absolute;
  top: 20px;
  left:20px;
}

/* 第一行数据容器样式 */
.DAtaFirst {
  position: relative;
  width: 1350px;
  display: flex;
  justify-content: space-between;
  height: 200px;
}

/* 主容器样式 */
.DataBody {
  width: 1350px;
  height: 1000px;
  margin-top: 1vh;
}
</style>
