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
              <div v-for="(questionSet) in questionSets" :key="questionSet.id" class="scrollbar-demo-item">
                <div class="question-set-header">
                  <div class="question-set-name" @click="toggleQuestionSet(setIndex)">
                    <el-avatar :size="40" :src="questionSet.appIcon" class="profile-avatar2"/> {{ questionSet.appName }}&nbsp;&nbsp;({{questionSet.appType
}})
                    <!-- <el-icon :class="['arrow-icon', { 'rotate': questionSet.expanded }]">
                      <ArrowDown />
                    </el-icon> -->
                  </div>
                  <div class="action-buttons">
                    <el-button type="text" @click="add(questionSet.id)">添加题目</el-button>
                    <el-button type="text" @click.stop="toggleEdit(questionSet.id)">更改</el-button>
                    <el-button type="text" @click.stop="deleteQuestionSet(questionSet.id)">删除</el-button>
                  </div>
                </div>
              </div>
               <!-- 更改键弹出 -->
              <el-dialog v-model="isEditDialogVisible" title="Tips"  width="500" :before-close="handleClose" :modal="null">
                  <el-form :model="nquestionSet" label-width="120px">
                    <el-form-item label="应用名称">
                      <el-input v-model="nquestionSet.appName" placeholder="请输入应用名称"></el-input>
                    </el-form-item>
                    <el-form-item label="应用描述">
                      <el-input v-model="nquestionSet.appDesc" placeholder="请输入应用描述"></el-input>
                    </el-form-item>
                    <!-- 上传头像 -->
                    <el-form-item label="上传头像">
                      <el-avatar :size="40" :src="nquestionSet.appIcon" class="profile-avatar" />
                      <el-upload action="#" :show-file-list="false" :before-upload="tttt" >
                        <el-button type="Default" size="small" class="mt-2">
                          更改头像
                        </el-button>
                      </el-upload>
                    </el-form-item>
                  </el-form>
                  <template #footer>
                    <div class="dialog-footer">
                      <el-button @click="isEditDialogVisible = false">取消</el-button>
                      <el-button type="primary" @click="baocun()"> 保存 </el-button>
                    </div>
                  </template>
                </el-dialog>
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
            <label class="switch">
                <el-switch v-model="value3" inline-prompt active-text="评分" inactive-text="测评" />
            </label>
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
            <!-- 新增应用描述输入框 -->
            <div class="app-description">
                <el-form-item label="应用描述" style="margin-top: 20px;">
                    <el-input  v-model="newQuestionSet.description" type="textarea"  :rows="3"  placeholder="请输入应用描述（最多200字）" maxlength="200" show-word-limit style="width: 500px;">               </el-input>
                </el-form-item>
            </div>
            <!-- <div v-for="(question, qIndex) in newQuestionSet.questions" :key="qIndex" class="question-item">
              <el-form :model="question" label-width="120px">
                <el-form-item :label="`问题 ${qIndex + 1}`">
                  <el-input v-model="question.text" placeholder="请输入问题"></el-input>
                </el-form-item>
                <el-form-item label="选项">
                  <div v-for="(option, index) in question.options" :key="index" class="option-item">
                    <div class="option-row">
                      <span class="option-label">{{ getOptionLabel(index) }}</span>
                      <el-input v-model="option.text" :placeholder="`选项 ${getOptionLabel(index)}`" class="option-input"></el-input>
                      <el-input v-model="option.score" class="option-input2" placeholder="请输入分数" v-if="value3"></el-input>
                       <el-input v-model="option.result" class="option-input2" placeholder="请输入属性" v-if="!value3"></el-input>
                      <el-button
                        type="danger"
                        circle
                        size="small"
                        @click="removeOption(-1, qIndex, index)"
                        v-if="index > 0"
                        class="delete-button"
                      >
                        <el-icon>
                          <img width="20px" src="@/icons/delete.png" style="position: relative;left: 100px;">
                        </el-icon>
                      </el-button>
                    </div>
                  </div>
                  <el-button class="cjxx" type="primary" @click="addOption(-1, qIndex)">增加选项</el-button>
                </el-form-item>
              </el-form>
            </div> -->
            <!-- <el-button type="primary" @click="addQuestion(-1)">增加题目</el-button>
            <el-button type="primary" @click="removeQuestion(-1)">删除题目</el-button> -->
            <el-button type="primary" @click="saveQuestionSet">上传应用</el-button>

          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
// import { ArrowDown } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus'; // 引入 ElMessage 用于提示
import {addApp, common,listAppByPage,editApp,deleteApp} from "@/api/app";
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';
// 弹窗
const nquestionSet = ref({
  id: null,
  appName: '',
  appDesc: '',
  appIcon: '' // 补充头像字段
});
const isEditDialogVisible = ref(false);
// 路由传参
const router = useRouter();
// 定义一个用于进行路由跳转并传递参数的函数
const add = (id) => {
    // 打印传入的 id 参数，方便调试
    console.log('传递的问题 ID 为:', id);
    try {
        // 使用路由实例进行跳转，将 id 作为查询参数传递
        router.push({
            path: '/questionmanage',
            // 使用简洁表示法，当对象属性名和变量名一致时可省略值
            query: { id }
        });
    } catch (error) {
        // 若跳转过程中出现错误，打印错误信息
        console.error('路由跳转失败:', error);
    }
};
// 定义是评分还是测评
const value3 = ref(true)
// 定义习题集列表
const questionSets = ref([]);
const isShow = ref(true);
const isShowa = ref(true);
// 定义选择类型
const options = [
  {
    value: 0,
    label: '系统测评',
  },
  {
    value: 1,
    label: 'ai评测',
  },
]
// 定义新习题集的数据结构
const newQuestionSet = ref({
  name: '',
  value: '',
  avatar: '',
  description: '' // 新增描述字段
});

// 获取选项的标签（A、B、C、D...）
// const getOptionLabel = (index) => {
//   return String.fromCharCode(65 + index); // 65是'A'的ASCII码
// };

// 切换创建应用和应用列表
const handleisshowa = async(show) => {
  isShowa.value = show;
};

// 切换手动设置和AI出题
const handleisshow = (show) => {
  isShow.value = show;
};
// 保存编辑
// 引入编辑应用的接口（假设接口文件中已定义）

const baocun = async () => {
  // 获取当前编辑的应用（从 questionSet 中获取，而非通过 index）
  const currentQuestionSet = nquestionSet.value;

  // 验证必填字段
  if (!currentQuestionSet.id) {
    ElMessage.error('应用数据异常，请重试');
    return;
  }
  if (currentQuestionSet.appName.trim() === '') {
    ElMessage.error('应用名称不能为空');
    return;
  }
  if (currentQuestionSet.appDesc.trim() === '') {
    ElMessage.error('应用描述不能为空');
    return;
  }

  // 构造请求参数（根据后端接口要求调整字段）
  const editParams = {
    id: currentQuestionSet.id,
    appName: currentQuestionSet.appName.trim(),
    appDesc: currentQuestionSet.appDesc.trim(),
    appIcon: currentQuestionSet.appIcon.trim() // 头像字段
    // 如有其他字段（如头像），需在此补充
  };

  try {
    // 调用编辑接口
    const res = await editApp(editParams);
    isEditDialogVisible.value = false;
    console.log(res);
    // 重新获取应用列表数据
    await init();
  } catch (error) {
    console.error('编辑接口调用失败:', error);
    ElMessage.error('编辑失败，请检查网络或重试');
  }
};

// 取消编辑
// const cancelEdit = (index) => {
//   questionSets.value[index].editing = false;
// };

// 保存题目编辑
// const saveQuestionEdit = (setIndex, qIndex) => {
//   const question = questionSets.value[setIndex].questions[qIndex];

//   // 检查问题是否为空
//   if (question.editText.trim() === '') {
//     ElMessage.error('问题不能为空');
//     return;
//   }

//   // 检查每个选项是否为空
//   for (const option of question.options) {
//     if (option.editText.trim() === '') {
//       ElMessage.error('选项不能为空');
//       return;
//     }
//   }

//   // 检查每个问题是否至少有一个答案
//   if (!question.options.some(option => option.isAnswer)) {
//     ElMessage.error('每个问题必须至少有一个答案');
//     return;
//   }

//   // 如果所有验证通过，保存编辑
//   question.text = question.editText;
//   question.options.forEach(option => {
//     option.text = option.editText;
//   });
//   question.editing = false;
// };

// 取消题目编辑
// const cancelQuestionEdit = (setIndex, qIndex) => {
//   const question = questionSets.value[setIndex].questions[qIndex];
//   question.editing = false;
// };

// 删除题目
// const removeQuestion = (qIndex) => {
//   if (qIndex === -1) {
//     newQuestionSet.value.questions.pop();
//   } else {
//     questionSets.value[qIndex].questions.splice(qIndex, 1);
//   }
// };
// 保存新应用
const id = ref()
const saveQuestionSet = async() => {
  const newSet = newQuestionSet.value;
  // 对接接口
  const addApi = {
    appName: newSet.name,
    appType: newSet.value,
    appIcon: newSet.avatar,
    appDesc: newSet.description,
    scoringStrategy:1
  }
  console.log(addApi)
 const {data:{code,data}} = await addApp(addApi)
 id.value = data
  if(code === 0) {
    ElMessage.success('上传成功');

  } else {
    ElMessage.error('上传失败');
  }

  // 检查应用名称是否为空
  if (newSet.name.trim() === '') {
    ElMessage.error('应用名称不能为空');
    return;
  }
  // 检查描述是否为空
  if (newSet.description.trim() === '') {
    ElMessage.error('描述不能为空');
    return;
  }
  // 检查每个问题是否为空
  // for (const question of newSet.questions) {
  //   if (question.text.trim() === '') {
  //     ElMessage.error('问题不能为空');
  //     return;
  //   }

  //   // 检查每个选项是否为空
  //   for (const option of question.options) {
  //     if (option.text.trim() === '') {
  //       ElMessage.error('选项不能为空');
  //       return;
  //     }
  //   }
  //   // 检查分数是否为空
  //   for (const option of question.options) {
  //     if(value3.value) {
  //       if (option.score.trim() === '') {
  //         ElMessage.error('分数不能为空');
  //         return;
  //       }
  //     }
  //     if(!value3.value) {
  //       if (option.result.trim() === '') {
  //         ElMessage.error('属性不能为空');
  //         return;
  //       }
  //     }
  //   }

  //   // 检查每个问题是否至少有一个答案
  //   if (newSet.value.trim() === '') {
  //     ElMessage.error('类型不能为空');
  //     return;
  //   }
  //   if (newSet.avatar.trim() === '') {
  //     ElMessage.error('头像不能为空');
  //     return;
  //   }

  // }

  // 如果所有验证通过，保存新应用
  // 重置新应用表单
  newQuestionSet.value = {
    name: '',
    description: '',
    avatar:'',
    value:'',
  };
};
// 应用列表
const init = async() => {
    try {
        const res = await listAppByPage({ page: null});
        console.log(res)
        questionSets.value = res.data.data.records
        console.log(questionSets.value)
    } catch (error) {
        console.error('获取应用列表失败:', error);
    }
};
onMounted(() => {
    init();
  })
// 切换习题集的展开状态
// const toggleQuestionSet = (index) => {
//   questionSets.value[index].expanded = !questionSets.value[index].expanded;
// };

// 判断是否为多选题
// const isMultipleChoice = (question) => {
//   return question.options.filter(option => option.isAnswer).length > 1;
// };
// 切换编辑状态
const toggleEdit = (id) => {
  const targetSet = questionSets.value.find(set => set.id === id);
  if (!targetSet) {
    ElMessage.warning('未找到对应的应用，请刷新后重试');
    return;
  }
  // 创建一个新的对象副本
  nquestionSet.value = {...targetSet };
  isEditDialogVisible.value = true;
};

// 删除应用
const deleteQuestionSet = async (appId) => {
    // 确认删除
    const confirmDelete = window.confirm('确定要删除该应用吗？');
    if (!confirmDelete) {
      return;
    }else {
      try {

        const res = await deleteApp({id:appId})
        if(res) {
          ElMessage.success('删除成功')
          await init();
        }
      }catch (error) {
        console.error('删除应用失败:', error);
        ElMessage.error('删除应用失败，请重试');
      }
    }
};
// 上传头像
const handleAvatarUpload = async(file) => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    ElMessage.error('只能上传图片文件')
    return false
  }
  const formData = new FormData()
  formData.append('file', file)
  console.log(11111)
  const res = await common(formData)
  newQuestionSet.value.avatar = res.data.data
  ElMessage.success('上传成功')
  return true

}
const tttt = async(file) => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    ElMessage.error('只能上传图片文件')
    return false
  }
  const formData = new FormData()
  formData.append('file', file)
  console.log(11111)
  const res = await common(formData)
  nquestionSet.value.appIcon = res.data.data
  ElMessage.success('上传成功')
  return true
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
.option-input2 {
  width: 110px;
  height: 30px;
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

<style >
.tou{
  float: left;
  width: 200px;
  height: 200px;
  position: relative;
  left: 350px;
  top: 27px;
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

.switch {
 position: relative;
 top: 56px;
 display: inline-block;
 left: -10px;
 width: 120px;
 height: 34px;
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
