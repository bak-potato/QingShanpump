<template>
    <div class="friend-container">
        <el-menu>
            <el-sub-menu index="1">
                <template #title>
                    <el-icon><User/></el-icon>
                    <span>我的好友</span>
                </template>
                <el-menu-item @click="handleaa" index="1-1">
                    <img src="/src/images/RC.jpg" alt="" style="width: 40px;height:40px;border-radius: 50%;margin-left: -20px;">
                    <div>
                        <span class="text">张三</span>
                    </div>
                </el-menu-item>
                <el-menu-item index="1-2">
                    <img src="/src/images/RC.jpg" alt="" style="width: 40px;height:40px;border-radius: 50%;margin-left: -20px;">
                    <div>
                        <span class="text">张三</span>
                    </div>
                </el-menu-item>
                <el-menu-item index="1-3">
                    <img src="/src/images/RC.jpg" alt="" style="width: 40px;height:40px;border-radius: 50%;margin-left: -20px;">
                    <div>
                        <span class="text">张三</span>
                    </div>
                </el-menu-item>
                <el-menu-item index="1-4">
                    <img src="/src/images/RC.jpg" alt="" style="width: 40px;height:40px;border-radius: 50%;margin-left: -20px;">
                    <div>
                        <span class="text">张三</span>
                    </div>
                </el-menu-item>
            </el-sub-menu>
        </el-menu>
        <div class="button-group">
            <el-button type="info" :icon="User" circle @click="Shen" />
            <el-button type="danger" :icon="Delete" circle @click="deleteFriend" />
            <el-button :icon="Search" circle @click="searchUser" />
        </div>
    </div>


    <el-dialog title="好友申请" v-model="dialogShen" class="custom-dialog">
        <div class="friend-list">
            <div class="friend-item" v-for="friend in friendRequests" :key="friend.id">
                <div class="friend-info">
                    <img :src="friend.avatar" class="friend-avatar">
                    <span class="friend-name">{{ friend.name }}</span>
                </div>
                <div class="friend-actions">
                    <el-button type="success" size="small" plain>同意</el-button>
                    <el-button type="danger" size="small" plain>拒绝</el-button>
                </div>
            </div>
        </div>
        <template #footer>
            <el-button @click="dialogShen = false">关闭</el-button>
        </template>
    </el-dialog>

    <el-dialog title="删除好友" v-model="dialogDelete" class="custom-dialog">
        <div class="friend-list">
            <div class="friend-item" v-for="friend in friends" :key="friend.id">
                <div class="friend-info">
                    <img :src="friend.avatar" class="friend-avatar">
                    <span class="friend-name">{{ friend.name }}</span>
                </div>
                <el-button type="danger" size="small" plain @click="deleteFriend">删除</el-button>
            </div>
        </div>
        <template #footer>
            <el-button @click="dialogDelete = false">关闭</el-button>
        </template>
    </el-dialog>
</template>

<script setup>
import { useRouter } from 'vue-router'; // 引入路由
import { User, Delete, Search } from '@element-plus/icons-vue';//引入图标
import { ref } from 'vue';
const dialogDelete = ref(false);//控制删除好友的弹出框
const dialogShen = ref(false);//控制好友申请的弹出框
const router = useRouter(); // 创建路由实例
const handleaa = () => {
    router.push('/FriendVue'); // 跳转到 /friend 路由
};
const searchUser = () => {
    // 跳转到 /search 路由
    router.push('/SearchFriend');
}
const Shen = () => {
    dialogShen.value = true;
}
const deleteFriend = () => {
    dialogDelete.value = true;
};
// 模拟删除好友数据
const friends = ref([
    { id: 1, name: '张三', avatar: '/src/images/RC.jpg' },
    { id: 2, name: '李四', avatar: '/src/images/RC.jpg' }
]);
// 模拟好友申请数据
const friendRequests = ref([
    { id: 1, name: '王五', avatar: '/src/images/RC.jpg' },
    { id: 2, name: '赵六', avatar: '/src/images/RC.jpg' }
])
</script>

<style scoped>
.friend-container {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.el-menu {
    border-right: 10px;
    margin-top: 10px;
}

.el-menu-item {
    height: 60px;
    margin-top: 10px;
    display: flex;
    align-items: center;
}

.el-menu-item div {
    display: flex;
    margin-left: 10px;
    flex-direction: column;
}

.span {
    font-size: 12px;
    color: #999;
    max-width: 100px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0 auto;
}

.text {
    font-size: 16px;
    line-height: 10px;
}

.el-input-group {
    margin-top: 20px;
    width: 100%;
}

.custom-dialog {
    border-radius: 8px;
}

.custom-dialog :deep(.el-dialog__header) {
    border-bottom: 1px solid #eee;
    margin: 0;
    padding: 16px 24px;
}

.custom-dialog :deep(.el-dialog__body) {
    padding: 16px 24px;
}

.custom-dialog :deep(.el-dialog__footer) {
    border-top: 1px solid #eee;
    padding: 16px 24px;
}

/* 好友列表容器 */
.friend-list {
    max-height: 400px;
    overflow-y: auto;
}

/* 好友项通用样式 */
.friend-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px;
    margin: 8px 0;
    background: #f8f9fa;
    border-radius: 8px;
    transition: all 0.3s;
}

.friend-item:hover {
    background: #f1f3f5;
    transform: translateX(4px);
}

/* 好友信息部分 */
.friend-info {
    display: flex;
    align-items: center;
    gap: 12px;
}

.friend-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #e9ecef;
}

.friend-name {
    font-size: 15px;
    font-weight: 500;
    color: #212529;
}

/* 操作按钮区域 */
.friend-actions {
    display: flex;
    gap: 8px;
}

.button-group {
    display: flex;
    gap: 10px;
    padding: 10px;
}
</style>
