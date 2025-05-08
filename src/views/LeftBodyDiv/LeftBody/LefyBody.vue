<template>
  <div class="lefybodybody">
    <div class="lefybody">
      <div class="leftbody2">
        <img  @click="handleviewlast1" class="clickable fclass" width="30px" src="/src/icons/50309213222.png" />
        <hr />
        <!-- 每个菜单项使用精确的view值比较 -->
        <div @click="handleview0" :class="['fc3body', { fc3bodyover: view === 0 }]" class="clickable">
          <img class="fclass3" width="20px" src="/src/icons/zhuye.png" />
          <p>主页</p>
        </div>
        <div @click="handleview1" :class="['fc3body', { fc3bodyover: view === 1 }]" class="clickable">
          <img class="fclass3" width="20px" src="/src/icons/duowenjianjia.png" />
          <p>工作空间</p>
        </div>
        <div @click="handleview2" :class="['fc3body', { fc3bodyover: view === 2 }]" class="clickable">
          <img class="fclass3" width="20px" src="/src/icons/shangdian.png" />
          <p>商店</p>
        </div>
        <div @click="handleview6" :class="['fc3body', { fc3bodyover: view === 6 }]" class="clickable">
          <img class="fclass3" width="20px" src="/src/icons/guanfang.png" />
          <p>官方应用</p>
        </div>
        <div @click="handleview3" :class="['fc3body', { fc3bodyover: view === 3 }]" class="clickable">
          <img class="fclass3" width="20px" src="/src/icons/shangdian.png" />
          <p>社区</p>
        </div>


        <div class="bodyl">
          <div @click="handleviewmanage" v-if="userRole === 'admin'" :class="['last1', 'clickable', 'tooltip-container', { fc3bodyover: view === 100 }]">
            <img width="20px" src="/src/icons/houtaiguanli-houtaiguanli.png" />
            <div class="tooltip">后台管理系统</div>
          </div>
       <div class="last1 clickable tooltip-container" @click="showComingSoon">
  <img width="20px" src="/src/icons/shiyongwendang.png" />
  <div class="tooltip">使用文档</div>
</div>
<div class="last1 clickable tooltip-container" @click="showComingSoon">
  <img width="20px" src="/src/icons/xiaoxi.png" />
  <div class="tooltip">消息提醒</div>
</div>
<div class="last1 clickable tooltip-container" @click="showComingSoon">
  <img width="20px" src="/src/icons/yijiangoumai.png" />
  <div class="tooltip">了解更多</div>
</div>
          <div @click="handleviewlast1" :class="['last1', 'clickable', 'tooltip-container', { fc3bodyover: view === 0 && $route.path === '/user' }]">
            <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
            <div class="tooltip">个人中心</div>
          </div>
        </div>
      </div>
      <div ref="rightbody" class="rightbody">
        <div v-if="0" @click="handleright" class="hiddenicon"></div>
        <LeftBDiv98 v-if="view === 98"  />
        <LeftBDiv0 v-if="view === 0 && $route.path === '/'" />
        <LeftBDiv2 v-if="view === 2" />
        <LeftBDiv1 v-if="view === 1" />
        <LeftBDiv3 v-if="view === 3" />
        <LeftBDiv100 v-if="view === 100" />
        <LeftBDiv99 v-if="view === 99" />
        <LeftBDiv6 v-if="view === 6" />
        <LeftBDiv0 v-if="view === 0 && $route.path === '/user'" />
      </div>
    </div>
  </div>
</template>

<script setup>
import LeftBDiv0 from '@/views/LeftBodyDiv/LeftPage/LeftBDiv0.vue';
import LeftBDiv1 from '@/views/LeftBodyDiv/LeftPage/LeftBDiv1.vue';
import LeftBDiv2 from '@/views/LeftBodyDiv/LeftPage/LeftBDiv2.vue';
import LeftBDiv3 from '@/views/LeftBodyDiv/LeftPage/LeftBDiv3.vue';
import LeftBDiv6 from '@/views/LeftBodyDiv/LeftPage/LeftBDiv6.vue';
import LeftBDiv100 from '@/views/LeftBodyDiv/LeftPage/LeftBDiv100.vue';
import LeftBDiv99 from '@/views/LeftBodyDiv/LeftPage/LeftBDiv99.vue';
import LeftBDiv98 from '@/views/LeftBodyDiv/LeftPage/LeftBDiv98.vue';
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getLoginUser } from '@/api/user.js';
import { ElMessage } from 'element-plus'
const router = useRouter();
const route = useRoute();

// 使用更精确的视图管理
const view = ref(0);
const userRole = ref();

// 页面加载时根据路由初始化view
onMounted(async () => {
  await handleuser();
  await initializeViewFromRoute();
});
const showComingSoon = () => {
  ElMessage.info('敬请期待')
}
const initializeViewFromRoute = async () => {
  await handleuser(); // 确保先获取用户角色
  const path = route.path;
  view.value = {
    '/': 0,
    '/SoftwareManagement': 1,
    '/store': 2,
    '/community': 3,
    '/official': 6,
    '/FriendVue': 7,
    '/usermanage1': 100,
    '/AIGirlfriend': 98,
    '/answer': 99,
    '/user': 0,
    '/ApplicationManagement': 100,
    '/ForumManView': 100,
    '/VueDataAnalyticsPanel': 100,
    '/ApplicationReview': 100,
    '/charmanage': 100
  }[path] || 0;
};

const handleuser = async () => {
  try {
    const res = await getLoginUser();
    if (res?.data?.data) {
      userRole.value = res.data.data.userRole;
    }
  } catch (error) {
    console.error('获取用户信息失败:', error);
  }
};

// 统一处理页面跳转
const navigateToView = (viewValue, path) => {
  view.value = viewValue;
  router.push(path);
};

const handleview0 = () => navigateToView(0, '/');
const handleview1 = () => navigateToView(1, '/SoftwareManagement');
const handleviewmanage = () => navigateToView(100, '/usermanage1');
const handleview2 = () => navigateToView(2, '/store');
const handleviewlast1 = () => navigateToView(0, '/user');
const handleview3 = () => navigateToView(3, '/community');
const handleview6 = () => navigateToView(6, '/official');

function isComputer() {
  const userAgent = navigator.userAgent.toLowerCase();
  const mobileKeywords = ['android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone', 'iemobile', 'opera mini','mobile'];
  return !mobileKeywords.some(keyword => userAgent.includes(keyword));
}

if (!isComputer()) {
  router.push('/PhoneVue');
}

const rightbody = ref(null);
const handleright = () => {
  rightbody.value?.classList.add('hidden');
};
</script>

<style scoped>
/* 保持原有样式不变 */
.tooltip-container {
  position: relative;
}

.tooltip {
  visibility: hidden;
  width: max-content;
  max-width: 120px;
  background-color: #333;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 8px;
  position: absolute;
  z-index: 100;
  left: 50px;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0;
  transition: opacity 0.3s, visibility 0.3s;
  font-size: 12px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.tooltip::after {
  content: "";
  position: absolute;
  right: 100%;
  top: 50%;
  margin-top: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: transparent #333 transparent transparent;
}

.tooltip-container:hover .tooltip {
  visibility: visible;
  opacity: 1;
}

.last1:hover {
  background-color: #f2f3f8;
  border-radius: 10px;
  transition: background-color 0.3s ease;
}

.last1 {
  height: 40px;
  position: relative;
  width: 40px;
  border-radius: 10px;

  margin: 0px auto;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hiddenicon {
  width: 15px;
  height: 15px;
  background-image: url('../icons/shouqi.png');
  background-size: 100% 100%;
  position: absolute;
  bottom: 48vh;
  right: 10px;
}

.rightbody {
  width: 200px;
  z-index: 10;
  border: #e7e7ec 1px solid;
  border-radius: 10px;
  padding: 20px;
  position: relative;
  margin-left: 5px;
  float: right;
  background-color: #fff;
  height: 100%;
}

.bodyl {
  position: absolute;
  bottom: 0px;
  background-color: #ffffff;
  width: 58px;
}

.fc3body:hover {
  background-color: #f2f3f8;
  transition: background-color 0.3s ease;
}

.fc3bodyover {
  background-color: #f2f3f8;
  transition: background-color 0.3s ease;
}

.fc3body {
  width: 50px;
  height: 48px;
  color: #757a8c;
  display: flex;
  flex-direction: column;
  font-size: 10px;
  margin-top: 10px;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
}

hr {
  width: 60%;
  height: 1px;
  margin-top: 20px;
  border: #e7e7ec 1px solid;
}

.fclass2 {
  margin-top: 30px;
  border-radius: 10px;
}

.fclass {
  margin-top: 20px;
  border-radius: 10px;
}

.leftbody2 {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #fff;
  border-radius: 20px;
  justify-content: first baseline;
  align-items: center;
  width: 60px;
  float: left;
  height: 100%;
  border-right: 1px solid #e7e7ec;
}

.lefybodybody {
  width: auto;
  height: 100vh;
  display: flex;
  align-items: center;
}

.lefybody {
  width: auto;
  margin-left: 10px;
  border-radius: 20px;
  height: 98vh;
}
</style>
