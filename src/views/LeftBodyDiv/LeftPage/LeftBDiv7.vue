<template>
    <el-menu>
        <el-sub-menu index="1">
            <template #title>
                <el-icon><user/></el-icon>
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
    <el-button type="primary" style="left: 0px;height: 40px; position: absolute; bottom: 0px; width: 200px; margin-left: 0px; border-radius: 0px 0px 9px 9px" @click="searchUser">搜索好友</el-button>
</template>

<script setup>
import { useRouter } from 'vue-router'; // 引入路由
const router = useRouter(); // 创建路由实例
const handleaa = () => {
    router.push('/FriendVue'); // 跳转到 /friend 路由
};
const searchUser = () => {
    // 跳转到 /search 路由
    router.push('/SearchFriend');
}

</script>

<style scoped>
.el-menu {
    border-right: 10px;
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
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
</style>
