<template>
  <div class="userAdminmanage">
    <!-- 搜索栏 -->
    <div class="search-container">
      <el-input
        v-model="searchPhone"
        placeholder="手机号搜索"
        clearable
        style="width: 240px; margin-right: 15px"
      />
      <el-input
        v-model="searchAccount"
        placeholder="用户账号搜索"
        clearable
        style="width: 240px; margin-right: 15px"
      />
      <el-input
        v-model="searchName"
        placeholder="姓名搜索"
        clearable
        style="width: 240px; margin-right: 15px"
      />
      <el-button type="primary" @click="handleSearch">搜索</el-button>
    </div>

    <div class="usertable">
  <el-table  v-loading="loading" :data="filteredUserList" style="width: 100%">
    <el-table-column prop="id" label="序号" width="190" />
    <el-table-column prop="account" label="用户id" width="190" />
    <el-table-column prop="name" label="姓名" width="190" />
    <el-table-column prop="phone" label="手机号" width="190" />
    <el-table-column prop="role" label="角色" width="190" />
    <el-table-column prop="name" label="状态" width="190" />
    <el-table-column prop="createTime" label="创建时间" width="200" />
  </el-table>

    </div>


  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 模拟数据
const userList = ref([
  {
    id:0,
    account: 'admin',
    name: '张三',
    phone: '13800138000',
    role: '管理员',
    status: '正常',
    createTime: '2023-01-01 10:00:00'
  },
  {
    id:1,
    account: 'user001',
    name: '李四',
    phone: '13912345678',
    role: '普通用户',
    status: '禁用',
    createTime: '2023-02-15 14:30:00'
  }
  // 可继续添加更多测试数据...
])

// 搜索条件
const searchPhone = ref('')
const searchAccount = ref('')
const searchName = ref('')

// 过滤后的用户列表
const filteredUserList = computed(() => {
  return userList.value.filter(user => {
    const phoneMatch = searchPhone.value
      ? user.phone.includes(searchPhone.value)
      : true
    const accountMatch = searchAccount.value
      ? user.account.includes(searchAccount.value)
      : true
    const nameMatch = searchName.value
      ? user.name.includes(searchName.value)
      : true
    return phoneMatch && accountMatch && nameMatch
  })
})

// 搜索操作（实际开发中可替换为API请求）
const handleSearch = () => {
  // 这里可以添加API请求逻辑
  console.log('执行搜索:', {
    phone: searchPhone.value,
    account: searchAccount.value,
    name: searchName.value
  })
}
</script>

<style scoped>
.usertable{
  width: 1400px;
  height: 800px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);

  border-radius: 20px;
  background-color: rgb(255, 255, 255);
}
.userAdminmanage {
  width: 1400px;
  height: 80px;
  margin: 0px auto;
  margin-top: 1vh;
  border-radius: 20px;
  box-sizing: border-box;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
}

.search-container {
  display: flex;
  padding: 20px;

  align-items: center;
  margin-bottom: 20px;
}

.el-table {
  margin-top: 20px;
}

/* 响应式适配 */
@media (max-width: 1400px) {
  .userAdminmanage {
    width: 100%;
    min-width: auto;
    margin: 10px;
    height: auto;
    min-height: 98vh;
  }
}
</style>
