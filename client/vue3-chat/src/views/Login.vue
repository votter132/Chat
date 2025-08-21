<script setup>
import { ElMessage } from 'element-plus';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores'
import axios from 'axios';
const router = useRouter()
const userStore = useUserStore()
const isLogin = ref(true)
// 表单数据
const formData = ref({
  username: '',
  password: '',
  email: ''
})
// 绑定表当Dom
const formDataRef = ref();
// 规则校验
const rules = {
  username: [
    { required: true, message: "请输入账号", trigger: 'blur' },
    { min: 3, max: 15, message: "账号长度在3到15个字符之间", trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9_]+$/,
      message: "账号只能包含字母、数字和下划线",
      trigger: 'blur'
    }
  ],
  password: [
    { required: true, message: "请输入密码", trigger: 'blur' },
    { min: 6, max: 20, message: "密码长度在6到20个字符之间", trigger: 'blur' },
    {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
      message: "密码至少包含大小写字母和数字",
      trigger: 'blur'
    }
  ],
  email: [
    { required: true, message: "请输入邮箱", trigger: 'blur' },
    {
      type: 'email',
      message: "请输入有效的邮箱地址",
      trigger: ['blur', 'change']
    }
  ]
}
const login = async () => {
  await formDataRef.value.validate()
  const res = await axios.post('http://localhost:3000/login', formData.value)
  // console.log(res)
  if (res.data.code === 1) {
    ElMessage.success('登录成功')
    console.log(res.data);

    userStore.setUserInfo(res.data.data); // 保存用户名到状态管理
    router.push('/index'); // 跳转到首页
  } else {
    ElMessage.error(res.data.msg)
  }
}
const register = async () => {
  await formDataRef.value.validate()
  const res = await axios.post('http://localhost:3000/register', formData.value)
  console.log(res)
  if (res.data.code === 1) {
    ElMessage.success('注册成功')
    formData.value = {
      username: '',
      password: '',
      email: ''
    }
    isLogin.value = true
  } else {
    ElMessage.error(res.data.msg)
  }
}
</script>

<template>
  <div class="login-container">
    <!-- 背景装饰元素 -->
    <div class="bg-decoration"></div>

    <el-card class="login-card">
      <!-- 卡片顶部装饰 -->
      <div class="card-header">
        <div class="shine-effect"></div>
        <h1 class="title">账户{{ isLogin ? '登录' : '注册' }}</h1>
        <p class="subtitle">欢迎回来，请{{ isLogin ? '登录' : '注册' }}您的账户</p>
      </div>

      <div class="form">
        <el-form label-position="top" :model="formData" :rules="rules" ref="formDataRef" @submit.prevent>
          <!-- 账号输入 -->
          <el-form-item label="账号：" prop="username" class="form-item">
            <el-input clearable placeholder="请输入用户名..." v-model.trim="formData.username" class="custom-input"
              prefix-icon="User"></el-input>
          </el-form-item>

          <!-- 密码输入 -->
          <el-form-item label="密码：" prop="password" class="form-item">
            <el-input show-password clearable placeholder="请输入密码..." v-model.trim="formData.password"
              class="custom-input" prefix-icon="Lock"></el-input>
          </el-form-item>

          <!-- 邮箱输入 -->
          <el-form-item v-if="!isLogin" label="邮箱：" prop="email" class="form-item">
            <el-input clearable placeholder="请输入邮箱..." v-model.trim="formData.email" class="custom-input"
              prefix-icon="Message"></el-input>
          </el-form-item>

          <!-- 登录按钮 -->
          <el-form-item class="form-actions">
            <el-button @click="login" v-if="isLogin" type="primary" class="login-btn">
              <span>登录</span>
              <i class="icon-right"></i>
            </el-button>
            <el-button @click="register" v-else type="primary" class="login-btn">
              <span>注册</span>
              <i class="icon-right"></i>
            </el-button>
          </el-form-item>

          <!-- 额外链接 -->
          <div class="form-links">
            <a href="#" class="link-item">忘记密码</a>
            <a href="#" class="link-item" @click="isLogin = !isLogin">{{ isLogin ? '注册' : '登录' }}账号</a>
          </div>
        </el-form>
      </div>
    </el-card>

    <!-- 页脚 -->
    <footer class="login-footer">
      <p>© 2025 My Chat.</p>
    </footer>
  </div>
</template>

<style lang="less" scoped>
.login-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #fff;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

/* 背景装饰 */
.bg-decoration {
  position: absolute;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(10, 175, 230, 0.1) 0%, transparent 70%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 0;
}

.bg-decoration::before {
  content: '';
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, transparent 60%);
  top: -100px;
  right: -100px;
}

/* 登录卡片样式 */
.login-card {
  width: 100%;
  max-width: 420px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  position: relative;
  z-index: 1;
}

/* 卡片头部 */
.card-header {
  position: relative;
  padding: 40px 30px 20px;
  text-align: center;
}

.shine-effect {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 80px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%);
}

.title {
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 10px;
  background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  font-size: 14px;
  color: #000;
  margin: 0;
}

/* 表单样式 */
.form {
  padding: 0 30px 30px;
}

.form-item {
  margin-bottom: 22px;
}

.el-form-item__label {
  color: rgba(255, 255, 255, 0.8) !important;
  font-size: 14px;
  padding-bottom: 8px !important;
}

.custom-input {
  background: rgba(255, 255, 255, 0.07) !important;
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
  border-radius: 10px !important;
  color: #ffffff !important;
  height: 50px !important;
  transition: all 0.3s ease !important;
}

.custom-input:hover {
  border-color: rgba(79, 172, 254, 0.5) !important;
}

.custom-input:focus {
  border-color: #4facfe !important;
  box-shadow: 0 0 0 2px rgba(79, 172, 254, 0.2) !important;
}

.el-input__wrapper {
  background: transparent !important;
}

.el-input__placeholder {
  color: rgba(255, 255, 255, 0.3) !important;
}

.el-input__icon {
  color: rgba(255, 255, 255, 0.5) !important;
}

/* 按钮样式 */
.form-actions {
  margin-top: 30px !important;
  padding: 0 !important;
}

.login-btn {
  width: 100%;
  height: 52px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 10px;
  background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
  border: none;
  color: #0a192f;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.login-btn:hover {
  background: linear-gradient(90deg, #3ca5fc 0%, #00e5fd 100%);
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(79, 172, 254, 0.3);
}

.login-btn:active {
  transform: translateY(0);
  box-shadow: 0 5px 10px rgba(79, 172, 254, 0.2);
}

.icon-right {
  transition: transform 0.3s ease;
}

.rotate-icon {
  transform: rotate(90deg);
}

/* 链接样式 */
.form-links {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  padding: 0 10px;
}

.link-item {
  color: rgba(79, 172, 254, 0.8);
  font-size: 14px;
  text-decoration: none;
  transition: all 0.2s ease;
  position: relative;
  padding-bottom: 2px;
}

.link-item::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 1px;
  background-color: #4facfe;
  transition: width 0.3s ease;
}

.link-item:hover {
  color: #4facfe;
}

.link-item:hover::after {
  width: 100%;
}

/* 页脚 */
.login-footer {
  margin-top: 30px;
  color: rgba(255, 255, 255, 0.4);
  font-size: 12px;
  text-align: center;
  z-index: 1;
}
</style>
