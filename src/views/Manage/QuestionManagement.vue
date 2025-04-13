<template>
  <div class="questionMan">
    <h1>题目管理</h1>
    <div class="questionbody">
      <h2>题目列表</h2>
      <div class="elscbody">
        <el-scrollbar height="300px">

          <el-empty v-if="questions.length === 0" description="暂无创建题目" />

          <div v-else>
            <div v-for="question in questions" :key="question.id" class="scrollbar-demo-item">
              <div class="question-header">
                <div class="question-text" @click="toggleQuestion(question.contentId)">
                  {{ question.title }}
                  <el-icon :class="['arrow-icon', { 'rotate': question.expanded }]">
                    <ArrowDown />
                  </el-icon>
                </div>
                <el-button class="xiugaiaa" type="text" @click="toggleEdit(question.id)">修改</el-button>
                <el-button class="xiugaiaa" type="text" @click="DeleteQuestion(question.id)">删除</el-button>
              </div>

              <div v-if="question.expanded" class="question-details">
                <ul class="option-list">
                  <li v-for="(option, index) in question.options" :key="index">
                    <span class="option-label">{{ option.key }}</span>
                    <span class="option-value">{{ option.value }}</span>
                    <span v-if="option.isAnswer" class="answer-mark">✔ 答案</span>
                    <span v-if="value3" class="score-info">评分：{{ option.score }}</span>
                    <span v-if="!value3" class="result-info">属性：{{ option.result }}</span>
                  </li>
                </ul>
              </div>

              <div v-if="question.editing" class="edit-section">
                <el-form :model="nnn" label-width="120px">
                  <el-form-item label="问题">
                    <el-input v-model="nnn.text" placeholder="请输入问题"></el-input>
                  </el-form-item>
                  <el-form-item label="选项">
                    <div v-for="(option, oIndex) in nnn.options" :key="oIndex" class="option-item">
                      <div class="option-row">
                        <span class="option-label">{{ getOptionLabel(oIndex) }}</span>
                        <el-input v-model="option.value" :placeholder="`选项 ${getOptionLabel(oIndex)}`" class="option-input"></el-input>
                        <el-input v-model="option.score"  placeholder="请输入分数" v-if="value3" style="width: 140px;"></el-input>
                        <el-input v-model="option.result" placeholder="请输入属性" v-if="!value3" style="width: 140px;"></el-input>
                        <el-button
                          type="danger"
                          circle
                          size="small"
                          @click="removeOption(index, oIndex)"
                          v-if="oIndex > 1"
                          class="delete-button"
                        >
                          <el-icon>
                            <img width="20px" src="@/icons/delete.png" style="position: relative;left: 100px;">
                          </el-icon>
                        </el-button>
                      </div>
                    </div>
                    <el-button class="cjxx1" type="primary" @click="addOption(question.id)">增加选项</el-button>
                  </el-form-item>
                </el-form>
                <div class="edit-buttons">
                <el-button type="primary" @click="saveEdit(question.id)">保存</el-button>
                <el-button type="text" @click="cancelEdit(question.id)">取消</el-button>
                </div>
              </div>
            </div>
          </div>
        </el-scrollbar>
      </div>






      <h2>创建题目</h2>
      <div class="lastf1">
        <div @click="handleisshow(true)" :class="['l2a', { l21: isShow }]">
          手动出题
        </div>
        <div @click="handleisshow(false)" :class="['l2a', { l21: !isShow }]">
          AI出题
        </div>
      </div>
      <div>
        <div class="AIquestion" v-if="!isShow"></div>
        <div class="handquestion" v-if="isShow" >
          <div class="question-item">
              <el-form style="position: relative;" :model="newQuestion" label-width="120px">
  <label class="switch">
    <el-switch v-model="value3" inline-prompt active-text="评分" inactive-text="测评" />
  </label>

  <!-- 循环渲染每个问题 -->
  <div v-for="(question, qIndex) in newQuestion.questions" :key="qIndex" class="question-item">
    <el-form-item label="问题标题">
      <el-input
        v-model="question.title"
        placeholder="请输入问题标题（如：下列哪个是正确选项？）"
      ></el-input>
    </el-form-item>

    <el-form-item label="选项">
      <div v-for="(option, oIndex) in question.options" :key="oIndex" class="option-item">
        <div class="option-row">
          <span class="option-label">{{ getOptionLabel(oIndex) }}</span>
          <el-input
            v-model="option.text"
            :placeholder="`选项 ${getOptionLabel(oIndex)}`"
            class="option-input"
          ></el-input>
          <!-- 评分/测评模式输入 -->
          <el-input
            v-model="option.score"
            placeholder="请输入分数"
            v-if="value3"
            style="width: 140px;"
          ></el-input>
          <el-input
            v-model="option.result"
            placeholder="请输入属性"
            v-if="!value3"
            style="width: 140px;"
          ></el-input>
          <!-- 删除选项按钮（保留至少2个选项） -->
          <el-button
            type="danger"
            circle
            size="small"
            @click="removeNewOption(qIndex, oIndex)"
            v-if="question.options.length > 2 && oIndex > 1"
            class="delete-button"
          >
            <el-icon style="margin-left: 200px;"><img width="20px" src="@/icons/delete.png"></el-icon>
          </el-button>
        </div>
      </div>
      <el-button
        class="cjxx1"
        type="primary"
        @click="addNewOption(qIndex)"
        style="margin-left: 46px; "
      >增加选项
    </el-button>
      <el-button
          type="danger"
          @click="deleteq(qIndex)"
          v-if="newQuestion.questions.length > 1"
          class="delete-question-btn"
          style="margin-bottom: 10px; "
        >
          删除问题
        </el-button>
    </el-form-item>
  </div>

           <!-- 增加新问题按钮 -->
          <el-button class="cjxx1" type="primary"  @click="addNewq()" style="margin-top: 20px; margin-left: 80px;">增加问题 </el-button>
            </el-form>
          </div>

          <el-button type="primary" @click="saveQuestion(id)" style="position: relative;left: 200px;top: -32px;">上传题目</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref,onMounted} from 'vue';
import { ArrowDown } from '@element-plus/icons-vue';
import { addQuestion,listMyQuestionVOByPage} from "@/api/question";
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
const router = useRouter();
// 接收路由参数
const id = router.currentRoute.value.query.id
const isShow = ref(true);
const value3 = ref(true);
// 定义新题目的数据结构（支持多个问题）
const newQuestion = ref({
  questions: [ // 问题数组，每个元素是一个独立问题
    {
      title: '', // 问题标题
      options: [ // 问题选项（至少2个初始选项）
        { text: '', score: '', result: '' }, // 选项A
        { text: '', score: '', result: '' }, // 选项B
      ],
    }
  ],
  isMultiple: false, // 是否多选
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
const addNewOption = (qIndex) => {
  newQuestion.value.questions[qIndex].options.push({
    text: '',
    score: '',
    result: '',
  });
};
// 增加新问题（每个问题默认包含2个选项）
const addNewq = () => {
  newQuestion.value.questions.push({
    title: '',
    options: [
      { text: '', score: '', result: '' }, // 选项A
      { text: '', score: '', result: '' }, // 选项B
    ],
  });
};
// 删除选项
const removeNewOption = (qIndex, oIndex) => {
  newQuestion.value.questions[qIndex].options.splice(oIndex, 1);
};
// 删除问题
const deleteq = (qIndex) => {
  // 防止删除最后一个问题
  if (newQuestion.value.questions.length === 1) {
    alert('至少保留1个问题');
    return;
  }
  newQuestion.value.questions.splice(qIndex, 1);
};
// 保存题目
const saveQuestion = async (id) => {
  // 校验每个问题的标题和选项是否为空
  const hasEmptyTitle = newQuestion.value.questions.some(question =>
    question.title.trim() === ''
  );
  const hasEmptyOption = newQuestion.value.questions.some(question =>
    question.options.some(option => option.text.trim() === '')
  );
  if (hasEmptyTitle) {
    alert('问题标题不能为空');
    return;
  }
  if (hasEmptyOption) {
    alert('选项内容不能为空');
    return;
  }

  // 格式化数据：将每个问题的选项转换为API所需格式
  const questionContent = newQuestion.value.questions.map((question) => ({
    title: question.title,
    options: question.options.map((option, oIndex) => ({
      key: getOptionLabel(oIndex), // 生成A/B/C/D...
      value: option.text,
      score: value3.value ? Number(option.score) || 0 : null, // 评分模式
      result: !value3.value ? option.result || null : null, // 测评模式
    })),
  }));

  // 构造API参数（假设appId从路由获取）
  const params = {
    appId: id, // 应用ID（从路由参数获取）
    questionContent, // 直接传递问题数组
  };

  // 调用添加接口
  const { data: { code, message } } = await addQuestion(params);
  if (code === 0) {
    alert('题目添加成功');
    // 清空表单（保留1个初始问题，方便继续创建）
    newQuestion.value = {
      questions: [
        {
          title: '',
          options: [
            { text: '', score: '', result: '' },
            { text: '', score: '', result: '' },
          ],
        }
      ],
      isMultiple: false,
    };
  } else {
    alert('添加失败：' + message);
  }
};

// 编辑
const questions = ref([]);
const nnn = ref({
  id: 0,
  title: '',
  options: [],
  expanded: false,
  editing: false
});
// 获取题目列表
const renderQuestions = async () => {
  try {
    const { data } = await listMyQuestionVOByPage({ appId: id });
    const rawQuestions = data.data.records || [];

    // 确保每个题目有唯一 id 和正确的状态字段
    const processedQuestions = rawQuestions.flatMap(record => {
      return record.questionContent.map(content => ({
        id: record.id, // 题目唯一标识
        contentId: `${Date.now()}`, // 新增唯一内容ID
        title: content.title,
        options: content.options.map(option => ({ ...option })),
        expanded: false, // 展开状态
        editing: false, // 编辑状态
      }));
    });

    questions.value = processedQuestions; // 赋值给数组
  } catch (error) {
    ElMessage.error('加载题目失败',error);
  }
};
// 展开/收起
const toggleQuestion = (contentId) => {
  const question = questions.value.find(q => q.contentId === contentId);
  console.log(question);
  if (question) {
    question.expanded = !question.expanded;
  }
}
// 组件挂载时加载数据
onMounted(() => {
  renderQuestions();
});
</script>
<style scoped>
.question-item{
margin-top: 40px;
}
.switch {
position: absolute;
top: -30px;
left: 500px;
}
.edit-buttons {
  position: absolute;
  bottom: 0px;
  margin-top: 20px;
  left: 40%;
}
.cjxx1 {
  margin-left: 20px;
  margin-top: -10px;
}
.xiugaiaa {
  float: right;
  margin-right: 20px;
  margin-top: -30px;
  border-radius: 10px;
}
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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  padding: 20px;
}

.AIquestion {
  width: 100%;
  height: 300px;
  margin-top: 10px;
  border-radius: 25px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
  border-radius: 10px;
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

.question-set-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.edit-button {
  margin-left: auto;
}

.edit-section {
  margin-top: 10px;
  display: flex;
  padding: 30px;
  gap: 10px;
  position: relative;
  height: auto;
  align-items: center;
}
</style>
