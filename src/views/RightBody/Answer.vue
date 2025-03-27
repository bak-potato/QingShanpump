<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="quiz-container">
    <!-- 头部进度和计时 -->
    <div class="quiz-header">
      <el-progress :percentage="progress" :stroke-width="8" />
      <div class="timer">
        <el-icon><Clock /></el-icon>
        <span>{{ formatTime(timeLeft) }}</span>
      </div>
    </div>

    <!-- 题目区域 -->
    <div class="question-container">
      <h2 class="question-title">{{ currentQuestion.title }}</h2>
      <p class="question-content">{{ currentQuestion.content }}</p>

      <!-- 选项列表 -->
      <ul class="options-list">
        <li
          v-for="(option, index) in currentQuestion.options"
          :key="index"
          :class="{ 'selected': selectedAnswer === index }"
          @click="selectAnswer(index)"
        >
          <span class="option-index">{{ optionLabels[index] }}</span>
          <div class="option-content">{{ option }}</div>
        </li>
      </ul>
    </div>

    <!-- 控制按钮 -->
    <div class="control-buttons">
      <el-button
        type="primary"
        :disabled="currentQuestionIndex === 0"
        @click="prevQuestion"
      >
        上一题
      </el-button>

      <el-button
        type="primary"
        v-if="currentQuestionIndex < questions.length - 1"
        @click="nextQuestion"
      >
        下一题
      </el-button>

      <el-button
        type="success"
        v-else
        @click="submitQuiz"
      >
        提交答卷
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed ,watch} from 'vue'
import { Clock } from '@element-plus/icons-vue'
import { useIntervalFn } from '@vueuse/core'
import { useQuestionStore } from "../../store/qusetion.js"
import { storeToRefs } from 'pinia'
const store = useQuestionStore()
const { selectedQuestionId } = storeToRefs(store)
watch(selectedQuestionId, (newId) => {
  if (!newId) return

  // 在题目列表中查找匹配的索引
  const targetIndex = questions.value.findIndex(q => q.id === newId)

  if (targetIndex !== -1) {
    currentQuestionIndex.value = targetIndex
    console.log('已定位到题目:', targetIndex + 1)
  } else {
    console.warn('未找到对应题目，ID:', newId)
  }
})
// 题目数据示例
const questions = ref([
  {
    id:1,
    title: '题目1：Vue基础知识',
    content: '下列关于Vue的说法正确的是？',
    options: [
      'Vue是一个基于JavaScript的框架',
      'Vue使用单向数据流',
      'Vue由Facebook团队维护',
      'Vue不支持TypeScript'
    ],
    correct: 0
  },
  {
     id:2,
    title: '题目1：Vue基础知识',
    content: '下列关于Vue的说法正确的是？',
    options: [
      'Vue是一个基于JavaScript的框架',
      'Vue使用单向数据流',
      'Vue由Facebook团队维护',
      'Vue不支持TypeScript'
    ],
    correct: 0
  },
  // 更多题目...
])

// 当前题目索引
const currentQuestionIndex = ref(0)
const selectedAnswer = ref(null)

// 计时功能
const timeLeft = ref(1800) // 30分钟
const { pause: pauseTimer } = useIntervalFn(() => {
  timeLeft.value = Math.max(0, timeLeft.value - 1)
}, 1000)

// 计算属性

const currentQuestion = computed(() => questions.value[currentQuestionIndex.value])


const progress = computed(() =>
  ((currentQuestionIndex.value + 1) / questions.value.length) * 100
)

const optionLabels = ['A', 'B', 'C', 'D']

// 方法
const selectAnswer = (index) => {
  selectedAnswer.value = index
}

const nextQuestion = () => {
  if (currentQuestionIndex.value < questions.value.length - 1) {
    currentQuestionIndex.value++
    selectedAnswer.value = null
  }
}

const prevQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
    selectedAnswer.value = null
  }
}

const submitQuiz = () => {
  pauseTimer()

  // 提交逻辑...

  console.log('提交答卷')
}

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}
</script>

<style scoped>
.quiz-container {
  max-width: 1350px;
  width: 1350px;
  margin: 20px auto;
  padding: 24px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.quiz-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.timer {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 16px;
}

.question-container {
  margin: 24px 0;
}

.question-title {
  color: #333;
  margin-bottom: 16px;
}

.question-content {
  color: #666;
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 32px;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.options-list li {
  display: flex;
  align-items: center;
  padding: 16px;
  border: 1px solid #eee;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.options-list li:hover {
  background: #f5f7fa;
}

.options-list li.selected {
  border-color: #409eff;
  background: #ecf5ff;
}

.option-index {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f2f5;
  border-radius: 50%;
  margin-right: 16px;
}

.control-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 32px;
}
</style>
