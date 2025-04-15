<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="quiz-container">
    <!-- 题目区域，添加 v-if 确保有数据时才渲染 -->
    <div v-if="questions.length > 0" class="question-container">
      <h2 class="question-title">题目:{{ currentQuestion.title }}</h2>
      <!-- 选项列表 -->
      <ul class="options-list">
        <li
          v-for="(option, index) in currentQuestion.options"
          :key="index"
          :class="{ 'selected': isOptionSelected(index) }"
          @click="toggleOption( index)"
        >
          <span class="option-index">{{ optionLabels[index] }}</span>
          <div class="option-content">{{ option.value }}</div>
        </li>
      </ul>
    </div>
    <!-- 数据加载中提示 -->
    <div v-else class="loading">数据加载中...</div>

    <!-- 控制按钮，根据数据加载情况禁用 -->
    <div class="control-buttons">
      <el-button
        type="primary"
        :disabled="currentQuestionIndex === 0 || questions.length === 0"
        @click="prevQuestion"
      >
        上一题
      </el-button>

      <el-button
        type="primary"
        v-if="currentQuestionIndex < questions.length - 1 && questions.length > 0"
        @click="nextQuestion"
      >
        下一题
      </el-button>

      <el-button
        type="success"
        v-else-if="questions.length > 0"
        @click="submitQuiz"
      >
        提交答卷
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { listQuestionVOByPage ,addUserAnswer,getUserAnswerVOById} from '@/api/answer';
import { ElMessage } from 'element-plus';
const router = useRouter();
const questions = ref([]);
const currentQuestionIndex = ref(0);
const userAnswers = ref([]);
// 计算当前题目
const currentQuestion = computed(() => questions.value[currentQuestionIndex.value]);
console.log(currentQuestion);
const getOptionLabel = (index) => {
  if (index < 26) {
    return String.fromCharCode(65 + index); // 65 是 'A' 的 ASCII 码
  }
  return String.fromCharCode(65 + (index % 26)) + Math.floor(index / 26); // 处理超过 Z 的情况
};
const optionLabels = Array.from({ length: 100 }, (_, i) => getOptionLabel(i))
// 获取题目列表
const listQuestions = async () => {
  const id = router.currentRoute.value.query.id;
  try {
    const res = await listQuestionVOByPage({ appId: id });
    if (res.data && res.data.data.records) {
      const processedQuestions = res.data.data.records.flatMap((record) => {
        return record.questionContent.map((content) => ({
          title: content.title || '默认标题', // 设置默认值防止 title 为 undefined
          content: content.content || '', // 题目内容根据接口实际字段调整
          options: content.options || [] // 选项数组根据接口实际字段调整
        }));
      });
      questions.value = processedQuestions;
      console.log(questions.value);
      currentQuestionIndex.value = 0; // 初始化显示第一题
    }
  } catch (error) {
    console.error('获取题目列表失败:', error);
  }
};

// 简化的交互逻辑，实际需根据需求完善
const isOptionSelected = (index) => {
  const currentQuestion = questions.value[currentQuestionIndex.value];
  if (currentQuestion.isMultiple) {
    return userAnswers.value[currentQuestionIndex.value]?.includes(index) || false;
  }
  return userAnswers.value[currentQuestionIndex.value] === index;
};

// 切换选项的选中状态
const toggleOption = (index) => {
  const currentQuestion = questions.value[currentQuestionIndex.value];
  if (currentQuestion.isMultiple) {
    // 处理多选题的选中状态切换
    userAnswers.value[currentQuestionIndex.value] = userAnswers.value[currentQuestionIndex.value] || [];
    const newAnswers = userAnswers.value[currentQuestionIndex.value].includes(index)
     ? userAnswers.value[currentQuestionIndex.value].filter(i => i!== index)
      : [...userAnswers.value[currentQuestionIndex.value], index];
    userAnswers.value[currentQuestionIndex.value] = newAnswers;
  } else {
    // 处理单选题的选中状态切换
    userAnswers.value[currentQuestionIndex.value] = index;
  console.log(userAnswers.value);
  }

};
const prevQuestion = () => {
  if (currentQuestionIndex.value > 0 && questions.value.length > 0) {
    currentQuestionIndex.value--;
  }
};
const nextQuestion = () => {
  if (currentQuestionIndex.value < questions.value.length - 1 && questions.value.length > 0) {
    currentQuestionIndex.value++;
  }
};

const submitQuiz = async () => {
  const id = router.currentRoute.value.query.id;
  const answers = userAnswers.value.map((answer, index) => {
    const question = questions.value[index];
    if (question.isMultiple) {
      return answer ? answer.map(i => optionLabels[i]).join(',') : '';
    }
    return answer !== null ? optionLabels[answer] : '';
  });

  const data = {
    appId: id,
    choices: answers
  };
console.log(data);
  try {
    console.log('data',data)
    const res = await addUserAnswer(data);
    console.log(res);
    goToResult(res.data.data)
    if (res.data.code === 0) {
      // 跳出提示框
      ElMessage({
        message: '提交成功',
        type: 'success',
        duration: 2000
      })
    }
  } catch (error) {
    console.error('提交答卷失败:', error);
  }

};
// 返回评测结果
const goToResult = async(id) => {
  const res = await getUserAnswerVOById({id:id});
    router.push({
      path: '/AnswerIns',
      query: {
        resultDesc:res.data.data.resultDesc,
        resultName:res.data.data.resultName
      }
    });
  console.log(res.data.data);
  console.log(res.data.data.resultName);

}
// const submitQuiz = async () => {

//   const id = router.currentRoute.value.query.id;
//   const answers = userAnswers.value.map((answer, index) => {
//     const question = questions.value[index];
//     if (question.isMultiple) {
//       return answer ? answer.map(i => optionLabels[i]).join(',') : '';
//     }
//     return answer !== null ? optionLabels[answer] : '';
//   });

//   const data = {
//     appId: id,
//     choices: answers
//   };
//   console.log(data);
//   try {
//     const res = await addUserAnswer(data);
//     console.log(res);
//     // 路由跳转并传递参数
//     router.push({
//       path: '/AnswerIns',
//       query: {
//         result:res.data.data
//       }
//     });

//     if (res.data.code === 0) {
//       ElMessage({
//         message: '提交成功',
//         type: 'success',
//         duration: 2000
//       });
//     }
//   } catch (error) {
//     console.error('提交答卷失败:', error);
//     ElMessage({
//       message: '提交失败',
//       type: 'error',
//       duration: 2000
//     });
//   }
// };

onMounted(() => {
  listQuestions();
});

</script>

<style scoped>
/* 新增加载状态样式 */
.loading {
  text-align: center;
  font-size: 18px;
  color: #666;
  padding: 20px;
}

/* 原有样式保持不变 */
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
