<template>
<div class="dshop">
  <!-- 头部导航 -->
  <div class="dshoptitle">
    <el-button @click="router.back()" circle>
      <el-icon><ArrowLeft /></el-icon>
    </el-button>
    <p class="dshoptitle1">帖子详情</p>
  </div>

  <!-- 主内容区 -->
  <div class="post-container">
    <!-- 作者信息 -->
    <div class="author-info">
      <el-avatar :size="50" :src="userData.userAvatar" />
      <div class="meta">
        <h3>{{ userData.userName }}</h3>
        <p class="time">{{ postData.createTime }} · {{ postData.viewCount }}次浏览</p>
      </div>
      <el-button type="primary" round class="follow-btn">
        {{ postData.isFollowing ? '已关注' : '+ 关注' }}
      </el-button>
    </div>

    <!-- 帖子内容 -->
    <article class="post-content">
      <h1>{{ postData.title }}</h1>
      <div class="content-box">
        <PreviewOnly :content="content"/>
      </div>

    </article>

    <!-- 互动统计 -->
    <div class="interaction-stats">
      <div class="stat-item">
        <el-icon :color="postData.isLiked ? '#ff4222' : ''"><StarFilled /></el-icon>
        <span>{{ postData.likeCount }}</span>
      </div>
      <div class="stat-item">
        <el-icon><ChatDotRound /></el-icon>
        <span>{{ postData.commentCount }}</span>
      </div>
      <div class="stat-item">
        <el-icon><Share /></el-icon>
        <span>{{ postData.shareCount }}</span>
      </div>
    </div>
  </div>

  <!-- 评论区 -->
  <div class="comment-section">
    <h3>全部评论（{{ comments.length }}）</h3>

    <!-- 评论输入 -->
    <div class="comment-input">
      <el-avatar :size="40" :src="currentUser.avatar" />
      <el-input
        v-model="newComment"
        placeholder="写下你的评论..."
        :rows="2"
        type="textarea"
        resize="none"
      />
      <el-button type="primary" @click="submitComment">发布</el-button>
    </div>

    <!-- 评论列表 -->
    <div class="comment-list">
      <div v-for="comment in comments" :key="comment.id" class="comment-item">
        <el-avatar :size="36" :src="comment.author.avatar" />
        <div class="comment-content">
          <div class="comment-header">
            <span class="author">{{ comment.author.name }}</span>
            <span class="time">{{ comment.time }}</span>
          </div>
          <p class="comment-text">{{ comment.content }}</p>
          <div class="comment-actions">
            <el-button text><el-icon><Star /></el-icon> {{ comment.likes }}</el-button>
            <el-button text>回复</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getPostByIdApi } from '@/api/post';
import PreviewOnly from '@/components/editor/PreviewOnly.vue'

const router = useRouter();

// 帖子数据
const content = ref('');
const userData = ref({})
const postData = ref({
  title: '大模型分布式训练中的梯度同步问题探讨',
  content: `在千卡集群上进行大模型训练时，我们遇到了梯度同步效率瓶颈...`,
  codeContent: `def gradient_sync(params):
    # 使用Ring AllReduce算法
    for param in params:
        dist.all_reduce(param.grad.data)`,
  codeLanguage: 'Python',
  author: {
    name: 'AI架构师',
    avatar: 'https://example.com/avatar1.jpg'
  },
  createTime: '2024-03-15 14:30',
  viewCount: 2458,
  likeCount: 156,
  commentCount: 23,
  shareCount: 12,
  isLiked: false,
  isFollowing: false
});
const getPostData = async () => {
  const id = router.currentRoute.value.query.id
  try {
    const res = await getPostByIdApi({ id: id })
    content.value = res.data.data.content
    userData.value = res.data.data.user
    console.log('帖子详情', res.data.data)
  } catch (error) {
    console.error('获取帖子详情失败', error)
  }
}
onMounted(() => {
  getPostData()
})

// 评论数据
const comments = ref([
  {
    id: 1,
    author: { name: '开发者小明', avatar: 'https://example.com/avatar2.jpg' },
    content: '感谢分享！请问在跨机房场景下有什么优化建议吗？',
    time: '1小时前',
    likes: 5
  },
  // 更多评论...
]);

// 当前用户
const currentUser = ref({
  avatar: 'https://example.com/user-avatar.jpg'
});

const newComment = ref('');

const submitComment = () => {
  if (newComment.value.trim()) {
    comments.value.unshift({
      id: Date.now(),
      author: { ...currentUser.value },
      content: newComment.value.trim(),
      time: '刚刚',
      likes: 0
    });
    newComment.value = '';
    postData.value.commentCount++;
  }
};
</script>

<style scoped>
.dshop {
  /* max-width: 1200px; */
  width: 100%;
  margin: 0 auto;
  padding: 20px;
  color: #333;
}

.dshoptitle {
  display: flex;
  align-items: center;
  margin-bottom: 30px;

  .dshoptitle1 {
    font-size: 24px;
    margin: 0 20px;
    flex-grow: 1;
  }
}

.post-container {
  background: #fff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}

.author-info {
  display: flex;
  align-items: center;
  margin-bottom: 30px;

  .meta {
    flex-grow: 1;
    margin-left: 15px;

    h3 { margin: 0; }
    .time { color: #666; }
  }
}

.post-content {
  h1 {
    font-size: 28px;
    margin: 0 0 20px;
  }
}

.interaction-stats {
  display: flex;
  gap: 30px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;

  .stat-item {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;

    &:hover {
      color: var(--el-color-primary);
    }
  }
}

.comment-section {
  margin-top: 40px;

  h3 {
    font-size: 20px;
    margin-bottom: 20px;
  }
}

.comment-input {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;

  :deep(.el-textarea__inner) {
    min-height: 80px !important;
    padding: 12px 15px;
  }
}

.comment-item {
  display: flex;
  gap: 15px;
  padding: 15px 0;
  border-bottom: 1px solid #eee;

  .comment-content {
    flex-grow: 1;

    .comment-header {
      color: #666;
      margin-bottom: 5px;

      .time {
        margin-left: 10px;
        font-size: 0.9em;
      }
    }

    .comment-text {
      margin: 0;
      line-height: 1.6;
    }

    .comment-actions {
      margin-top: 8px;

      .el-button {
        padding: 0 10px;
      }
    }
  }
}

.follow-btn {
  width: 90px;
}
</style>
