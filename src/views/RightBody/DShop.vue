<template>
  <div class="dshop">
    <div class="dshoptitle">
      <p class="dshoptitle1">应用商店</p>
      <div class="search-container">
        <!-- 输入框 + 搜索按钮 -->
        <el-input
          style="border-radius: 25px;"
          v-model="keyword"
          placeholder="搜索"
          clearable
          @keyup.enter="handleSearch"
        >
        </el-input>
      </div>
      <el-button @click="handlecjapp" class="dstt2" type="primary">上架应用</el-button>
    </div>
    <div class="dshoptitlet">
      <div class="dshoptitlet2">
        <p class="dsa">
          🎨DeepSeek驱动，开启图文制作AutoPilot模式
        </p>
        <br>
        <p class="dsa2">
          图文工厂，让你不再为内容发愁
        </p>
        <el-button class="elbut1" type="primary">立即聊聊</el-button>
      </div>
      <div class="dshoptitlet3">
      </div>
    </div>
    <div v-if="listData.length === 0" class="loading">
      <div class="spinner"></div>
    </div>
    <div v-else class="dshoptitleta">
      <el-card shadow="hover" v-for="item in listData" :key="item.id" style="max-width: 400px;margin-left: 10px; width: 440px;height: 160px;">
        <div class="dshoptitleta2"></div>
        <div class="dshoptitleta3">
          <div class="head">
            <img :src="item.appIcon" alt="" class="imgg">
          </div>
          <div class="content">
            <h3 class="title">{{ item.appName }}</h3>
            <p class="description">{{item.appDesc}}</p>
            <el-button type="primary" class="view-btn" @click="answer(item.id)">查看</el-button>
          </div>
        </div>
        <div class="hrt1"></div>
        <div class="dshoptitleta4">

        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { listAppVOByPage, } from "@/api/app";

// 应用列表数据
const listData = ref([]);

// 渲染应用列表
const renderAppList = async () => {
  const res = await listAppVOByPage({ page: null });
  console.log(res);
  // 赋值给应用列表数据
  // 遍历res.data.data中的reviewMessage
  listData.value = res.data.data.records.filter(item => item.reviewMessage!== null);
  console.log(listData.value);
};

onMounted(() => {
  renderAppList();
});

const keyword = ref('');

const handleSearch = () => {
  if (!keyword.value.trim()) return;
  console.log('搜索关键词:', keyword.value);
  // 调用搜索 API 或处理逻辑
};

// import { useTransition } from '@vueuse/core';
import router from '@/router';

const handlecjapp = () => {
  router.push('/SoftwareManagement');
  sessionStorage.setItem('view', 1);
};

const source = ref(0);
// const outputValue = useTransition(source, {
//   duration: 1500,
// });
source.value = 172000;

const answer = (id) => {
  sessionStorage.setItem('view', 99);
  router.push({
    path: '/answer',
    query: {
      id: id
    }
  });
  // 延迟刷新
  setTimeout(() => {
    window.location.reload();
  }, 100);
};
</script>

<style scoped>
.el-col {
  text-align: center;
}

/* 加载中动画样式 */
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-left-color: #5147ff;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}


.el-card {
  width: 320px;
  height: 220px;
  margin-top: 30px;
}

.dshoptitleta {
  max-width: 1350px;
  display: flex;
  flex-wrap: wrap;
  display: flex;
  justify-content: flex-start;
  margin: 0 auto;
  margin-top: 30px;
  width: 100%;
  /* margin-top: 30px; */
  height: 220px;
  position: relative;
 .dshoptitleta3 {
    height: 130px;
    width: 100%;
 .head {
      float: left;
      height: 130px;
      width: 130px;
      background-size: 100% 100%;
      border-radius: 10px;
 .imgg {
        width: 100px;
        height: 100px;
      }
    }
  .content {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 10px;
      height: 100%;
      margin-left: 140px; /* 根据头像宽度调整 */
    }

  .title {
      font-size: 16px;
      font-weight: 600;
      color: #333;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      overflow: hidden;
      margin: 0;
    }

.description {
  font-size: 12px;
  color: #666;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2; /* 限制显示3行 */
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
}

  .view-btn {
      position: absolute;
      bottom: 10px;
      right: 10px;
      padding: 8px 20px;
      border-radius: 15px;
      background-color: #5147ff;
      transition: all 0.3s ease;
    }

  .view-btn:hover {
      background-color: #4538ff;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(81, 71, 255, 0.3);
    }
  }
 .hrt1 {
    height: 1px;
    width: 100%;
    background-color: #ebedff;
    position: relative;
    top: 10px;
  }
 .dshoptitleta4 {
    height: 90px;
    width: 100%;
  .ftca p {
      float: left;
      font-size: 18px;
      margin-left: 10px;
      margin-top: 20px;
    }
  .ftca img {
      float: left;
      margin-top: 20px;
      margin-left: 10px;
    }
  .ftca {
      color: #757a8c;
      margin-top: 10px;
      height: 16px;
      bottom: 13px;
      line-height: 16px;
    }
  }
}

.elbut1 {
  margin-left: 20px;
  font-size: 16px;
  width: 150px;
  height: 40px;
  margin-top: 20px;
  border-radius: 20px;
  background-color: #000000;
}

.dsimg1 {
  width: 100%;
  margin-top: 30px;
  height: 100%;
  border-radius: 10px;
  /* background-image: url(../images/20250316213326.png); */
  background-size: 100% 100%;
}

.dshoptitlet3 {
  width: 40%;
  right: 0px;
  height: 220px;
  position: absolute;
}

.dshoptitlet2 {
  height: 220px;
  margin-top: 30px;
  width: 60%;
  left: 0px;
  position: absolute;
}

.dsa2 {
  margin-left: 20px;
  margin-top: 50px;
  color: rgb(150, 150, 150);
}

.dsa {
  margin-left: 20px;
  margin-top: 10px;
  font-weight: bold;
  color: rgb(0, 0, 0);
  font-size: 33px;
}

.dshoptitlet {
  width: 100%;
  margin-top: 10px;
  position: relative;
  height: 270px;
}

.dstt2:hover {
  background-color: #4538ff;
}

.dstt2 {
  float: right;
  margin-right: 20px;
  border-radius: 10px;
  background-color: #5147ff;
  border: none;
}

.el-input {
  border-radius: 20px;
}

.search-container {
  float: left;
  margin-left: 300px;
  width: 400px;  /* 按需调整宽度 */
}

.dshoptitle1 {
  margin-left: 20px;
  color: black;
  float: left;
  line-height: 30px;
  font-size: 20px;
}

.dshoptitle {
  width: 100%;
  margin-top: 30px;
  height: 30px;
  /* background-color: #343030; */
}

.dshop {
  min-width: 1350px;
  margin: 0px auto;
  /* background-color: #9c4242; */
}
</style>
