<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <h1 class="error-code">404</h1>
      <h2 class="error-title">Oops! Page Not Found</h2>
      <p class="error-message">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div class="action-buttons">
        <button @click="goBack" class="back-button">Go Back</button>
        <button @click="goHome" class="home-button">Go Home</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.go(-1)
}

const goHome = () => {
  router.push('/')
}
</script>

<style scoped>
.not-found-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 20px;
}

.not-found-content {
  text-align: center;
  max-width: 600px;
  padding: 40px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.error-code {
  font-size: 6rem;
  font-weight: bold;
  color: #dc3545;
  margin: 0;
  line-height: 1;
}

.error-title {
  font-size: 2rem;
  margin: 20px 0 10px;
  color: #343a40;
}

.error-message {
  font-size: 1.1rem;
  color: #6c757d;
  margin-bottom: 30px;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.back-button, .home-button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-button {
  background-color: #6c757d;
  color: white;
}

.back-button:hover {
  background-color: #5a6268;
}

.home-button {
  background-color: #007bff;
  color: white;
}

.home-button:hover {
  background-color: #0069d9;
}

/* 添加一些动画效果 */
.not-found-content {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
