<template>
  <el-container>
    <el-header>
      <el-card style=" width: 1350px;height: 60px; margin-top: 1vh;">
      <h1 class="apptitle">应用管理</h1>

      </el-card>
    </el-header>
    <el-main style="width: 1380px;">
      <!-- 卡片容器 -->
      <el-card shadow="hover" style="border-radius: 8px;">
        <!-- 搜索栏 -->
        <el-row :gutter="20" style="margin-bottom: 20px;">
          <el-col :span="6">
            <el-input v-model="searchParams.uploader" placeholder="按作者搜索" clearable></el-input>
          </el-col>
          <el-col :span="6">
            <el-select v-model="searchParams.status" placeholder="按状态筛选" clearable>
              <el-option label="正常" value="active"></el-option>
              <el-option label="已下架" value="inactive"></el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-input v-model="searchParams.name" placeholder="按题目名称搜索" clearable></el-input>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-col>
        </el-row>

        <!-- 表格 -->
        <el-table
          v-loading="loading"
          stripe
          :data="filteredApplications"
          style="width: 100%"
          border
          :default-sort="{ prop: 'createdAt', order: 'descending' }"
        >
          <el-table-column
            prop="uploader"
            label="上传者"
            width="180"
            align="center"
            header-align="center"
          ></el-table-column>
          <el-table-column
            prop="questionCount"
            label="题目数量"
            width="130"
            align="center"
            header-align="center"
            sortable
          ></el-table-column>
          <el-table-column
            prop="name"
            label="题目名称"
            width="240"
            align="center"
            header-align="center"
          ></el-table-column>
          <el-table-column
            prop="answerCount"
            label="答题人数"
            width="130"
            align="center"
            header-align="center"
            sortable
          ></el-table-column>
          <el-table-column
            prop="createdAt"
            label="创建时间"
            width="240"
            align="center"
            header-align="center"
            sortable
          >
            <template #default="scope">
              {{ formatDate(scope.row.createdAt) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态"
            width="147"
            align="center"
            header-align="center"
          >
            <template #default="scope">
              <el-tag :type="scope.row.status === 'active' ? 'success' : 'danger'">
                {{ scope.row.status === 'active' ? '正常' : '已下架' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="auto"
            align="center"
            header-align="center"
          >
            <template #default="scope">
              <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button
                size="mini"
                :type="scope.row.status === 'active' ? 'danger' : 'success'"
                @click="toggleStatus(scope.row)"
              >
                {{ scope.row.status === 'active' ? '下架' : '恢复' }}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, computed } from 'vue';

// 应用数据

const applications = ref([
  {
    uploader: '张三',
    questionCount: 10,
    name: '数学题集',
    answerCount: 100,
    status: 'active',
    createdAt: '2023-10-01T08:00:00',
  },
  {
    uploader: '李四',
    questionCount: 5,
    name: '英语题集',
    answerCount: 50,
    status: 'inactive',
    createdAt: '2023-09-25T14:30:00',
  },
  {
    uploader: '王五',
    questionCount: 8,
    name: '物理题集',
    answerCount: 80,
    status: 'active',
    createdAt: '2023-10-05T10:15:00',
  },
  // 更多应用数据...
]);

// 搜索参数
const searchParams = ref({
  uploader: '', // 按作者搜索
  status: '', // 按状态筛选
  name: '', // 按题目名称搜索
});

// 加载状态
const loading = ref(false);

// 过滤后的应用列表
const filteredApplications = computed(() => {
  return applications.value.filter((app) => {
    const matchesUploader = app.uploader
      .toLowerCase()
      .includes(searchParams.value.uploader.toLowerCase());
    const matchesStatus = searchParams.value.status
      ? app.status === searchParams.value.status
      : true;
    const matchesName = app.name
      .toLowerCase()
      .includes(searchParams.value.name.toLowerCase());
    return matchesUploader && matchesStatus && matchesName;
  });
});

// 搜索
const handleSearch = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    console.log('搜索参数:', searchParams.value);
  }, 500);
};

// 重置搜索
const resetSearch = () => {
  searchParams.value = {
    uploader: '',
    status: '',
    name: '',
  };
};

// 编辑应用
const handleEdit = (row) => {
  console.log('编辑应用', row);
  // 这里可以跳转到编辑页面或弹出编辑对话框
};

// 切换应用状态（下架或恢复）
const toggleStatus = (row) => {
  row.status = row.status === 'active' ? 'inactive' : 'active';
  console.log('应用状态已更新', row);
};

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString(); // 根据本地时间格式化
};
</script>

<style scoped>
.apptitle{
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  margin-top: -20px;
  line-height: 60px;
  text-align: center;
}
.el-header {
  color: white;
  text-align: center;
  line-height: 60px;
  border-radius: 8px 8px 0 0;
}

.el-card {
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.el-table {
  margin-top: 20px;
}

.el-table--border {
  border: 1px solid #ebeef5;
}

.el-table th {
  background-color: #f5f7fa;
  font-weight: bold;
}

.el-table td,
.el-table th {
  padding: 12px 0;
}
</style>
