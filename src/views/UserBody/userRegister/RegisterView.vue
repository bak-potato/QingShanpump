<template>
  <div class="register-container">
    <el-card class="register-card">
      <h3 @click="handlelog">返回登录</h3>
      <h2 class="title">用户注册</h2>

      <el-form
        :model="registerForm"
        :rules="rules"
        ref="registerFormRef"
        label-position="top"
        @submit.prevent="handleRegister"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="registerForm.username"
            placeholder="请输入用户名"
            prefix-icon="User"
          />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            v-model="registerForm.password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>

        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="registerForm.confirmPassword"
            type="password"
            placeholder="请再次输入密码"
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>

        <el-form-item>
          <el-button
            class="submit-btn"
            type="primary"
            native-type="submit"
            :loading="loading"
          >
            立即注册
          </el-button>
        </el-form-item>

        <div class="third-party-login">
          <span class="divider">或使用第三方账号注册</span>
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
import { ElMessage } from 'element-plus';
import { registerApi } from '@/api/user';

const registerFormRef = ref();
const loading = ref(false);

const registerForm = reactive({
  username: '',
  password: '',
  confirmPassword: ''
});

const handlelog = () => {
  window.location.href = '/login';
}
const validatePassword = (rule, value, callback) => {
  if (value!== registerForm.password) {
    callback(new Error('两次输入密码不一致!'));
  } else {
    callback();
  }
};

const rules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 4, max: 16, message: '长度在4到16个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 18, message: '长度在6到18个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { validator: validatePassword, trigger: 'blur' }
  ]
});

const handleRegister = async () => {
  try {
    registerFormRef.value.validate(valid => {
      if (!valid) {
        ElMessage.warning('请填写完整信息');
        return;
      }
    });

    loading.value = true;
    const requestData = {
      userAccount: registerForm.username,
      userPassword: registerForm.password,
      checkPassword: registerForm.confirmPassword
    };
console.log(requestData)
    const res = await registerApi(requestData);
    console.log(res)
    if (res.data.code === 0) {
      ElMessage.success('注册成功!');
      registerFormRef.value.resetFields();
    } else {
      ElMessage.error(res.message || '注册失败，请检查输入信息');
    }
  } catch (error) {
    ElMessage.error('注册失败，请检查网络或稍后重试');
    console.error('注册请求错误:', error);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
h3{
  position: absolute;
  top: 20px;
  font-weight: 600;
  color: #878787;
  font-size: 16px;
  right: 20px;
}
.register-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  /* background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); */
  background-image:url(/src/images/666666.jpg);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
}

.register-card {
  width: 100%;
  max-width: 500px;
  position: relative;
  margin: 20px;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  color: #303133;
  margin-bottom: 30px;
}

.submit-btn {
  width: 100%;
  height: 40px;
  margin-top: 10px;
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
