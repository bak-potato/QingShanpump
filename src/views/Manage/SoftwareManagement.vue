<template>
  <div class="questionMan">
    <h1>应用管理</h1>
    <div class="questionbody">
      <h2>已创建应用</h2>
      <div class="elscbody">
        <el-scrollbar height="300px">
          <!-- 根据是否有内容来决定是否显示 el-empty -->
          <el-empty v-if="questionSets.length === 0" description="暂无创建应用" />
          <!-- 渲染题目列表 -->
          <div v-else>
            <div v-for="(questionSet, setIndex) in questionSets" :key="setIndex" class="scrollbar-demo-item">
              <div class="question-set-header">
                <div class="question-set-name" @click="toggleQuestionSet(setIndex)">
                  {{ questionSet.name }}
                  <el-icon :class="['arrow-icon', { 'rotate': questionSet.expanded }]">
                    <ArrowDown />
                  </el-icon>
                </div>
                <div class="action-buttons">
                  <el-button type="text" @click.stop="toggleEdit(setIndex)">更改</el-button>
                  <el-button type="text" @click.stop="deleteQuestionSet(setIndex)">删除</el-button>
                </div>
              </div>
              <div v-if="questionSet.expanded">
                <div v-for="(question, index) in questionSet.questions" :key="index" class="scrollbar-demo-item">
                  <div class="question-text">
                    {{ question.text }}
                    <span v-if="isMultipleChoice(question)" class="multiple-choice-tag">（多选题）</span>
                  </div>
                  <ul class="options-list">
                    <li v-for="(option, oIndex) in question.options" :key="oIndex">
                      <span class="option-label">{{ getOptionLabel(oIndex) }}</span>
                      <span class="option-text">{{ option.text }}</span>
                      <span v-if="option.isAnswer" class="answer-tag">(答案)</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div v-if="questionSet.editing" class="edit-section">
                <el-input v-model="questionSet.editName" placeholder="请输入新的应用名称"></el-input>
                <el-button type="primary" @click="saveEdit(setIndex)">保存</el-button>
                <el-button type="text" @click="cancelEdit(setIndex)">取消</el-button>
              </div>
            </div>
          </div>
        </el-scrollbar>
      </div>
      <h2>创建应用</h2>
      <div class="lastf1">
        <div @click="handleisshow(true)" :class="['l2a', { l21: isShow }]">
          手动设置
        </div>
        <div @click="handleisshow(false)" :class="['l2a', { l21: !isShow }]">
          AI出题
        </div>
      </div>
      <div>
        <div class="AIquestion" v-if="!isShow"></div>
        <div class="handquestion" v-if="isShow">
          <div class="tmmc">
            请输入应用名称： <el-input class="tmmc1" v-model="newQuestionSet.name" placeholder="请输入应用名称"></el-input>
          </div>
          <div v-for="(question, qIndex) in newQuestionSet.questions" :key="qIndex" class="question-item">
            <el-form :model="question" label-width="120px">
              <el-form-item :label="`问题 ${qIndex + 1}`">
                <el-input v-model="question.text" placeholder="请输入问题"></el-input>
              </el-form-item>
              <el-form-item label="选项">
                <div v-for="(option, index) in question.options" :key="index" class="option-item">
                  <div class="option-row">
                    <span class="option-label">{{ getOptionLabel(index) }}</span>
                    <el-input v-model="option.text" :placeholder="`选项 ${getOptionLabel(index)}`" class="option-input"></el-input>
                    <el-checkbox v-model="option.isAnswer" class="answer-checkbox">设为答案</el-checkbox>
                    <el-button
                      type="danger"
                      circle
                      size="small"
                      @click="removeOption(qIndex, index)"
                      v-if="index > 1"
                      class="delete-button"
                    >
                      <el-icon>
                        <img width="20px" src="@/icons/delete.png" >
                      </el-icon>
                    </el-button>
                  </div>
                </div>
                <el-button class="cjxx" type="primary" @click="addOption(qIndex)">增加选项</el-button>
              </el-form-item>
            </el-form>
          </div>
          <el-button type="primary" @click="addQuestion">增加题目</el-button>
          <el-button type="primary" @click="removeQuestion">删除题目</el-button>
          <el-button type="primary" @click="saveQuestionSet">保存应用</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ArrowDown } from '@element-plus/icons-vue';

// 定义习题集列表
const questionSets = ref([]);
const isShow = ref(true);

// 定义新习题集的数据结构
const newQuestionSet = ref({
  name: '',
  questions: [
    {
      text: '',
      options: [
        { text: '', isAnswer: false },
        { text: '', isAnswer: false }
      ]
    }
  ]
});

// 获取选项的标签（A、B、C、D...）
const getOptionLabel = (index) => {
  return String.fromCharCode(65 + index); // 65 是 'A' 的 ASCII 码
};

// 切换 AI 出题和手动出题
const handleisshow = (show) => {
  isShow.value = show;
};

// 增加选项
const addOption = (qIndex) => {
  newQuestionSet.value.questions[qIndex].options.push({ text: '', isAnswer: false });
};

// 删除选项
const removeOption = (qIndex, index) => {
  newQuestionSet.value.questions[qIndex].options.splice(index, 1);
};

// 增加题目
const addQuestion = () => {
  newQuestionSet.value.questions.push({
    text: '',
    options: [
      { text: '', isAnswer: false },
      { text: '', isAnswer: false }
    ]
  });
};

// 删除题目
const removeQuestion = (qIndex) => {
  newQuestionSet.value.questions.splice(qIndex, 1);
};

// 保存习题集
const saveQuestionSet = () => {
  if (newQuestionSet.value.name.trim() === '') {
    alert('应用名称不能为空');
    return;
  }
  if (newQuestionSet.value.questions.some(question => question.text.trim() === '')) {
    alert('问题不能为空');
    return;
  }
  if (newQuestionSet.value.questions.some(question => question.options.some(option => option.text.trim() === ''))) {
    alert('选项不能为空');
    return;
  }
  if (newQuestionSet.value.questions.some(question => !question.options.some(option => option.isAnswer))) {
    alert('每个问题必须至少有一个答案');
    return;
  }
  questionSets.value.push({ ...newQuestionSet.value, expanded: false, editing: false, editName: '' });
  newQuestionSet.value = {
    name: '',
    questions: [
      {
        text: '',
        options: [
          { text: '', isAnswer: false },
          { text: '', isAnswer: false }
        ]
      }
    ]
  };
};

// 切换习题集的展开状态
const toggleQuestionSet = (index) => {
  questionSets.value[index].expanded = !questionSets.value[index].expanded;
};

// 判断是否为多选题
const isMultipleChoice = (question) => {
  return question.options.filter(option => option.isAnswer).length > 1;
};

// 切换编辑状态
const toggleEdit = (index) => {
  questionSets.value[index].editing = !questionSets.value[index].editing;
  if (questionSets.value[index].editing) {
    questionSets.value[index].editName = questionSets.value[index].name;
  }
};

// 保存编辑
const saveEdit = (index) => {
  if (questionSets.value[index].editName.trim() === '') {
    alert('应用名称不能为空');
    return;
  }
  questionSets.value[index].name = questionSets.value[index].editName;
  questionSets.value[index].editing = false;
};

// 取消编辑
const cancelEdit = (index) => {
  questionSets.value[index].editing = false;
};

// 删除应用
const deleteQuestionSet = (index) => {
  questionSets.value.splice(index, 1);
};
</script>

<style scoped>
/* 其他样式保持不变 */

.question-set-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* .action-buttons {
} */

.edit-section {
  margin-top: 10px;
  display: flex;
  gap: 10px;
  align-items: center;
}
</style>

<style scoped>
.tmmc1 {
  width: 200px;
}
.tmmc {
  width: 500px;
  margin: 20px auto;
  font-size: 18px;
}
.cjxx {
  margin-left: 10px;
  margin-top: -10px;
}
.handquestion {
  width: 100%;
  margin-top: 10px;
  border-radius: 25px;
  background-color: #fff;
  padding: 20px;
}

.AIquestion {
  width: 100%;
  height: 300px;
  margin-top: 10px;
  border-radius: 25px;
  background-color: #fff;
}

/* 选项项样式 */
.option-item {
  margin-bottom: 10px;
  display: flex;
  height: auto;
}

.option-row {
  display: flex;
  position: relative;
  align-items: center;
  gap: 10px;
}

.option-label {
  width: 24px;
  height: 24px;
  display: flex;
  margin-left: 10px;
  align-items: center;
  justify-content: center;
  background-color: #409eff;
  color: white;
  border-radius: 50%;
  font-size: 14px;
}

.option-input {
  flex: 1;
}
.delete-button {
  margin-left: 10px;
  float: left;
  position: absolute;
  right: 100px;
  border: none;
  background-color: transparent;
}
.delete-button el-icon {
  color: #7e3e3e;
}

.answer-checkbox {
  margin-left: 10px;
}

.answer-tag {
  margin-left: 10px;
  color: green;
  font-weight: bold;
}

.multiple-choice-tag {
  margin-left: 10px;
  color: red;
  font-weight: bold;
}

/* 已创建题目样式 */
.question-text {
  font-weight: bold;
  margin-bottom: 10px;
}

.options-list {
  list-style: none;
  padding: 0;
}

.options-list li {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.options-list .option-label {
  width: 20px;
  height: 20px;
  font-size: 12px;
  margin-right: 8px;
}

/* 其他样式 */
.l2a:not(.l21):hover {
  background-color: #d7d8df;
}

.l21 {
  background-color: white;
}

.l2a {
  width: 60px;
  height: 20px;
  border-radius: 5px;
  font-size: 12px;
  margin-top: 3px;
  float: left;
  text-align: center;
  cursor: pointer;
}

.lastf1 {
  display: flex;
  align-content: center;
  justify-content: space-evenly;
  width: 126px;
  height: 26px;
  background-color: #e6e8f2;
  border-radius: 6px;
  margin-top: 20px;
  margin-left: 20px;
}

.elscbody {
  width: 100%;
  height: 300px;
}

h2 {
  margin-left: 20px;
  font-size: 18px;
  font-weight: 600;
  color: #757a8c;
  margin-top: 20px;
}

.scrollbar-demo-item {
  padding: 10px;
  margin: 4px;
  border-radius: 4px;
  background-color: #fff;
  color: #757a8c;
}

.questionbody {
  width: 100%;
  height: 700px;
}

.questionMan {
  max-width: 1350px;
  height: 98vh;
  min-width: 1350px;
  margin: 0px auto;
  margin-top: 1vh;
}

.arrow-icon {
  transition: transform 0.3s;
}

.rotate {
  transform: rotate(180deg);
}
</style>
