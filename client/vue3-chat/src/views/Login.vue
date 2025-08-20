<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from '../stores/counter'
import axios from 'axios';
const router = useRouter()
const user = useStore()
const formData = ref({
  username: '',
  password: ''
})
const formDataRef = ref();
const rules = {
  username: [{ required: true, message: "请输入账号", trigger: 'blur' }],
  password: [{ required: true, message: "请输入密码", trigger: 'blur' }],
};
const login = () => {
  user.setUsername(formData.value.username); // 保存用户名到状态管理
  router.push('/index'); // 跳转到首页
  console.log('登录成功')
  // axios.post('http://localhost:3000/user', { username: formData.value.username, password: formData.value.password })
  //   .then(res => {
  //     user.username = formData.value.username; // 保存用户名到状态管理
  //     router.push('/index'); // 跳转到首页
  //     console.log('登录成功', res.data);
  //   })
  //   .catch(err => {
  //     console.error('请求错误', err);
  //   });
}
</script>

<template>
  <div class="bg">
    <el-card class="login-card">
      <h1 class="title">登录</h1>
      <div class="form">
        <el-form label-position="top" :model="formData" :rules="rules" ref="formDataRef" @submit.prevent>
          <!--input输入-->
          <el-form-item label="账号：" prop="username">
            <el-input clearable placeholder="请输入账号..." v-model.trim="formData.username"></el-input>
          </el-form-item>
          <el-form-item label="密码：" prop="password">
            <el-input show-password clearable placeholder="请输入密码..." v-model.trim="formData.password"></el-input>
          </el-form-item>
          <el-form-item style="padding: 0;">
            <el-button @click="login" type="primary" style="width: 100%;margin: 0;">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<style lang="less" scoped>
.bg {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url('../assets/bg.jpg');
    background-size: 100% 100%;
    filter: blur(10px);
    z-index: 1;
  }

  .login-card {
    position: relative;
    z-index: 2;
    width: 600px;

    .title {
      margin: 0;
      text-align: center;
      border-bottom: 2px solid #000;
      padding-bottom: 10px;
    }

    .form {
      margin: 60px 0 0 0;
      padding: 0 20px;
      // background-color: pink;
      // width: 100%;
      // height: 150px;
      display: flex;
      flex-direction: column;

      // justify-content: center;
      // align-items: center;
      :deep(.el-form-item) .el-form-item__content {
        margin-left: 0 !important;
        display: flex;
        justify-content: center;
      }
    }
  }
}
</style>
