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
            <el-select v-model="listQuery.status" placeholder="状态" clearable style="width: 130px" @change="handleFilter">
              <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-select v-model="listQuery.questionType" placeholder="题目类型" clearable style="width: 130px" @change="handleFilter">
              <el-option v-for="item in questionTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-input v-model="listQuery.username" placeholder="用户名" style="width: 180px;" clearable @keyup.enter="handleFilter" />
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
        <el-table-column prop="id" label="ID" width="80" align="center" />
        <el-table-column prop="username" label="用户名" width="120" align="center" />
        <el-table-column prop="appName" label="应用名称" width="180" align="center" />
        <el-table-column prop="appType" label="应用类型" width="120" align="center">
          <template #default="{row}">
            <el-tag :type="row.appType === 'quiz' ? '' : 'success'">
              {{ appTypeMap[row.appType] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="submitTime" label="提交时间" width="180" align="center">
          <template #default="{row}">
            {{ formatTime(row.submitTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="questionType" label="题目类型" width="130" align="center">
          <template #default="{row}">
            <el-tag :type="getQuestionTypeTag(row.questionType)">
              {{ questionTypeMap[row.questionType] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="questionCount" label="题目数量" width="100" align="center" />
        <el-table-column prop="status" label="状态" width="120" align="center">
          <template #default="{row}">
            <el-tag :type="statusMap[row.status].type" effect="light">
              {{ statusMap[row.status].text }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="260" class-name="small-padding fixed-width">
          <template #default="{row}">
            <el-button v-if="row.status === 'pending'" type="primary" size="small" @click="handleApprove(row)" plain>
              通过
            </el-button>
            <el-button v-if="row.status === 'pending'" type="danger" size="small" @click="handleReject(row)" plain>
              拒绝
            </el-button>
            <el-button v-if="row.status === 'published'" type="warning" size="small" @click="handleTakeDown(row)" plain>
              下架
            </el-button>
            <el-button v-if="row.status === 'rejected' || row.status === 'taken_down'" type="success" size="small" @click="handlePublish(row)" plain>
              上架
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
    <el-dialog v-model="dialogVisible" title="题目详情" width="70%">
      <div v-if="currentQuestion" class="detail-container">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="应用名称">{{ currentQuestion.appName }}</el-descriptions-item>
          <el-descriptions-item label="应用类型">
            <el-tag :type="currentQuestion.appType === 'quiz' ? '' : 'success'">
              {{ appTypeMap[currentQuestion.appType] }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="用户名">{{ currentQuestion.username }}</el-descriptions-item>
          <el-descriptions-item label="提交时间">{{ formatTime(currentQuestion.submitTime) }}</el-descriptions-item>
          <el-descriptions-item label="题目类型">
            <el-tag :type="getQuestionTypeTag(currentQuestion.questionType)">
              {{ questionTypeMap[currentQuestion.questionType] }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="题目数量">{{ currentQuestion.questionCount }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="statusMap[currentQuestion.status].type" effect="light">
              {{ statusMap[currentQuestion.status].text }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="备注" v-if="currentQuestion.remark">{{ currentQuestion.remark }}</el-descriptions-item>
        </el-descriptions>

        <div class="question-preview" v-if="currentQuestion.questions && currentQuestion.questions.length">
          <h4>题目预览：</h4>
          <div v-for="(q, index) in currentQuestion.questions.slice(0, 3)" :key="index" class="question-item">
            <p><strong>题目{{ index + 1 }}:</strong> {{ q.content }}</p>
            <p v-if="q.options"><strong>选项:</strong> {{ q.options.join(', ') }}</p>
          </div>
          <p v-if="currentQuestion.questions.length > 3" class="more-questions">...共{{ currentQuestion.questions.length }}道题目</p>
        </div>
      </div>
      <template #footer>
        <el-button @click="dialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
<!-- 拒绝 -->
  <el-dialog
    v-model="rejectDialogVisible"
    title="拒绝原因"
    width="500px"
    v-if="rejectDialogVisible"
  >
    <el-form label-width="100px">
      <el-form-item label="拒绝原因">
        <el-select
          v-model="selectedRejectReason"
          placeholder="请选择拒绝原因"
          style="width: 100%"
        >
          <el-option
            v-for="item in rejectReasonOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="具体原因"
        v-if="selectedRejectReason === 'other'"
        :rules="[{ required: true, message: '请输入具体原因', trigger: 'blur' }]"
      >
        <el-input
          v-model="customRejectReason"
          type="textarea"
          :rows="3"
          placeholder="请输入具体拒绝原因"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="rejectDialogVisible = false">取消</el-button>
      <el-button
        type="primary"
        @click="confirmReject(rowToReject)"
        :disabled="!selectedRejectReason || (selectedRejectReason === 'other' && !customRejectReason)"
      >
        确定
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Search, Refresh } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const rejectDialogVisible = ref(false)
const rowToReject = ref(null)
const customRejectReason = ref('')
// 模拟数据
const handleReset = () => {
  listQuery.value = {
    page: 1,
    limit: 10,
    status: undefined,
    username: undefined,
    questionType: undefined,
    appType: undefined
  }
  fetchList()
}
const mockData = [
  {
    id: 1,
    username: 'user1',
    appName: '心理健康测评',
    appType: 'assessment',
    submitTime: new Date('2023-05-10 09:30:00'),
    questionType: 'psychological',
    questionCount: 20,
    status: 'pending',
    remark: '',
    questions: [
      { content: '你最近一周感到焦虑的频率如何？', options: ['从不', '偶尔', '经常', '总是'] },
      { content: '你对自己的睡眠质量满意吗？', options: ['非常满意', '比较满意', '不太满意', '非常不满意'] }
    ]
  },
  {
    id: 2,
    username: 'user2',
    appName: '生活常识问答',
    appType: 'quiz',
    submitTime: new Date('2023-05-11 14:20:00'),
    questionType: 'life',
    questionCount: 15,
    status: 'published',
    remark: '已审核通过',
    questions: [
      { content: '下列哪种食物不宜存放在冰箱中？', options: ['香蕉', '鸡蛋', '牛奶', '蔬菜'] },
      { content: '日常饮用的自来水需要煮沸几分钟最安全？', options: ['1分钟', '3分钟', '5分钟', '10分钟'] }
    ]
  },
  {
    id: 3,
    username: 'user3',
    appName: '趣味知识挑战',
    appType: 'quiz',
    submitTime: new Date('2023-05-12 16:45:00'),
    questionType: 'entertainment',
    questionCount: 30,
    status: 'rejected',
    remark: '部分题目内容不准确',
    questions: [
      { content: '以下哪位不是漫威超级英雄？', options: ['蜘蛛侠', '蝙蝠侠', '钢铁侠', '美国队长'] },
      { content: '《哈利波特》中赫敏的猫叫什么名字？', options: ['克鲁克山', '斑斑', '海德薇', '牙牙'] }
    ]
  },
  {
    id: 4,
    username: 'user4',
    appName: '科学知识测评',
    appType: 'assessment',
    submitTime: new Date('2023-05-13 11:10:00'),
    questionType: 'science',
    questionCount: 25,
    status: 'taken_down',
    remark: '用户投诉题目难度不均衡',
    questions: [
      { content: '光速约为每秒多少公里？', options: ['3万', '30万', '300万', '3000万'] },
      { content: '下列哪种元素在地壳中含量最高？', options: ['氧', '硅', '铝', '铁'] }
    ]
  },
  {
    id: 5,
    username: 'user5',
    appName: '智力大挑战',
    appType: 'quiz',
    submitTime: new Date('2023-05-14 10:15:00'),
    questionType: 'intelligence',
    questionCount: 10,
    status: 'published',
    remark: '已审核通过',
    questions: [
      { content: '1, 1, 2, 3, 5, 8, 13, 下一个数字是？', options: ['18', '21', '23', '26'] },
      { content: '如果所有的A都是B，所有的B都是C，那么所有的A都是C。这个推理是？', options: ['正确的', '错误的'] }
    ]
  }
]

const list = ref([])
const total = ref(0)
const loading = ref(true)
const dialogVisible = ref(false)
const currentQuestion = ref(null)

const listQuery = ref({
  page: 1,
  limit: 10,
  status: undefined,
  username: undefined,
  questionType: undefined,
  appType: undefined
})

const appTypeOptions = [
  { value: 'quiz', label: '答题类' },
  { value: 'assessment', label: '测评类' }
]

const statusOptions = [
  { value: 'pending', label: '待审核' },
  { value: 'published', label: '已上架' },
  { value: 'rejected', label: '已拒绝' },
  { value: 'taken_down', label: '已下架' }
]

const questionTypeOptions = [
  { value: 'psychological', label: '心理测试' },
  { value: 'life', label: '生活实用' },
  { value: 'entertainment', label: '娱乐休闲' },
  { value: 'science', label: '科普' },
  { value: 'intelligence', label: '智力挑战' },
  { value: 'study', label: '学习' },
  { value: 'other', label: '其他' }
]

const statusMap = {
  pending: { text: '待审核', type: 'warning' },
  published: { text: '已上架', type: 'success' },
  rejected: { text: '已拒绝', type: 'danger' },
  taken_down: { text: '已下架', type: 'info' }
}

const appTypeMap = {
  quiz: '答题类',
  assessment: '测评类'
}

const questionTypeMap = {
  psychological: '心理测试',
  life: '生活实用',
  entertainment: '娱乐休闲',
  science: '科普',
  intelligence: '智力挑战',
  study: '学习',
  other: '其他'
}

// 获取列表数据
const fetchList = () => {
  loading.value = true
  // 模拟API请求
  setTimeout(() => {
    let filteredData = [...mockData]

    // 过滤状态
    if (listQuery.value.status) {
      filteredData = filteredData.filter(item => item.status === listQuery.value.status)
    }

    // 过滤用户名
    if (listQuery.value.username) {
      filteredData = filteredData.filter(item =>
        item.username.toLowerCase().includes(listQuery.value.username.toLowerCase())
      )
    }

    // 过滤题目类型
    if (listQuery.value.questionType) {
      filteredData = filteredData.filter(item => item.questionType === listQuery.value.questionType)
    }

    // 过滤应用类型
    if (listQuery.value.appType) {
      filteredData = filteredData.filter(item => item.appType === listQuery.value.appType)
    }

    // 模拟分页
    const start = (listQuery.value.page - 1) * listQuery.value.limit
    const end = start + listQuery.value.limit
    list.value = filteredData.slice(start, end)
    total.value = filteredData.length
    loading.value = false
  }, 500)
}

// 格式化时间
const formatTime = (time) => {
  return new Date(time).toLocaleString()
}
const confirmReject = (row) => {
  let reasonText = ''

  if (selectedRejectReason.value === 'other') {
    reasonText = customRejectReason.value
  } else {
    const reasonObj = rejectReasonOptions.find(r => r.value === selectedRejectReason.value)
    reasonText = reasonObj ? reasonObj.label : '未知原因'
  }

  row.status = 'rejected'
  row.remark = `拒绝原因: ${reasonText}`
  ElMessage.success('操作成功')
  fetchList()
  rejectDialogVisible.value = false
}
// 获取题目类型标签样式
const getQuestionTypeTag = (type) => {
  const map = {
    psychological: 'danger',
    life: 'success',
    entertainment: 'warning',
    science: '',
    intelligence: 'info',
    study: 'primary',
    other: ''
  }
  return map[type] || ''
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
const handleApprove = (row) => {
  ElMessageBox.confirm('确认通过此题目集吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    row.status = 'published'
    row.remark = '审核通过'
    ElMessage.success('操作成功')
    fetchList()
  }).catch(() => {
    ElMessage.info('已取消操作')
  })
}

const selectedRejectReason = ref('')
const rejectReasonOptions = [
  { value: 'vulgar', label: '低俗内容' },
  { value: 'inappropriate', label: '内容不当' },
  { value: 'inaccurate', label: '信息不准确' },
  { value: 'duplicate', label: '重复提交' },
  { value: 'other', label: '其他原因' }
]
// 拒绝审核
const handleReject = (row) => {
  rowToReject.value = row
  selectedRejectReason.value = ''
  customRejectReason.value = ''
  rejectDialogVisible.value = true
}



// 上架
const handlePublish = (row) => {
  ElMessageBox.confirm('确认上架此题目集吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    row.status = 'published'
    row.remark = '已重新上架'
    ElMessage.success('操作成功')
    fetchList()
  }).catch(() => {
    ElMessage.info('已取消操作')
  })
}

// 下架
const handleTakeDown = (row) => {
  ElMessageBox.prompt('请输入下架原因', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputPattern: /\S+/,
    inputErrorMessage: '请输入下架原因'
  }).then(({ value }) => {
    row.status = 'taken_down'
    row.remark = value
    ElMessage.success('操作成功')
    fetchList()
  }).catch(() => {
    ElMessage.info('已取消操作')
  })
}

// 查看详情
const handleViewDetail = (row) => {
  currentQuestion.value = row
  dialogVisible.value = true
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

.question-preview {
  margin-top: 20px;
  padding: 15px;
  background-color: #f8fafc;
  border-radius: 6px;
  border-left: 4px solid #409eff;
}

.question-item {
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px dashed #e4e7ed;
}

.question-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.more-questions {
  color: #909399;
  font-size: 14px;
  text-align: center;
  margin-top: 10px;
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
