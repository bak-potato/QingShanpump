<template>
  <!-- 主容器 -->
    <el-scrollbar style="background-color: white; margin-top: 1vh;" height="98vh">
  <div class="app-management-container">
    <!-- 页面标题 -->
    <h1 class="page-title">应用管理</h1>

    <!-- 主体内容区域 -->
    <div class="app-management-body">
      <!-- 顶部选项卡 -->
 <div class="lastf12">
      <div
        @click="isShowa = true"
        :class="['l2ab', { 'active-tab': isShowa }]"
      >
        <h2>创建应用</h2>
      </div>
      <div
        @click="isShowa = false"
        :class="['l2ab', { 'active-tab': !isShowa }]"
      >
        <h2>应用列表</h2>
      </div>
    </div>
      <!-- 应用列表视图 -->
      <div v-if="!isShowa" class="app-list-view">
        <h2 class="section-title">已创建应用</h2>
        <div class="scroll-container">
          <el-scrollbar>
            <!-- 空状态提示 -->
            <el-empty v-if="apps.length === 0" description="暂无创建应用" />

            <!-- 应用列表 -->
            <div v-else class="app-list">
              <div v-for="app in apps" :key="app.id" class="app-item">
                <div class="app-header">
                  <!-- 应用信息 -->
                  <div class="app-info" @click="toggleAppDetails(app.id)">
                    <el-avatar :size="40" :src="app.appIcon" class="app-avatar"/>
                    <span class="app-name">{{ app.appName }}</span>
                  </div>

                  <!-- 操作按钮 -->
                  <div class="app-actions">
                    <el-button
                      type="text"
                      v-if="app.appType !== 1"
                      @click="viewScoringStrategy(app.id)"
                    >
                      查看策略
                    </el-button>
                    <el-button type="text" @click="viewQuestions(app.id)">
                      添加/查看题目
                    </el-button>
                    <el-button type="text" @click.stop="openEditDialog(app.id)">
                      编辑
                    </el-button>
                    <el-button type="text" @click.stop="confirmDeleteApp(app.id)">
                      删除
                    </el-button>
                  </div>
                </div>
              </div>

              <!-- 应用编辑对话框 -->
              <el-dialog
                v-model="isEditDialogVisible"
                title="编辑应用"
                width="500px"
                :before-close="handleDialogClose"
              >
                <el-form :model="editingApp" label-width="120px">
                  <el-form-item label="应用名称">
                    <el-input
                      v-model="editingApp.appName"
                      placeholder="请输入应用名称"
                    />
                  </el-form-item>
                  <el-form-item label="应用描述">
                    <el-input
                      v-model="editingApp.appDesc"
                      placeholder="请输入应用描述"
                    />
                  </el-form-item>
                  <el-form-item label="应用头像">
                    <el-avatar :size="60" :src="editingApp.appIcon" class="app-avatar-large" />
                    <el-upload
                      action="#"
                      :show-file-list="false"
                      :before-upload="handleAvatarUpload"
                    >
                      <el-button type="default" size="small" class="upload-btn">
                        更换头像
                      </el-button>
                    </el-upload>
                  </el-form-item>
                </el-form>
                <template #footer>
                  <div class="dialog-footer">
                    <el-button @click="isEditDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="saveAppChanges">保存</el-button>
                  </div>
                </template>
              </el-dialog>
            </div>
          </el-scrollbar>
        </div>
      </div>

      <!-- 创建应用视图 -->
      <div v-if="isShowa" class="create-app-view">
        <!-- 应用基本信息表单 -->
        <div class="app-basic-info">
          <div class="avatar-upload">
            <el-avatar :size="100" :src="newApp.avatar" class="new-app-avatar" />
            <el-upload
              action="/api/common/upload"
              :show-file-list="false"
              :before-upload="handleNewAppAvatarUpload"
            >
              <el-button type="default" size="small" class="upload-btn">
                上传头像
              </el-button>
            </el-upload>
          </div>

          <div class="app-name-input">
            <el-input
              v-model="newApp.name"
              placeholder="请输入应用名称"
              class="name-input"
            />
            <el-select
              v-model="newApp.type"
              placeholder="选择应用类型"
              class="type-select"
            >
              <el-option
                v-for="item in appTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>

          <div class="app-description">
            <el-form-item label="应用描述">
              <el-input
                v-model="newApp.description"
                type="textarea"
                :rows="3"
                placeholder="请输入应用描述（最多200字）"
                maxlength="200"
                show-word-limit
                class="description-textarea"
              />
            </el-form-item>
          </div>

          <el-button
            type="primary"
            @click="createNewApp"
            class="submit-btn"
            style="margin-left: calc(50% - 100px);"
          >
            创建应用
          </el-button>
        </div>

        <!-- 评分策略设置 -->
        <div class="scoring-policy" v-if="newApp.type !== 1">
          <h2 class="policy-title">评分策略设置</h2>

          <el-form
            v-for="(policy, index) in scoringPolicies"
            :key="index"
            :model="policy"
            label-width="150px"
            class="policy-form"
          >
            <h3 class="policy-subtitle">策略 {{ index + 1 }}:</h3>

            <el-form-item label="评分类型">
              <el-radio-group v-model="policy.type">
                <el-radio label="0">得分类应用</el-radio>
                <el-radio label="1">测评类应用</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="分数" v-if="policy.type === '0'">
              <el-input
                v-model="policy.resultScoreRange"
                placeholder="请输入合格分数"
                class="score-input"
              />
            </el-form-item>

            <el-form-item label="属性" v-if="policy.type === '1'">
              <el-select
                v-model="policy.resultProp"
                placeholder="请选择属性"
                class="prop-select"
              >
                <el-option
                  v-for="item in personalityTraits"
                  :key="item"
                  :label="item.label"
                  :value="item"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="结果名称">
              <el-input
                v-model="policy.resultName"
                placeholder="输入评分结果名称"
                class="result-name-input"
              />
            </el-form-item>

            <el-form-item label="结果描述">
              <el-input
                v-model="policy.resultDesc"
                placeholder="输入评分结果描述"
                type="textarea"
                :rows="2"
                class="result-desc-input"
              />
            </el-form-item>
          </el-form>

          <el-button
            type="primary"
            @click="saveScoringPolicies"
            class="save-policy-btn"
          >
            保存策略
          </el-button>
        </div>
      </div>
    </div>
  </div>
  </el-scrollbar>

</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRouter } from 'vue-router';
import {
  addApp,
  common,
  listMyAppVOByPage,
  editApp,
  deleteApp
} from "@/api/app";
import { addScoringResult } from "@/api/scoring";

const router = useRouter();
const isShowa = ref(true); // true显示创建应用，false显示应用
// ==================== 应用列表相关 ====================
const apps = ref([]); // 应用列表数据
const currentAppId = ref(null); // 当前操作的应用ID
const isEditDialogVisible = ref(false); // 编辑对话框显示状态
const editingApp = ref({  // 正在编辑的应用数据
  id: null,
  appName: '',
  appDesc: '',
  appIcon: ''
});

/**
 * 初始化应用列表数据
 */
const initAppList = async () => {
  try {
    const res = await listMyAppVOByPage({ page: null });
    apps.value = res.data.data.records;
  } catch (error) {
    console.error('获取应用列表失败:', error);
    ElMessage.error('获取应用列表失败');
  }
};

/**
 * 打开编辑应用对话框
 * @param {number} appId - 应用ID
 */
const openEditDialog = (appId) => {
  const targetApp = apps.value.find(app => app.id === appId);
  if (!targetApp) {
    ElMessage.warning('未找到对应的应用');
    return;
  }

  editingApp.value = { ...targetApp };
  isEditDialogVisible.value = true;
};

/**
 * 保存应用编辑
 */
const saveAppChanges = async () => {
  if (!editingApp.value.id) {
    ElMessage.error('应用数据异常');
    return;
  }
  if (editingApp.value.appName.trim() === '') {
    ElMessage.error('应用名称不能为空');
    return;
  }
  if (editingApp.value.appDesc.trim() === '') {
    ElMessage.error('应用描述不能为空');
    return;
  }

  try {
    await editApp({
      id: editingApp.value.id,
      appName: editingApp.value.appName.trim(),
      appDesc: editingApp.value.appDesc.trim(),
      appIcon: editingApp.value.appIcon.trim()
    });

    isEditDialogVisible.value = false;
    ElMessage.success('应用更新成功');
    await initAppList();
  } catch (error) {
    console.error('更新应用失败:', error);
    ElMessage.error('更新应用失败');
  }
};

/**
 * 确认删除应用
 * @param {number} appId - 应用ID
 */
const confirmDeleteApp = (appId) => {
  ElMessageBox.confirm('确定要删除此应用吗?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteApp({ id: appId });
      ElMessage.success('删除成功');
      await initAppList();
    } catch (error) {
      console.error('删除应用失败:', error);
      ElMessage.error('删除失败');
    }
  }).catch(() => {
    // 用户取消删除
  });
};

// ==================== 创建应用相关 ====================
const newApp = ref({  // 新应用数据
  name: '',
  type: '',
  avatar: '',
  description: ''
});

const appTypes = [  // 应用类型选项
  { value: 0, label: '系统测评' },
  { value: 1, label: 'AI评测' }
];

/**
 * 创建新应用
 */
const createNewApp = async () => {
  if (newApp.value.name.trim() === '') {
    ElMessage.error('应用名称不能为空');
    return;
  }
  if (newApp.value.description.trim() === '') {
    ElMessage.error('应用描述不能为空');
    return;
  }
  if (!newApp.value.type) {
    ElMessage.error('请选择应用类型');
    return;
  }

  try {
    const { data } = await addApp({
      appName: newApp.value.name,
      appType: newApp.value.type,
      appIcon: newApp.value.avatar,
      appDesc: newApp.value.description,
      scoringStrategy: newApp.value.type,
    });

    currentAppId.value = data;
    ElMessage.success('应用创建成功');

    // 重置表单
    newApp.value = {
      name: '',
      type: '',
      avatar: '',
      description: ''
    };

    // 刷新应用列表
    await initAppList();
  } catch (error) {
    console.error('创建应用失败:', error);
    ElMessage.error('创建应用失败');
  }
};

// ==================== 评分策略相关 ====================
const scoringPolicies = ref([  // 评分策略数据
  {
    type: '0',
    appId: 0,
    resultScoreRange: null,
    resultName: '',
    resultProp: [],
    resultDesc: ''
  }
]);

const personalityTraits = [  // 人格特质选项
  { label: 'I', value: 'I' },
  { label: 'S', value: 'S' },
  { label: 'T', value: 'T' },
  { label: 'J', value: 'J' }
];

/**
 * 保存评分策略
 */
const saveScoringPolicies = async () => {
  // 验证必填字段
  for (const policy of scoringPolicies.value) {
    if (!policy.resultName) {
      ElMessage.error('请填写结果名称');
      return;
    }
  }

  // 准备请求数据
  const requests = scoringPolicies.value.map(policy => {
    let resultPropValue = [];
    if (policy.type === '1' && policy.resultProp) {
      if (Array.isArray(policy.resultProp)) {
        resultPropValue = policy.resultProp.map(item => item.value || item);
      } else if (typeof policy.resultProp === 'object') {
        resultPropValue = [policy.resultProp.value || policy.resultProp];
      }
    }

    return {
      appId: currentAppId.value,
      type: policy.type,
      resultScoreRange: policy.resultScoreRange || 0,
      resultName: policy.resultName,
      resultProp: resultPropValue,
      resultDesc: policy.resultDesc
    };
  });

  try {
    await addScoringResult(requests);
    ElMessage.success('策略保存成功');

    // 重置策略表单
    scoringPolicies.value = [
      {
        type: '0',
        appId: 0,
        resultScoreRange: null,
        resultName: '',
        resultProp: [],
        resultDesc: ''
      }
    ];
  } catch (error) {
    console.error('保存策略失败:', error);
    ElMessage.error('保存策略失败');
  }
};

// ==================== 文件上传相关 ====================
/**
 * 处理头像上传
 * @param {File} file - 上传的文件
 */
const handleAvatarUpload = async (file) => {
  if (!file.type.startsWith('image/')) {
    ElMessage.error('只能上传图片文件');
    return false;
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await common(formData);
    editingApp.value.appIcon = res.data.data;
    ElMessage.success('头像上传成功');
    return true;
  } catch (error) {
    console.error('上传失败:', error);
    ElMessage.error('上传失败');
    return false;
  }
};

/**
 * 处理新应用头像上传
 * @param {File} file - 上传的文件
 */
const handleNewAppAvatarUpload = async (file) => {
  if (!file.type.startsWith('image/')) {
    ElMessage.error('只能上传图片文件');
    return false;
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await common(formData);
    newApp.value.avatar = res.data.data;
    ElMessage.success('头像上传成功');
    return true;
  } catch (error) {
    console.error('上传失败:', error);
    ElMessage.error('上传失败');
    return false;
  }
};

// ==================== 路由相关 ====================
/**
 * 查看评分策略
 * @param {number} appId - 应用ID
 */
const viewScoringStrategy = (appId) => {
  router.push({ path: '/applist', query: { id: appId } });
};

/**
 * 查看题目
 * @param {number} appId - 应用ID
 */
const viewQuestions = (appId) => {
  router.push({ path: '/questionmanage', query: { id: appId } });
};

// ==================== 生命周期钩子 ====================
onMounted(() => {
  initAppList();
});
</script>

<style scoped lang="scss">
.lastf12 {
  display: flex;
  width: 226px;
  height: 36px;
  background-color: #e6e8f2;
  border-radius: 6px;
  margin: 20px;
}

.l2ab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.l2ab h2 {
  font-size: 14px;
  margin: 0;
}

.active-tab {
  background-color: white;
  color: #409eff;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 主容器样式 */
.app-management-container {
  max-width: 1350px;
  min-width: 1350px;
  margin: 0 auto;
  height: auto;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

/* 页面标题 */
.page-title {
  font-size: 24px;
  color: #303133;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
}

/* 主体内容区域 */
.app-management-body {
  background-color: #fff;
  border-radius: 8px;
  margin-top: -20px;
  padding: 20px;
  height: calc(100% - 60px);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

/* 选项卡切换器 */
.tab-switcher {
  display: flex;
  width: 240px;
  height: 40px;
  background-color: #e6e8f2;
  border-radius: 6px;
  margin-bottom: 20px;
  overflow: hidden;

  .tab-item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    color: #757a8c;

    h2 {
      font-size: 14px;
      font-weight: 500;
      margin: 0;
    }

    &:hover {
      background-color: #d7d8df;
      color: #409eff;
    }

    &.active-tab {
      background-color: #fff;
      color: #409eff;
      font-weight: 600;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  }
}

/* 分区标题 */
.section-title {
  font-size: 18px;
  color: #303133;
  margin-bottom: 20px;
  font-weight: 600;
}

/* 滚动容器 */
.scroll-container {
  height: calc(100% - 60px);
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

/* 应用列表项 */
.app-list {
  .app-item {
    padding: 15px;
    margin-bottom: 10px;
    border-radius: 6px;
    background-color: #fff;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
    transition: box-shadow 0.3s ease;

    &:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
  }

  .app-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .app-info {
    display: flex;
    align-items: center;
    cursor: pointer;

    .app-avatar {
      margin-right: 12px;
    }

    .app-name {
      font-size: 16px;
      font-weight: 500;
      color: #303133;
    }
  }

  .app-actions {
    .el-button {
      margin-left: 10px;
      color: #606266;

      &:hover {
        color: #409eff;
      }
    }
  }
}

/* 创建应用视图 */
.create-app-view {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

/* 应用基本信息表单 */
.app-basic-info {
  background-color: #fff;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);

  .avatar-upload {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;

    .new-app-avatar {
      margin-bottom: 10px;
      border: 1px solid #ebeef5;
    }

    .upload-btn {
      width: 100px;
    }
  }

  .app-name-input {
    display: flex;
    gap: 15px;
    margin-bottom: 20px;

    .name-input {
      flex: 1;
    }

    .type-select {
      width: 150px;
    }
  }

  .app-description {
    margin-bottom: 20px;

    .description-textarea {
      width: 100%;
    }
  }

  .submit-btn {
    width: 150px;
    margin-top: 10px;
  }
}

/* 评分策略表单 */
.scoring-policy {
  background-color: #fff;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  position: relative;

  .policy-title {
    font-size: 18px;
    color: #303133;
    margin-bottom: 25px;
    font-weight: 600;
  }

  .policy-form {
    padding: 20px;
    margin-bottom: 20px;
    border: 1px solid #ebeef5;
    border-radius: 6px;
    position: relative;

    .policy-subtitle {
      position: absolute;
      top: -12px;
      left: 20px;
      background: #fff;
      padding: 0 10px;
      color: #409eff;
      font-size: 14px;
      font-weight: 500;
    }

    .score-input,
    .prop-select,
    .result-name-input,
    .result-desc-input {
      width: 100%;
    }
  }

  .save-policy-btn {
    width: 150px;
    margin-top: 10px;
    margin-left: 150px;
  }
}

/* 对话框样式 */
:deep(.el-dialog) {
  border-radius: 10px;

  .el-dialog__header {
    border-bottom: 1px solid #ebeef5;
    padding: 15px 20px;
    margin-right: 0;

    .el-dialog__title {
      font-size: 16px;
      font-weight: 600;
    }
  }

  .el-dialog__body {
    padding: 20px;
  }

  .el-dialog__footer {
    border-top: 1px solid #ebeef5;
    padding: 15px 20px;
    text-align: right;
  }

  .app-avatar-large {
    margin-right: 15px;
    vertical-align: middle;
  }

  .upload-btn {
    margin-left: 15px;
  }
}

/* 空状态样式 */
:deep(.el-empty) {
  padding: 40px 0;

  .el-empty__description {
    color: #909399;
    margin-top: 10px;
  }
}
</style>
