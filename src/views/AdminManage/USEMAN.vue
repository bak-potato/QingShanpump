<template>
  <div class="user-admin-manage">
    <!-- 搜索栏和操作按钮 -->
 <div class="search-container">
      <el-input
        v-model="searchId"
        placeholder="输入用户ID搜索"
        clearable
        style="width: 240px"
        @keyup.enter="handleSearchById"
      />
      <el-button type="primary" @click="handleSearchById">搜索</el-button>
      <el-button type="success" @click="handleAdd">新增用户</el-button>
    </div>

    <!-- 用户表格 -->
    <div class="user-table">
      <el-table
        :data="userList"
        style="width: 100%"
        v-loading="loading"
        stripe
      >
        <el-table-column
          type="index"
          label="序号"
          width="80"
          align="center"
        />

        <el-table-column
          prop="userAccount"
          label="用户账号"
          width="180"
        />

        <el-table-column
          prop="userPassword"
          label="密码"
          width="280"
        />

        <el-table-column
          prop="id"
          label="id"
          width="200"
        />


        <el-table-column
          prop="createTime"
          label="创建时间"
          width="300"
          :formatter="formatDate"
        />

        <el-table-column
          label="操作"
          width="240"
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
            <el-popconfirm
              title="确定要删除该用户吗？"
              @confirm="handleDelete(row)"
            >
              <template #reference>
                <el-button size="small" type="danger">删除</el-button>
              </template>
            </el-popconfirm>
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
        :total="totalCount"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 编辑/添加对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
    >
      <el-form
        :model="currentUser"
        label-width="80px"
        :rules="formRules"
        ref="formRef"
      >
        <!-- 用户账号 -->
        <el-form-item label="用户账号" prop="userAccount">
          <el-input v-model="currentUser.userAccount" />
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="密码" prop="userPassword">
          <el-input v-model="currentUser.userPassword" type="password" show-password />
        </el-form-item>
        <!-- id -->
        <el-form-item label="id" prop="id">
          <el-input v-model="currentUser.id" />
        </el-form-item>
        <!-- 用户角色 -->
        <el-form-item label="用户角色" prop="userRole">
          <el-select v-model="currentUser.userRole">
            <el-option label="普通用户" value="user" />
            <el-option label="管理员" value="admin" />
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
import { ref, computed, reactive, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { listuserbypage } from '../../api/user.js'
import { deleteuser, adduser, updateUser, getuserbyid } from '../../api/user.js'

// 搜索条件
const searchId = ref('')

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const totalCount = ref(0)

// 加载状态
const loading = ref(false)

// 对话框相关
const dialogVisible = ref(false)
const isAdd = ref(false)
const formRef = ref(null)
const currentUser = reactive({
  userAccount: '',
  userPassword: '',
  id: '',
  userRole: ''
});

// 计算对话框标题
const dialogTitle = computed(() => {
  return isAdd.value ? '新增用户' : `编辑用户 - ${currentUser.userAccount}`
})

// 表单验证规则
const formRules = {
  userAccount: [
    { required: true, message: '请输入用户账号', trigger: 'blur' },
    { min: 4, max: 20, message: '长度在4到20个字符', trigger: 'blur' }
  ],
  userPassword: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 50, message: '长度在6到20个字符', trigger: 'blur' }
  ],
  id: [{ required: true, message: '请输入id', trigger: 'blur' }],
  userRole: [{ required: true, message: '请选择用户角色', trigger: 'change' }]
};

// 选项数据

// 格式化日期
const formatDate = (row, column, cellValue) => {
  return cellValue // 实际项目中可使用 dayjs 格式化
}

// 用户列表
const userList = ref([])

// 分页后的数据
const paginatedList = computed(() => {
  return userList.value // 直接返回当前用户列表
})

const handleSearchById = async () => {
  if (!searchId.value) {
    handleSearch()
    return
  }

  loading.value = true
  try {
    const response = await getuserbyid({ id: searchId.value })
    if (response.data.code === 0) {
      userList.value = response.data.data ? [response.data.data] : []
      totalCount.value = response.data.data ? 1 : 0 // 确保总条数为1或0
      currentPage.value = 1
    } else {
      userList.value = []
      totalCount.value = 0
      ElMessage.warning(response.data.message || '未找到匹配的用户')
    }
  } catch (error) {
    console.log('搜索出错:', error)
    ElMessage.error('搜索出错，请检查网络或联系管理员')
  } finally {
    loading.value = false
  }
}

// 搜索处理
const handleSearch = async () => {
  loading.value = true
  try {
    const requestData = {
      current: currentPage.value - 1,
      id: "",
      mpOpenId: "",
      pageSize: pageSize.value,
      sortField: "",
      sortOrder: "",
      unionId: "",
      userName: "",
      userProfile: "",
      userRole: ""
    }
    const response = await listuserbypage(requestData)
    if (response.data.code === 0) {
      userList.value = response.data.data.records
      totalCount.value = response.data.data.total
      if (typeof totalCount.value === 'string') {
        totalCount.value = Number(totalCount.value);
      }
    } else {
      ElMessage.error(response.message || '获取用户列表失败')
    }
  } catch (error) {
    console.error('请求出错:', error)
    ElMessage.error('请求出错，请检查网络或联系管理员')
  } finally {
    loading.value = false
  }
}

// 分页处理
const handleSizeChange = (newSize) => {
  pageSize.value = newSize
  currentPage.value = 1
  if (searchId.value) {
    handleSearchById()
  } else {
    handleSearch()
  }
}

const handleCurrentChange = (newPage) => {
  currentPage.value = newPage
  if (searchId.value) {
    handleSearchById()
  } else {
    handleSearch()
  }
}
// 用户状态切换
const toggleStatus = async (user) => {
  loading.value = true
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 500))
    user.status = user.status === '正常' ? '禁用' : '正常'
    ElMessage.success('状态更新成功')
  } finally {
    loading.value = false
  }
}

// 新增用户
const handleAdd = () => {
  isAdd.value = true
  Object.assign(currentUser, {
    userAccount: '',
    userPassword: '',
    id: '',
    userRole: ''
  })
  dialogVisible.value = true
  nextTick(() => {
    if (formRef.value) {
      formRef.value.clearValidate()
    }
  })
}

// 编辑用户
const handleEdit = async (user) => {
  isAdd.value = false
  loading.value = true
  try {
    const response = await getuserbyid({ id: user.id })
    if (response.data.code === 0) {
      Object.assign(currentUser, response.data.data)
      dialogVisible.value = true
    } else {
      ElMessage.error(response.data.message || '获取用户信息失败')
    }
  } catch (error) {
    console.error('请求出错:', error)
    ElMessage.error('请求出错，请检查网络或联系管理员')
  } finally {
    loading.value = false
  }
}

// 删除用户
const handleDelete = async (user) => {
  loading.value = true
  try {
    const requestData = { id: user.id }
    const response = await deleteuser(requestData)
    console.log('删除用户响应:', response)
    if (response.data && response.data.code === 0) {
      userList.value = userList.value.filter(u => u.id!== user.id)
      ElMessage.success('用户删除成功')
      // 如果当前页没有数据了，且不是第一页，则返回上一页
      if (paginatedList.value.length === 0 && currentPage.value > 1) {
        currentPage.value -= 1
        handleSearch()
      }
    } else {
      ElMessage.error(response.data && response.data.message || '删除用户失败')
    }
  } catch (error) {
    console.log('删除用户请求出错:', error.response)
    ElMessage.error('删除用户请求出错，请检查网络或联系管理员')
  } finally {
    loading.value = false
  }
}

// 保存用户
const saveUser = async () => {
  // 表单验证
  try {
    await formRef.value.validate()
  } catch (error) {
    console.error('表单验证失败', error)
    ElMessage.warning('请填写完整且正确的表单信息')
    return
  }

  loading.value = true
  try {
    if (isAdd.value) {
      // 检查账号是否已存在
      if (userList.value.some((u) => u.userAccount === currentUser.userAccount)) {
        ElMessage.error('该用户账号已存在')
        return
      }
      // 新增用户
      const response = await adduser({
        userAccount: currentUser.userAccount,
        userAvatar: "",
        userName: "",
        userRole: currentUser.userRole
      })
      if (response.data && response.data.code === 0) {
        const newUser = {
          ...currentUser,
          createTime: new Date().toLocaleString()
        }
        userList.value.push(newUser)
        ElMessage.success('用户添加成功')
      } else {
        ElMessage.error(response.data && response.data.message || '用户添加失败')
      }
    } else {
      // 编辑用户 - 使用updateuser API
      const response = await updateUser({
        id: currentUser.id,
        userAvatar: currentUser.userAvatar || "",
        userName: currentUser.userName || "",
        userProfile: currentUser.userProfile || "",
        userRole: currentUser.userRole
      })
      console.log('更新用户响应:', {
        id: currentUser.id,
        userAvatar: currentUser.userAvatar || "",
        userName: currentUser.userName || "",
        userProfile: currentUser.userProfile || "",
        userRole: currentUser.userRole
      })
      if (response.data && response.data.code === 0) {
        // 更新本地数据
        const index = userList.value.findIndex((u) => u.id === currentUser.id)
        if (index!== -1) {
          userList.value[index] = {
            ...userList.value[index],
            ...currentUser
          }
        }
        ElMessage.success('用户信息更新成功')
      } else {
        ElMessage.error(response.data && response.data.message || '用户更新失败')
      }
    }
    dialogVisible.value = false
  } catch (error) {
    console.error('保存用户请求出错:', error)
    ElMessage.error('保存用户请求出错，请检查网络或联系管理员')
  } finally {
    loading.value = false
  }
}

// 初始加载数据
handleSearch()
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
  flex-wrap: wrap;
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
  .search-container .el-input,
  .search-container .el-button {
    width: 100% !important;
  }
}

.operation-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
</style>
