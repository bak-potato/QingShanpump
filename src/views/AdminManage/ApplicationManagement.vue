<template>
  <el-container>
    <el-header>
      <el-card style="width: 1350px; height: 60px; margin-top: 1vh;">
        <h1 class="apptitle">应用管理</h1>
      </el-card>
    </el-header>
    <el-main style="width: 1380px;">
      <!-- 卡片容器 -->
      <el-card shadow="hover" style="border-radius: 8px;">
        <!-- 搜索栏和操作按钮 -->
        <el-row :gutter="20" style="margin-bottom: 20px;">
          <el-col :span="5">
            <el-input v-model="searchParams.uploader" placeholder="按作者搜索" clearable></el-input>
          </el-col>
          <el-col :span="5">
            <el-select v-model="searchParams.status" placeholder="按状态筛选" clearable>
              <el-option label="全部" value=""></el-option>
              <el-option label="正常" value="active"></el-option>
              <el-option label="已下架" value="inactive"></el-option>
            </el-select>
          </el-col>
          <el-col :span="5">
            <el-input v-model="searchParams.name" placeholder="按题目名称搜索" clearable></el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-col>
          <el-col :span="5" style="text-align: right;">
            <el-button type="success" @click="handleAdd">新增应用</el-button>
          </el-col>
        </el-row>

        <!-- 表格 -->
        <el-table
          v-loading="loading"
          stripe
          :data="paginatedApplications"
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
            width="240"
            align="center"
            header-align="center"
          >
            <template #default="scope">
              <!-- 将 size="mini" 修改为 size="small" -->
              <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button
                size="small"
                :type="scope.row.status === 'active' ? 'danger' : 'success'"
                @click="toggleStatus(scope.row)"
              >
                {{ scope.row.status === 'active' ? '下架' : '恢复' }}
              </el-button>
              <el-popconfirm
                title="确定要删除该应用吗？"
                @confirm="handleDelete(scope.row)"
              >
                <template #reference>
                  <!-- 将 size="mini" 修改为 size="small" -->
                  <el-button size="small" type="danger">删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-pagination
          class="pagination"
          :current-page="currentPage"
          :page-sizes="[5, 10, 20, 50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="filteredApplications.length"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-card>
    </el-main>

    <!-- 编辑/添加对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form
        :model="currentApp"
        label-width="100px"
        :rules="formRules"
        ref="formRef"
      >
        <el-form-item label="上传者" prop="uploader">
          <el-input v-model="currentApp.uploader" placeholder="请输入上传者姓名"></el-input>
        </el-form-item>
        <el-form-item label="题目名称" prop="name">
          <el-input v-model="currentApp.name" placeholder="请输入题目名称"></el-input>
        </el-form-item>
        <el-form-item label="题目数量" prop="questionCount">
          <el-input-number
            v-model="currentApp.questionCount"
            :min="1"
            :max="1000"
            controls-position="right"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="答题人数" prop="answerCount">
          <el-input-number
            v-model="currentApp.answerCount"
            :min="0"
            :max="100000"
            controls-position="right"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="currentApp.status" placeholder="请选择状态">
            <el-option label="正常" value="active"></el-option>
            <el-option label="已下架" value="inactive"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间" v-if="!isAdd">
          <el-date-picker
            v-model="currentApp.createdAt"
            type="datetime"
            disabled
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveApp">保存</el-button>
      </template>
    </el-dialog>
  </el-container>
</template>

<script setup>
import { ref, computed, reactive, nextTick } from 'vue';
import { ElMessage } from 'element-plus';

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
]);

// 搜索参数
const searchParams = ref({
  uploader: '',
  status: '',
  name: '',
});

// 分页相关
const currentPage = ref(1);
const pageSize = ref(10);

// 加载状态
const loading = ref(false);

// 对话框相关
const dialogVisible = ref(false);
const isAdd = ref(false);
const formRef = ref(null);
const currentApp = reactive({
  uploader: '',
  questionCount: 1,
  name: '',
  answerCount: 0,
  status: 'active',
  createdAt: new Date().toISOString()
});

// 表单验证规则
const formRules = {
  uploader: [
    { required: true, message: '请输入上传者姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在2到20个字符', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入题目名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在2到50个字符', trigger: 'blur' }
  ],
  questionCount: [
    { required: true, message: '请输入题目数量', trigger: 'blur' }
  ],
  answerCount: [
    { required: true, message: '请输入答题人数', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
};

// 计算对话框标题
const dialogTitle = computed(() => {
  return isAdd.value ? '新增应用' : `编辑应用 - ${currentApp.name}`;
});

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

// 分页后的应用列表
const paginatedApplications = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredApplications.value.slice(start, end);
});

// 搜索
const handleSearch = () => {
  loading.value = true;
  setTimeout(() => {
    currentPage.value = 1;
    loading.value = false;
  }, 500);
};

// 重置搜索
const resetSearch = () => {
  searchParams.value = {
    uploader: '',
    status: '',
    name: '',
  };
  currentPage.value = 1;
};

// 分页处理
const handleSizeChange = (newSize) => {
  pageSize.value = newSize;
  currentPage.value = 1;
};

const handleCurrentChange = (newPage) => {
  currentPage.value = newPage;
};

// 新增应用
const handleAdd = () => {
  isAdd.value = true;
  Object.assign(currentApp, {
    uploader: '',
    questionCount: 1,
    name: '',
    answerCount: 0,
    status: 'active',
    createdAt: new Date().toISOString()
  });
  dialogVisible.value = true;

  nextTick(() => {
    if (formRef.value) {
      formRef.value.clearValidate();
    }
  });
};

// 编辑应用
const handleEdit = (row) => {
  isAdd.value = false;
  Object.assign(currentApp, JSON.parse(JSON.stringify(row)));
  dialogVisible.value = true;
};

// 删除应用
const handleDelete = async (row) => {
  loading.value = true;
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 500));
    applications.value = applications.value.filter(app => app.name !== row.name);
    ElMessage.success('应用删除成功');

    // 如果当前页没有数据了，且不是第一页，则返回上一页
    if (paginatedApplications.value.length === 0 && currentPage.value > 1) {
      currentPage.value -= 1;
    }
  } finally {
    loading.value = false;
  }
};

// 切换应用状态
const toggleStatus = async (row) => {
  loading.value = true;
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 500));
    row.status = row.status === 'active' ? 'inactive' : 'active';
    ElMessage.success(`应用已${row.status === 'active' ? '恢复' : '下架'}`);
  } finally {
    loading.value = false;
  }
};

// 保存应用
const saveApp = async () => {
  // 表单验证
  try {
    await formRef.value.validate();
  } catch (error) {
    console.error('表单验证失败', error);
    ElMessage.warning('请填写完整且正确的表单信息');
    return;
  }

  loading.value = true;
  try {
    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 500));

    if (isAdd.value) {
      // 检查名称是否已存在
      if (applications.value.some(app => app.name === currentApp.name)) {
        ElMessage.error('该题目名称已存在');
        return;
      }

      // 新增应用
      applications.value.push({
        ...currentApp,
        createdAt: new Date().toISOString()
      });
      ElMessage.success('应用添加成功');
    } else {
      // 编辑应用
      const index = applications.value.findIndex(app => app.name === currentApp.name);
      if (index !== -1) {
        applications.value[index] = { ...currentApp };
        ElMessage.success('应用信息更新成功');
      }
    }

    dialogVisible.value = false;
  } finally {
    loading.value = false;
  }
};

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};
</script>

<style scoped>
.apptitle {
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

.pagination {
  margin-top: 20px;
  justify-content: flex-end;
}

.operation-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .el-col {
    margin-bottom: 10px;
  }

  .el-button {
    width: 100%;
  }
}
</style>
