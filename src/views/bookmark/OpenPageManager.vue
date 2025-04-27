<template>
    <div style="display: flex; flex-direction: column; width: 80%; max-width: 1200px; margin: 0 auto;">
        <div class="head">
            <div class="vertical-bar long"></div>
            <div class="vertical-bar short"></div>
            <span class="title">窗口管理</span>
        </div>
        <div style="margin-top: 10px;margin-left: 20px;">
            <el-button type="primary" @click="addpage()">创建新窗口</el-button>
        </div>
        <div class="content">
            <div class="card-grid">
                <el-card v-for="item in list" :key="item.id" class="window-card">
                    <div class="card-header">
                        <div class="window-title">{{ item.title }}</div>
                    </div>
                    <div class="card-body">
                        <div class="window-info">窗口名称: {{ item.title }}</div>
                    </div>
                    <div class="card-footer">
                        <div class="manage-button">
                            <el-button type="primary" @click="handlemessage(item.id)">管理</el-button>
                            <el-button type="danger" @click="handleDelete(item.id)">删除</el-button>
                        </div>
                    </div>
                </el-card>
            </div>
        </div>
        <el-dialog title="编辑聊天窗口" v-model="dialogVisible" width="400px" :close-on-click-modal="false" center>
            <div class="dialog-content">
                <el-input v-model="newChat" placeholder="请输入窗口名称" clearable size="large" />
            </div>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="newhandlemessage" :disabled="!newChat.trim()">编辑</el-button>
                </div>
            </template>
        </el-dialog>
         <el-dialog title="新建聊天窗口" v-model="dialogV" width="400px" :close-on-click-modal="false" center>
            <div class="dialog-content">
                <el-input v-model="addChat" placeholder="请输入窗口名称" clearable size="large" />
            </div>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="newpages" :disabled="!addChat.trim()">创建</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { listMyChatWindowsVOByPage, deleteChatWindows, editChatWindows ,addChatWindows} from "@/api/chat.js"
import { ElMessage } from 'element-plus'
const list = ref([])
const dialogVisible = ref(false)
const dialogV = ref(false)
const newChat = ref('')
const addChat = ref('')
const pageid = ref()

const getList = async () => {
    const { data } = await listMyChatWindowsVOByPage({ pageSize: 10 })
    console.log(data.data.records)
    list.value = data.data.records
}
// 创建
const addpage = () => {
    dialogV.value = true
}
const newpages = async () => {
    const data = {
        title: addChat.value,
        type: 0,
        userId: localStorage.getItem('userId')
    }
    const {data:{code}} = await addChatWindows(data)
    if (code === 0) {
        ElMessage({
            message: '创建成功',
            type:'success',
            duration: 2000,
        })
        dialogV.value = false
        getList()
    }
}
// 删除
const handleDelete = async (id) => {
    const { data: { code } } = await deleteChatWindows({ id: id })
    if (code === 0) {
        ElMessage({
            message: '删除成功',
            type: 'success',
            duration: 2000,
        })
        getList()
    }
}

// 管理
// 通过本地存储获取用户id
const userId = localStorage.getItem('userId')
const handlemessage = (id) => {
    console.log(id)
    dialogVisible.value = true
    pageid.value = id
}

// 编辑
const newhandlemessage = async () => {
    const data = {
        id: pageid.value,
        title: newChat.value,
        type: 0,
        userId: userId
    }
    const { data: { code } } = await editChatWindows(data)
    if (code === 0) {
        ElMessage({
            message: '编辑成功',
            type: 'success',
            duration: 2000,
        })
        dialogVisible.value = false
        // 重新获取列表
        getList()
    }
}

onMounted(() => {
    getList()
})
</script>

<style scoped>
.head {
    width: 100%;
    display: flex;
    align-items: center;
    margin-top: 20px;
    padding: 15px 20px;
    background-color: #f8f9fa;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.vertical-bar {
    border-radius: 3px;
    margin-right: 10px;
}

.long {
    width: 6px;
    height: 60px;
    background-color: #409EFF;
}

.short {
    width: 5px;
    height: 30px;
    background-color: #409EFF;
}

.title {
    max-width: 160px;
    font-size: 16px;
    margin-left: 20px;
    font-weight: 600;
    color: #333;
    letter-spacing: 1px;
}

.content {
    width: 100%;
    padding: 20px;
    border-radius: 8px;
    margin-top: 10px;
    box-sizing: border-box;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
}

.window-card {
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
    overflow: hidden;
}

.window-card:hover {
    transform: translateY(-5px);
}

.card-header {
    padding: 15px;
    background-color: #f0f0f0;
    border-bottom: 1px solid #e0e0e0;
}

.window-title {
    font-size: 18px;
    font-weight: 600;
    color: #333;
}

.card-body {
    padding: 15px;
}

.window-info {
    font-size: 14px;
    color: #666;
}

.card-footer {
    padding: 15px;
    border-top: 1px solid #e0e0e0;
    display: flex;
    justify-content: space-around;
}

.manage-button {
    display: flex;
    gap: 10px;
}

.el-button {
    border-radius: 6px;
    transition: background-color 0.3s ease;
}

.el-button.primary {
    background-color: #409EFF;
    border-color: #409EFF;
}

.el-button.primary:hover {
    background-color: #3a8ee6;
    border-color: #3a8ee6;
}

.el-button.danger {
    background-color: #f56c6c;
    border-color: #f56c6c;
}

.el-button.danger:hover {
    background-color: #e45e5e;
    border-color: #e45e5e;
}

.el-dialog__title {
    font-size: 18px;
    font-weight: 600;
    color: #333;
}

.dialog-content {
    padding: 20px;
}

.dialog-footer {
    padding: 20px;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}
</style>
