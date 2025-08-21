<script setup>
import { ref } from 'vue'
import { useUserStore } from '../stores'
import { io } from "https://cdn.socket.io/4.7.4/socket.io.esm.min.js";
import axios from 'axios';
const userStore = useUserStore()
const textarea = ref('')
const activeIndex = ref()
const socket = io('http://localhost:3000', {
  query: {
    username: userStore.userInfo.username,
    id: userStore.userInfo.id
  }
}); //地址
const userList = ref([]) //在线用户列表
// 发送的消息对象
const sendMsg = {
  reciveName: '',
  sendName: userStore.userInfo.username,
  sendId: '',
  reciveId: '',
  toSocketId: '',
  msg: ''
}
socket.on('userList', (users) => {
  userList.value = users
  console.log('在线用户列表:', users)
})

socket.on('message', (data) => {
  msgBox.value.push({
    sendName: data.sendName,
    sendId: data.sendId,
    reciveId: data.reciveId,
    reciveName: data.reciveName,
    msg: data.msg
  })
})
const msgBox = ref([])   // 消息列表
const changeUser = (item) => {
  activeIndex.value = item.id
  sendMsg.toSocketId = item.socketId
  sendMsg.reciveId = item.id
  sendMsg.reciveName = item.username
  console.log(sendMsg);

}
const keyDown = async () => {

  if (textarea.value.trim() === '') {
    return
  }
  sendMsg.msg = textarea.value
  sendMsg.sendId = userStore.userInfo.id
  console.log(sendMsg);

  const res = await axios.post('http://localhost:3000/sendMsg', sendMsg)
  console.log(res);

  if (res.data.code) {
    msgBox.value.push({
      ...sendMsg,
      msg: textarea.value
    })
    textarea.value = ''
  }
}

</script>

<template>
  <div class="box">
    <header>
      <nav>
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" :ellipsis="false"
          @select="handleSelect">
          <el-menu-item index="0" style="font-size: 28px;">
            C h a t
            <!-- <img style="width: 100px" src="/images/element-plus-logo.svg" alt="Element logo" /> -->
          </el-menu-item>
        </el-menu>
      </nav>
    </header>
    <div class="body">
      <aside>
        <div :class="{ friend: true, active: activeIndex === item.id }" v-for="(item, index) in userList"
          :key="item.socketId" @click="changeUser(item)">
          <img class="image" src="../assets/tx.jpg" alt="">
          <div class="text">{{ item.username }}</div>
        </div>
      </aside>
      <main>
        <el-card class="box-card">
          <div class="card-content">
            <div :class="item.sendId === userStore.userInfo.id ? 'right-box' : ''" v-for="(item, index) in msgBox"
              :key="index">
              <div class="friend">
                <template v-if="item.sendId === userStore.userInfo.id">
                  <div class="text">{{ item.msg }}</div>
                  <div>
                    <img class="image" src="../assets/tx.jpg" alt="">
                    {{ userStore.userInfo.username }}
                  </div>
                </template>
                <template v-else>
                  <div>
                    <img class="image" src="../assets/tx.jpg" alt="">
                    {{ item.sendName }}
                  </div>
                  <div class="text">{{ item.msg }}</div>
                </template>
              </div>
            </div>
          </div>
          <!-- <div class="card-ipt"> -->
          <el-input @keydown.enter="keyDown" class="card-ipt" v-model="textarea" :rows="10" type="textarea"
            placeholder="按下回车发送..." />
          <!-- </div> -->
        </el-card>
      </main>
    </div>

  </div>

</template>
<style lang="less">
:root {
  --active-color: #50ebc9; // 悬停变量
}
</style>
<style lang="less" scoped>
.box {
  width: 100%;
  height: 100vh;
  background-color: pink;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.body {
  display: flex;
  flex: 1;

  aside {
    width: 260px;
    height: 100%;
    background: #fefefe;
    box-sizing: border-box;

    .active {
      background-color: var(--active-color);
    }

    .friend {
      width: 100%;
      height: 80px;
      // background-color: blue;
      border: 1px solid #000;
      box-sizing: border-box;
      margin-top: 10px;
      display: flex;
      align-items: center;
      position: relative;
      /* 用于定位伪元素 */
      overflow: hidden;
      /* 隐藏超出按钮范围的光效 */
      transition: background-color 0.3s ease;

      &:hover {
        background-color: var(--active-color);
      }

      .text {
        flex: 1;
        font-weight: 700;
        text-align: center;
      }

      .image {
        width: 80px;
        height: 80px;
      }
    }

    /* 白光效果伪元素 */
    .friend::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      /* 初始位置在左侧外部 */
      width: 50%;
      height: 100%;
      background: linear-gradient(to right,
          rgba(255, 255, 255, 0) 0%,
          rgba(255, 255, 255, 0.3) 50%,
          rgba(255, 255, 255, 0) 100%);
      transform: skewX(-25deg);
      /* 倾斜效果 */
      transition: left 0.6s ease;
      /* 动画过渡效果 */
    }

    /* 鼠标悬浮时，白光从左向右移动 */
    .friend:hover::before {
      left: 150%;
      /* 结束位置在右侧外部 */
    }
  }

  main {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 20px;
    background-color: #f3f3f3;
    justify-content: center;
    align-items: center;

    .right-box {
      display: flex;
      justify-content: right;
    }

    .box-card {
      width: 100%;
      height: 720px;
      box-sizing: border-box;
      display: flex;

      :deep(.el-card__body) {
        flex: 1;
        display: flex;
        flex-direction: column;
      }

      .card-content {
        width: 100%;
        height: 70%;
        padding: 0 10px;
        // box-sizing: border-box;
        border: 2px solid #f3f3f3;
        // background-color: #ccc;
        overflow: auto;

        .friend {
          width: 50%;
          box-sizing: border-box;
          height: 80px;
          // background-color: blue;
          border: 1px solid #000;
          box-sizing: border-box;
          margin-top: 10px;
          display: flex;
          align-items: center;
          overflow: hidden;

          .text {
            flex: 1;
            font-weight: 700;
            text-align: center;
          }

          .image {
            width: 80px;
            height: 80px;
          }
        }
      }

      .card-ipt {
        width: 100%;
        height: 30%;
        // background-color: red;
      }
    }

  }
}
</style>
