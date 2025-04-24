<template>
  <div class="login-container">
    <!-- 左侧品牌视觉区 -->
    <el-card class="login-card animate__animated animate__fadeInUp">
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
            :prefix-style="{ color: '#409eff' }"
          />
        </el-form-item>

        <el-form-item label="密码" prop="userPassword">
          <el-input
            v-model="loginForm.userPassword"
            type="password"
            placeholder="请输入密码"
            prefix-icon="Lock"
            :prefix-style="{ color: '#409eff' }"
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
            :hover-class="buttonHover"
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
            <el-icon :size="28" class="icon-ani">
              <ChatDotRound />
            </el-icon>
            <el-icon :size="28" class="icon-ani">
              <UserFilled />
            </el-icon>
            <el-icon :size="28" class="icon-ani">
              <Share />
            </el-icon>
          </div>
        </div>
      </el-form>
    </el-card>
    <div class="decorate-shape"></div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { loginApi, getLoginUser } from '@/api/user.js';
import { ElMessage } from 'element-plus';
import router from '@/router';

const loginFormRef = ref();
const loading = ref(false);
const rememberMe = ref(false);
const buttonHover = 'el-button--primary--hover';

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
      localStorage.setItem('isLoggedIn', 'true');
      if (rememberMe.value) {
        localStorage.setItem('userAccount', loginForm.userAccount);
      }

      const userRes = await getLoginUser();
      if (userRes.status === 200) {
        localStorage.setItem('userRole', userRes.data.data.userRole);
      } else {
        ElMessage.error('获取用户信息失败');
      }

      router.push('/');
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
@import url('https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css');

.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
 /* background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); */
 background-image: url('/src/images/6666.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  position: relative;
  overflow: hidden;
}

.login-card {
  width: 100%;
  max-width: 450px;
  top:10px;
  left: 500px;
  margin: 20px;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(64, 158, 255, 0.2);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  padding: 32px 40px;
  position: relative;
  z-index: 1;
}

.title {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
  position: relative;
}

.title::after {
  content: '';
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: -12px;
  width: 60px;
  height: 3px;
  background: #409eff;
}

.flex-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.submit-btn {
  width: 100%;
  height: 44px;
  margin-top: 16px;
  font-size: 16px;
  transition: transform 0.1s;
}

.submit-btn:hover {
  transform: scale(1.02);
}

.register-link {
  text-align: center;
  margin: 20px 0;
  color: #606266;
  font-size: 15px;
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
  width: 28%;
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
  gap: 24px;
  color: #606266;
  cursor: pointer;
  transition: color 0.3s;
}

.social-icons .el-icon {
  transition: transform 0.3s;
}

.social-icons .el-icon:hover {
  color: #409eff;
  transform: translateY(-4px);
}

.decorate-shape {
  width: 200px;
  height: 200px;
  background: rgba(64, 158, 255, 0.1);
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  z-index: 0;
}

.decorate-shape:nth-child(1) {
  top: 20%;
  left: -10%;
}

.decorate-shape:nth-child(2) {
  bottom: 20%;
  right: -10%;
}

</style>
