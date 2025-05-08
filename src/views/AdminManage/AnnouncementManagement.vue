<template>
  <div class="announcement-container">
    <div class="header">
      <h1>公告管理</h1>
      <el-button
        type="primary"
        @click="handleAdd"
        class="publish-btn"
      >
        <el-icon><Plus /></el-icon>
        发布公告
      </el-button>
    </div>

    <!-- 发布/编辑公告弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      :before-close="handleClose"
    >
      <el-form :model="form" :rules="rules" ref="formRef">
        <el-form-item label="标题" prop="title">
          <el-input
            v-model="form.title"
            placeholder="请输入公告标题"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="context">
          <el-input
            v-model="form.context"
            type="textarea"
            :rows="5"
            placeholder="请输入公告内容"
            show-word-limit
            maxlength="500"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="resetForm">取消</el-button>
          <el-button type="primary" @click="submitForm">确认</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 公告列表 -->
    <div class="announcement-list">
      <div v-if="loading" class="loading-tip">
        <el-skeleton :rows="5" animated />
      </div>
      <div v-else-if="announcements.length === 0" class="empty-tip">
        <el-empty description="暂无公告" />
      </div>
      <div
        v-for="(item, index) in announcements"
        :key="item.id"
        class="announcement-item"
        :class="{ 'expanded': expandedIndex === index }"
      >
        <div class="announcement-header">
          <div class="title-wrapper">
            <el-tag :type="item.status === 1 ? 'success' : 'info'" size="small">
              {{ item.status === 1 ? '已发布' : '未发布' }}
            </el-tag>
            <h3 class="title">{{ item.title }}</h3>
          </div>
          <div class="meta">
            <span class="time">{{ formatTime(item.createTime) }}</span>
            <div class="actions">
              <el-button
                type="text"
                @click.stop="handleEdit(item)"
                class="action-btn"
              >
                <el-icon><Edit /></el-icon>
                编辑
              </el-button>
              <el-button
                type="text"
                @click.stop="handleDelete(item.id)"
                class="action-btn"
              >
                <el-icon><Delete /></el-icon>
                删除
              </el-button>
              <el-button
                type="text"
                @click.stop="toggleExpand(index)"
                class="expand-btn"
              >
                {{ expandedIndex === index ? '收起' : '展开' }}
                <el-icon :class="{ 'rotate': expandedIndex === index }">
                  <ArrowDown />
                </el-icon>
              </el-button>
            </div>
          </div>
        </div>
        <div class="announcement-content">
          {{ item.context }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, ArrowDown, Edit, Delete } from '@element-plus/icons-vue'
import { addgg, cxgglist, updategg, deletegg } from '../../api/notice'


// 表单数据
const form = ref({
  id: null,
  title: '',
  context: ''
})

// 表单验证规则
const rules = {
  title: [
    { required: true, message: '请输入公告标题', trigger: 'blur' },
    { max: 50, message: '标题长度不能超过50个字符', trigger: 'blur' }
  ],
  context: [
    { required: true, message: '请输入公告内容', trigger: 'blur' }
  ]
}

const formRef = ref(null)
const announcements = ref([])
const expandedIndex = ref(null)
const dialogVisible = ref(false)
const dialogTitle = ref('发布新公告')
const loading = ref(false)
const isEdit = ref(false)

// 获取公告列表
const fetchAnnouncements = async () => {
  try {
    loading.value = true
    const res = await cxgglist({
      current: 1,
      pageSize: 10
    })
    console.log(res.data.data)
    if (res.data.message === 'ok') {
      announcements.value = res.data.data.records
      console.log(announcements.value)
    } else {
      ElMessage.error(res.message || '获取公告列表失败')
    }
  } catch (error) {
    ElMessage.error('获取公告列表失败')
    console.log(error)
  } finally {
    loading.value = false
  }
}

// 提交表单
const submitForm = async () => {
  try {
    await formRef.value.validate()

    if (isEdit.value) {
      // 编辑公告
      const res = await updategg({
        id: form.value.id,
        title: form.value.title,
        context: form.value.context
      })
      console.log('resss',res)
      if (res.data.message === 'ok') {
        ElMessage.success('公告更新成功')
        fetchAnnouncements()
      } else {
        ElMessage.error(res.message || '公告更新失败')
      }
    } else {
      // 新增公告
      const res = await addgg({
        title: form.value.title,
        context: form.value.context
      })
      console.log('resss',res)
      if (res.data.message === 'ok') {
        ElMessage.success('公告发布成功')
        fetchAnnouncements()
      } else {
        ElMessage.error(res.message || '公告发布失败')
      }
    }

    resetForm()
    dialogVisible.value = false
  } catch (error) {
    console.error(error)
  }
}

// 重置表单
const resetForm = () => {
  formRef.value?.resetFields()
  form.value = {
    id: null,
    title: '',
    context: ''
  }
  isEdit.value = false
  dialogTitle.value = '发布新公告'
}

// 添加公告
const handleAdd = () => {
  dialogTitle.value = '发布新公告'
  dialogVisible.value = true
}

// 编辑公告
const handleEdit = (item) => {
  dialogTitle.value = '编辑公告'
  form.value = {
    id: item.id,
    title: item.title,
    context: item.context
  }
  isEdit.value = true
  dialogVisible.value = true
}

// 删除公告
// 删除公告
const handleDelete = (id) => {
  ElMessageBox.confirm('确定要删除该公告吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      // 构造请求参数
      const data = {
        deleteId: id
      };
      // 调用接口
      const res = await deletegg(data);
      if (res.data.message === 'ok') {
        ElMessage.success('删除成功')
        fetchAnnouncements()
      } else {
        ElMessage.error(res.message || '删除失败')
      }
    } catch (error) {
      ElMessage.error('删除失败')
      console.error(error)
    }
  }).catch(() => {})
}

// 格式化时间
const formatTime = (time) => {
  if (!time) return ''
  return new Date(time).toLocaleString()
}

// 切换展开/收起
const toggleExpand = (index) => {
  expandedIndex.value = expandedIndex.value === index ? null : index
}

// 关闭弹窗前确认
const handleClose = (done) => {
  if (form.value.title || form.value.context) {
    ElMessageBox.confirm('确定要取消吗？填写的内容将不会被保存', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      resetForm()
      done()
    }).catch(() => {})
  } else {
    done()
  }
}

// 组件挂载时获取公告列表
onMounted(() => {
  fetchAnnouncements()
})
</script>

<style scoped>
.announcement-container {
  width: 1300px;
  height: 98vh;
  margin: 1vh auto;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  overflow-y: auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid #ebeef5;
}

.header h1 {
  margin: 0;
  font-size: 24px;
  color: #303133;
}

.publish-btn {
  height: 40px;
}

.announcement-list {
  margin-top: 20px;
}

.announcement-item {
  margin-bottom: 20px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
}

.announcement-item:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.announcement-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.title-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.announcement-header .title {
  margin: 0;
  font-size: 16px;
  color: #303133;
  font-weight: 500;
}

.meta {
  display: flex;
  align-items: center;
  gap: 15px;
}

.announcement-header .time {
  font-size: 12px;
  color: #909399;
}

.actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-btn {
  padding: 0;
  display: flex;
  align-items: center;
  gap: 4px;
}

.announcement-content {
  color: #606266;
  line-height: 1.6;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.announcement-item.expanded .announcement-content {
  -webkit-line-clamp: unset;
}

.expand-btn {
  padding: 0;
  display: flex;
  align-items: center;
  gap: 4px;
}

.expand-btn .el-icon {
  transition: transform 0.3s;
}

.expand-btn .rotate {
  transform: rotate(180deg);
}

.empty-tip {
  padding: 40px 0;
  text-align: center;
  color: #909399;
}

.loading-tip {
  padding: 20px 0;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
