<template>
  <div class="question-management-container">
    <el-card class="management-card">
      <template #header>
        <div class="card-header">
          <h2 class="card-title">应用审核管理</h2>
          <div class="filter-container">
            <el-select v-model="listQuery.appType" placeholder="应用类型" clearable style="width: 130px" @change="handleFilter">
              <el-option v-for="item in appTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-button type="primary" @click="handleFilter" :icon="Search">搜索</el-button>
            <el-button type="primary" @click="handleReset" :icon="Refresh">重置</el-button>
          </div>
        </div>
      </template>

      <el-table
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%"
        v-loading="loading"
        :header-cell-style="{background: '#f5f7fa', color: '#606266'}"
      >
        <el-table-column type="index" label="序号" width="80" align="center" />
        <el-table-column prop="userId" label="账号" width="200" align="center" />
        <el-table-column prop="appDesc" label="应用描述" width="200" align="center" />

        <el-table-column prop="appName" label="应用名称" width="180" align="center" />
        <el-table-column prop="appType" label="应用类型" width="120" align="center">
          <template #default="{row}">
            <el-tag :type="row.appType === 0? 'info' : 'warning'">
              {{ appTypeMap[row.appType] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="reviewStatus" label="状态" width="120" align="center">
          <template #default="{row}">
            <el-tag :type="statusMap[row.reviewStatus].type" effect="light">
              {{ statusMap[row.reviewStatus].text }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="appIcon" label="应用图标" width="120" align="center">
          <template #default="{row}">
            <img :src="row.appIcon" alt="应用图标" style="width: 40px; height: 40px; object-fit: cover;">
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="260" class-name="small-padding fixed-width">
          <template #default="{row}">
            <el-button v-if="row.reviewStatus === 0" type="primary" size="small" @click="handleApprove(row)" plain>
              通过
            </el-button>
            <el-button v-if="row.reviewStatus === 0" type="danger" size="small" @click="handleReject(row)" plain>
              拒绝
            </el-button>
            <el-button type="info" size="small" @click="handleViewDetail(row)" plain>
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="listQuery.page"
          v-model:page-size="listQuery.limit"
          :total="total"
          background
          layout="total, prev, pager, next, jumper"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 详情对话框 -->
    <el-dialog v-model="dialogVisible" title="应用详情" width="70%">
      <div v-if="currentApp" class="detail-container">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="应用名称">{{ currentApp.appName }}</el-descriptions-item>
          <el-descriptions-item label="应用类型">
            <el-tag :type="currentApp.appType === 0? 'info' : 'warning'">
              {{ appTypeMap[currentApp.appType] }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="账号">{{ currentApp.userId }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="statusMap[currentApp.reviewStatus].type" effect="light">
              {{ statusMap[currentApp.reviewStatus].text }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="应用图标">
            <img :src="currentApp.appIcon" alt="应用图标" style="width: 80px; height: 80px; object-fit: cover;">
          </el-descriptions-item>
          <el-descriptions-item label="应用描述" v-if="currentApp.appDesc">{{ currentApp.appDesc }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <el-button @click="dialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Search, Refresh } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { listAppByPage, updateApp } from '../../api/app.js';

const list = ref([])
const total = ref(0)
const loading = ref(true)
const dialogVisible = ref(false)
const currentApp = ref(null)

const initialListQuery = {
  page: 1,
  limit: 10,
  username: undefined,
  appType: undefined
}

const listQuery = ref({ ...initialListQuery })

const appTypeOptions = [
  { value: 0, label: '系统测评' },
  { value: 1, label: 'AI 测评' }
]

const statusMap = {
  0: { text: '未审核', type: 'warning' },
  1: { text: '已通过', type: 'success' },
  2: { text: '已拒绝', type: 'danger' }
}

const appTypeMap = {
  0: '系统测评',
  1: 'AI 测评'
}

// 获取列表数据
const fetchList = () => {
  loading.value = true
  const requestData = {
    current: listQuery.value.page,
    pageSize: listQuery.value.limit,
    reviewStatus: 0,
    appType: listQuery.value.appType
  }
  console.log('Request Data:', requestData)
  listAppByPage(requestData)
    .then(response => {
      console.log('Response:', response)
      if (response.data.code === 0) {
        list.value = response.data.data.records
        total.value = Number(response.data.data.total)
        console.log('List:', list.value)
        console.log('total:', typeof total.value)
      } else {
        ElMessage.error(response.message)
      }
    })
    .catch(error => {
      console.error('Error fetching list:', error)
      ElMessage.error('获取数据失败，请稍后重试')
    })
    .finally(() => {
      loading.value = false
    })
}

// 搜索过滤
const handleFilter = () => {
  listQuery.value.page = 1
  fetchList()
}

// 分页变化
const handleCurrentChange = (val) => {
  listQuery.value.page = val
  fetchList()
}

// 通过审核
const handleApprove = async (row) => {
  try {
    await ElMessageBox.confirm('确认通过此应用吗?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    const updatedData = { ...row, reviewStatus: 1, reviewMessage: '审核通过' }
    await updateApp(updatedData)
    ElMessage.success('操作成功')
    fetchList()
  } catch (error) {
    if (error === 'cancel') {
      ElMessage.info('已取消操作')
    } else {
      console.error('Error approving app:', error)
      ElMessage.error('通过审核失败，请稍后重试')
    }
  }
}

// 拒绝审核
const handleReject = async (row) => {
  try {
    const { value } = await ElMessageBox.prompt('请输入拒绝原因', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPattern: /\S+/,
      inputErrorMessage: '请输入拒绝原因'
    })
    const updatedData = { ...row, reviewStatus: 2, reviewMessage: value }
    await updateApp(updatedData)
    ElMessage.success('操作成功')
    fetchList()
  } catch (error) {
    if (error === 'cancel') {
      ElMessage.info('已取消操作')
    } else {
      console.error('Error rejecting app:', error)
      ElMessage.error('拒绝审核失败，请稍后重试')
    }
  }
}

// 查看详情
const handleViewDetail = (row) => {
  currentApp.value = row
  dialogVisible.value = true
}

// 重置
const handleReset = () => {
  listQuery.value = { ...initialListQuery }
  fetchList()
}

onMounted(() => {
  fetchList()
})
</script>

<style scoped>
.filter-container .el-button {
  margin: 0px;
}
.question-management-container {
  width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.management-card {
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
}

.card-title {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.filter-container {
  display: flex;
  gap: 12px;
  align-items: center;
}
.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.detail-container {
  padding: 10px;
}

:deep(.el-table) {
  font-size: 14px;
}

:deep(.el-table th.el-table__cell) {
  background-color: #f5f7fa;
}

:deep(.el-tag) {
  font-weight: 500;
}
</style>
