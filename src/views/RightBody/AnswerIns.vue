<template>
  <div class="result-container">
    <div class="header">
      <h1>答题结果</h1>
      <div class="progress-container">
        <div class="progress-bar" :style="{ width: scorePercentage + '%' }"></div>
        <span class="score-text">{{ resultName || '我的' }} {{ score }}</span>
      </div>
    </div>

    <div class="result-card" :class="resultClass">
      <div class="result-icon">
        <i :class="iconClass"></i>
      </div>
      <div class="result-content">
        <h2>{{ resultTitle }}</h2>
        <p class="result-desc">{{ resultDescription || resultDesc }}</p>
      </div>
    </div>

    <div class="detail-section" v-if="answers && answers.length > 0">
      <h3>详细解析</h3>
      <div class="answer-list">
        <div
          v-for="(answer, index) in answers"
          :key="index"
          class="answer-item"
          :class="{ correct: answer.isCorrect, incorrect: !answer.isCorrect }"
        >
          <div class="question-info">
            <span class="question-number">第{{ index + 1 }}题</span>
            <span class="question-status">
              <i :class="answer.isCorrect ? 'el-icon-success' : 'el-icon-error'"></i>
              {{ answer.isCorrect ? '正确' : '错误' }}
            </span>
          </div>
          <div class="question-detail" v-if="answer.explanation">
            <p><strong>解析：</strong>{{ answer.explanation }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="action-buttons">
      <button class="retry-btn" @click="handleRetry">再试一次</button>
      <button class="share-btn" @click="handleShare">分享结果</button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute();
const resultName = ref('')
const resultDesc = ref('')

const props = defineProps({
  score: {
    type: Number,
    required: true
  },
  maxScore: {
    type: Number,
    default: 100
  },
  resultDescription: {
    type: String,
    required: true
  },
  answers: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['retry'])

const scorePercentage = computed(() => (props.score / props.maxScore) * 100)

const resultClass = computed(() => {
  if (scorePercentage.value >= 80) {
    return 'excellent'
  } else if (scorePercentage.value >= 60) {
    return 'good'
  } else {
    return 'poor'
  }
})

const resultTitle = computed(() => {
  if (scorePercentage.value >= 80) {
    return '优秀！'
  } else if (scorePercentage.value >= 60) {
    return '良好！'
  } else {
    return '继续努力！'
  }
})

const iconClass = computed(() => {
  if (scorePercentage.value >= 80) {
    return 'el-icon-trophy'
  } else if (scorePercentage.value >= 60) {
    return 'el-icon-star-on'
  } else {
    return 'el-icon-warning-outline'
  }
})

const handleRetry = () => {
  emit('retry')
}

const handleShare = () => {
  // 分享逻辑
  console.log('分享功能已触发')
}

onMounted(() => {
  resultName.value = route.query.resultName || ''
  resultDesc.value = route.query.resultDesc || ''
})
</script>

<style scoped>
/* 保持原有的样式不变 */
.result-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  animation: fadeIn 0.5s ease-in-out;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.header h1 {
  color: #333;
  font-size: 28px;
  margin-bottom: 20px;
}

.progress-container {
  height: 30px;
  background-color: #f5f5f5;
  border-radius: 15px;
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.1);
}

.progress-bar {
  height: 100%;
  border-radius: 15px;
  background: linear-gradient(90deg, #4CAF50, #8BC34A);
  transition: width 1s ease-in-out;
  position: relative;
}

.score-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #333;
  font-weight: bold;
  z-index: 1;
}

.result-card {
  display: flex;
  align-items: center;
  padding: 25px;
  border-radius: 10px;
  margin-bottom: 30px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.result-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}

.result-card.excellent {
  background: linear-gradient(135deg, #e0f7fa, #b2ebf2);
  border-left: 5px solid #00bcd4;
}

.result-card.good {
  background: linear-gradient(135deg, #fff8e1, #ffecb3);
  border-left: 5px solid #ffc107;
}

.result-card.poor {
  background: linear-gradient(135deg, #ffebee, #ffcdd2);
  border-left: 5px solid #f44336;
}

.result-icon {
  margin-right: 20px;
}

.result-icon i {
  font-size: 50px;
}

.result-card.excellent .result-icon i {
  color: #00bcd4;
}

.result-card.good .result-icon i {
  color: #ffc107;
}

.result-card.poor .result-icon i {
  color: #f44336;
}

.result-content h2 {
  margin: 0 0 10px 0;
  color: #333;
}

.result-desc {
  margin: 0;
  color: #666;
  line-height: 1.6;
}

.detail-section {
  margin-bottom: 30px;
}

.detail-section h3 {
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.answer-list {
  display: grid;
  grid-gap: 15px;
}

.answer-item {
  padding: 15px;
  border-radius: 8px;
  background-color: #f9f9f9;
  transition: all 0.3s ease;
}

.answer-item:hover {
  transform: translateX(5px);
}

.answer-item.correct {
  border-left: 4px solid #4CAF50;
}

.answer-item.incorrect {
  border-left: 4px solid #f44336;
}

.question-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-weight: bold;
}

.question-number {
  color: #333;
}

.question-status {
  display: flex;
  align-items: center;
}

.question-status i {
  margin-right: 5px;
}

.el-icon-success {
  color: #4CAF50;
}

.el-icon-error {
  color: #f44336;
}

.question-detail {
  color: #666;
  line-height: 1.6;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
}

button {
  padding: 12px 25px;
  border: none;
  border-radius: 30px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-btn {
  background-color: #2196F3;
  color: white;
}

.retry-btn:hover {
  background-color: #0d8bf2;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(33, 150, 243, 0.3);
}

.share-btn {
  background-color: #FF9800;
  color: white;
}

.share-btn:hover {
  background-color: #f57c00;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(255, 152, 0, 0.3);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 600px) {
  .result-card {
    flex-direction: column;
    text-align: center;
  }

  .result-icon {
    margin-right: 0;
    margin-bottom: 15px;
  }

  .action-buttons {
    flex-direction: column;
    gap: 10px;
  }

  button {
    width: 100%;
  }
}
</style>
