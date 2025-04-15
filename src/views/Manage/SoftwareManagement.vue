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
          <el-scrollbar>
            <!-- 根据是否有内容来决定是否显示el-empty -->
            <el-empty v-if="questionSets.length === 0" description="暂无创建应用" />
            <!-- 渲染题目列表 -->
            <div v-else>
              <div v-for="(questionSet) in questionSets" :key="questionSet.id" class="scrollbar-demo-item">
                <div class="question-set-header">
                  <div class="question-set-name" @click="toggleQuestionSet(setIndex)">
                    <el-avatar :size="40" :src="questionSet.appIcon" class="profile-avatar2"/> {{ questionSet.appName }}&nbsp;&nbsp;({{questionSet.appType}})
                  </div>
                  <div class="action-buttons">
                    <el-button type="text" @click="addscoring(questionSet.id)">编辑/查看策略</el-button>
                    <el-button type="text" @click="add(questionSet.id)">添加/查看题目</el-button>
                    <el-button type="text" @click.stop="toggleEdit(questionSet.id)">更改</el-button>
                    <el-button type="text" @click.stop="deleteQuestionSet(questionSet.id)">删除</el-button>
                  </div>
                </div>
              </div>
               <!-- 应用更改键弹出 -->
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

              <!-- 策略更改键弹出 -->
             <!-- 策略更改键弹出 -->
<el-dialog v-model="isScoringDialogVisible" title="策略设置" width="800" :before-close="handleClose" :modal="null">
  <div class="policypp" style="position: relative;">
    <!-- 遍历编辑中的策略数据 -->
    <el-form
      v-for="(policy, pIndex) in editPolicies"
      :key="pIndex"
      :model="policy"
      label-width="150px"
      style="margin-top: 20px; position: relative;"
    >
      <h3 style="margin-left:50px;margin-top:60px;">策略 {{ pIndex + 1 }}:</h3>
      <el-form-item label="评分类型">
        <el-radio-group v-model="policy.type">
          <el-radio label="0">得分类应用</el-radio>
          <el-radio label="1">测评类应用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="分数" v-if="policy.type === '0'">
        <el-input
          v-model="policy.resultScoreRange"
          placeholder="要大于或等于该分数"
        />
      </el-form-item>
      <el-form-item label="属性" v-if="policy.type === '1'">
        <el-select
          v-model="policy.resultProp"
          placeholder="请选择属性"
          style="width: 100px"
          multiple
        >
          <!-- 假设 resultProp 是选项数组，如 [{ label: 'I', value: 'I' }] -->
          <el-option
            v-for="item in resultProp"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="结果名称">
        <el-input
          v-model="policy.resultName"
          placeholder="输入评分结果的名称"
        />
      </el-form-item>
      <el-form-item label="结果描述">
        <el-input
          v-model="policy.resultDesc"
          placeholder="输入评分结果的描述"
          type="textarea"
          :rows="3"
        />
      </el-form-item>
      <el-button
        type="primary"
        @click="nremovePolicy(pIndex)"
        style="position: relative; top:52px; left: 310px;"
      >
        删除策略
      </el-button>
    </el-form>
    <!-- 添加策略按钮（保持在表单外） -->
    <el-button
      type="primary"
      @click="addPolicy()"
      style="position: relative; top:10px;left:200px;"
    >
      添加策略
    </el-button>
    <el-button
      type="primary"
      @click="nsavePolicy()"
      style="margin-left: 330px; margin-top: 20px;"
    >
      保存编辑
    </el-button>
    <el-button
      type="primary"
      style="margin-left: 20px; margin-top: 20px;"
      @click="isScoringDialogVisible = false"
    >
      取消
    </el-button>
  </div>
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
            </label>
             <div class="tou">
              <el-avatar :size="40" :src="newQuestionSet.avatar" class="profile-avatar" />
               <el-upload action="/api/common/upload" :show-file-list="false"  :before-upload="handleAvatarUpload" >
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
            <el-button type="primary" @click="saveQuestionSet">上传应用</el-button>

          </div>
          <div v-if="isShow" class="policy" style="position: relative;">
            <h2 style="position: absolute;top: 10px;">评分策略设置</h2>
            <el-form v-for="(policy, pIndex) in policies" :key="pIndex" :model="policy" label-width="150px" style="margin-top: 20px; position: relative;">
            <h3 style="margin-left:50px;margin-top:60px;">策略 {{ pIndex + 1 }}:</h3>
            <el-form-item label="评分类型">
              <el-radio-group v-model="policy.type">
                <el-radio label="0" >得分类应用</el-radio>
                <el-radio label="1" >测评类应用</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="分数" v-if="policy.type === '0'">
              <el-input  v-model="policy.resultScoreRange" placeholder="要大于或等于该分数" />
            </el-form-item>
            <el-form-item label="属性" v-if="policy.type === '1'">
               <el-select v-model="policy.resultProp" placeholder="请选择属性" style="width: 100px;size: 100px;" v-if="policy.type === '1'">
                <el-option v-for="item in resultProp" :key="item" :label="item.label" :value="item"/>
               </el-select>
            </el-form-item>
             <el-form-item label="结果名称">
              <el-input v-model="policy.resultName" placeholder="输入评分结果的名称"/>
            </el-form-item>
            <el-form-item label="结果描述">
              <el-input v-model="policy.resultDesc" placeholder="输入评分结果的描述"/>
            </el-form-item>
             <el-button type="primary" @click="removePolicy(pIndex)" style="position: absolute; left:220px;">删除策略</el-button>
            </el-form>
            <el-button type="primary" @click="addPolicy()" style="position: absolute; left:100px;">添加策略</el-button>
            <el-button type="primary" @click="savePolicy" style="margin-left: 350px;">保存策略</el-button>
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
import {addApp, common,listMyAppVOByPage,editApp,deleteApp} from "@/api/app";
import {listMyScoringResultVOByPage,editScoringResult,deleteScoringResult} from "@/api/scoring";
import {addScoringResult} from "@/api/scoring";
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';
// 评分策略设置
 const policies = ref([
  {
    type: '0',
    appId: 0,
    resultScoreRange: null,
    resultName: '',
    resultProp: [],
    resultDesc: ''
  }
]);
  // 定义属性
  const resultProp = ref([
    { label: 'I', value: 'I' },
    { label: 'S', value: 'S' },
    { label:'T', value: 'T' },
    { label: 'J', value: 'J' }
  ]);
  // 添加按钮
  const addPolicy = () => {
  // 获取最后一个策略的类型，如果没有则用默认值
  const lastType = policies.value.length > 0
    ? policies.value[policies.value.length - 1].type
    : '0';

  policies.value.push({
    type: lastType, // 使用最后一个策略的类型
    appId: id.value,
    resultScoreRange: '',
    resultName: '',
    resultProp: [],
    resultDesc: ''
  });
};
// 删除按钮
const removePolicy = (index) => {
  if (policies.value.length > 1) {
    policies.value.splice(index, 1);
  } else {
    ElMessage.warning('至少保留一个策略');
  }
};
// 编辑删除
const nremovePolicy = async() => {
  const res = await deleteScoringResult()
  console.log(res);
}
// 存储编辑中的策略数据（从接口获取）
const editPolicies = ref([]);
// 保存策略
const savePolicy = async () => {
    for (const policy of policies.value) {
        if (!policy.resultName) {
            ElMessage.error('请填写结果名称和描述');
            return;
        }
    }
    const requests = policies.value.map(policy => {
        let resultPropValue = [];
        console.log('Before transformation, policy.resultProp:', policy.resultProp);
        if (policy.type === '1') {
            if (Array.isArray(policy.resultProp)) {
                resultPropValue = policy.resultProp.map(item => item.value || item);
            } else if (typeof policy.resultProp === 'object' && policy.resultProp!== null) {
                // 如果是对象，将其值添加到数组中
                resultPropValue = [policy.resultProp.value || policy.resultProp];
            }
        }
        return {
            appId: id.value,
            type: policy.type,
            resultScoreRange: policy.resultScoreRange || 0,
            resultName: policy.resultName,
            resultProp: resultPropValue,
            resultDesc: policy.resultDesc
        };
    });
    console.log('savePolicy requests:', requests);
    try {
        const res = await addScoringResult(requests);
        console.log(res);
        ElMessage.success('保存成功');
    } catch (error) {
        ElMessage.error('保存失败');
        console.error('savePolicy error:', error);
    }
    // 清空
    policies.value = [
        {
            type: '0',
            appId: 0,
            resultScoreRange: null,
            resultName: '',
            resultProp: [],
            resultDesc: ''
        }
    ];
};
//  保存策略编辑
const nsavePolicy = async () => {
 const res = await editScoringResult();
 console.log(res);
}
// 弹窗
const nquestionSet = ref({
  id: null,
  appName: '',
  appDesc: '',
  appIcon: '' // 补充头像字段
});
const isEditDialogVisible = ref(false);
const isScoringDialogVisible = ref(false);
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
// 定义一个用于进行路由跳转并传递参数的函数
const addscoring = async (id) => {
  console.log('传递的问题 ID 为:', id);
  isScoringDialogVisible.value = true;
  try {
    const res = await listMyScoringResultVOByPage({ appId: id });
    const records = res.data.data.records;
    console.log(records);
    if (records.length > 0) {
      // 假设 records 是一个包含策略数据的数组
      editPolicies.value = records.map(record => ({
        appId: record.appId,
        resultScoreRange: record.resultScoreRange,
        resultName: record.resultName,
        resultProp: record.resultProp,
        resultDesc: record.resultDesc
      }))
      console.log(editPolicies.value);
    }
  } catch (error) {
    console.error('获取策略数据失败:', error);
    ElMessage.error('获取策略数据失败，请重试');
  }
};
// 定义是评分还是测评
// const value3 = ref(true)
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

// 保存新应用
const saveQuestionSet = async() => {
  const newSet = newQuestionSet.value;
  // 对接接口
  const addApi = {
    appName: newSet.name,
    appType: newSet.value,
    appIcon: newSet.avatar,
    appDesc: newSet.description,
    scoringStrategy:0
  }
  console.log(addApi)
 const {data:{code,data}} = await addApp(addApi)
 id.value = data
 console.log(id.value)
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

  // 如果所有验证通过，保存新应用
  // 重置新应用表单
  newQuestionSet.value = {
    name: '',
    description: '',
    avatar:'',
    value:'',
  };
};
const id = ref()
// 应用列表
const init = async() => {
    try {
        const res = await listMyAppVOByPage({ page: null});

        questionSets.value = res.data.data.records

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
const handleAvatarUpload = async (file) => {
  const isImage = file.type.startsWith('image/');
  if (!isImage) {
    ElMessage.error('只能上传图片文件');
    return false;
  }
  const formData = new FormData();
  formData.append('file', file);
  const res = await common(formData); // 确保 common 内部 URL 正确
  newQuestionSet.value.avatar = res.data.data;
  ElMessage.success('上传成功');
  return true;
};
const tttt = async (file) => {
  const isImage = file.type.startsWith('image/');
  if (!isImage) {
    ElMessage.error('只能上传图片文件');
    return false;
  }
  const formData = new FormData();
  formData.append('file', file);
  const res = await common(formData); // 确保 common 内部 URL 正确
  nquestionSet.value.appIcon = res.data.data;
  ElMessage.success('上传成功');
  return true;
};
</script>



























<style scoped>
.policy-form {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  position: relative;

  h3 {
    position: absolute;
    top: -18px;
    left: 20px;
    background: white;
    padding: 0 10px;
    color: #409eff;
  }
}
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
.handquestion {
    width: 200px;
    background-color: lightgray;
    border: 1px solid #ccc;

    /* 借助不同方向的阴影营造立体效果 */
    box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.3), -1px -1px 3px rgba(255, 255, 255, 0.8);
    transition: box-shadow 0.3s ease;
}

.handquestion:hover {
    /* 鼠标悬停时调整阴影，增强交互效果 */
    box-shadow: 5px 5px 7px rgba(0, 0, 0, 0.4), -2px -2px 4px rgba(255, 255, 255, 0.9);
}
.policy{
    width: 100%;
    margin-top: 20px;
    background-color: rgb(255, 255, 255);
    border: 1px solid #ccc;
    border-radius: 20px;
    /* 借助不同方向的阴影营造立体效果 */
    box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.3), -1px -1px 3px rgba(255, 255, 255, 0.8);
    transition: box-shadow 0.3s ease;
    h2 {
      margin-left: 70px;
      margin-top: 10px;
    }
}
.policy:hover {
    /* 鼠标悬停时调整阴影，增强交互效果 */
    box-shadow: 5px 5px 7px rgba(0, 0, 0, 0.4), -2px -2px 4px rgba(255, 255, 255, 0.9);
}
.policypp {
   width: 100%;
    margin-top: 20px;
    background-color: rgb(255, 255, 255);
    border: 0px solid #ccc;
}
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
