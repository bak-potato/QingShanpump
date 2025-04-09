<template>
<div class="my-posts-container">
  <!-- 头部操作栏 -->
  <div class="operation-header">
    <h2 class="page-title">我的帖子</h2>
    <div class="action-group">
      <el-input
        v-model="searchKey"
        placeholder="搜索我的帖子"
        clearable
        style="width: 300px; margin-right: 20px;"
        @keyup.enter="handleSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      <el-button type="primary" @click="handleNewPost">
        <el-icon><Plus /></el-icon>
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
            <el-icon style="color: #ff6b6b"><StarFilled /></el-icon>
          </template>
        </el-statistic>
      </el-col>
      <el-col :span="6">
        <el-statistic title="总收藏量" :value="1">
          <template #suffix>
            <el-icon style="color: #ffd700"><Collection /></el-icon>
          </template>
        </el-statistic>
      </el-col>
      <el-col :span="6">
        <el-statistic title="平均阅读" :value="1">
          <template #suffix>
            <el-icon><View /></el-icon>
          </template>
        </el-statistic>
      </el-col>
    </el-row>
  </div>

  <!-- 帖子列表 -->
  <div class="post-list">
    <div class="filter-bar">
      <el-radio-group v-model="filterStatus" @change="filterPosts">
        <el-radio-button label="all">全部</el-radio-button>
        <el-radio-button label="published">已发布</el-radio-button>
        <el-radio-button label="draft">草稿</el-radio-button>
        <el-radio-button label="review">审核中</el-radio-button>
      </el-radio-group>
    </div>

      <div class="post-table">
    <el-table
      :data="postList"
      style="width: 100%"
      stripe
      @row-click="handleRowClick"
      :loading= loading
    >
      <el-table-column prop="title" label="帖子标题" width="300">
        <template #default="{ row }">
          <span class="title-link" @click.stop="handleView(row.id)">
            {{ row.title }}
          </span>
        </template>
      </el-table-column>

      <el-table-column prop="status" label="状态" width="120">
        <template #default="{ row }">
          <el-tag :type="statusType[row.status]" effect="plain">
            123
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="views" label="阅读量" sortable width="120">
        <template #default="{ row }">
          <el-icon><View /></el-icon>
          {{ row.views }}
        </template>
      </el-table-column>

      <el-table-column prop="likes" label="点赞数" sortable width="120">
        <template #default="{ row }">
          <el-icon><StarFilled /></el-icon>
          {{ row.thumbNum }}
        </template>
      </el-table-column>

      <el-table-column prop="time" label="发布时间" sortable width="180">
        <template #default="{ row }">
          <el-icon><Clock /></el-icon>
          {{ row.createTime }}
        </template>
      </el-table-column>

      <el-table-column label="操作" width="220">
        <template #default="{ row }">
          <el-button
            size="small"
            @click.stop="handleEdit(row.id)"
            icon="Edit"
          >编辑</el-button>
          <el-button
            type="danger"
            size="small"
            @click.stop="handleDelete(row.id)"
            icon="Delete"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination">
<el-pagination class="mr mt" v-model:current-page="pageInfo.current" v-model:page-size="pageInfo.pageSize"
        :page-sizes="[10, 20, 30, 40]" layout="sizes, prev, pager, next, jumper, total" :total="totals" background
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

const router = useRouter()
// 帖子状态映射
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
// 获取帖子列表
const loadData = async () => {
  loading.value = true
  const { data :{data: { records, total }} } = await listUserPostApi({ ...pageInfo })
  loading.value = false
  postList.value = records
  setTotals(Number(total))
  postList.value = records.map((records) => ({
    ...records,
  }))
  console.log(postList.value)
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
}

const handleNewPost = () => {
  // 跳转到新建帖子页面
  router.push('/createpost');
  console.log('新建帖子')
}

const handleEdit = (id) => {
  router.push({
    path: '/editpost',
    query: {
      id: id
    }
  })
  console.log('编辑帖子:', id)
}

const handleDelete = (id) => {
  // 确认删除操作
 ElMessageBox.confirm('确定要删除该帖子吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    await deletePostApi({ id: id })
    ElMessage.success('删除成功')
    loadData()
  })

  console.log('删除帖子:', id)
}

const handleView = (id) => {
  // 跳转到帖子详情页
  window.open(router.resolve({
    path: '/post',
    query: {
      id: id
    }
  }).href, '_blank')
  console.log('查看详情:', id)
}

const filterPosts = () => {
  console.log('筛选状态:', filterStatus.value)
}
</script>

<style scoped>
.my-posts-container {
  width: 100%;
  margin: 0 auto;
  padding: 20px;
}

.operation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.page-title {
  color: #1a1a1a;
  font-size: 24px;
}

.stats-panel {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
}

.post-card {
  margin-bottom: 20px;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-3px);
  }
}

.card-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.post-main {
  flex: 1;
  margin-right: 20px;
}

.post-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;

  .post-title {
    font-size: 16px;
    margin-right: 15px;
    color: #333;
  }
}

.post-excerpt {
  color: #666;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 10px;
}

.post-meta {
  display: flex;
  gap: 20px;
  color: #999;
  font-size: 12px;

  .el-icon {
    margin-right: 5px;
  }
}

.post-actions {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.filter-bar {
  margin-bottom: 20px;
}

.title-link {
  color: #409eff;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

/* 调整表格样式 */
:deep(.el-table__row) {
  cursor: pointer;

  &:hover {
    background-color: #f5f7fa !important;
  }
}

:deep(.el-table .cell) {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
