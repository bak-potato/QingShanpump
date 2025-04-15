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
              <i :class="answer.isCorrect? 'el-icon-check' : 'el-icon-close'" style="color: #00bfa5;"></i>
              {{ answer.isCorrect? '正确' : '错误' }}
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
/* 浅蓝色风格美化 */
.result-container {
  width: 1400px;
  margin: 2rem auto;
  padding: 2.5rem;
  font-family: 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  background: linear-gradient(135deg, #e6f7ff 0%, #ffffff 100%);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  animation: fadeIn 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

.header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.header h1 {
  color: #1f497d;
  font-size: 2.2rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.progress-container {
  height: 48px;
  background: #d9eefc;
  border-radius: 24px;
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.08);
}

.progress-bar {
  height: 100%;
  border-radius: 24px;
  background: linear-gradient(90deg, #0099ff 0%, #00c2ff 100%);
  transition: width 1s cubic-bezier(0.65, 0, 0.35, 1);
  position: relative;
}

.score-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #1f497d;
  font-weight: 600;
  font-size: 1.1rem;
  z-index: 1;
}

.result-card {
  display: flex;
  align-items: center;
  padding: 2rem;
  border-radius: 14px;
  margin-bottom: 2.5rem;
  background: white;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: none;
}

.result-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.result-card.excellent {
  background: linear-gradient(135deg, #e6f7ff 0%, #d0f0ff 100%);
  border-left: 6px solid #0099ff;
}

.result-card.good {
  background: linear-gradient(135deg, #e0f5ff 0%, #c7e8ff 100%);
  border-left: 6px solid #00bfff;
}

.result-card.poor {
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f0ff 100%);
  border-left: 6px solid #8db6e3;
}

.result-icon {
  margin-right: 1.8rem;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.7);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.result-icon i {
  font-size: 2.5rem;
}

.result-card.excellent .result-icon {
  background: linear-gradient(135deg, #c6e2ff 0%, #a0d4ff 100%);
  color: #007aff;
}

.result-card.good .result-icon {
  background: linear-gradient(135deg, #b9e8ff 0%, #88d0ff 100%);
  color: #0099ff;
}

.result-card.poor .result-icon {
  background: linear-gradient(135deg, #d6e8ff 0%, #b3d2ff 100%);
  color: #8db6e3;
}

.result-content h2 {
  margin: 0 0 0.8rem 0;
  color: #1f497d;
  font-size: 1.6rem;
  font-weight: 600;
}

.result-desc {
  margin: 0;
  color: #6c757d;
  line-height: 1.6;
  font-size: 1rem;
}

.detail-section {
  margin-bottom: 2.5rem;
}

.detail-section h3 {
  color: #1f497d;
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 0.8rem;
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
  font-weight: 500;
}

.answer-list {
  display: grid;
  grid-gap: 1rem;
}

.answer-item {
  padding: 1.5rem;
  border-radius: 12px;
  background: white;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border-left: 4px solid transparent;
}

.answer-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
}

.answer-item.correct {
  border-left-color: #00bfff;
  background: rgba(0, 191, 255, 0.03);
}

.answer-item.incorrect {
  border-left-color: #ff3b30;
  background: rgba(255, 59, 48, 0.03);
}

.question-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.8rem;
  font-weight: 500;
  color: #495057;
}

.question-number {
  color: #495057;
}

.question-status {
  display: flex;
  align-items: center;
  font-size: 0.95rem;
}

.question-status i {
  margin-right: 0.5rem;
}

.el-icon-check {
  color: #00bfff;
}

.el-icon-close {
  color: #ff3b30;
}

.question-detail {
  color: #6c757d;
  line-height: 1.6;
  font-size: 0.95rem;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 2rem;
}

button {
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

button::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 5px;
  height: 5px;
  background: rgba(255, 255, 255, 0.5);
  opacity: 0;
  border-radius: 100%;
  transform: scale(1, 1) translate(-50%);
  transform-origin: 50% 50%;
}

button:focus:not(:active)::after {
  animation: ripple 0.6s ease-out;
}

.retry-btn {
  background: linear-gradient(135deg, #0099ff 0%, #00c2ff 100%);
  color: white;
}

.retry-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 7px 14px rgba(0, 153, 255, 0.3);
}

.share-btn {
  background: linear-gradient(135deg, #a1c4ff 0%, #c2e9ff 100%);
  color: white;
}

.share-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 7px 14px rgba(161, 196, 255, 0.3);
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

@keyframes ripple {
  0% {
    transform: scale(0, 0);
    opacity: 1;
  }
  20% {
    transform: scale(25, 25);
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: scale(40, 40);
  }
}

@media (max-width: 768px) {
  .result-container {
    padding: 1.5rem;
    margin: 1rem auto;
  }

  .header h1 {
    font-size: 1.8rem;
  }

  .result-card {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem;
  }

  .result-icon {
    margin-right: 0;
    margin-bottom: 1.2rem;
  }

  .action-buttons {
    flex-direction: column;
    gap: 1rem;
  }

  button {
    width: 100%;
  }
}
</style>
