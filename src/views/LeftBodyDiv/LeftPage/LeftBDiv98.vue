<template>
  <div class="lefymenu">

      <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner"></div>
    </div>
    <!-- 1 -->
    <div class="leftmenu1">
      <h3>聊天窗口</h3>
      <h4 @click="handleddd" style="font-size:12px;position:absolute;color:#409eff;right:10px;top:20px;">新建</h4>
      <el-select
        v-model="value1"
        placeholder="对象"
        size="large"
        style="border:none;margin-left:-10px;width:180px"
        @change="handleSelectChange"
        :disabled="isLoading"
      >
        <el-option
          v-for="item in options1"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          class="custom-option"
        >
          <div class="option-content">
            <span>{{ item.label }}</span>
            <el-icon class="close-icon" @click.stop="handleDelete(item.value)">
              <Close />
            </el-icon>
          </div>
        </el-option>
      </el-select>
    </div>

    <div class="leftmenu2">
      <h3>模型</h3>
      <el-select v-model="value2" placeholder="glm-4-plus" size="large"
        style="border:none; margin-left: -10px; width: 180px">
        <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>
    <!-- 3 -->
    <div class="leftmenu3">
      <h3>多轮对话</h3><el-switch style="position: absolute;right: 10px;" v-model="value3" />
    </div>
    <hr style="border:1px solid #e0e0e0; margin-top: 10px;">
    <!-- 4 -->
    <h1>参数设置</h1>
    <div class="leftmenu4">
      <h3>system_prompt</h3>
      <el-input v-model="textarea" style="margin-left: -12px; width: 180px" :rows="2" type="textarea"
        placeholder="Please input" />
    </div>
    <!-- 5 -->
    <div class="leftmenu4">
      <h3>max_tokens </h3>
      <el-slider v-model="value4"  />
    </div>
    <!-- 6 -->
    <div class="leftmenu4">
      <h3>temperature </h3>
      <el-slider v-model="value5"  />
    </div>
    <!-- 7 -->
    <div class="leftmenu4">
      <h3>top_p </h3>
      <el-slider v-model="value6" />
    </div>
    <hr style="border:1px solid #e0e0e0; margin-top: 10px;">

    <h1>工具调用</h1>
    <div class="leftmenu3">
      <h3>网页检索</h3><el-switch style="position: absolute;right: 10px;" v-model="value7" />
    </div>
    <div class="leftmenu3">
      <h3>知识库检索</h3><el-switch style="position: absolute;right: 10px;" v-model="value8" />
    </div>
    <div class="leftmenu3">
      <h3>函数调用</h3><el-switch style="position: absolute;right: 10px;" v-model="value9" />
    </div>

    <div class="leftmenu3">
      <h3>生成分享二维码</h3>
      <QRCodeShare style="margin-top: -30px;" :config="currentConfig" />
    </div>
  </div>
<el-dialog
    title="创建新聊天窗口"
    v-model="dialogVisible"
    width="400px"
    :close-on-click-modal="false"
    center
  >
    <div class="dialog-content">
      <el-input
        v-model="newChat"
        placeholder="请输入窗口名称"
        clearable
        size="large"
        @keyup.enter="handleCreate"
      />
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="handleCreate"
          :disabled="!newChat.trim()"
        >
          创建
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import QRCodeShare from '../../../components/share/QRCodeShare.vue'
import { listMyChatWindowsVOByPage } from '../../../api/chat.js'
import { useRouter, useRoute } from 'vue-router'
import { addChatWindows, deleteChatWindows } from '../../../api/chat.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Close } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const isLoading = ref(false) // 加载状态
const dialogVisible = ref(false)
const value1 = ref('')
const value2 = ref('')
const value3 = ref(false)
const value4 = ref(100)
const value5 = ref(100)
const value6 = ref(100)
const value7 = ref(false)
const value8 = ref(false)
const value9 = ref(false)
const textarea = ref('')
const newChat = ref('')
const userId = ref()
const options1 = ref([])

const options2 = [
  { value: 'glm-4-plus', label: 'glm-4-plus' },
  { value: 'Option2', label: 'Option2' },
  { value: 'Option3', label: 'Option3' },
  { value: 'Option4', label: 'Option4' },
  { value: 'Option5', label: 'Option5' }
]

const currentConfig = computed(() => ({
  webSearch: value7.value,
  knowledgeBase: value8.value,
  functionCall: value9.value
}))

const handleSelectChange = async (selectedValue) => {
  if (selectedValue) {
    isLoading.value = true // 显示加载动画

    // 等待1秒显示加载动画
    await new Promise(resolve => setTimeout(resolve, 1000))

    router.push({
      path: '/AIGirlfriend',
      query: {
        chatId: selectedValue,
        title: options1.value.find(item => item.value === selectedValue)?.label || ''
      }
    })

    isLoading.value = false // 隐藏加载动画

    // 延迟50毫秒后刷新页面
    setTimeout(() => {
      window.location.reload()
    }, 50)
  }
}

const handleddd = () => {
  dialogVisible.value = true
}

const handleCreate = async () => {
  if (newChat.value.trim()) {
    userId.value = localStorage.getItem('userId')

    try {
      const res = await addChatWindows({
        title: newChat.value,
        type: 1,
        userId: userId.value
      })
      console.log('创建窗口成功:', res.data.data)
      newChat.value = ''
      dialogVisible.value = false
      await fetchChatWindows()

      if (options1.value.length > 0) {
        value1.value = options1.value[options1.value.length - 1].value
      }
    } catch (error) {
      console.error('创建窗口失败:', error)
    }
  }
}

const fetchChatWindows = async () => {
  try {
    const res = await listMyChatWindowsVOByPage({ pageSize: 10 })

    if (res.data.data.records.length === 0) {
      dialogVisible.value = true
      handleCreate()
    }

    options1.value = res.data.data.records.map(item => ({
      value: item.id,
      label: item.title
    }))

    const chatId = route.query.chatId
    if (chatId) {
      const selectedOption = options1.value.find(item => item.value === chatId)
      if (selectedOption) {
        value1.value = selectedOption.value
      }
    } else if (options1.value.length > 0) {
      // If no route parameters, automatically use the first chat window
      const firstChat = options1.value[0]
      value1.value = firstChat.value
      router.push({
        path: '/AIGirlfriend',
        query: {
          chatId: firstChat.value,
          title: firstChat.label
        }
      })
    }
  } catch (error) {
    console.error('获取聊天窗口失败:', error)
  }
}

const handleDelete = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除此聊天窗口吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await deleteChatWindows({ id })

    ElMessage({
      message: '删除成功',
      type: 'success',
      duration: 2000,
      customClass: 'delete-message'
    })

    if (value1.value === id) {
      value1.value = ''
    }

    await fetchChatWindows()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

onMounted(fetchChatWindows)
</script>

<style scoped>
/* 新增加载动画样式 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #ff85a2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  margin-top: 15px;
  color: #ff85a2;
  font-size: 16px;
  font-weight: bold;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
/* 删除消息动画 */
.delete-message {
  animation: fadeInUp 0.5s, fadeOut 0.5s 1.5s;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

/* 删除项动画 */
.list-leave-active {
  transition: all 0.5s;
}
.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
/* 添加这些样式 */
.custom-option {
  height: 36px;
  line-height: 36px;
  padding: 0 10px;
}

.option-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.close-icon {
  cursor: pointer;
  color: #999;
}

.close-icon:hover {
  color: #ff4d4f;
}
.flexds {
  position: relative;
  height: 30px;
  display: flex;
}
.dialog-content {
  padding: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 10px 20px 20px;
}

.leftmenu4{
  margin-top: 15px;
}
h1{
  font-size: 12px;
  position: relative;
  color: rgb(140, 140, 140);
  font-weight: 600;
  margin-top: 20px;
  left: -10px;
}
.leftmenu3{
  margin-top: 10px;
  display: flex;
  justify-self: center;
  align-items: center;
  width: 150px;
  height: 40px;
}
.leftmenu2{
  margin-top: 20px;
}
h3{
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 5px;
  position: relative;
  left: -10px;
}
.lefymenu {
  width: 150px;
}
</style>
