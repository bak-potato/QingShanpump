

<template>
  <div class="container">
    <div class="content">
      <h1 class="title">请在电脑端登录</h1>

      <!-- 小猫动画容器 -->
      <div class="cat-container">
        <div class="cat"></div>
      </div>

      <p class="description">请使用电脑浏览器访问本系统以完成登录操作</p>
    </div>
  </div>
</template>

<style scoped>
/* 原有样式保持不变 */
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ffffff;
  padding: 20px;
}

.content {
  text-align: center;
  max-width: 600px;
  padding: 40px;
}

.title {
  font-size: 2rem;
  color: #1a1a1a;
  margin-bottom: 1rem;
  font-weight: 500;
  line-height: 1.3;
}

.description {
  font-size: 1.1rem;
  color: #666;
  line-height: 1.6;
  margin: 0;
}

/* 新增小猫动画样式 */
.cat-container {
  margin: 2rem 0;
  position: relative;
  height: 80px;
  overflow: hidden;
}

.cat {
  position: absolute;
  left: -100px;
  width: 100px;
  height: 80px;
  animation: run 4s linear infinite;
  background-image: url('../images/微信图片_20250326192053.png');
  background-repeat: no-repeat;
  background-size: contain;
}

@keyframes run {
  0% {
    left: -100px;
    transform: scaleX(1);
  }
  45% {
    transform: scaleX(1);
  }
  50% {
    left: 100%;
    transform: scaleX(-1);
  }
  95% {
    transform: scaleX(-1);
  }
  100% {
    left: -100px;
    transform: scaleX(1);
  }
}

/* 响应式适配 */
@media (max-width: 768px) {
  .title {
    font-size: 1.5rem;
  }

  .description {
    font-size: 1rem;
  }

  .cat-container {
    height: 60px;
    margin: 1.5rem 0;
  }

  .cat {
    width: 80px;
    height: 60px;
  }
}
</style>
