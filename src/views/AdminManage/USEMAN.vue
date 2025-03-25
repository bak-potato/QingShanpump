<template>
  <div class="user-admin-manage">
    <!-- 搜索栏 -->
    <div class="search-container">
      <el-input
        v-model="searchPhone"
        placeholder="手机号搜索"
        clearable
        style="width: 240px"
      />
      <el-input
        v-model="searchAccount"
        placeholder="用户账号搜索"
        clearable
        style="width: 240px"
      />
      <el-input
        v-model="searchName"
        placeholder="姓名搜索"
        clearable
        style="width: 240px"
      />
      <el-button type="primary" @click="handleSearch">搜索</el-button>
    </div>

    <!-- 用户表格 -->
    <div class="user-table">
      <el-table
        :data="paginatedList"
        style="width: 100%"
        v-loading="loading"
        stripe
      >
        <!-- border -->

        <el-table-column
          type="index"
          label="序号"
          width="80"
          align="center"
        />

        <el-table-column
          prop="account"
          label="用户账号"
          width="180"
        />

        <el-table-column
          prop="name"
          label="姓名"
          width="150"
        />

        <el-table-column
          prop="phone"
          label="手机号"
          width="150"
        />

        <el-table-column
          prop="role"
          label="角色"
          width="120"
        />

        <el-table-column
          prop="status"
          label="状态"
          width="120"
        >
          <template #default="{ row }">
            <el-tag
              :type="row.status === '正常' ? 'success' : 'danger'"
              effect="dark"
            >
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column
          prop="createTime"
          label="创建时间"
          width="180"
          :formatter="formatDate"
        />

        <el-table-column
          label="操作"
          width="200"
          fixed="right"
        >
          <template #default="{ row }">
            <el-button
              size="small"
              type="primary"
              @click="handleEdit(row)"
            >
              编辑
            </el-button>
            <el-button
              size="small"
              :type="row.status === '正常' ? 'danger' : 'success'"
              @click="toggleStatus(row)"
            >
              {{ row.status === '正常' ? '禁用' : '启用' }}
            </el-button>
          </template>
        </el-table-column>

        <template #empty>
          <el-empty description="暂无数据" />
        </template>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        class="pagination"
        :current-page="currentPage"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="filteredUserList.length"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="`编辑用户 - ${currentUser.account}`"
      width="500px"
    >
      <el-form
        :model="currentUser"
        label-width="80px"
        :rules="formRules"
        ref="formRef"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="currentUser.name" />
        </el-form-item>

        <el-form-item label="手机号" prop="phone">
          <el-input v-model="currentUser.phone" />
        </el-form-item>

        <el-form-item label="角色" prop="role">
          <el-select v-model="currentUser.role">
            <el-option
              v-for="role in roleOptions"
              :key="role"
              :label="role"
              :value="role"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select v-model="currentUser.status">
            <el-option
              v-for="status in statusOptions"
              :key="status"
              :label="status"
              :value="status"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveUser">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { ElMessage } from 'element-plus'

// 模拟数据
const userList = ref([
  {
    account: 'admin',
    name: '张三',
    phone: '13800138000',
    role: '管理员',
    status: '正常',
    createTime: '2023-01-01 10:00:00'
  },
  {
    account: 'user001',
    name: '李四',
    phone: '13912345678',
    role: '普通用户',
    status: '禁用',
    createTime: '2023-02-15 14:30:00'
  }
])

// 搜索条件
const searchPhone = ref('')
const searchAccount = ref('')
const searchName = ref('')

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)

// 加载状态
const loading = ref(false)

// 对话框相关
const dialogVisible = ref(false)
const currentUser = reactive({
  account: '',
  name: '',
  phone: '',
  role: '',
  status: ''
})

// 表单验证规则
const formRules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ]
}

// 选项数据
const roleOptions = ['管理员', '普通用户', '审计员']
const statusOptions = ['正常', '禁用']

// 格式化日期
const formatDate = (row, column, cellValue) => {
  return cellValue // 实际项目中可使用 dayjs 格式化
}

// 过滤后的用户列表
const filteredUserList = computed(() => {
  return userList.value.filter(user => {
    return (
      user.phone.includes(searchPhone.value) &&
      user.account.includes(searchAccount.value) &&
      user.name.includes(searchName.value)
    )
})
})
// 分页后的数据
const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredUserList.value.slice(start, end)
})

// 搜索处理
const handleSearch = async () => {
  loading.value = true
  // 模拟API请求
  await new Promise(resolve => setTimeout(resolve, 500))
  loading.value = false
}

// 分页处理
const handleSizeChange = (newSize) => {
  pageSize.value = newSize
  currentPage.value = 1
}

const handleCurrentChange = (newPage) => {
  currentPage.value = newPage
}

// 用户状态切换
const toggleStatus = (user) => {
  user.status = user.status === '正常' ? '禁用' : '正常'
  ElMessage.success('状态更新成功')
}

// 编辑用户
const handleEdit = (user) => {
  Object.assign(currentUser, user)
  dialogVisible.value = true
}

// 保存用户
const saveUser = () => {
  const index = userList.value.findIndex(u => u.account === currentUser.account)
  if (index !== -1) {
    userList.value[index] = { ...currentUser }
    ElMessage.success('用户信息更新成功')
    dialogVisible.value = false
  }
}
</script>

<style scoped>
.user-admin-manage {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}

.search-container {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.user-table {
  margin-top: 20px;
}

.pagination {
  margin-top: 20px;
  justify-content: flex-end;
}

.el-table {
  border-radius: 8px;
  overflow: hidden;
}

.el-tag {
  margin: 2px;
}

@media (max-width: 768px) {
  .search-container {
    flex-wrap: wrap;
  }

  .search-container .el-input {
    width: 100% !important;
  }

  .search-container .el-button {
    width: 100%;
  }
}
</style>
