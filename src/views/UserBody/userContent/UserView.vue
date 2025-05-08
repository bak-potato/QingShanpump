 <template>
  <el-container>
    <el-header>
      <h2>用户信息中心</h2>
    </el-header>
    <el-main>
      <!-- 用户信息卡片 -->
      <el-card class="user-profile">
        <div class="profile-container">
          <!-- 左侧头像区域 -->
          <div class="avatar-section">
            <el-avatar
              :size="120"
              :src="userInfo.avatar"
              class="profile-avatar"
            />
            <el-upload
               action="#"
              :show-file-list="false"
              :before-upload="handleAvatarUpload"
            >
              <el-button type="primary" size="small" class="mt-2">
                更换头像
              </el-button>
            </el-upload>
          </div>

          <!-- 右侧信息区域 -->
          <div class="info-section">
            <el-descriptions
              title="基本信息"
              :column="2"
              border
            >
              <el-descriptions-item label="用户名">
                {{ userInfo.username }}
              </el-descriptions-item>
              <el-descriptions-item label="邮箱">
                {{ userInfo.email }}
                <el-tag v-if="userInfo.emailVerified" size="small" type="success">
                  已验证
                </el-tag>
                <el-tag v-else size="small" type="danger">
                  未验证
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="用户id">
                {{ userInfo.id || '未绑定' }}
              </el-descriptions-item>
              <el-descriptions-item label="注册时间">
                {{ formatDate(userInfo.createTime) }}
              </el-descriptions-item>
              <el-descriptions-item label="最后登录">
                {{ formatDate(userInfo.lastLogin) }}
              </el-descriptions-item>
            </el-descriptions>

            <div class="action-buttons mt-4">
              <el-button
                type="primary"
                @click="showEditDialog = true"
              >
                编辑信息
              </el-button>
              <el-button @click="handleSecuritySettings">
                退出登录
              </el-button>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 编辑信息对话框 -->
      <el-dialog
        v-model="showEditDialog"
        title="编辑个人信息"
        width="600px"
      >
        <el-form
          :model="editForm"
          label-width="100px"
          :rules="formRules"
          ref="editFormRef"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="editForm.username" />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="showEditDialog = false">取消</el-button>
          <el-button type="primary" @click="handleSaveInfo">
            保存修改
          </el-button>
        </template>
      </el-dialog>


      <!-- 我的应用 -->
      <el-card class="user-record mt-4">
  <div class="record-container">
    <h3 class="record-title">我的应用</h3>
    <!-- 应用列表 -->
    <el-row :gutter="20">
      <el-col
        v-for="(app, index) in myApps"
        :key="app.id"
        :xs="24" :sm="12" :md="8" :lg="6"
        class="mb-4"
      >
        <el-card
          class="app-card"
          shadow="hover"
          @click="handleAppClick(app)"
        >
          <div class="app-content">
            <el-avatar
              :size="60"
              :src="app.appIcon || 'https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png'"
              class="app-icon"
            />
            <div class="app-info">
              <h4 class="app-title">{{ app.appName }}</h4>
              <p class="app-desc">{{ app.appDesc || '暂无描述' }}</p>
            </div>
            <div class="app-actions">
              <el-button
                type="primary"
                size="small"
                @click.stop="handleManage(app)"
              >
                管理
              </el-button>
              <el-popconfirm
                title="确定要删除该应用吗？"
                @confirm="handleDeleteApp(index)"
              >
                <template #reference>
                  <el-button
                    size="small"
                    type="danger"
                    @click.stop
                  >
                    删除
                  </el-button>
                </template>
              </el-popconfirm>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 无应用时的提示 -->
    <div v-if="myApps.length === 0" class="empty-tip">
      <el-empty description="暂无应用，快去创建一个吧！" />
    </div>
  </div>
      </el-card>



      <!-- 答题记录 -->
      <el-card class="user-record mt-4">
        <div class="record-container">
          <h3 class="record-title">答题记录</h3>

          <div class="search-controls">
            <el-input
      v-model="searchKeyword"
      placeholder="搜索题目名称"
      clearable
      class="mr-2"
      @keyup.enter="handleSearch"
    >
      <template #prefix>
        <el-icon><Search /></el-icon>
      </template>
            </el-input>
            <el-button
      type="primary"
      @click="handleSearch"
      :icon="Search"
    >
      搜索
            </el-button>
            <el-button
      type="default"
      @click="handleReset"
    >
      重置
            </el-button>
          </div>


          <el-table   :data="filteredRecords"  border  style="width: 100%">
            <el-table-column   prop="appName"  label="题目名称" min-width="200"/>

            <el-table-column  label="创建时间"  width="180">
              <template #default="scope">
                {{ formatDate(scope.row.createTime) }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180" fixed="right">
              <template #default="scope">
                <el-button  size="small"  type="primary"  @click="handleView(scope.row.id)" >
                    查看
                </el-button>

                <el-popconfirm title="确定要删除这条记录吗？" @confirm="handleDelete(scope.row.id)">
                  <template #reference>
                    <el-button size="small" type="danger" >
                      删除
                    </el-button>
                  </template>
                </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>

      <!-- 查看答案记录对话框 -->
      <el-dialog
    v-model="selectedRecord"
    title="答题详情"
    width="680px"
    class="answer-detail-dialog"
  >
    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-container">
      <el-icon class="loading-icon"><Loading /></el-icon>
      <p class="loading-text">正在加载答题详情...</p>
    </div>

    <!-- 内容区域 -->
    <div v-else class="detail-content">
      <!-- 头部信息 -->
      <div class="header-section">
        <h3 class="title">{{ write.resultName || '答题结果' }}</h3>
        <div class="time-stamp">
          <el-icon><Clock /></el-icon>
          <span>{{ formatDate(write.createTime) }}</span>
        </div>
      </div>

      <!-- 主要内容 -->
      <div class="main-section">
        <!-- 答案区块 -->
        <div class="answer-block">
          <div class="block-header">
            <el-icon class="icon"><EditPen /></el-icon>
            <span class="label">用户答案</span>
          </div>
          <div class="choices-container">
            <template v-if="write.choices && write.choices.length">
              <el-tag
                v-for="(choice, index) in write.choices"
                :key="index"
                type="info"
                class="choice-tag"
                effect="dark"
              >
                {{ choice }}
              </el-tag>
            </template>
            <el-empty v-else description="未作答" :image-size="60" />
          </div>
        </div>

        <!-- 结果区块 -->
        <div class="result-block">
          <div class="result-row">
            <div class="result-item">
              <div class="label-box">
                <el-icon><Trophy /></el-icon>
                <span class="label">获得称号</span>
              </div>
              <div class="value">{{ write.resultName || '--' }}</div>
            </div>
            <div class="result-item">
              <div class="label-box">
                <el-icon><Comment /></el-icon>
                <span class="label">系统评价</span>
              </div>
              <div class="value">{{ write.resultDesc || '--' }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <el-button
        type="primary"
        @click="selectedRecord = false"
        class="close-btn"
      >
        关闭
      </el-button>
    </template>
      </el-dialog>











      <!-- 答题数据分析 -->
       <el-card class="user-record mt-4">
          <UserE/>
      </el-card>
    </el-main>
  </el-container>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import UserE from '../../../components/user/UserExcel.vue'
import { getLoginUser } from '../../../api/user.js'
import { updateUserInfo } from '../../../api/user.js'
import { userLogout,commonController } from '../../../api/user.js'
import {listMyAppVOByPage} from '../../../api/app.js'
import {listMyUserAnswerVOByPage} from  '@/api/answer.js'
import {deleteApp} from '../../../api/app.js'
const answerRecords = ref([])
const router = useRouter()
// 用户信息数据
const userInfo = reactive({
  username: '',
  email: '',
  emailVerified: false,
  id: '',
  avatar: '',
  createTime: null,
  lastLogin: null
})

// 编辑相关状态
const showEditDialog = ref(false)
const selectedRecord = ref(null)
const editFormRef = ref(null)
const isLoading = ref(false)
const editForm = reactive({
  username: userInfo.username
})

// 表单验证规则
const formRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 16, message: '长度在2到16个字符', trigger: 'blur' }
  ]
}

// 日期格式化
const formatDate = (date) => {
  return new Date(date).toLocaleString()
}

const handleAvatarUpload = async(file) => {
 const isImage = file.type.startsWith('image/')
 if (!isImage) {
  ElMessage.error('只能上传图片文件')
  return false
 }
 const formData = new FormData()
 formData.append('file', file)
 const res = await commonController(formData)
 console.log('res',res)
 userInfo.avatar = res.data.data
  const res2 = await updateUserInfo({
      "userAvatar": userInfo.avatar,
      "userName": userInfo.name || '',       // Assuming you might want to include the name
      "userProfile": userInfo.profile || ''  // And profile if available
    })
    console.log('res2',res2)
    console.log('userInfo',{
      "userAvatar": userInfo.avatar,
      "userName": userInfo.name || '',       // Assuming you might want to include the name
      "userProfile": userInfo.profile || ''  // And profile if available
    })
 ElMessage.success('上传成功')
 return true

}



// 保存修改
const handleSaveInfo = async () => {
  try {
    await editFormRef.value.validate()
    // 构造请求数据
    const requestData = {
      userName: editForm.username,
      userProfile: ''
    };
    // 调用接口
    const response = await updateUserInfo(requestData);
    if (response.status === 200 && response.data.code === 0 && response.data.data) {
      // 更新成功，将编辑后的数据同步到 userInfo
      userInfo.username = editForm.username;
      showEditDialog.value = false;
      ElMessage.success('用户名更新成功');
    } else {
      ElMessage.error(response.data.message || '用户名更新失败');
    }
  } catch (err) {
    console.error('表单验证失败或请求出错:', err);
    ElMessage.error('表单验证失败或请求出错，请检查输入或网络');
  }
}

// 退出登录处理
const handleSecuritySettings = async () => {
    try {
        console.log('执行退出登录操作');
        const response = await userLogout();

        if (response.data.code === 0 && response.data.data) {
            // 退出登录成功
            localStorage.removeItem('isLoggedIn');
            ElMessage.success('退出登录成功');
            router.push({ name: 'login' });
        } else {
            // 退出登录失败
            ElMessage.error('退出登录失败，请稍后重试');
        }
    } catch (error) {
        // 处理请求出错的情况
        console.error('退出登录请求出错:', error);
        ElMessage.error('退出登录请求出错，请检查网络');
    }
};

// 答题记录数据
const fetchAnswerRecords = async () => {
  try {
    const res = await listMyAppVOByPage({ page: null }) // 假设接口无需分页
    answerRecords.value = res.data.data.records || []
    console.log('answerRecords',answerRecords.value)
    filteredRecords.value = answerRecords.value // 初始化显示全部记录
  } catch (error) {
    console.error('获取答题记录失败:', error)
    ElMessage.error('加载答题记录失败')
  }
}
fetchAnswerRecords()
// 搜索关键字
const searchKeyword = ref('')
// 筛选后的记录
const filteredRecords = ref([])
// 搜索处理
const handleSearch = () => {
  filteredRecords.value = answerRecords.value.filter(record =>
    record.appName?.toLowerCase().includes(searchKeyword.value.toLowerCase())
  )
  if (filteredRecords.value.length === 0) {
    ElMessage.warning('未找到匹配的答题记录')
  }
}
// 重置搜索
const handleReset = () => {
  searchKeyword.value = ''
  filteredRecords.value = answerRecords.value

}
const answer = async() => {
  const res = await listMyAppVOByPage({ page: null })
  filteredRecords.value = res.data.data.records
  console.log(res.data.data.records)
}
answer()
// 查看题目信息
const write = ref({})
const handleView = async (appId) => {
    selectedRecord.value = true;
    isLoading.value = true // 显示加载
    try {
        const res = await listMyUserAnswerVOByPage({ page: null, appId: appId });
        // 取最新的一条记录
        write.value = res.data.data.records[0] || {};
    } catch (error) {
        console.error('请求出错:', error);
        ElMessage.error('获取答题记录失败');
    } finally {
    isLoading.value = false // 隐藏加载
  }
};
const handleDelete = async (id) => {
  try {
    const response = await deleteApp({ id: id }); // 调用删除应用的接口
    if (response.status === 200 && response.data.code === 0 && response.data.data) {
      // 删除成功
      ElMessage.success('应用已删除');
    }
    await answer()
  }
  catch (error) {
    console.error('删除应用请求出错:', error);
    ElMessage.error('删除应用请求出错，请检查网络或联系管理员');
  }
}




// 应用点击处理
const handleAppClick = (app) => {
  console.log(`点击应用: ${app.name}`)
}

// 应用管理
const handleManage = (app) => {
  console.log(`管理应用: ${app.name}`)
}

// 我的应用数据
const myApps = ref([])
// 在组件挂载时调用接口获取用户信息

onMounted(async () => {
  try {
    // 获取用户信息
    const userRes = await getLoginUser()
    console.log(userRes.data.data)
    if (userRes.status === 200) {
      const data = userRes.data.data
      userInfo.username = data.userName || '青山用户'
      userInfo.email = data.userEmail
      userInfo.emailVerified = false
      userInfo.id = data.id
      userInfo.avatar = data.userAvatar
      userInfo.createTime = data.createTime
      userInfo.lastLogin = data.updateTime
    }
    // 本地存储用户id
    localStorage.setItem('userId', userInfo.id)
    // 获取我的应用列表
    const appRes = await listMyAppVOByPage({ page: null })
    if (appRes.data.code === 0) {
      myApps.value = appRes.data.data.records || []
    }
  } catch (error) {
    console.error('请求出错:', error)
    ElMessage.error('请求出错，请检查网络或联系管理员')
  }
})
// 删除应用
// 删除记录
// 删除应用
const handleDeleteApp = async (index) => {
  try {
    const appId = myApps.value[index].id; // 获取要删除的应用的ID
    const response = await deleteApp({ id: appId }); // 调用删除应用的接口
    if (response.status === 200 && response.data.code === 0 && response.data.data) {
      // 删除成功
      myApps.value.splice(index, 1);
      ElMessage.success('应用已删除');
    } else {
      // 删除失败
      ElMessage.error(response.data.message || '应用删除失败');
    }
  } catch (error) {
    // 处理请求出错的情况
    console.error('删除应用请求出错:', error);
    ElMessage.error('删除应用请求出错，请检查网络或联系管理员');
  }
};
</script>


<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0;

  .loading-icon {
    font-size: 40px;
    color: var(--el-color-primary);
    animation: rotating 2s linear infinite;
  }

  .loading-text {
    margin-top: 15px;
    color: #666;
    font-size: 14px;
  }
}
.app-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}
/* 我的应用样式 */
.app-card {
  cursor: pointer;
  transition: transform 0.2s;
  height: 250px;
}

.app-card:hover {
  transform: translateY(-5px);
}

.app-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  padding: 16px;
}

.app-icon {
  margin-bottom: 12px;
}

.app-info {
  text-align: center;
  flex-grow: 1;
}

.app-title {
  margin: 8px 0;
  font-size: 16px;
  color: #333;
}

.app-desc {
  font-size: 12px;
  color: #666;
  line-height: 1.4;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.mb-4 {
  margin-bottom: 16px;
}
/* 更新搜索区域的样式 */
.search-controls {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-controls .mr-2 {
  flex: 1;
  max-width: 1100px;
}

/* 使搜索图标更明显 */
:deep(.el-input__prefix) {
  display: flex;
  align-items: center;
  padding-left: 8px;
}
.search-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.search-controls {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.mr-2 {
  margin-right: 8px;
}
.el-main {
  height: 500px;
}
.el-header {
  background-color: #ffffff;
  padding: 15px;
  text-align: center;
  margin-top: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.user-profile {
 width: 100%;
  margin: 0 auto;
  padding: 24px;
}

.profile-container {
  display: flex;
  gap: 40px;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-avatar {
  margin-top: 25px;
  border: 2px solid #eee;
  margin-bottom: 16px;
}

.info-section {
  flex: 1;
}

.action-buttons {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.mt-2 {
  margin-top: 8px;
}

.mt-4 {
  margin-top: 16px;
}

:deep(.el-descriptions__title) {
  font-size: 18px;
  margin-bottom: 20px;
}

:deep(.el-descriptions__label) {
  width: 120px;
  font-weight: 500;
}
.answer-detail-dialog {
  :deep(.el-dialog__header) {
    border-bottom: 1px solid #eee;
    margin-right: 0;
  }

  :deep(.el-dialog__body) {
    padding: 20px 30px;
  }
}
.detail-content {
  .header-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;

    .title {
      margin: 0;
      font-size: 18px;
      color: #333;
      font-weight: 600;
    }

    .time-stamp {
      display: flex;
      align-items: center;
      color: #999;

      .el-icon {
        margin-right: 6px;
      }
    }
  }

  .main-section {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 20px;
  }
}

/* 答案区块 */
.answer-block {
  margin-bottom: 25px;

  .block-header {
    display: flex;
    align-items: center;
    margin-bottom: 15px;

    .icon {
      font-size: 18px;
      color: var(--el-color-primary);
      margin-right: 8px;
    }

    .label {
      font-size: 15px;
      color: #333;
      font-weight: 500;
    }
  }

  .choices-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    min-height: 40px;

    .choice-tag {
      font-size: 14px;
      padding: 8px 12px;
      border-radius: 16px;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 2px 6px rgba(0,0,0,0.1);
      }
    }
  }
}

/* 结果区块 */
.result-block {
  .result-row {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  .result-item {
    background: white;
    border-radius: 8px;
    padding: 15px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);

    .label-box {
      display: flex;
      align-items: center;
      margin-bottom: 10px;

      .el-icon {
        color: var(--el-color-primary);
        font-size: 16px;
        margin-right: 8px;
      }

      .label {
        color: #666;
        font-size: 14px;
      }
    }

    .value {
      color: #333;
      font-size: 15px;
      font-weight: 500;
      line-height: 1.4;
    }
  }
}

/* 关闭按钮 */
.close-btn {
  width: 120px;
}

@keyframes rotating {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
