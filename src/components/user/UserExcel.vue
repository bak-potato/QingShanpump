<template>
  <!-- 在用户信息卡片和答题记录之间添加数据分析部分 -->
  <el-card class="data-analysis mt-4">
    <h3 class="section-title">答题数据分析</h3>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :xs="24" :sm="12" :md="6">
        <div class="stat-card correct mouse">
          <div class="stat-content">
            <div class="stat-value">{{ stats.correctRate }}%</div>
            <div class="stat-label">正确率</div>
            <el-icon class="stat-icon"><CircleCheck /></el-icon>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <div class="stat-card average mouse">
          <div class="stat-content">
            <div class="stat-value">{{ stats.avgScore }}</div>
            <div class="stat-label">平均分</div>
            <el-icon class="stat-icon"><TrendCharts /></el-icon>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <div class="stat-card total mouse">
          <div class="stat-content">
            <div class="stat-value">{{ stats.totalAnswers }}</div>
            <div class="stat-label">总答题数</div>
            <el-icon class="stat-icon"><Document /></el-icon>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <div class="stat-card duration mouse">
          <div class="stat-content">
            <div class="stat-value">{{ stats.avgDuration }}s</div>
            <div class="stat-label">平均用时</div>
            <el-icon class="stat-icon"><Clock /></el-icon>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 图表分析 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :xs="24" :md="12">
        <div class="chart-container">
          <div ref="correctChart" style="height: 300px;"></div>
        </div>
      </el-col>
      <el-col :xs="24" :md="12">
        <div class="chart-container">
          <div ref="trendChart" style="height: 300px;"></div>
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import * as echarts from 'echarts'
import {
  CircleCheck,
  TrendCharts,
  Document,
  Clock
} from '@element-plus/icons-vue'

// 模拟答题记录数据（可替换为真实接口数据）
const answerRecords = ref([
  { id: 1, status: 'correct', score: 90, duration: 60, createTime: '2023-10-01' },
  { id: 2, status: 'correct', score: 85, duration: 75, createTime: '2023-10-01' },
  { id: 3, status: 'wrong', score: 60, duration: 120, createTime: '2023-10-02' },
  { id: 4, status: 'correct', score: 95, duration: 50, createTime: '2023-10-02' },
  { id: 5, status: 'wrong', score: 55, duration: 150, createTime: '2023-10-03' },
  { id: 6, status: 'correct', score: 88, duration: 65, createTime: '2023-10-03' },
  { id: 7, status: 'correct', score: 92, duration: 55, createTime: '2023-10-04' },
  { id: 8, status: 'wrong', score: 65, duration: 110, createTime: '2023-10-04' },
]);

// 答题统计数据
const stats = computed(() => {
  const validRecords = answerRecords.value.filter(r => r.status !== 'unfinished');
  return {
    correctRate: (validRecords.length > 0 ? 
      (validRecords.filter(r => r.status === 'correct').length / validRecords.length * 100).toFixed(1) : 0),
    avgScore: (validRecords.length > 0 ? 
      (validRecords.reduce((sum, r) => sum + r.score, 0) / validRecords.length).toFixed(1) : 0),
    totalAnswers: answerRecords.value.length,
    avgDuration: (validRecords.length > 0 ? 
      (validRecords.reduce((sum, r) => sum + r.duration, 0) / validRecords.length).toFixed(1) : 0)
  };
});

// ECharts实例
const correctChart = ref(null);
const trendChart = ref(null);

// 初始化图表
onMounted(() => {
  initCorrectChart();
  initTrendChart();
});

// 正确率饼图
const initCorrectChart = () => {
  const chart = echarts.init(correctChart.value);
  const validRecords = answerRecords.value.filter(r => r.status !== 'unfinished');
  const correctCount = validRecords.filter(r => r.status === 'correct').length;
  const errorCount = validRecords.length - correctCount;

  const option = {
    tooltip: { trigger: 'item', formatter: "{b}: {d}%" },
    series: [{
      name: '答题分布',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      data: [
        { value: correctCount, name: '正确', itemStyle: { color: '#67C23A' } },
        { value: errorCount, name: '错误', itemStyle: { color: '#F56C6C' } }
      ],
      label: {
        show: true,
        position: 'outside',
        formatter: '{b}: {d}%'
      },
      labelLine: {
        length: 10,
        lineStyle: {
          color: '#333'
        }
      }
    }]
  };
  chart.setOption(option);
};

// 答题趋势折线图
const initTrendChart = () => {
  const chart = echarts.init(trendChart.value);
  const dateSet = new Set();
  answerRecords.value.forEach(r => {
    dateSet.add(new Date(r.createTime).toISOString().split('T')[0]);
  });
  const dates = Array.from(dateSet).sort();

  const dailyCounts = dates.map(date => 
    answerRecords.value.filter(r => 
      new Date(r.createTime).toISOString().split('T')[0] === date
    ).length
  );

  const option = {
    xAxis: {
      type: 'category',
      data: dates,
      axisTick: { alignWithLabel: true },
      axisLine: { lineStyle: { color: '#e0e2e5' } }
    },
    yAxis: {
      type: 'value',
      name: '答题次数',
      splitLine: { lineStyle: { color: '#e0e2e5' } }
    },
    series: [{
      name: '每日答题趋势',
      data: dailyCounts,
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      itemStyle: { color: '#409EFF' },
      lineStyle: { color: '#409EFF', width: 2 },
      areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
        offset: 0,
        color: '#409EFF'
      }, {
        offset: 1,
        color: '#f0f5ff'
      }]) }
    }],
    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        return `${params[0].name}：<span style="color: #409EFF;">${params[0].value}</span>次`;
      }
    }
  };
  chart.setOption(option);
};
</script>

<style scoped>
.data-analysis {
  margin-top: 2rem;
}

.section-title {
  color: #303133;
  border-left: 4px solid #409EFF;
  padding-left: 12px;
  margin-bottom: 2rem;
}

.stats-row {
  margin-bottom: 2rem;
}

.stat-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
  }

  &.correct::before { background: #67C23A; }
  &.average::before { background: #E6A23C; }
  &.total::before { background: #409EFF; }
  &.duration::before { background: #909399; }
}

.stat-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}

.stat-label {
  color: #909399;
  font-size: 14px;
}

.stat-icon {
  font-size: 32px;
  opacity: 0.2;
}

.chart-container {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .stat-card {
    margin-bottom: 15px;
  }

  .stat-value {
    font-size: 20px;
  }
}
</style>
