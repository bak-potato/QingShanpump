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
              <el-descriptions-item label="手机号">
                {{ userInfo.phone || '未绑定' }}
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
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email" />
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="editForm.phone" />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="showEditDialog = false">取消</el-button>
          <el-button type="primary" @click="handleSaveInfo">
            保存修改
          </el-button>
        </template>
      </el-dialog>

      <!-- 答题记录 -->
      <el-card class="user-record mt-4">
        <div class="record-container">
          <h3 class="record-title">答题记录</h3>
        <div class="search-controls">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索题目名称"
          prefix-icon="el-icon-search"
          clearable
          class="mr-2"
        />
        <el-button
          type="primary"
          @click="handleSearch"
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
          <!-- <el-form-item label="题目描述">
            {{ selectedRecord.description }}
          </el-form-item> -->
          <!-- <el-form-item label="题目类型">
            {{ selectedRecord.type }}
          </el-form-item> -->
          <!-- <el-form-item label="题目难度">
            {{ selectedRecord.difficulty }}
          </el-form-item> -->
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
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import UserE from './UserBody/UserE.vue'

const router = useRouter()
// 用户信息数据
const userInfo = reactive({
  username: '青山用户',
  email: 'user@qingshan.com',
  emailVerified: true,
  phone: '138-0013-8000',
  avatar: 'https://example.com/avatar.jpg',
  createTime: new Date('2023-01-01'),
  lastLogin: new Date()
})

// 编辑相关状态
const showEditDialog = ref(false)
const selectedRecord = ref(null)
const editFormRef = ref(null)
const editForm = reactive({
  username: userInfo.username,
  email: userInfo.email,
  phone: userInfo.phone
})

// 表单验证规则
const formRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 16, message: '长度在2到16个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ]
}

// 日期格式化
const formatDate = (date) => {
  return new Date(date).toLocaleString()
}

// 头像上传处理
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
    userInfo.avatar = reader.result
  }
  return false // 阻止自动上传
}

// 保存修改
const handleSaveInfo = async () => {
  try {
    await editFormRef.value.validate()
    Object.assign(userInfo, editForm)
    showEditDialog.value = false
    ElMessage.success('信息更新成功')
  } catch (err) {
    console.error('表单验证失败:', err)
  }
}

// 安全设置处理
const handleSecuritySettings = () => {
  // 跳转到安全设置页面
  console.log('跳转到安全设置')
  localStorage.removeItem('isLoggedIn');
  ElMessage.error('退出登录成功')

  router.push({ name: 'login' }); // 跳转到登录页面
  //刷新页面

}
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
</script>

<style scoped>
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
