<template>
  <div class="forbidden-container">
    <div class="forbidden-content">
      <div class="error-animation">
        <div class="lock-icon">
          <div class="lock-top"></div>
          <div class="lock-body"></div>
        </div>
        <div class="forbidden-text">403</div>
      </div>
      <h1 class="title">Access Denied</h1>
      <p class="message">Sorry, you don't have permission to access this page.</p>
      <button @click="goHome" class="home-button">Return to Home</button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    goHome() {
      this.$router.push('/');
    }
  }
}
</script>

<style scoped>
.forbidden-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
}

.forbidden-content {
  text-align: center;
  max-width: 600px;
  padding: 40px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.error-animation {
  position: relative;
  margin: 0 auto 30px;
  width: 200px;
  height: 200px;
}

.lock-icon {
  position: absolute;
  width: 100px;
  height: 100px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.lock-top {
  position: absolute;
  width: 60px;
  height: 40px;
  background: #ff5252;
  border-radius: 20px 20px 0 0;
  top: 0;
  left: 20px;
  animation: shake 0.5s ease-in-out infinite alternate;
}

.lock-body {
  position: absolute;
  width: 100px;
  height: 60px;
  background: #ff5252;
  border-radius: 10px;
  bottom: 0;
  animation: shake 0.5s ease-in-out 0.1s infinite alternate;
}

.forbidden-text {
  position: absolute;
  font-size: 100px;
  font-weight: bold;
  color: rgba(255, 82, 82, 0.2);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: -1;
}

.title {
  color: #ff5252;
  font-size: 32px;
  margin-bottom: 15px;
}

.message {
  color: #666;
  font-size: 18px;
  margin-bottom: 30px;
}

.home-button {
  background: #ff5252;
  color: white;
  border: none;
  padding: 12px 30px;
  font-size: 16px;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 82, 82, 0.3);
}

.home-button:hover {
  background: #ff3232;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 82, 82, 0.4);
}

@keyframes shake {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(5px);
  }
}

@media (max-width: 600px) {
  .forbidden-content {
    padding: 30px 20px;
  }

  .error-animation {
    width: 150px;
    height: 150px;
  }

  .forbidden-text {
    font-size: 80px;
  }

  .title {
    font-size: 28px;
  }

  .message {
    font-size: 16px;
  }
}
</style>
