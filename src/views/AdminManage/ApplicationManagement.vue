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
            <el-input v-model="searchParams.id" placeholder="按应用ID搜索" clearable></el-input>
          </el-col>
          <el-col :span="5">
            <el-select
              v-model="searchParams.appType"
              placeholder="按应用类型筛选"
              clearable
              @change="handleAppTypeChange"
            >
              <el-option label="全部" value=""></el-option>
              <el-option label="系统测评" :value="0"></el-option>
              <el-option label="AI测评" :value="1"></el-option>
            </el-select>
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
          :data="tableData"
          style="width: 100%"
          border
          :default-sort="{ prop: 'id', order: 'descending' }"
        >
          <el-table-column
            prop="id"
            label="应用ID"
            width="200"
            align="center"
            header-align="center"
            sortable
          ></el-table-column>
          <el-table-column
            prop="userId"
            label="用户ID"
            width="200"
            align="center"
            header-align="center"
          ></el-table-column>
          <el-table-column
            prop="appName"
            label="应用名称"
            width="140"
            align="center"
            header-align="center"
          ></el-table-column>
          <el-table-column
            prop="appDesc"
            label="应用描述"
            width="250"
            align="center"
            header-align="center"
          ></el-table-column>
          <el-table-column
            label="应用图标"
            width="150"
            align="center"
            header-align="center"
          >
            <template #default="scope">
              <el-image
                style="width: 50px; height: 50px"
                :src="scope.row.appIcon || 'https://picsum.photos/120/120'"
                :preview-src-list="[scope.row.appIcon || 'https://picsum.photos/120/120']"
                fit="cover"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="appType"
            label="应用类型"
            width="120"
            align="center"
            header-align="center"
          >
            <template #default="scope">
              <el-tag>{{ getAppTypeName(scope.row.appType) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="240"
            align="center"
            header-align="center"
          >
            <template #default="scope">
              <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
              <el-popconfirm
                title="确定要删除该应用吗？"
                @confirm="handleDelete(scope.row)"
              >
                <template #reference>
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
          :total="totalCount"
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
        <el-form-item label="应用名称" prop="appName">
          <el-input v-model="currentApp.appName" placeholder="请输入应用名称"></el-input>
        </el-form-item>
        <el-form-item label="应用描述" prop="appDesc">
          <el-input
            v-model="currentApp.appDesc"
            placeholder="请输入应用描述"
            type="textarea"
            :rows="3"
          ></el-input>
        </el-form-item>
        <el-form-item label="应用图标">
          <div class="avatar-upload-container">
            <el-avatar
              :size="120"
              :src="currentApp.appIcon || 'https://picsum.photos/120/120'"
              class="profile-avatar"
            />
            <el-upload
              action="#"
              :show-file-list="false"
              :before-upload="handleAvatarUpload"
            >
              <el-button type="primary" size="small" class="mt-2">
                更换图标
              </el-button>
            </el-upload>
          </div>
        </el-form-item>
        <!-- 添加应用类型选择器 -->
        <el-form-item label="应用类型" prop="appType">
          <el-select v-model="currentApp.appType" placeholder="请选择应用类型">
            <el-option label="系统测评" value="0"></el-option>
            <el-option label="AI测评" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="评判标准" prop="scoringStrategy">
          <el-select v-model="currentApp.scoringStrategy" placeholder="请选择评判标准">
            <el-option label="打分类" value="0"></el-option>
            <el-option label="测评类" value="1"></el-option>
          </el-select>
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
import { ref, computed, reactive, nextTick, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { listAppByPage, addApp, deleteApp } from '../../api/app.js';
import { commonController } from '../../api/user.js';

// 表格数据
const tableData = ref([]);
const totalCount = ref(0);

// 搜索参数
const searchParams = ref({
  id: '',
  userId: '',
  appType: null,
  appName: '',
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
  id: 0,
  appName: '',
  appDesc: '',
  appIcon: '',
  appType: '',
  scoringStrategy: 0,
});

// 表单验证规则
const formRules = {
  appName: [
    { required: true, message: '请输入应用名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在2到50个字符', trigger: 'blur' }
  ],
  appDesc: [
    { required: true, message: '请输入应用描述', trigger: 'blur' },
    { min: 5, max: 200, message: '长度在5到200个字符', trigger: 'blur' }
  ],
  appIcon: [
    { required: true, message: '请上传应用图标', trigger: 'change' }
  ],
  appType: [
    { required: true, message: '请选择应用类型', trigger: 'change' }
  ],
  scoringStrategy: [
    { required: true, message: '请选择评判标准', trigger: 'change' }
  ]
};

const handleAppTypeChange = (value) => {
  searchParams.value.appType = value === '' ? null : parseInt(value, 10);
  handleSearch();
};

// 获取应用类型名称
const getAppTypeName = (type) => {
  const types = {
    0: '系统测评',
    1: 'AI测评'
  };
  return types[type] || '未知类型';
};

// 计算对话框标题
const dialogTitle = computed(() => {
  return isAdd.value ? '新增应用' : `编辑应用 - ${currentApp.appName}`;
});

// 搜索
const handleSearch = async () => {
  currentPage.value = 1; // 搜索时重置到第一页
  await loadApplications();
};

// 重置搜索
const resetSearch = () => {
  searchParams.value = {
    id: '',
    userId: '',
    appType: null,
    appName: '',
  };
  currentPage.value = 1;
  loadApplications();
};

// 分页处理
const handleSizeChange = (newSize) => {
  pageSize.value = newSize;
  currentPage.value = 1; // 改变每页大小时重置到第一页
  loadApplications();
};

const handleCurrentChange = (newPage) => {
  currentPage.value = newPage;
  loadApplications();
};

// 新增应用
const handleAdd = () => {
  isAdd.value = true;
  Object.assign(currentApp, {
    id: 0,
    appName: '',
    appDesc: '',
    appIcon: '',
    appType: '',
    scoringStrategy: 0
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
    const response = await deleteApp({ id: row.id });
    console.log('删除应用响应:', response);

    if (response && response.data.code === 0) {
      ElMessage.success('应用删除成功');
      // 重新加载当前页数据
      await loadApplications();

      // 如果当前页没有数据了，且不是第一页，则返回上一页
      if (tableData.value.length === 0 && currentPage.value > 1) {
        currentPage.value -= 1;
        await loadApplications();
      }
    } else {
      ElMessage.error(response ? response.data.message || '删除应用失败' : '删除应用失败');
    }
  } catch (error) {
    console.error('删除应用失败', error);
    ElMessage.error('删除应用失败: ' + (error.message || '未知错误'));
  } finally {
    loading.value = false;
  }
};

// 保存应用
const saveApp = async () => {
  if (!formRef.value) {
    ElMessage.warning('表单引用不存在');
    return;
  }
  try {
    await formRef.value.validate();
  } catch (error) {
    console.error('表单验证失败', error);
    ElMessage.warning('请填写完整且正确的表单信息');
    return;
  }

  loading.value = true;
  try {
    if (isAdd.value) {
      const response = await addApp({
        appDesc: currentApp.appDesc,
        appIcon: currentApp.appIcon,
        appName: currentApp.appName,
        appType: currentApp.appType,
        scoringStrategy: currentApp.scoringStrategy
      });

      if (response && response.data.code === 0) {
        ElMessage.success('应用添加成功');
        // 重新加载数据，回到第一页
        currentPage.value = 1;
        await loadApplications();
      } else {
        ElMessage.error(response ? response.message || '添加应用失败' : '添加应用失败');
      }
    } else {
      // 编辑应用逻辑保持不变
      const index = tableData.value.findIndex(app => app.id === currentApp.id);
      if (index !== -1) {
        tableData.value[index] = { ...currentApp };
        ElMessage.success('应用信息更新成功');
      }
    }

    dialogVisible.value = false;
  } catch (error) {
    ElMessage.error('操作失败: ' + (error.message || '未知错误'));
  } finally {
    loading.value = false;
  }
};

// 加载应用列表
const loadApplications = async () => {
  try {
    loading.value = true;
    const params = {
      current: currentPage.value,
      pageSize: pageSize.value,
      ...searchParams.value
    };

    // 明确处理appType，null时不传递
    if (params.appType === null) {
      delete params.appType;
    }

    console.log('请求参数:', params);

    const res = await listAppByPage(params);
    console.log('获取应用列表响应:', res.data.data);

    if (res && res.data && res.data.data) {
      tableData.value = res.data.data.records;
      totalCount.value =  parseInt(res.data.data.total) ;
    } else {
      console.error('响应数据结构不符合预期:', res);
      ElMessage.error('获取应用列表失败: 响应数据结构不符合预期');
    }
  } catch (error) {
    console.error('获取应用列表失败', error);
    ElMessage.error('获取应用列表失败:'+ (error.message || '未知错误'));
  } finally {
    loading.value = false;
  }
};

// 处理头像上传
const handleAvatarUpload = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await commonController(formData);
    console.log('头像上传响应:', response);
    if (response.data.code === 0) {
      currentApp.appIcon = response.data.data;
      console.log('头像上传成功:', currentApp.appIcon);
      ElMessage.success('图标上传成功');
    } else {
      ElMessage.error(response.message || '图标上传失败');
    }
  } catch (error) {
    console.error('图标上传出错', error);
    ElMessage.error('图标上传出错: ' + (error.message || '未知错误'));
  }
  return false;
};

onMounted(async () => {
  await loadApplications();
});
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

.avatar-upload-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-avatar {
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
  margin-bottom: 10px;
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
