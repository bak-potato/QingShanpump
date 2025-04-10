<template>
  <div class="post-container">
    <!-- 头部 -->
    <div class="post-header">
      <h2 class="post-title">编辑帖子</h2>
      <el-button type="primary" @click="submitForm" :loading="submitting" class="submit-btn">
        {{ submitting ? '发布中...' : '立即发布' }}
      </el-button>
    </div>

    <!-- 主体表单 -->
    <el-form ref="postForm" :model="form" :rules="rules" label-position="top" class="post-form">
      <!-- 标题输入 -->
      <el-form-item label="帖子标题" prop="title">
        <el-input v-model="form.title" placeholder="请输入标题（最多50字）" maxlength="50" show-word-limit clearable
          class="title-input" />
      </el-form-item>

      <!-- 内容编辑器 -->
      <el-form-item label="帖子内容" prop="content">
        <MdEditor :constEdit="form.content" @modelValue="uploadContent" />
        <div class="format-tips">
          <el-icon>
            <InfoFilled />
          </el-icon>
          <span>支持Markdown格式</span>
        </div>
      </el-form-item>

      <!-- 标签选择 -->
      <el-form-item label="添加标签" prop="tags">
        <el-select v-model="form.tags" multiple filterable allow-create placeholder="选择或输入标签（最多5个）" style="width: 100%"
          class="tag-selector">
          <el-option v-for="tag in popularTags" :key="tag" :label="tag" :value="tag" />
        </el-select>
        <div class="tag-tips">热门标签：{{ popularTags.join(' / ') }}</div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getPostByIdApi, editPostApi } from '@/api/post';
import { useRouter } from 'vue-router';
import MdEditor from '@/components/MdEditor.vue'

const router = useRouter()
// 表单数据
const form = ref({
  title: '',
  content: '',
  tags: [],
})
const getPostData = async () => {
  const id = router.currentRoute.value.query.id
  try {
    const res = await getPostByIdApi({id:id})
    form.value.content = res.data.data.content
    form.value.title = res.data.data.title
    form.value.tags = res.data.data.tagList
    console.log('帖子详情', res)
  } catch (error) {
    console.error('获取帖子详情失败', error)
  }
}
onMounted(() => {
  getPostData()
})
function uploadContent(data) {
  form.value.content = data
}

// 验证规则
const rules = reactive({
  title: [
    { required: true, message: '标题不能为空', trigger: 'blur' },
    { min: 5, max: 50, message: '长度在5到50个字符', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '内容不能为空', trigger: 'blur' },
    { min: 20, message: '内容至少20个字符', trigger: 'blur' }
  ],
  tags: [
    { type: 'array', max: 5, message: '最多选择5个标签', trigger: 'change' }
  ]
})

// 热门标签
const popularTags = ref([
  'AI技术', '深度学习', '算法交流',
  '项目协作', '数据资源', '经验分享'
])

// 提交状态
const submitting = ref(false)

console.log('当前路由参数:', router.currentRoute.value.query)
// 提交表单
const postid = router.currentRoute.value.query.id
const submitForm = async () => {
  try {
    submitting.value = true
    // 提交逻辑
    const res = await editPostApi({...form.value, id: postid})
    console.log(res)
    if (res.data.code !== 0) {
      ElMessage.error('发布失败，请稍后重试')
    } else {
      ElMessage.success('发布成功！')
    }
    // router.push('/community')
  } catch (error) {
    console.log(error)
    ElMessage.error('请完善必填内容')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.post-container {
  width: 100%;
  margin: 20px auto;
  padding: 30px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.post-title {
  font-size: 24px;
  color: #1a1a1a;
  margin: 0;
}

.submit-btn {
  padding: 12px 36px;
  border-radius: 8px;
  font-size: 16px;
  background: #5147ff;
  transition: all 0.3s ease;
}

.submit-btn:hover {
  background: #4538ff;
  transform: translateY(-2px);
}

.post-form {
  margin-top: 20px;
}

.title-input {
  font-size: 16px;
}

.content-editor {
  font-size: 14px;
  line-height: 1.6;
}

.format-tips {
  margin-top: 8px;
  color: #666;
  font-size: 12px;
  display: flex;
  align-items: center;

  .el-icon {
    margin-right: 6px;
    color: #999;
  }
}

.tag-selector {
  :deep(.el-tag) {
    background: #f0f2ff;
    color: #5147ff;
    border-color: #d9dcff;
  }
}

.tag-tips {
  margin-top: 8px;
  color: #999;
  font-size: 12px;
}

.image-uploader {
  :deep(.el-upload) {
    border: 2px dashed #eee;
    border-radius: 8px;
    transition: all 0.3s;

    &:hover {
      border-color: #5147ff;
    }
  }
}

.upload-tips {
  color: #999;
  font-size: 12px;
  margin-top: 8px;
}
</style>
