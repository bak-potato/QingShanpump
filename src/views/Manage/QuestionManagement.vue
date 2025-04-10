<template>
  <div class="questionMan">
    <h1>题目管理</h1>
    <div class="questionbody">
      <h2>题目列表</h2>
      <div class="elscbody">
        <el-scrollbar height="300px">
          <!-- 根据是否有内容来决定是否显示 el-empty -->
          <el-empty v-if="questions.length === 0" description="暂无创建题目" />
          <!-- 渲染题目列表 -->
          <div v-else>
            <div v-for="question in questions" :key="question.id" class="scrollbar-demo-item">
              <div class="question-header">
                <div class="question-text" @click="toggleQuestion(question.id)">
                  {{ question.text }} <!-- 显示题目标题 -->
                  <el-icon :class="['arrow-icon', { 'rotate': question.expanded }]">
                    <ArrowDown />
                  </el-icon>
                </div>
                <el-button class="xiugaiaa" type="text" @click="toggleEdit(question.id)">修改</el-button>
                <el-button class="xiugaiaa" type="text" @click="DeleteQuestion(question.id)">删除</el-button>
              </div>
              <!-- 展开后显示选项和答案 -->
              <div v-if="question.expanded && !question.editing" class="question-details">
                <ul class="options-list">
                  <li v-for="(option, oIndex) in question.options" :key="oIndex">
                    <span class="option-label">{{ getOptionLabel(oIndex) }}</span>
                    <span class="option-text">{{ option.value }}</span>
                    <span v-if="option.isAnswer" class="answer-tag">(答案)</span>
                    <span v-if="value3" class="answer-tag">({{option.score }})</span>
                     <span v-if="!value3" class="answer-tag">({{option.result }})</span>
                  <span v-if="!option.isAnswer">
                    正确答案：{{ question.options.filter(option => option.isAnswer).map(option => getOptionLabel(question.options.indexOf(option))).join('、') }}
                  </span>
                  </li>
                </ul>

              </div>
              <!-- 编辑模式 -->
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
        <div class="handquestion" v-if="isShow">
          <div class="question-item">
            <el-form style="position: relative;" :model="newQuestion" label-width="120px">
              <label class="switch">
                <el-switch v-model="value3" inline-prompt active-text="评分" inactive-text="测评" />
              </label>
               <label class="switch" style="margin-left: 50px;">
                <el-switch v-model=" newQuestion.isMultiple" inline-prompt active-text="多选" inactive-text="单选" />
              </label>

              <el-form-item label="问题">
                <el-input v-model="newQuestion.text" placeholder="请输入问题"></el-input>
              </el-form-item>
              <el-form-item label="选项">
                <div v-for="(option, index) in newQuestion.options" :key="index" class="option-item">
                  <div class="option-row">
                    <span class="option-label">{{ getOptionLabel(index) }}</span>
                    <el-input v-model="option.text" :placeholder="`选项 ${getOptionLabel(index)}`" class="option-input"></el-input>
                    <el-input v-model="option.score"  placeholder="请输入分数" v-if="value3" style="width: 140px;"></el-input>
                    <el-input v-model="option.result" placeholder="请输入属性" v-if="!value3" style="width: 140px;"></el-input>
                    <el-button
                      type="danger"
                      circle
                      size="small"
                      @click="removeNewOption(index)"
                      v-if="index > 1"
                      class="delete-button"
                    >
                      <el-icon>
                        <img width="20px" src="@/icons/delete.png" style="position: relative;left: -50px;">
                      </el-icon>
                    </el-button>
                  </div>
                </div>
                <el-button class="cjxx1" type="primary" @click="addNewOption">增加选项</el-button>
              </el-form-item>
            </el-form>
          </div>
          <el-button type="primary" @click="saveQuestion(id)">保存题目</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref,onMounted} from 'vue';
import { ArrowDown } from '@element-plus/icons-vue';
import {addQuestion,listQuestionVOByPage,editQuestion,deleteQuestion} from "@/api/question";
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
// 新建
const nnn = ref({
   id: 0,
  questionContent: [
    {
      options: [
        {
          key: "",
          result: "",
          score: 0,
          value: ""
        }
      ],
      title: ""
    }
  ]
})
const router = useRouter();
// 接收路由参数
const id = router.currentRoute.value.query.id
// 定义题目列表
const questions = ref({});
const isShow = ref(true);
const value3 = ref(true);
// 定义新题目的数据结构
const newQuestion = ref({
  text: '',
  options: [
    { text: '', score: '', result: '' }, // 初始化 isAnswer 为 false
    { text: '', score: '', result: '' }
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

// 增加选项（新题目）
const addNewOption = () => {
 newQuestion.value.options.push({
    text: '',
    score: '',
    result: '',
    isAnswer: false // 初始化答案状态为 false
  });
};

// 删除选项（新题目）
const removeNewOption = (index) => {
  newQuestion.value.options.splice(index, 1);
};

// 保存题目
const saveQuestion = async(id) => {
  if (newQuestion.value.text.trim() === '') {
    alert('问题不能为空');
    return;
  }
  if (newQuestion.value.options.some(option => option.text.trim() === '')) {
    alert('选项不能为空');
    return;
  }
  // questions.value.push({
  //   ...newQuestion.value,
  //   expanded: false,
  //   editing: false
  // });
    const newquestion = {
  appId: id,
  questionContent: [
    {
        title: newQuestion.value.text,
        options: newQuestion.value.options.map((option, index) => ({
          key: String.fromCharCode(65 + index), // 生成 A,B,C...
          value: option.text,
          score: value3.value ? Number(option.score) || 0 : 0,
          result: !value3.value ? option.result || '' : '',
        }))
    }
  ]
  };
  console.log(newquestion);
  const {data:{code,data}} = await addQuestion(newquestion);
  if(code === 0){
    alert('添加成功');
    console.log(data);

  }else{
    alert('添加失败');
  }
  // 清空表单数据
  newQuestion.value = {
    text: '',
    options: [
      { text: '', score: '', result: '' },
      { text: '', score: '', result: '' }
    ]
  };
};
// 删除题目
const DeleteQuestion = async (id) => {
  const question = questions.value.find(q => q.id === id);
  console.log(question);
  if (!question) return;
  // 出现弹窗询问是否删除
  const confirmDelete = window.confirm('确定要删除该题目吗？');
  if (!confirmDelete) return;
  else{
  const   res  = await deleteQuestion({id:question.id});
  if(res){
    ElMessage.success('删除成功');
  }
  await renderQuestions();
  console.log(res);
  }

}

// 渲染题目列表
const renderQuestions = async() => {
  const res = await listQuestionVOByPage({ appId: id });
  const records = res.data.data.records || [];
  questions.value = records.flatMap((record) =>
    record.questionContent.map((content) => ({
      ...record,
      ...content,
      text: content.title, // 假设题目标题为 title
      id: `${record.id}`, // 生成唯一标识
      expanded: false,
      editing: false
    }))
  );
  console.log(questions.value);
};
onMounted(() => {
  renderQuestions();
});
// 切换题目展开状态
const toggleQuestion = (questionId) => {
  const question = questions.value.find(q => q.id === questionId);
  if (question) {
    question.expanded = !question.expanded;
  }
};
// 切换编辑状态
const toggleEdit = async(questionId) => {
  const question = questions.value.find(q => q.id === questionId);
  console.log(question.id);
  if (question) {
    question.editing = !question.editing;
    // 创建一个新的对象副本
    nnn.value = {
      ...question,
      options: question.options.map(option => ({
        ...option,
        score: value3.value? Number(option.score) || 0 : 0,
        result:!value3.value? option.result || '' : '',
      }))
    }
    // if (!question.editing) {
    //   const updatedQuestion = {
    //     ...question,
    //     options: question.options.map(option => ({
    //       ...option,
    //       score: value3.value ? Number(option.score) || 0 : 0,
    //       result: !value3.value ? option.result || '' : ''
    //     }))
    //   };
    //    console.log(updatedQuestion);
    // }

  }
};

// 增加选项（编辑模式）
const addOption = (questionId) => {
  const question = questions.value.find(q => q.id === questionId);
  console.log(question);
  nnn.value.options.push({
    value: '',
    score: '',
    result: '',
  });
};

// 删除选项（编辑模式）
const removeOption = (qIndex, oIndex) => {
  questions.value[qIndex].options.splice(oIndex, 1);
};

// 保存编辑
const saveEdit = async (questionId) => {
   // 获取当前编辑的应用（从 questionSet 中获取，而非通过 index）
  const question = nnn.value;
  // 构造API参数
    const params = {
      id: question.id.split('-')[0], // 提取原始ID
      questionContent: [{
        title: question.text,
        options: question.options.map((opt, index) => ({
          key: String.fromCharCode(65 + index),
          value: opt.value,
          score: value3.value ? Number(opt.score) || 0 : 0,
          result: !value3.value ? opt.result || '' : ''
        }))
      }]
    };
  try {
    const question = questions.value.find(q => q.id === questionId);
    console.log(question);
    if (!question) return;

    // 验证必填字段
    if (question.text.trim() === '') {
      ElMessage.error('问题内容不能为空');
      return;
    }

    if (question.options.some(option => option.value.trim() === '')) {
      ElMessage.error('选项内容不能为空');
      return;
    }

    // 调用编辑接口
    const { data } = await editQuestion(params);
    if (data.code === 0) {
      ElMessage.success('修改成功');
      question.editing = false;
      await renderQuestions();
    } else {
      ElMessage.error(data.message || '保存失败');
    }
  } catch (error) {
    console.error('保存失败:', error);
    ElMessage.error('保存失败，请检查网络连接');
  }
};

// 取消编辑
const cancelEdit = (questionId) => {
  const question = questions.value.find(q => q.id === questionId);
  if (question ) {
    question.editing = false;
  }
};
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
