<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2 class="title">欢迎登录</h2>
      <el-form
        :model="loginForm"
        :rules="rules"
        ref="loginFormRef"
        label-position="top"
        @submit.prevent="handleLogin"
      >
        <el-form-item label="用户名/邮箱" prop="userAccount">
          <el-input
            v-model="loginForm.userAccount"
            placeholder="请输入用户名或邮箱"
            prefix-icon="User"
          />
        </el-form-item>

        <el-form-item label="密码" prop="userPassword">
          <el-input
            v-model="loginForm.userPassword"
            type="password"
            placeholder="请输入密码"
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>

        <div class="flex-container">
          <el-checkbox v-model="rememberMe">记住我</el-checkbox>
          <el-link type="primary" :underline="false">忘记密码?</el-link>
        </div>

        <el-form-item>
          <el-button
            class="submit-btn"
            type="primary"
            native-type="submit"
            @click="handleLogin"
            :loading="loading"
          >
            立即登录
          </el-button>
        </el-form-item>

        <div class="register-link">
          没有账号? <el-link type="primary" @click="router.push('/register')">立即注册</el-link>
        </div>

        <div class="third-party-login">
          <span class="divider">其他登录方式</span>
          <div class="social-icons">
            <el-icon :size="24"><ChatDotRound /></el-icon>
            <el-icon :size="24"><UserFilled /></el-icon>
            <el-icon :size="24"><Share /></el-icon>
          </div>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { loginApi } from '../api/user.js';
import { ElMessage } from 'element-plus';
import router from '@/router';

const loginFormRef = ref();
const loading = ref(false);
const rememberMe = ref(false);

const loginForm = reactive({
  userAccount: '',
  userPassword: ''
});

const rules = reactive({
  userAccount: [
    { required: true, message: '请输入用户名或邮箱', trigger: 'blur' },
    { min: 4, message: '长度至少4个字符', trigger: 'blur' }
  ],
  userPassword: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 18, message: '长度在6到18个字符', trigger: 'blur' }
  ]
});

const handleLogin = async () => {
  try {
    loading.value = true;
    const valid = await loginFormRef.value.validate();
    if (!valid) {
      ElMessage.warning('请填写完整信息');
      return;
    }

    const res = await loginApi(loginForm);
    if (res.status === 200) {
      ElMessage.success('登录成功');
      // 存储登录状态到本地存储
      localStorage.setItem('isLoggedIn', 'true');
      if (rememberMe.value) {
        localStorage.setItem('userAccount', loginForm.userAccount);
      }
      router.push('/');
      // 刷新页面
    } else {
      ElMessage.error('登录失败，请检查用户名或密码');
    }
  } catch (error) {
    ElMessage.error('登录失败，请检查网络或重试');
    console.error('登录请求错误:', error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.login-card {
  width: 100%;
  max-width: 450px;
  margin: 20px;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  color: #303133;
  margin-bottom: 30px;
}

.flex-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.submit-btn {
  width: 100%;
  height: 40px;
  margin-top: 10px;
}

.register-link {
  text-align: center;
  margin: 15px 0;
  color: #606266;
}

.third-party-login {
  margin-top: 30px;
  text-align: center;
}

.divider {
  display: block;
  color: #909399;
  font-size: 14px;
  margin-bottom: 15px;
  position: relative;
}

.divider::before,
.divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 30%;
  height: 1px;
  background: #dcdfe6;
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}

.social-icons {
  display: flex;
  justify-content: center;
  gap: 20px;
  color: #606266;
  cursor: pointer;
  transition: color 0.3s;
}

.social-icons .el-icon:hover {
  color: #409eff;
}
</style>
