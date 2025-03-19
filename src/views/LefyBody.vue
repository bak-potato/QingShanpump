<template>
  <div class="lefybodybody">
    <div class="lefybody">
      <div class="leftbody2">
        <img class="clickable fclass" width="30px" src="../icons/50309213222.png" />
        <img class="fclass2 clickable" width="30px" src="../icons/chuangjian.png" />
        <hr />
        <div @click="handleview0" :class="['fc3body', { fc3bodyover: view === 0 }]" class="clickable">
          <img class="fclass3" width="20px" src="../icons/zhuye.png" />
          <p>主页</p>
        </div>
        <div @click="handleview1" :class="['fc3body', { fc3bodyover: view === 1 }]" class="clickable">
          <img class="fclass3" width="20px" src="../icons/duowenjianjia.png" />
          <p>工作空间</p>
        </div>
        <div @click="handleview2" :class="['fc3body', { fc3bodyover: view === 2 }]" class="clickable">
          <img class="fclass3" width="20px" src="../icons/shangdian.png" />
          <p>商店</p>
        </div>
        <div class="fc3body clickable">
          <img class="fclass3" width="20px" src="../icons/mobankuangjia-xianxing.png" />
          <p>模板</p>
        </div>
        <div class="fc3body clickable">
          <img class="fclass3" width="20px" src="../icons/api-fill.png" />
          <p>山清API</p>
        </div>
        <div class="bodyl">
          <div class="last1 clickable">
            <img width="20px" src="../icons/shiyongwendang.png" />
          </div>
          <div class="last1 clickable">
            <img width="20px" src="../icons/xiaoxi.png" />
          </div>
          <div class="last1 clickable">
            <img width="20px" src="../icons/yijiangoumai.png" />
          </div>
          <div class="last1 clickable">
            <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
          </div>
        </div>
      </div>
      <div ref="rightbody" class="rightbody">
        <div v-if="0" @click="handleright" class="hiddenicon"></div>
        <LeftBDiv0 v-if="view === 0" />
        <LeftBDiv2 v-if="view === 2" />
        <LeftBDiv1 v-if="view === 1" />
      </div>
    </div>
  </div>
</template>

<script setup>
import LeftBDiv0 from './LeftBodyDiv/LeftBDiv0.vue';
import LeftBDiv1 from './LeftBodyDiv/LeftBDiv1.vue';
import LeftBDiv2 from './LeftBodyDiv/LeftBDiv2.vue';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 从 sessionStorage 中读取 view 的值，如果没有则默认为 0
const view = ref(parseInt(sessionStorage.getItem('view')) || 0);

// 页面加载时读取 sessionStorage 中的 view 值
onMounted(() => {
  const savedView = sessionStorage.getItem('view');
  if (savedView !== null) {
    view.value = parseInt(savedView);
    updateActiveClass(view.value);
  }
});

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

// 处理商店点击
const handleview2 = () => {
  view.value = 2;
  sessionStorage.setItem('view', 2);
  updateActiveClass(2);
  router.push('/store');
};

const rightbody = ref(null);

const handleright = () => {
  console.log('11');
  if (rightbody.value) {
    rightbody.value.classList.add('hidden');
  } else {
    console.error('rightbody element not found');
  }
};
</script>

<style scoped>
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
}
.last1 {
  height: 40px;
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
}
.fc3bodyover {
  background-color: #f2f3f8;
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
