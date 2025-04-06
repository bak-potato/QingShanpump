<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="quiz-container">
    <!-- 题目区域 -->
    <div class="question-container">
      <h2 class="question-title">{{ currentQuestion.title }}</h2>
      <p class="question-content">{{ currentQuestion.content }}</p>

      <!-- 选项列表 -->
      <ul class="options-list">
        <li
          v-for="(option, index) in currentQuestion.options"
          :key="index"
          :class="{ 'selected': isOptionSelected(index) }"
          @click="toggleOption(index)"
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
import { ref, computed,watch  } from 'vue';
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
        selectedAnswer.value = userAnswers.value[targetIndex]
        console.log('已定位到题目:', currentQuestionIndex.value)
    } else {
        console.warn('未找到对应题目，ID:', newId)
    }
})
// 题目数据示例，添加 isMultiple 字段区分单选和多选
const questions = ref([
  {
    id: 1,
    title: '题目1：Vue基础知识',
    content: '下列关于Vue的说法正确的是？',
    options: [
      'Vue是一个基于JavaScript的框架',
      'Vue使用单向数据流',
      'Vue由Facebook团队维护',
      'Vue不支持TypeScript'
    ],
    correct: 0,
    isMultiple: false
  },
  {
    id: 2,
    title: '题目2：Vue基础知识（多选）',
    content: '以下哪些是Vue的特性？',
    options: [
      '响应式',
      '组件化',
      '虚拟DOM',
      '双向数据绑定'
    ],
    correct: [0, 1, 2],
    isMultiple: true
  }
]);

// 当前题目索引
const currentQuestionIndex = ref(0);
// 用户选择的答案数组，单选存储单个索引，多选存储索引数组
const userAnswers = ref(new Array(questions.value.length).fill(null));
// 当前选中的答案
const selectedAnswer = ref(null);

// 计算当前题目
const currentQuestion = computed(() => questions.value[currentQuestionIndex.value]);
const optionLabels = ['A', 'B', 'C', 'D'];

// 判断选项是否被选中
const isOptionSelected = (index) => {
  if (currentQuestion.value.isMultiple) {
    return userAnswers.value[currentQuestionIndex.value]?.includes(index);
  }
  return userAnswers.value[currentQuestionIndex.value] === index;
};

// 切换选项选择状态
const toggleOption = (index) => {
  if (currentQuestion.value.isMultiple) {
    const currentAnswers = userAnswers.value[currentQuestionIndex.value] || [];
    const newAnswers = currentAnswers.includes(index)
     ? currentAnswers.filter((i) => i!== index)
      : [...currentAnswers, index];
    userAnswers.value[currentQuestionIndex.value] = newAnswers;
  } else {
    userAnswers.value[currentQuestionIndex.value] = index;
  }
};

const nextQuestion = () => {
  if (currentQuestionIndex.value < questions.value.length - 1) {
    currentQuestionIndex.value++;
    selectedAnswer.value = userAnswers.value[currentQuestionIndex.value];
  }
};

const prevQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--;
    selectedAnswer.value = userAnswers.value[currentQuestionIndex.value];
  }
};

// 提交答卷
const submitQuiz = () => {
  // 收集所有答案并转换为选项内容
  const selectedOptions = userAnswers.value.map((answer, i) => {
    if (answer === null) {
      return '未回答';
    }
    if (questions.value[i].isMultiple) {
      return answer.map((index) => questions.value[i].options[index]).join(', ');
    }
    return questions.value[i].options[answer];
  });

  // 验证答案并计算得分
  const score = userAnswers.value.reduce((acc, answer, index) => {
    const question = questions.value[index];
    if (question.isMultiple) {
      if (
        answer &&
        answer.length === question.correct.length &&
        answer.every((i) => question.correct.includes(i))
      ) {
        return acc + 1;
      }
    } else {
      if (answer === question.correct) {
        return acc + 1;
      }
    }
    return acc;
  }, 0);

  console.log('提交的选项内容:', selectedOptions);
  console.log('你的得分是:', score, '/', questions.value.length);
};
</script>

<style scoped>
.quiz-container {
  max-width: 1350px;
  width: 1350px;
  margin: 20px auto;
  padding: 24px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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

.result-message {
  margin-top: 20px;
  text-align: center;
  font-size: 18px;
  color: #333;
}
</style>
