<template>
  <div class="chat-management-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <h2>聊天窗口管理</h2>
          <div class="header-actions">
            <el-input
              v-model="searchQuery"
              placeholder="搜索窗口ID/用户ID/题目..."
              style="width: 300px"
              clearable
              @clear="handleSearchClear"
              @keyup.enter="handleSearch"
            />
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button type="primary" @click="refreshData">刷新数据</el-button>
          </div>
        </div>
      </template>

      <!-- 聊天窗口列表表格 -->
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="id" label="窗口ID" width="180" />
        <el-table-column prop="userId" label="用户ID" width="180" />
        <el-table-column prop="createTime" label="创建时间" width="240" />
        <el-table-column prop="title" label="题目" show-overflow-tooltip />
        <el-table-column label="操作" width="240">
          <template #default="{ row }">
            <el-button size="small" @click="showChatDetail(row)">查看记录</el-button>
            <el-button size="small" type="danger" @click="confirmDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页控件 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 聊天记录弹窗 -->
    <el-dialog style="overflow: hidden;" v-model="chatDetailDialogVisible" title="聊天记录详情" width="70%">
      <div v-if="selectedChatWindow" style="overflow: hidden;" class="chat-detail-container">
        <!-- 窗口信息部分保持不变... -->
        <div class="window-info">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="窗口ID">{{ selectedChatWindow.id }}</el-descriptions-item>
            <el-descriptions-item label="用户ID">{{ selectedChatWindow.userId }}</el-descriptions-item>
            <el-descriptions-item label="创建时间">{{ selectedChatWindow.createTime }}</el-descriptions-item>
            <el-descriptions-item label="最后活跃">{{ selectedChatWindow.lastActive }}</el-descriptions-item>
            <el-descriptions-item label="题目">{{ selectedChatWindow.title }}</el-descriptions-item>
            <el-descriptions-item label="消息数量">{{ selectedChatWindow.messageCount || 0 }}</el-descriptions-item>
          </el-descriptions>
        </div>

        <el-divider />
        <div class="message-list">
          <h3>聊天记录</h3>
          <div v-if="messagesLoading" class="loading-container">
            <el-skeleton :rows="5" animated />
          </div>
          <template v-else>
            <div
              v-for="(message, index) in chatMessages"
              :key="index"
              :class="['message-item', message.type === 0? 'user-message' : 'ai-message']"
            >
              <div class="message-meta">
                <span class="sender">{{ message.type === 0? '用户' : 'AI' }}</span>
                <span class="time">{{ message.createTime }}</span>
              </div>
              <div class="message-content">{{ message.content }}</div>
            </div>
          </template>
        </div>
      </div>
    </el-dialog>

    <!-- 修改窗口名称弹窗 -->
    <el-dialog v-model="editDialogVisible" title="修改窗口名称" width="500px">
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="窗口ID">
          <el-input v-model="editForm.windowId" disabled />
        </el-form-item>
        <el-form-item label="用户ID">
          <el-input v-model="editForm.userId" disabled />
        </el-form-item>
        <el-form-item label="新名称" required>
          <el-input v-model="editForm.newTitle" placeholder="请输入新的窗口名称" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmEdit">确认修改</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { listChatWindowsByPage } from '@/api/chat.js'
import { deleteChatWindows } from '@/api/chat.js'
import { listMessage } from '@/api/message.js'
// 状态管理
const loading = ref(false)
const tableData = ref([])
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 聊天详情相关状态
const chatDetailDialogVisible = ref(false)
const selectedChatWindow = ref(null)
const chatMessages = ref([])
const messagesLoading = ref(false)

// 编辑相关状态
const editDialogVisible = ref(false)
const editForm = ref({
  windowId: '',
  userId: '',
  newTitle: ''
})

// 获取聊天窗口列表
const fetchChatWindows = async () => {
  try {
    loading.value = true
    const params = {
      current: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchQuery.value
    }

    const res = await listChatWindowsByPage(params)
    console.log('获取聊天窗口列表:', res.data.data)
    tableData.value = res.data.data.records || []
    console.log('获取聊天窗口列表:', tableData.value)
    total.value = parseInt(res.data.data.total) || 0
  } catch (error) {
    console.error('获取聊天窗口列表失败:', error)
    ElMessage.error('获取数据失败，请稍后重试')
  } finally {
    loading.value = false
  }
}
// 获取聊天消息
const fetchChatMessages = async (chatWindowId) => {
  try {
    messagesLoading.value = true
    const res = await listMessage({ chatWindowsId: chatWindowId })

    if (res.data && res.data.code === 0) {
      chatMessages.value = res.data.data || []

      // 格式化时间显示（如果需要）
      chatMessages.value.forEach(msg => {
        if (msg.createTime) {
          msg.createTime = formatDateTime(msg.createTime)
        }
      })
    } else {
      ElMessage.error(res.data?.message || '获取聊天记录失败')
    }
  } catch (error) {
    console.error('获取聊天消息失败:', error)
    ElMessage.error('获取聊天记录失败')
  } finally {
    messagesLoading.value = false
  }
}

// 时间格式化函数（可选）
const formatDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return ''
  try {
    const date = new Date(dateTimeStr)
    return date.toLocaleString() // 或者使用dayjs等库格式化
  } catch {
    return dateTimeStr
  }
}
// 方法
const refreshData = () => {
  currentPage.value = 1
  fetchChatWindows()
}

const handleSearch = () => {
  currentPage.value = 1
  fetchChatWindows()
}

const handleSearchClear = () => {
  searchQuery.value = ''
  handleSearch()
}

const showChatDetail = (chatWindow) => {
  selectedChatWindow.value = chatWindow
  chatDetailDialogVisible.value = true
  fetchChatMessages(chatWindow.id) // 使用窗口ID获取消息
}


const confirmEdit = async () => {
  if (!editForm.value.newTitle.trim()) {
    ElMessage.warning('请输入有效的窗口名称')
    return
  }

  try {

    const index = tableData.value.findIndex(
      w => w.windowId === editForm.value.windowId
    )

    if (index!== -1) {
      tableData.value[index].title = editForm.value.newTitle
      ElMessage.success('窗口名称修改成功')
      editDialogVisible.value = false
    }
  } catch (error) {
    console.error('修改窗口名称失败:', error)
    ElMessage.error('修改失败，请稍后重试')
  }
}

const confirmDelete = (chatWindow) => {
  ElMessageBox.confirm(
    `确定要删除窗口 "${chatWindow.title}" 吗?`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(async () => {
    try {
      // 这里假设有删除窗口的API，实际使用时请替换
      const res = await deleteChatWindows({ id: chatWindow.id })
      console.log('删除窗口:', res)

      ElMessage.success('窗口删除成功')
      fetchChatWindows()
    } catch (error) {
      console.log('删除窗口失败:', error)
      ElMessage.error('删除失败，请稍后重试')
    }
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
  fetchChatWindows()
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchChatWindows()
}

// 生命周期钩子
onMounted(() => {
  fetchChatWindows()
})
</script>

<style scoped>
.user-message {
  margin-left: auto;
  background-color: #e1f3d8; /* 绿色背景表示用户消息 */
  max-width: 80%;
}

/* AI消息样式 */
.ai-message {
  margin-right: auto;
  background-color: #f5f7fa; /* 浅灰色背景表示AI消息 */
  max-width: 80%;
}

.message-meta.flex-between {
  display: flex;
  justify-content: space-between;
}

.message-meta.flex-between.small-text {
  font-size: 12px;
  color: #909399;
}

.message-meta.flex-between.small-text.sender {
  font-weight: bold;
  color: #333;
}

.message-meta.flex-between.small-text.sender:after {
  content: ":";
  margin-right: 4px;
}

.chat-management-container {
  width: 1300px;
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.chat-detail-container {
  max-height: 60vh;
  overflow-y: auto;
}

.window-info {
  margin-bottom: 20px;
  overflow: hidden;
}

.message-list {
  margin-top: 20px;
  max-height: 400px;
  overflow-y: auto;
  padding: 10px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.message-item {
  margin-bottom: 15px;
  padding: 10px;
  border-radius: 5px;
  background-color: #f5f7fa;
  max-width: 80%;
}

.message-item.self {
  margin-left: auto;
  background-color: #e1f3d8;
}

.message-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-size: 12px;
  color: #909399;
}

.message-content {
  word-break: break-word;
  white-space: pre-wrap;
}

.loading-container {
  padding: 20px;
}
</style>
