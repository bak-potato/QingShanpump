<template>
  <div class="my-posts-container">
    <!-- 头部操作栏 -->
    <div class="operation-header">
      <h2 class="page-title">我的帖子</h2>
      <div class="action-group">
        <el-input v-model="searchKey" placeholder="搜索我的帖子" clearable style="width: 300px; margin-right: 20px;"
          @keyup.enter="handleSearch">
          <template #prefix>
            <el-icon>
              <Search />
            </el-icon>
          </template>
        </el-input>
        <el-button type="primary" @click="handleNewPost">
          <el-icon>
            <Plus />
          </el-icon>
          新建帖子
        </el-button>
      </div>
    </div>

    <!-- 数据概览 -->
    <div class="stats-panel">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-statistic title="总发布量" :value="totals" />
        </el-col>
        <el-col :span="6">
          <el-statistic title="获赞总数" :value="1">
            <template #suffix>
              <el-icon style="color: #ff6b6b">
                <StarFilled />
              </el-icon>
            </template>
          </el-statistic>
        </el-col>
        <el-col :span="6">
          <el-statistic title="总收藏量" :value="1">
            <template #suffix>
              <el-icon style="color: #ffd700">
                <Collection />
              </el-icon>
            </template>
          </el-statistic>
        </el-col>
        <el-col :span="6">
          <el-statistic title="平均阅读" :value="1">
            <template #suffix>
              <el-icon>
                <View />
              </el-icon>
            </template>
          </el-statistic>
        </el-col>
      </el-row>
    </div>

    <!-- 帖子列表 -->
    <div class="post-list-container">
      <div class="filter-bar">
        <el-radio-group v-model="filterStatus" @change="filterPosts">
          <el-radio-button label="all">全部</el-radio-button>
          <el-radio-button label="published">已发布</el-radio-button>
          <el-radio-button label="draft">草稿</el-radio-button>
          <el-radio-button label="review">审核中</el-radio-button>
        </el-radio-group>
      </div>

      <div class="table-container">
        <el-table :data="postList" style="width: 100%" stripe v-loading="loading" @row-click="handleRowClick">
          <el-table-column prop="title" label="帖子标题" min-width="300">
            <template #default="{ row }">
              <div class="title-content">
                <span class="title-link" @click.stop="handleView(row.id)">
                  {{ row.title }}
                </span>
                <el-tag v-if="row.status" :type="statusType[row.status]" size="small" class="status-tag">
                  {{ statusMap[row.status] }}
                </el-tag>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="views" label="阅读量" sortable width="120" align="center">
            <template #default="{ row }">
              <div class="metric-cell">
                <el-icon>
                  <View />
                </el-icon>
                <span>{{ row.views || 0 }}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="likes" label="点赞数" sortable width="120" align="center">
            <template #default="{ row }">
              <div class="metric-cell">
                <el-icon>
                  <StarFilled />
                </el-icon>
                <span>{{ row.thumbNum || 0 }}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="time" label="发布时间" sortable width="180">
            <template #default="{ row }">
              <div class="time-cell">
                <el-icon>
                  <Clock />
                </el-icon>
                <span>{{ formatTime(row.createTime) }}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="180" fixed="right" align="center">
            <template #default="{ row }">
              <el-button size="small" @click.stop="handleEdit(row.id)" icon="Edit" link>编辑</el-button>
              <el-button type="danger" size="small" @click.stop="handleDelete(row.id)" icon="Delete" link>删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-wrapper">
          <el-pagination v-model:current-page="pageInfo.current" v-model:page-size="pageInfo.pageSize"
            :page-sizes="[10, 20, 30, 40]" layout="total, sizes, prev, pager, next, jumper" :total="totals" background
            @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePagination } from '@/hooks/usePagination'
import { listUserPostApi, deletePostApi } from '@/api/post'
import { ElMessageBox, ElMessage } from 'element-plus'
import { getuserbyid } from '@/api/user'
import dayjs from 'dayjs'

const router = useRouter()

const statusMap = {
  published: '已发布',
  draft: '草稿',
  review: '审核中'
}

const statusType = {
  published: 'success',
  draft: 'info',
  review: 'warning'
}

const postList = ref([])
const loading = ref(false)

// 格式化时间显示
const formatTime = (time) => {
  return dayjs(time).format('YYYY-MM-DD HH:mm')
}

// 获取帖子列表
const loadData = async () => {
  loading.value = true
  try {
    const { data: { data: { records, total } } } = await listUserPostApi({ ...pageInfo })
    postList.value = records.map(record => ({
      ...record,
      createTime: formatTime(record.createTime)
    }))
    setTotals(Number(total))
  } catch (error) {
    console.error('获取帖子列表失败:', error)
    ElMessage.error('获取帖子列表失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})

const { totals, pageInfo, handleCurrentChange, handleSizeChange, setTotals } = usePagination(loadData)

// 筛选状态
const filterStatus = ref('all')
const searchKey = ref('')

// 操作处理
const handleSearch = () => {
  console.log('搜索关键词:', searchKey.value)
  loadData()
}

const handleNewPost = () => {
  router.push('/createpost')
}

const handleEdit = (id) => {
  router.push({
    path: '/editpost',
    query: { id }
  })
}

const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除该帖子吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await deletePostApi({ id })
    ElMessage.success('删除成功')
    loadData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const handleView = (id) => {
  window.open(router.resolve({
    path: '/post',
    query: { id }
  }).href, '_blank')
}

const filterPosts = () => {
  console.log('筛选状态:', filterStatus.value)
  loadData()
}

const handleRowClick = (row) => {
  handleView(row.id)
}
</script>

<style>
.my-posts-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
}

.operation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
}

.operation-header .page-title {
  color: var(--el-text-color-primary);
  font-size: 24px;
  font-weight: 500;
  margin: 0;
}

.operation-header .action-group {
  display: flex;
  align-items: center;
}

.stats-panel {
  background: var(--el-bg-color-overlay);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: var(--el-box-shadow-light);
}

.post-list-container {
  background: var(--el-bg-color-overlay);
  border-radius: 12px;
  padding: 20px;
  box-shadow: var(--el-box-shadow-light);
}

.post-list-container .filter-bar {
  margin-bottom: 20px;
}

.table-container {
  width: 100%;
  overflow-x: auto;
}

.table-container .title-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.table-container .title-content .title-link {
  color: var(--el-color-primary);
  cursor: pointer;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.table-container .title-content .title-link:hover {
  text-decoration: underline;
}

.table-container .title-content .status-tag {
  flex-shrink: 0;
}

.table-container .metric-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.table-container .metric-cell .el-icon {
  color: var(--el-text-color-secondary);
}

.table-container .time-cell {
  display: flex;
  align-items: center;
  gap: 6px;
}

.table-container .time-cell .el-icon {
  color: var(--el-text-color-secondary);
}

.table-container .el-table__row {
  cursor: pointer;
}

.table-container .el-table__row:hover {
  background-color: var(--el-fill-color-light) !important;
}

.table-container .el-table__cell {
  padding: 12px 0;
}

.table-container .el-button--small {
  padding: 5px 8px;
}

.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.pagination-wrapper .el-pagination {
  padding: 0;
}

@media (max-width: 768px) {
  .operation-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .operation-header .action-group {
    width: 100%;
  }

  .operation-header .action-group .el-input {
    flex: 1;
    margin-right: 10px;
  }

  .stats-panel .el-col {
    margin-bottom: 15px;
  }

  .stats-panel .el-col:last-child {
    margin-bottom: 0;
  }
}
</style>
