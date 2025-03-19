<template>
  <!-- 在用户信息卡片和答题记录之间添加数据分析部分 -->
  <el-card class="data-analysis mt-4">
    <h3 class="section-title">答题数据分析</h3>
    
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :xs="24" :sm="12" :md="6">
        <div class="stat-card correct">
          <div class="stat-content">
            <div class="stat-value">{{ stats.correctRate }}%</div>
            <div class="stat-label">正确率</div>
            <el-icon class="stat-icon"><CircleCheck /></el-icon>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <div class="stat-card average">
          <div class="stat-content">
            <div class="stat-value">{{ stats.avgScore }}</div>
            <div class="stat-label">平均分</div>
            <el-icon class="stat-icon"><TrendCharts /></el-icon>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <div class="stat-card total">
          <div class="stat-content">
            <div class="stat-value">{{ stats.totalAnswers }}</div>
            <div class="stat-label">总答题数</div>
            <el-icon class="stat-icon"><Document /></el-icon>
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <div class="stat-card duration">
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
import { ref,  computed, onMounted } from 'vue'
import * as echarts from 'echarts'
import {
  CircleCheck,
  TrendCharts,
  Document,
  Clock
} from '@element-plus/icons-vue'

// 答题统计数据
const stats = computed(() => {
  const validRecords = answerRecords.value.filter(r => r.status !== 'unfinished')
  
  return {
    correctRate: ((validRecords.filter(r => r.status === 'correct').length / validRecords.length) * 100 || 0).toFixed(1),
    avgScore: (validRecords.reduce((sum, r) => sum + r.score, 0) / validRecords.length || 0).toFixed(1),
    totalAnswers: answerRecords.value.length,
    avgDuration: (validRecords.reduce((sum, r) => sum + (r.duration || 0), 0) / validRecords.length || 0).toFixed(1)
  }
})

// ECharts实例
const correctChart = ref(null)
const trendChart = ref(null)
const answerRecords = ref([]);
// 初始化图表
onMounted(() => {
  initCorrectChart()
  initTrendChart()
})

// 正确率饼图
const initCorrectChart = () => {
  const chart = echarts.init(correctChart.value)
  const option = {
    tooltip: { trigger: 'item' },
    series: [{
      name: '答题正确率',
      type: 'pie',
      radius: ['40%', '70%'],
      data: [
        { value: stats.value.correctRate, name: '正确', itemStyle: { color: '#67C23A' } },
        { value: 100 - stats.value.correctRate, name: '错误', itemStyle: { color: '#F56C6C' } }
      ],
      label: {
        formatter: '{b}: {d}%'
      }
    }]
  }
  chart.setOption(option)
}

// 答题趋势折线图
const initTrendChart = () => {
  const chart = echarts.init(trendChart.value)
  const dates = [...new Set(answerRecords.value.map(r => 
    new Date(r.createTime).toLocaleDateString()
  ))].sort()
  
  const option = {
    xAxis: {
      type: 'category',
      data: dates
    },
    yAxis: { type: 'value' },
    series: [{
      data: dates.map(date => 
        answerRecords.value.filter(r => 
          new Date(r.createTime).toLocaleDateString() === date
        ).length
      ),
      type: 'line',
      smooth: true,
      areaStyle: {},
      itemStyle: { color: '#409EFF' }
    }],
    tooltip: { trigger: 'axis' }
  }
  chart.setOption(option)
}
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