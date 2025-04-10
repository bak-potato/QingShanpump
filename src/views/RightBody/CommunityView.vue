<template>
  <div class="dshop">
    <div class="dshoptitle">
      <p class="dshoptitle1 ">深度社区</p>
      <div class="search-container">
        <el-input style="border-radius: 25px;" v-model="keyword" placeholder="搜索帖子" clearable
          @keyup.enter="handleSearch"></el-input>
      </div>
      <el-button @click="handleNewPost" class="dstt2" type="primary">发布帖子</el-button>
    </div>

    <div class="dshoptitlet">
      <div class="dshoptitlet2">
        <p class="dsa">
          🚀DeepSeek社区，与千万开发者共同成长
        </p>
        <br>
        <p class="dsa2">
          技术交流 | 经验分享 | 协作开发 | 资源互助
        </p>
        <el-button class="elbut1" type="primary" @click="router">立即参与</el-button>
      </div>
      <div class="dshoptitlet3">
        <div class="dsimg1">
          <el-row>
            <el-col :span="6">
              <el-statistic title="总帖子数" :value="totalPosts" />
            </el-col>
            <el-col :span="6">
              <el-statistic :value="2358">
                <template #title>
                  <div style="display: inline-flex; align-items: center">
                    当前在线
                    <el-icon style="margin-left: 4px" :size="12">
                      <User />
                    </el-icon>
                  </div>
                </template>
              </el-statistic>
            </el-col>
            <el-col :span="6">
              <el-statistic title="今日发帖" :value="outputValue" />
            </el-col>
            <el-col :span="6">
              <el-statistic title="热门话题" :value="5623">
                <template #suffix>
                  <el-icon style="vertical-align: -0.125em">
                    <Fire />
                  </el-icon>
                </template>
              </el-statistic>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>

    <div class="dshoptitleta">
      <el-row :gutter="24">
        <el-col :span="8" v-for="(post, index) in currentPosts" :key="index">
          <el-card shadow="hover" style="width: 100%; margin-bottom: 10px;" @click="goToPostDetail(post.id)">
            <div class="post-card">
              <div class="post-header">
                <el-avatar :size="40" :src="post.avatar || 'https://picsum.photos/40/40'" />
                <div class="user-info">
                  <h4>{{ post.userName || '未知作者' }}</h4>
                  <span class="post-time">{{ post.createTime ? formatTime(post.createTime) : '未知时间' }}</span>
                </div>
              </div>

              <div class="post-content">
                <h3 class="post-title">{{ post.title }}</h3>
                <p class="post-desc">{{ post.content }}</p>
              </div>

              <div class="post-stats">
                <div class="stat-item">
                  <el-icon>
                    <Star />
                  </el-icon>
                  <span>{{ post.thumbNum || 0 }}</span>
                </div>
                <div class="stat-item">
                  <el-icon>
                    <ChatDotRound />
                  </el-icon>
                  <span>{{ post.comments || 0 }}</span>
                </div>
                <div class="stat-item">
                  <el-icon>
                    <Share />
                  </el-icon>
                  <span>{{ post.shares || 0 }}</span>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <el-pagination style="margin-left: 700px;" @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="currentPage" :page-sizes="[9, 18, 27]" :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper" :total="totalPosts">
    </el-pagination>

  </div>
  <router-view />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useTransition } from '@vueuse/core';
import { useRouter } from 'vue-router';
import { format } from 'date-fns';
import { listPostByPage } from '../../api/postController';
import { listuserbypage } from '../../api/user';

const router = useRouter();
const keyword = ref('');
const source = ref(0);
const outputValue = useTransition(source, { duration: 1500 });
source.value = 872;

const totalPosts = ref(0);
const pageSize = ref(9);
const currentPage = ref(1);
const posts = ref([]);

const currentPosts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return posts.value.slice(start, end);
});
const goToPostDetail = (postId) => {
  router.push({
    path: '/post',
    query: { id: postId }
  });
};
const handleSearch = () => {
  if (!keyword.value.trim()) return;
  console.log('搜索帖子:', keyword.value);
  // 这里可以添加搜索逻辑，调用接口并传入搜索关键字
  fetchPosts();
};

const handleNewPost = () => {
  router.push('/createpost');
};

const handleSizeChange = (newSize) => {
  pageSize.value = newSize;
  fetchPosts();
};

const handleCurrentChange = (newPage) => {
  currentPage.value = newPage;
  fetchPosts();
};

const formatTime = (time) => {
  return format(new Date(time), 'yyyy-MM-dd HH:mm:ss');
};

const fetchPosts = async () => {
  try {
    const response = await listPostByPage({
      current: currentPage.value,
      pageSize: pageSize.value
    });
    posts.value = response.data.data.records;
    totalPosts.value = parseInt(response.data.data.total);

    for (let post of posts.value) {
      if (!post.userId) {
        console.warn('帖子对象缺少userId属性，跳过获取用户信息');
        post.userName = '未知用户';
        continue;
      }
      try {
        console.log("正在查询用户ID:", post.userId);
        // 尝试不同的参数传递方式
        const userResponse = await listuserbypage({
          id: post.userId.toString() // 保持为字符串
        });
        // 处理可能的响应结构，先判断records是否存在且是数组
        if (Array.isArray(userResponse.data.data.records) && userResponse.data.data.records.length > 0) {
          const userName = userResponse.data.data.records[0].userName;
          post.userName = userName || '未知用户';
        } else {
          post.userName = '未知用户';
        }
        console.log('获取用户信息响应:', post.userName);
        console.log('帖子作者:', post.userName);
      } catch (error) {
        console.error('获取用户信息失败:', error);
        post.userName = '未知用户';
      }
    }
    console.log('33最终帖子数据:', posts.value);
  } catch (error) {
    console.error('获取帖子数据失败:', error);
  }
};

onMounted(() => {
  fetchPosts();
});
</script>



<style scoped>
/* 基础布局优化 */
.dshop {
  width: 100%;
  max-width: 1200px;
  /* margin: 0 auto; */
  padding: 0 20px;
}

.dshoptitle {
  display: flex;
  align-items: center;
  gap: 30px;
  margin: 40px 0;
}

.search-container {
  flex: 1;
  max-width: 600px;
}

/* 标题样式增强 */
.dshoptitle1 {
  font-size: 28px;
  font-weight: 600;
  color: #1a1a1a;
  margin-right: 30px;
}

/* 按钮样式统一 */
.dstt2 {
  background: linear-gradient(135deg, #6B5BFF, #5147FF);
  border: none;
  border-radius: 12px;
  padding: 12px 28px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(107, 91, 255, 0.3);
  }
}

/* 头部横幅区域优化 */
.dshoptitlet {
  background: linear-gradient(135deg, #f8f9ff, #f0f2ff);
  border-radius: 20px;
  padding: 30px;
  margin: 10px 0;
  position: relative;
  overflow: hidden;
}


.dsa {
  font-size: 32px;
  line-height: 1.3;
  color: #1a1a1a;
  margin-bottom: 15px;
}

.dsa2 {
  font-size: 16px;
  color: #666;
  margin-bottom: 25px;
}

.elbut1 {
  margin-bottom: 20px;
  background: linear-gradient(135deg, #00C9A7, #00B894);
  border-radius: 12px;
  padding: 12px 28px;
}

/* 统计卡片优化 */
.dsimg1 {
  background: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

/* 帖子卡片增强 */
.dshoptitleta {
  padding: 20px 0;
}

.el-card {
  border-radius: 16px !important;
  transition: all 0.3s ease;
  border: 1px solid #eee;

  &:hover {
    /* transform: translateY(-5px); */
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
}

.post-card {
  padding: 16px;
}

.post-header {
  display: flex;
  align-items: center;
  margin-bottom: 18px;

  .el-avatar {
    border: 2px solid #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
}

.user-info {
  margin-left: 15px;

  h4 {
    font-size: 15px;
    margin: 0;
    color: #333;
  }

  .post-time {
    font-size: 12px;
    color: #999;
  }
}

.post-title {
  font-size: 17px;
  line-height: 1.4;
  margin: 0 0 12px;
  color: #1a1a1a;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-desc {
  font-size: 14px;
  line-height: 1.6;
  color: #666;
  margin: 0 0 16px;
  display: -webkit-box;
  text-overflow: ellipsis;
  white-space: nowrap;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-stats {
  display: flex;
  justify-content: space-between;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.stat-item {
  display: flex;
  align-items: center;
  color: #666;
  font-size: 13px;

  .el-icon {
    margin-right: 6px;
    font-size: 16px;
    color: #999;
  }

  &:hover {
    color: #6B5BFF;

    .el-icon {
      color: currentColor;
    }
  }
}

/* 响应式优化 */
@media (max-width: 768px) {
  .dshoptitle {
    flex-wrap: wrap;
    gap: 15px;
  }

  .dshoptitlet {
    padding: 25px;
  }

  .dsa {
    font-size: 24px;
  }

  .el-col {
    width: 100%;
  }
}
</style>
