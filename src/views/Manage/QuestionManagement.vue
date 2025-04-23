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
                <div class="question-text" @click="toggleQuestion(question.title)">
                  {{ question.title }}
                  <el-icon :class="['arrow-icon', { 'rotate': question.expanded }]">
                    <ArrowDown />
                  </el-icon>
                </div>
                <el-button class="xiugaiaa" type="text" @click="toggleEdit(question.questionId)">修改</el-button>
                <el-button class="xiugaiaa" type="text" @click="DeleteQuestion(question.questionId,question.id)">删除</el-button>
              </div>
              <!-- 展开状态 -->
              <div v-if="question.expanded" class="question-details">
                <ul class="option-list">
                  <li v-for="(option, index) in question.options" :key="index">
                    <span class="option-label">{{ option.key }}</span>
                    <span class="option-value">{{ option.value }}</span>
                    <span v-if="option.isAnswer" class="answer-mark">✔ 答案</span>
                  </li>
                </ul>
              </div>
             <!-- 修改题目 -->
              <div v-if="question.editing" class="edit-section">
                <el-form :model="nnn" label-width="120px">
                  <el-form-item label="问题">
                    <el-input v-model="nnn.title" placeholder="请输入问题"></el-input>
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
                    <el-button class="cjxx1" type="primary" @click="addOption(question.questionId)">增加选项</el-button>
                  </el-form-item>
                </el-form>
                <div class="edit-buttons">
                <el-button type="primary" @click="saveEdit(question.id)">保存</el-button>
                <el-button type="text" @click="noSave(question.questionId)">取消</el-button>
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
        <!-- ai出题 -->
        <div class="AIquestion" v-if="!isShow">
          <div class="question" >
            <el-form
              :model="ai"
              :rules="aiRules"
              ref="aiFormRef"
              label-width="100px"
            >
              <el-form-item
                label="题目个数"
                prop="questionCount"
              >
                <el-input
                  v-model.number="ai.questionCount"
                  placeholder="请输入题目个数"
                  type="number"
                  min="2"
                  :max="50"
                ></el-input>
              </el-form-item>

              <el-form-item
                label="选项个数"
                prop="optionCount"
              >
                <el-input
                  v-model.number="ai.optionCount"
                  placeholder="请输入选项个数"
                  type="number"
                  min="2"
                  :max="10"
                ></el-input>
              </el-form-item>
            </el-form>

            <el-button
              type="primary"
              @click="addAi"
              style="margin-left: 20px;"
              :disabled="!ai.questionCount || !ai.optionCount || loading"
            >
              <span v-if="!loading">提交</span>
              <span v-else>
                <el-icon class="is-loading">
                  <Loading />
                </el-icon>
                生成中...
              </span>
            </el-button>
          </div>

          <!-- 加载动画 -->
          <div v-if="loading" class="loading-overlay">
            <div class="loading-content">
              <el-progress type="circle" :percentage="progress" :status="progressStatus" />
              <p class="loading-text">AI正在生成题目，请稍候...</p>
            </div>
          </div>
        </div>
        <!-- 人工出题 -->
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
import { ArrowDown, Loading } from '@element-plus/icons-vue';
import { ref,onMounted} from 'vue';
import { addQuestion,listMyQuestionVOByPage,aiGenerateQuestion,deleteQuestion,editQuestion} from "@/api/question";
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
const router = useRouter();
// 接收路由参数
const id = router.currentRoute.value.query.id
const isShow = ref(true);
const value3 = ref(true);
const aiFormRef = ref(null);
// 添加加载状态相关变量
const loading = ref(false);
const progress = ref(0);
const progressStatus = ref('');
const progressInterval = ref(null);

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
// 定义ai属性
const ai = ref({
  id:id, // 应用ID（从路由参数获取）
  optionCount: 2,// 题目个数（生成多少道题）
  questionCount: 2, // 每个题目的选项个数
});
// Ai表单验证规则
const aiRules = ref({
  questionCount: [
    { required: true, message: '请输入题目个数', trigger: 'blur' },
    { type: 'number', min: 2, message: '题目个数必须≥2', trigger: 'blur' },
  ],
  optionCount: [
    { required: true, message: '请输入选项个数', trigger: 'blur' },
    { type: 'number', min: 2, message: '选项个数必须≥2', trigger: 'blur' },
  ],
});
// 切换 AI 出题和手动出题
const handleisshow = (show) => {
  isShow.value = show;
};

const addAi = async () => {
  // 验证表单
  try {
    await aiFormRef.value.validate();
  } catch (error) {
    console.error('表单验证失败:', error);
    return;
  }

  // 开始加载
  loading.value = true;
  progress.value = 0;
  progressStatus.value = '';

  // 模拟进度条
  progressInterval.value = setInterval(() => {
    progress.value += Math.floor(Math.random() * 10) + 5;
    if (progress.value >= 95) {
      clearInterval(progressInterval.value);
    }
  }, 500);

  try {
    const params = {
      appId: ai.value.id,
      optionNumber: ai.value.optionCount,
      questionNumber: ai.value.questionCount
    };

    const res = await aiGenerateQuestion(params);
    console.log(res);
    // 完成加载
    clearInterval(progressInterval.value);
    progress.value = 100;
    progressStatus.value = 'success';

    // 稍作延迟让用户看到完成状态
    setTimeout(() => {
      loading.value = false;
      ElMessage.success('AI出题成功');
      renderQuestions(); // 刷新题目列表
    }, 800);

  } catch (error) {
    // 出错处理
    clearInterval(progressInterval.value);
    progress.value = 100;
    progressStatus.value = 'exception';

    setTimeout(() => {
      loading.value = false;
      ElMessage.error(`请求失败：${error.message || '数据不存在'}`);
    }, 800);
  }
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
    // 生成一个从1单数开始的id
    questionId:  newQuestion.value.questions.indexOf(question) + 1,
    options: question.options.map((option, oIndex) => ({
      key: getOptionLabel(oIndex), // 生成A/B/C/D...
      value: option.text,
      score: value3.value ? Number(option.score) || 0 : null, // 评分模式
      result: !value3.value ? option.result || null : null, // 测评模式
    })),
  }));
console.log(questionContent);
  // 构造API参数（假设appId从路由获取）
  const params = {
    appId: id, // 应用ID（从路由参数获取）
    questionContent, // 直接传递问题数组
  };

  // 调用添加接口
  const { data: { code, message } } = await addQuestion(params);
  if (code === 0) {
    ElMessage.success('添加成功');
    // 刷新题目列表
    renderQuestions();
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
    console.log(data);
    const rawQuestions = data.data.records || [];
    console.log(rawQuestions);
    // 确保每个题目有唯一 id 和正确的状态字段
    const processedQuestions = rawQuestions.flatMap(record => {
      return record.questionContent.map(content => ({
        questionId: content.questionId,
        id: record.id,
        title: content.title,
      //  正确渲染选项
        options: content.options.map((option, index) => ({
          key: getOptionLabel(index), // 生成A/B/C/D...
          value: option.value,
          score: option.score , // 评分模式
          result: option.result || null, // 测评模式
        })),
        expanded: false, // 展开状态
        editing: false, // 编辑状态
      }));
    });
    console.log(processedQuestions);
    questions.value = processedQuestions; // 赋值给数组
    console.log(questions.value);
  } catch (error) {
    ElMessage.error('加载题目失败',error);
  }
};
// 展开/收起
const toggleQuestion = (title) => {
  const question = questions.value.find(q => q.title === title);
  console.log(question);
  if (question) {
    question.expanded = !question.expanded;
  }
}
// 修改
const toggleEdit = (questionId) => {
  console.log(questionId);
  // 打开面板
  const question = questions.value.find(q => q.questionId === questionId);
  if (question) {
    question.editing = true;
    // 复制当前问题的数据到 nnn 中
    nnn.value = {
      questionId: question.questionId,
      title: question.title,
      options: question.options.map(option => ({
        key: option.key,
        value: option.value,
        score: option.score,
        result: option.result
      })),
    }
    console.log(nnn.value);
  }
}
// 删除
const DeleteQuestion = async (questionId,id) => {
  try {
    console.log(id,questionId);
    const res = await deleteQuestion({id:id,questionId:questionId});
    if (res.code === 0) {
      ElMessage.success('删除成功');
    }
    // 重新加载题目列表
    renderQuestions();
    console.log(res);
  }
  catch (error) {
    ElMessage.error('删除失败',error);
  }
}
// 提交编辑
const saveEdit = async (id) => {
  // 检查题目ID是否存在
  console.log(nnn.value);
  if (!nnn.value.questionId) {
    ElMessage.error('编辑的题目ID不存在');
    return;
  }
  // 从路由获取外层id（假设路由中的id就是接口示例中的外层id）
  const outerId = id;
  // 构造questionContent
  const questionContent = [{
    questionId: nnn.value.questionId, // 题目自身的id
    title: nnn.value.title,
    options: nnn.value.options.map(option => ({
      key: option.key,
      value: option.value,
      score: option.score,
      result: option.result
    }))
  }];
  // 构造完整参数（注意键名是id，与接口示例一致）
  const params = {
    id: outerId, // 外层id
    questionContent
  };
  try {
    const { data } = await editQuestion(params);
    if (data.code === 0) {
      ElMessage.success('修改成功');
      // 关闭编辑状态并更新本地数据
      const question = questions.value.find(q => q.questionId === nnn.value.questionId);
      if (question) {
        question.editing = false;
        question.title = nnn.value.title;
        question.options = nnn.value.options;
      }
    } else {
      ElMessage.error(`修改失败：${data.message}`);
    }
  } catch (error) {
    ElMessage.error('网络错误，修改失败');
    console.error('编辑请求失败', error);
  }
};
// 增加选项
const addOption = (questionId) => {
  const question = questions.value.find(q => q.questionId === questionId);
  if (question) {
    const newKey = String.fromCharCode(65 + question.options.length);
    question.options.push({ key: newKey, value: '', score: '', result: '' });
    // 若该题目处于编辑状态，同步更新 nnn.value.options

  }
    if (question.editing) {
      nnn.value.options = [...question.options]; // 复制数组确保响应式更新
    }
}
// 取消
const noSave = (questionId) => {
  // 关闭面板
  const question = questions.value.find(q => q.questionId === questionId);
  if (question) {
    question.editing = false;
  }
}
// 组件挂载时加载数据
onMounted(() => {
  renderQuestions();
});
</script>
<style scoped>
.option-list {
  list-style: none;
}
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
.option-value {
  position: relative;
  left: 40px;
  top:-24px;
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
.question {
  padding-top: 80px;
}
.loading-overlay {
  position: fixed; /* 使用 fixed 定位覆盖整个页面 */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 半透明背景 */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999; /* 确保在最上层 */
}

.loading-content {
  text-align: center;
}
</style>
