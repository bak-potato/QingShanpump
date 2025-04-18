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
            <el-table-column   prop="questionName"  label="题目名称" min-width="200"/>
            <el-table-column  prop="score" label="得分" width="100" />

            <el-table-column  label="答题时间"  width="180">
              <template #default="scope">
                {{ formatDate(scope.row.createTime) }}
              </template>
            </el-table-column>

            <el-table-column  prop="status"  label="状态"  width="120">
              <template #default="scope">
                <el-tag
                  :type="scope.row.status === 'correct' ? 'success' :
                          scope.row.status === 'wrong' ? 'warning' : 'info'"
                  :effect="scope.row.status === 'correct' ? 'dark' :
                          scope.row.status === 'wrong' ? 'dark' : 'plain'"
                >
                  {{ scope.row.status === 'correct' ? '正确' :
                        scope.row.status === 'wrong' ? '错误' : '未完成' }}
                </el-tag>
              </template>
            </el-table-column>

            <el-table-column label="操作" width="180" fixed="right">
              <template #default="scope">
                <el-button  size="small"  type="primary"  @click="handleView(scope.row)" >
                    查看
                </el-button>

                <el-popconfirm title="确定要删除这条记录吗？" @confirm="handleDelete(scope.$index)">
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

      <!-- 查看题目信息对话框 -->
      <el-dialog  v-model="selectedRecord"  title="题目信息"  width="600px">
        <el-form>
          <el-form-item label="题目名称:">
            {{ selectedRecord.questionName }}
          </el-form-item>

          <el-form-item label="题目选项:">
            <el-radio-group v-model="selectedRecord.selectedOption">
              <el-radio v-for="(option, index) in selectedRecord.options" :key="index" :label="index">
                {{ option }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="用户答案:">
            {{ selectedRecord.userAnswer }}
          </el-form-item>
          <el-form-item label="正确答案:">
            {{ selectedRecord.correctAnswer }}
          </el-form-item>
          <el-form-item label="得分:">
            {{ selectedRecord.score }}
          </el-form-item>
          <el-form-item label="答题时间:">
            {{ formatDate(selectedRecord.createTime)}}
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="selectedRecord = false" type="primary">关闭</el-button>
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
import {deleteApp} from '../../../api/app.js'

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
const answerRecords = ref([
  {
    id: 1,
    questionName: 'Python基础测试',
    score: 95,
    createTime: new Date('2025-03-15'),
    status: 'correct'
  },
  {
    id: 2,
    questionName: '前端开发实战',
    score: 82,
    createTime: new Date('2025-03-12'),
    status: 'correct'
  },
  {
    id: 3,
    questionName: '数据库原理',
    score: 75,
    createTime: new Date('2025-03-10'),
    status: 'wrong'
  },
  {
    id: 4,
    questionName: '算法设计',
    score: 0,
    createTime: new Date('2025-03-08'),
    status: 'unfinished'
  }
])

// 搜索关键字
const searchKeyword = ref('')
// 筛选后的记录
const filteredRecords = ref([])
// 搜索处理
const handleSearch = () => {
  filteredRecords.value = answerRecords.value.filter(record =>
    record.questionName.toLowerCase().includes(searchKeyword.value.toLowerCase())
  )
}
// 重置搜索
const handleReset = () => {
  searchKeyword.value = ''
  filteredRecords.value = answerRecords.value

}
filteredRecords.value = answerRecords.value
// 查看题目信息
const handleView = (row) => {
  selectedRecord.value = row
  console.log(selectedRecord.value)
}

// 删除记录
const handleDelete = (index) => {
  answerRecords.value.splice(index, 1)
  filteredRecords.value.splice(index, 1)
  ElMessage.success('记录已删除')
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
</style>
