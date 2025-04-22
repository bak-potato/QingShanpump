<template>
  <div class="lefybodybody">
    <div class="lefybody">
      <div class="leftbody2">
        <img class="clickable fclass" width="30px" src="/src/icons/50309213222.png" />
        <img class="fclass2 clickable" width="30px" src="/src/icons/chuangjian.png" />
        <hr />
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
          <img class="fclass3" width="20px" src="/src/icons/shangdian.png" />
          <p>官方应用</p>
        </div>

        <div @click="handleview3" :class="['fc3body', { fc3bodyover: view === 3 }]" class="clickable">
          <img class="fclass3" width="20px" src="/src/icons/shangdian.png" />
          <p>社区</p>
        </div>

        <div class="bodyl">
          <div @click="handleviewmanage" v-if="userRole === 'admin'" class="last1 clickable tooltip-container">
            <img width="20px" src="/src/icons/houtaiguanli-houtaiguanli.png" />
            <div class="tooltip">后台管理系统</div>
          </div>
          <div class="last1 clickable tooltip-container">
            <img width="20px" src="/src/icons/shiyongwendang.png" />
            <div class="tooltip">使用文档</div>
          </div>
          <div class="last1 clickable tooltip-container">
            <img width="20px" src="/src/icons/xiaoxi.png" />
            <div class="tooltip">消息提醒</div>
          </div>
          <div class="last1 clickable tooltip-container">
            <img width="20px" src="/src/icons/yijiangoumai.png" />
            <div class="tooltip">了解更多</div>
          </div>
          <div @click="handleviewlast1" class="last1 clickable tooltip-container">
            <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
            <div class="tooltip">个人中心</div>
          </div>
        </div>
      </div>
      <div ref="rightbody" class="rightbody">
        <div v-if="0" @click="handleright" class="hiddenicon"></div>
        <LeftBDiv0 v-if="view === 0" />
        <LeftBDiv2 v-if="view === 2" />
        <LeftBDiv1 v-if="view === 1" />
        <LeftBDiv3 v-if="view === 3" />
        <LeftBDiv100 v-if="view === 100" />
        <LeftBDiv99 v-if="view === 99" />
        <LeftBDiv98 v-if="view === 98" />

      </div>
    </div>
  </div>
</template>

<script setup>
import LeftBDiv0 from '@/views/LeftBodyDiv/LeftPage/LeftBDiv0.vue';
import LeftBDiv1 from '@/views/LeftBodyDiv/LeftPage/LeftBDiv1.vue';
import LeftBDiv2 from '@/views/LeftBodyDiv/LeftPage/LeftBDiv2.vue';
import LeftBDiv3 from '@/views/LeftBodyDiv/LeftPage/LeftBDiv3.vue';
import LeftBDiv100 from '@/views/LeftBodyDiv/LeftPage/LeftBDiv100.vue';
import LeftBDiv99 from '@/views/LeftBodyDiv/LeftPage/LeftBDiv99.vue';
import LeftBDiv98 from '@/views/LeftBodyDiv/LeftPage/LeftBDiv98.vue';
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { getLoginUser } from '@/api/user.js';
const router = useRouter();

// 从 sessionStorage 中读取 view 的值，如果没有则默认为 0
const view = ref(parseInt(sessionStorage.getItem('view')) || 0);
const userRole = ref('');
// 页面加载时读取 sessionStorage 中的 view 值
onMounted(() => {
  handleuser()
  const savedView = sessionStorage.getItem('view');
  if (savedView !== null) {
    view.value = parseInt(savedView);
    updateActiveClass(view.value);
  }
});

const handleuser = async () => {
  const res = await getLoginUser()
  userRole.value = res.data.data.userRole;
  console.log(userRole.value);
}

// 更新激活的菜单项样式
const updateActiveClass = (index) => {
  const divs = document.querySelectorAll('.fc3body');
  divs.forEach((div, i) => {
    div.classList.remove('fc3bodyover');
    if (i === index) {
      div.classList.add('fc3bodyover');
    }
  });
};

// 处理主页点击
const handleview0 = () => {
  view.value = 0;
  sessionStorage.setItem('view', 0);
  updateActiveClass(0);
  router.push('/');
};

// 处理工作空间点击
// 处理工作空间点击
const handleview1 = () => {
  view.value = 1;
  sessionStorage.setItem('view', 1);
  updateActiveClass(1);
  console.log('Before router.push');
  router.push('/SoftwareManagement').then(() => {
    console.log('After router.push');
  }).catch((error) => {
    console.error('Router push error:', error);
  });
};

const handleviewmanage = () => {
  view.value = 100;
  sessionStorage.setItem('view', 100);
  updateActiveClass(100);
  router.push('/usermanage1');

}
function isComputer() {
  const userAgent = navigator.userAgent.toLowerCase();
  const mobileKeywords = ['android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone', 'iemobile', 'opera mini', 'mobile'];
  for (const keyword of mobileKeywords) {
    if (userAgent.includes(keyword)) {
      return false;
    }
  }
  return true;
}

if (!isComputer()) {
  console.log('当前登录设备不是电脑端');
  router.push('/PhoneVue');
}


// 处理商店点击
const handleview2 = () => {
  view.value = 2;
  sessionStorage.setItem('view', 2);
  updateActiveClass(2);
  router.push('/store');
};
const handleviewlast1 = () => {
  sessionStorage.setItem('view', 0);
  view.value = 0;
  updateActiveClass(0);
  router.push('/user');

}
const handleview3 = () => {
  sessionStorage.setItem('view', 3);
  view.value = 3;
  updateActiveClass(3);
  router.push('/community');
}
const handleview6 = () => {
  sessionStorage.setItem('view', 6);
  view.value = 6;
  updateActiveClass(6);
  router.push('/official');
}

const rightbody = ref(null);

const handleright = () => {
  console.log('11');
  if (rightbody.value) {
    rightbody.value.classList.add('hidden');
  } else {
    console.error('rightbody element not found');
  }
};

// 监听 view 的变化，让样式变化有过渡效果
watch(view, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    updateActiveClass(newValue);
  }
}, { immediate: true });
</script>

<style scoped>
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

/* Keep your existing styles but remove the inblowdiv specific ones */
.last1:hover {
  background-color: #f2f3f8;
  border-radius: 10px;
  transition: background-color 0.3s ease;
  /* 添加过渡效果 */
}

.last1 {
  height: 40px;
  position: relative;
  width: 40px;
  margin: 0px auto;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.inblowdiv {
  font-size: 10px;
  width: 100px;
  left: 40px;
  z-index: 100;
  position: absolute;
  color: #757a8c;
  margin-top: 5px;
}

/* 样式保持不变 */
.visiable {
  z-index: 2;
  width: 15px;
  height: 15px;
  background-image: url('../icons/zhankai.png');
  background-size: 100% 100%;
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

.last1:hover {
  background-color: #f2f3f8;
  border-radius: 10px;
  transition: background-color 0.3s ease;
  /* 添加过渡效果 */
}

.last1 {
  height: 40px;
  position: relative;
  width: 40px;
  margin: 0px auto;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
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
  /* 添加过渡效果 */
}

.fc3bodyover {
  background-color: #f2f3f8;
  transition: background-color 0.3s ease;
  /* 添加过渡效果 */
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
