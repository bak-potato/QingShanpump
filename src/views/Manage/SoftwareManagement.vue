<template>
  <div class="questionMan">
    <h1>应用管理</h1>
    <div class="questionbody">
      <div class="lastf12">
        <div
          @click="handleisshowa(true)"
          :class="['l2ab', { l21: isShowa, 'active-tab': isShowa }]"
        >
          <h2>创建应用</h2>
        </div>
        <div
          @click="handleisshowa(false)"
          :class="['l2ab', { l21:!isShowa, 'active-tab':!isShowa }]"
        >
          <h2>应用列表</h2>
        </div>
      </div>
      <div v-if="!isShowa">
        <h2 class="h2a">已创建应用</h2>
        <div class="elscbody">
          <el-scrollbar height="700px">
            <!-- 根据是否有内容来决定是否显示el-empty -->
            <el-empty v-if="questionSets.length === 0" description="暂无创建应用" />
            <!-- 渲染题目列表 -->
            <div v-else>
              <div v-for="(questionSet, setIndex) in questionSets" :key="setIndex" class="scrollbar-demo-item">
                <div class="question-set-header">
                  <div class="question-set-name" @click="toggleQuestionSet(setIndex)">
                    <el-avatar :size="40" :src="questionSet.avatar" class="profile-avatar2"/> {{ questionSet.name }}&nbsp;&nbsp;({{questionSet.value}})
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
                      <template v-if="!question.editing">
                        {{ question.text }}
                        <span v-if="isMultipleChoice(question)" class="multiple-choice-tag">（多选题）</span>
                        <!-- toggleQuestionEdit -->
                      </template>
                      <template v-else>
                        <el-input v-model="question.editText" placeholder="请输入问题"></el-input>
                        <el-button type="primary" @click="saveQuestionEdit(setIndex, index)">保存</el-button>
                        <el-button type="text" @click="cancelQuestionEdit(setIndex, index)">取消</el-button>
                      </template>
                    </div>
                    <ul class="options-list">
                      <li v-for="(option, oIndex) in question.options" :key="oIndex">
                        <template v-if="!question.editing">
                          <span class="option-label">{{ getOptionLabel(oIndex) }}</span>
                          <span class="option-text">{{ option.text }}</span>
                          <span v-if="option.isAnswer" class="answer-tag">(答案)</span>
                        </template>
                        <template v-else>
                          <span class="option-label">{{ getOptionLabel(oIndex) }}</span>
                          <el-input v-model="option.editText" :placeholder="`选项 ${getOptionLabel(oIndex)}`" class="option-input"></el-input>
                          <el-checkbox v-model="option.isAnswer">设为答案</el-checkbox>
                          <el-button
                            type="danger"
                            circle
                            size="small"
                            @click="removeOption(setIndex, index, oIndex)"
                            v-if="oIndex > 0"
                            class="delete-button"
                          >
                            <el-icon>
                              <img width="20px" src="@/icons/delete.png" />
                            </el-icon>
                          </el-button>
                        </template>
                      </li>
                      <li v-if="question.editing">
                        <el-button type="primary" @click="addOption(setIndex, index)">增加选项</el-button>
                      </li>
                    </ul>
                  </div>
                </div>
                <!-- 更改键弹出 -->
                <div v-if="questionSet.editing" class="edit-section">
                  <el-form :model="questionSet" label-width="120px">
                    <el-form-item label="应用名称">
                      <el-input v-model="questionSet.editName" placeholder="请输入应用名称"></el-input>
                    </el-form-item>
                    <el-form-item label="问题列表">
                      <div v-for="(question, qIndex) in questionSet.questions" :key="qIndex" class="question-item">
                        <div class="question-text">
                          <el-input v-model="question.text" placeholder="请输入问题"></el-input>
                        </div>
                        <div class="options-list">
                          <div v-for="(option, oIndex) in question.options" :key="oIndex" class="option-item">
                            <div class="option-row">
                              <span class="option-label">{{ getOptionLabel(oIndex) }}</span>
                              <el-input v-model="option.text" :placeholder="`选项 ${getOptionLabel(oIndex)}`" class="option-input"></el-input>
                              <el-checkbox v-model="option.isAnswer">设为答案</el-checkbox>
                              <el-button
                                type="danger"
                                circle
                                size="small"
                                @click="removeOption(setIndex, qIndex, oIndex)"
                                v-if="oIndex > 0"
                                class="delete-button"
                              >
                                <el-icon>
                                  <img width="20px" src="@/icons/delete.png" />
                                </el-icon>
                              </el-button>
                            </div>
                          </div>
                          <el-button type="primary" @click="addOption(setIndex, qIndex)">增加选项</el-button>
                      <el-button type="primary" @click="addQuestion(setIndex)">增加问题</el-button>

                            <el-button  type="primary" @click="saveEdit(setIndex)">保存</el-button>
                    <el-button type="text" @click="cancelEdit(setIndex)">取消</el-button>
                        </div>
                      </div>
                    </el-form-item>
                  </el-form>
                  <div class="edit-buttons">

                  </div>
                </div>
              </div>
            </div>
          </el-scrollbar>
        </div>
      </div>
      <div v-if="isShowa">
        <div class="lastf1">
          <div @click="handleisshow(true)" :class="['l2a', { l21: isShow }]">
            手动设置
          </div>
          <div @click="handleisshow(false)" :class="['l2a', { l21:!isShow }]">
            AI出题
          </div>
        </div>




        <div>
          <div class="AIquestion" v-if="!isShow"></div>
          <div class="handquestion" v-if="isShow">
             <div class="tou">
              <el-avatar :size="40" :src="newQuestionSet.avatar" class="profile-avatar" />
               <el-upload action="#" :show-file-list="false"  :before-upload="handleAvatarUpload" >
                  <el-button type="Default" size="small" class="mt-2">
                上传照片
              </el-button>
               </el-upload>
             </div>



            <div class="tmmc">
              请输入应用名称： <el-input class="tmmc1" v-model="newQuestionSet.name" placeholder="请输入应用名称"></el-input>
                            <el-select v-model="newQuestionSet.value" placeholder="类型选择" style="width: 100px;size: 100px;">
                                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"/>
                            </el-select>
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
                        @click="removeOption(-1, qIndex, index)"
                        v-if="index > 0"
                        class="delete-button"
                      >
                        <el-icon>
                          <img width="20px" src="@/icons/delete.png">
                        </el-icon>
                      </el-button>
                    </div>
                  </div>
                  <el-button class="cjxx" type="primary" @click="addOption(-1, qIndex)">增加选项</el-button>
                </el-form-item>
              </el-form>
            </div>








            <el-button type="primary" @click="addQuestion(-1)">增加题目</el-button>
            <el-button type="primary" @click="removeQuestion(-1)">删除题目</el-button>
            <el-button type="primary" @click="saveQuestionSet">保存应用</el-button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ArrowDown } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus'; // 引入 ElMessage 用于提示

// 定义习题集列表
const questionSets = ref([]);
const isShow = ref(true);
const isShowa = ref(true);

// 定义选择类型
const options = [
  {
    value: '心理测试',
    label: '心理测试',
  },
  {
    value: '生活实用',
    label: '生活实用',
  },
  {
    value: '娱乐休闲',
    label: '娱乐休闲',
  },
  {
    value: '科普',
    label: '科普',
  },
  {
    value: '智力挑战',
    label: '智力挑战',
  },
  {
    value: '学习',
    label: '学习',
  },
  {
    value: '其他',
    label: '其他',
  },
]
// 定义新习题集的数据结构
const newQuestionSet = ref({
  name: '',
  value: '',
  avatar: '',
  questions: [
    {
      text: '',
      options: [
        { text: '', isAnswer: false ,option:''},
        { text: '', isAnswer: false ,option:''}
      ]
    }
  ]
});

// 获取选项的标签（A、B、C、D...）
const getOptionLabel = (index) => {
  return String.fromCharCode(65 + index); // 65是'A'的ASCII码
};

// 切换创建应用和应用列表
const handleisshowa = (show) => {
  isShowa.value = show;
};

// 切换手动设置和AI出题
const handleisshow = (show) => {
  isShow.value = show;
};

// 增加问题
const addQuestion = (setIndex) => {
  if (setIndex === -1) {
    newQuestionSet.value.questions.push({
      text: '',
      options: [
        { text: '', isAnswer: false },
        { text: '', isAnswer: false }
      ]
    });
  } else {
    questionSets.value[setIndex].questions.push({
      text: '',
      options: [
        { text: '', isAnswer: false },
        { text: '', isAnswer: false }
      ]
    });
  }
};

// 增加选项
const addOption = (setIndex, qIndex) => {
  if (setIndex === -1) {
    newQuestionSet.value.questions[qIndex].options.push({ text: '', isAnswer: false });
  } else {
    questionSets.value[setIndex].questions[qIndex].options.push({ text: '', isAnswer: false });
  }
};

// 删除选项
const removeOption = (setIndex, qIndex, oIndex) => {
  if (setIndex === -1) {
    newQuestionSet.value.questions[qIndex].options.splice(oIndex, 1);
  } else {
    questionSets.value[setIndex].questions[qIndex].options.splice(oIndex, 1);
  }
};

// 保存编辑
const saveEdit = (index) => {
  const questionSet = questionSets.value[index];

  // 检查应用名称是否为空
  if (questionSet.editName.trim() === '') {
    ElMessage.error('应用名称不能为空');
    return;
  }
  // 检查类型是否为空
  if (questionSet.value.trim() === '') {
    ElMessage.error('类型不能为空');
    return;
  }

  // 检查每个问题是否为空
  for (const question of questionSet.questions) {
    if (question.text.trim() === '') {
      ElMessage.error('问题不能为空');
      return;
    }

    // 检查每个选项是否为空
    for (const option of question.options) {
      if (option.text.trim() === '') {
        ElMessage.error('选项不能为空');
        return;
      }
    }

    // 检查每个问题是否至少有一个答案
    if (!question.options.some(option => option.isAnswer)) {
      ElMessage.error('每个问题必须至少有一个答案');
      return;
    }
  }

  // 如果所有验证通过，保存编辑
  questionSet.name = questionSet.editName;
  questionSet.editing = false;
};

// 取消编辑
const cancelEdit = (index) => {
  questionSets.value[index].editing = false;
};

// 保存题目编辑
const saveQuestionEdit = (setIndex, qIndex) => {
  const question = questionSets.value[setIndex].questions[qIndex];

  // 检查问题是否为空
  if (question.editText.trim() === '') {
    ElMessage.error('问题不能为空');
    return;
  }

  // 检查每个选项是否为空
  for (const option of question.options) {
    if (option.editText.trim() === '') {
      ElMessage.error('选项不能为空');
      return;
    }
  }

  // 检查每个问题是否至少有一个答案
  if (!question.options.some(option => option.isAnswer)) {
    ElMessage.error('每个问题必须至少有一个答案');
    return;
  }

  // 如果所有验证通过，保存编辑
  question.text = question.editText;
  question.options.forEach(option => {
    option.text = option.editText;
  });
  question.editing = false;
};

// 取消题目编辑
const cancelQuestionEdit = (setIndex, qIndex) => {
  const question = questionSets.value[setIndex].questions[qIndex];
  question.editing = false;
};

// 删除题目
const removeQuestion = (qIndex) => {
  if (qIndex === -1) {
    newQuestionSet.value.questions.pop();
  } else {
    questionSets.value[qIndex].questions.splice(qIndex, 1);
  }
};

// 保存新应用
const saveQuestionSet = () => {
  const newSet = newQuestionSet.value;

  // 检查应用名称是否为空
  if (newSet.name.trim() === '') {
    ElMessage.error('应用名称不能为空');
    return;
  }

  // 检查每个问题是否为空
  for (const question of newSet.questions) {
    if (question.text.trim() === '') {
      ElMessage.error('问题不能为空');
      return;
    }

    // 检查每个选项是否为空
    for (const option of question.options) {
      if (option.text.trim() === '') {
        ElMessage.error('选项不能为空');
        return;
      }
    }

    // 检查每个问题是否至少有一个答案
    if (!question.options.some(option => option.isAnswer)) {
      ElMessage.error('每个问题必须至少有一个答案');
      return;
    }
    if (newSet.value.trim() === '') {
      ElMessage.error('类型不能为空');
      return;
    }
    if (newSet.avatar.trim() === '') {
      ElMessage.error('头像不能为空');
      return;
    }
  }

  // 如果所有验证通过，保存新应用
  questionSets.value.push({
    ...newSet,
    expanded: false,
    editing: false,
    editName: ''
  });

  // 重置新应用表单
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

// 删除应用
const deleteQuestionSet = (index) => {
  questionSets.value.splice(index, 1);
};
// 上传头像
const handleAvatarUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    ElMessage.error('只能上传图片文件')
    return false
  }
  // 实际应调用上传API
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => {
    newQuestionSet.value.avatar = reader.result
  }
  return false // 阻止自动上传
}
</script>

<style scoped>

.bccas1 {
position: absolute;
}
.edit-section {
  margin-top: 20px;
  padding: 20px;
  width: 100%;
  /* background-color: #f9fafc; */
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.question-item {
  margin-top: 30px;
  margin-bottom: 20px;
  width: 1000px;
  padding: 15px;
  background-color: #fff;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.question-text {
  margin-bottom: 15px;
}


.option-item {
  margin-bottom: 10px;
}

.option-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.option-label {
  width: 24px;
  height: 24px;
  display: flex;
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
}

.edit-buttons {
  margin-top: 20px;
  text-align: right;
}
/* 其他样式保持不变 */
.h2a {
  margin-top: 20px;
}
.question-set-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .question-set-name {
    margin-bottom: 10px;
  }
  .profile-avatar2 {
    position: relative;
    top: 10px;
    left: -2px;

  }
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
.tou{
  float: left;
  width: 200px;
  height: 200px;
  position: relative;
  left: 350px;
  top: -7px;
  .profile-avatar {
    margin-top: 20px;
  }
  .mt-2 {
    position: relative;
    top: -35px;
    left: -87px;
  }
}

.question-set-info {
  display: flex;
  align-items: center;
}

.create-time {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}
.lastf12 {
  display: flex;
  align-content: center;
  justify-content: space-evenly;
  width: 226px;
  height: 36px; /* 增加高度 */
  background-color: #e6e8f2;
  border-radius: 6px;
  margin-top: 20px;
  margin-left: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 增加阴影 */
}

.l2ab {
  width: 100px;
  height: 100%;
  border-radius: 6px;
  font-size: 14px; /* 增大字体 */
  line-height: 36px; /* 垂直居中 */
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease; /* 增加过渡效果 */
  color: #757a8c; /* 默认文字颜色 */
}

.l2ab:hover {
  background-color: #d7d8df; /* 悬停效果 */
  color: #409eff; /* 悬停文字颜色 */
}

.active-tab {
  background-color: white; /* 激活状态背景色 */
  color: #409eff; /* 激活状态文字颜色 */
  font-weight: bold; /* 激活状态加粗 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 激活状态阴影 */
}

h2 {
  font-size: 16px; /* 调整标题大小 */
  font-weight: 600;
  color: inherit; /* 继承父元素颜色 */
  margin: 0; /* 去除默认 margin */
}
.tmmc1 {
  padding-right: 30px;
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
.l2ab {
  width: 100px;
  height: 20px;
  border-radius: 5px;
  font-size: 12px;
  line-height: 20px;
  text-align: center;
  margin-top: 3px;
  float: left;
  text-align: center;
  cursor: pointer;
}
.lastf12 {
  display: flex;
  align-content: center;
  justify-content: space-evenly;
  width: 226px;
  height: 26px;
  background-color: #e6e8f2;
  border-radius: 6px;
  margin-top: 20px;
  margin-left: 20px;
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
  height: 700px;
}

h2 {
  font-size: 18px;
  font-weight: 600;
  color: #757a8c;
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
