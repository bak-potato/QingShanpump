<template>
  <div class="post-management">
    <div class="header">
      <h2>帖子管理</h2>
      <div class="search-container">
        <el-button type="primary" @click="router.push('/createpost')" style="margin-right: 10px;">添加帖子</el-button>
        <el-input
          v-model="searchId"
          placeholder="请输入帖子ID搜索"
          clearable
          style="width: 300px"
          @keyup.enter="handleSearch"
          @clear="handleClearSearch"
        >
          <template #append>
            <el-button :icon="Search" @click="handleSearch" />
          </template>
        </el-input>
      </div>
    </div>

    <el-table :data="tableData" border style="width: 100%" v-loading="loading">
      <el-table-column prop="id" label="帖子ID" width="170" />
      <el-table-column prop="userName" label="用户名称" width="160" />
      <el-table-column prop="title" label="帖子标题" width="200" />
      <el-table-column label="标签" width="200">
        <template #default="{ row }">
          <el-tooltip
            effect="dark"
            :content="getAllTags(row.tags)"
            placement="top"
            :disabled="getTagCount(row.tags) <= 2"
          >
            <div class="tags-container">
              <el-tag
                v-for="(tag, index) in getLimitedTags(row.tags)"
                :key="index"
                style="margin-right: 5px;"
              >
                {{ tag }}
              </el-tag>
              <span v-if="getTagCount(row.tags) > 2" class="more-tags">...</span>
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="thumbNum" label="点赞数" width="100" align="center">
        <template #default="{ row }">
          <el-icon><Star /></el-icon> {{ row.thumbNum }}
        </template>
      </el-table-column>
      <el-table-column prop="favourNum" label="收藏数" width="100" align="center">
        <template #default="{ row }">
          <el-icon><Collection /></el-icon> {{ row.favourNum }}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="170">
        <template #default="{ row }">
          {{ formatDate(row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160" fixed="right">
        <template #default="{ row }">

          <el-button type="text" size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button type="text" size="small" @click="handleDelete(row)" style="color: #f56c6c">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :background="true"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup>
import { listPostByPage, deletePost } from "@/api/postController.js";
import { onMounted, ref } from "vue";
import { ElMessage, ElMessageBox } from 'element-plus';
import { Star, Collection, Search } from '@element-plus/icons-vue';
import { listuserbypage } from "@/api/user.js";
import { useRouter } from 'vue-router';
const router = useRouter();
const tableData = ref([]);
const loading = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const userMap = ref({});
const searchId = ref(''); // 搜索ID

// 获取标签数组
const getTagsArray = (tagsString) => {
  try {
    return JSON.parse(tagsString);
  } catch (e) {
    console.error('解析标签字符串失败:', e);
    return [];
  }
};

// 获取标签数量
const getTagCount = (tagsString) => {
  return getTagsArray(tagsString).length;
};

// 获取限制显示的标签(最多2个)
const getLimitedTags = (tagsString) => {
  const tags = getTagsArray(tagsString);
  return tags.slice(0, 2);
};

// 获取所有标签文本(用于tooltip)
const getAllTags = (tagsString) => {
  return getTagsArray(tagsString).join(', ');
};

// 获取用户信息
const fetchUserInfo = async (userId) => {
  try {
    if (userMap.value[userId]) {
      return userMap.value[userId];
    }

    const res = await listuserbypage({ id: userId });
    if (res.data.data.records && res.data.data.records.length > 0) {
      const user = res.data.data.records[0];
      userMap.value[userId] = user.userName || '未知用户';
      return userMap.value[userId];
    }
    return '未知用户';
  } catch (error) {
    console.error('获取用户信息失败:', error);
    return '未知用户';
  }
};

// 处理帖子数据，添加用户名
const processPostData = async (posts) => {
  return Promise.all(posts.map(async post => {
    return {
      ...post,
      userName: await fetchUserInfo(post.userId)
    };
  }));
};

const fetchData = async () => {
  try {
    loading.value = true;
    const params = {
      current: currentPage.value,
      pageSize: pageSize.value
    };

    // 如果有搜索ID，添加到参数中
    if (searchId.value) {
      params.id = searchId.value;
    }

    const res = await listPostByPage(params);

    // 处理数据，添加用户名
    const processedData = await processPostData(res.data.data.records);
    tableData.value = processedData;
    total.value = parseInt(res.data.data.total);
  } catch (error) {
    ElMessage.error('获取数据失败: ' + error.message);
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString();
};
const handleEdit = (row) => {
  console.log('编辑帖子:',row.id );
  const id = row.id;
  router.push({
    path: '/editpost',
    query: { id }
  })
}


const handleDelete = (row) => {
  ElMessageBox.confirm(`确定要删除帖子 "${row.title}" 吗?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deletePost({ id: row.id }).then(() => {
      ElMessage.success('删除成功');
      fetchData();
    }).catch(error => {
      ElMessage.error('删除失败: ' + error.message);
    });
  }).catch(() => {
    ElMessage.info('已取消删除');
  });
};

const handleSizeChange = (val) => {
  pageSize.value = val;
  fetchData();
};

const handleCurrentChange = (val) => {
  currentPage.value = val;
  fetchData();
};

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1; // 搜索时重置到第一页
  fetchData();
};

// 处理清除搜索
const handleClearSearch = () => {
  searchId.value = '';
  currentPage.value = 1;
  fetchData();
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.post-management {
  padding: 20px;
  width: 1300px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.header {
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-container {
  display: flex;
  align-items: center;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.tags-container {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.el-tag {
  margin-right: 5px;
}

.more-tags {
  color: #909399;
  font-size: 12px;
  margin-left: 2px;
}

.el-icon {
  vertical-align: middle;
  margin-right: 3px;
}
</style>
