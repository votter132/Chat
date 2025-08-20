<script setup>
import { ref } from 'vue'
import { useStore } from '../stores/counter'
import { io } from "https://cdn.socket.io/4.7.4/socket.io.esm.min.js";
const user = useStore()
const socket = io('http://localhost:3000', {
  query: {
    username: user.username
  }
}); //地址
const userList = ref([]) //在线用户列表
const sendMsg = {
  username: user.username,
  to: ''
}
socket.on('userList', (users) => {
  userList.value = users
  console.log('在线用户列表:', users)
})
const msgBox = ref({})   // 消息列表
const keyDown = () => {
  if (textarea.value.trim() === '') {
    return
  }
  socket.emit('send', {
    ...sendMsg,
    content: textarea.value
  })
  msgBox.value.push({
    ...sendMsg,
    content: textarea.value
  })
  textarea.value = ''
}
const textarea = ref('')
const activeIndex = ref()
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
        <div :class="{ friend: true, active: activeIndex === item.id }" v-for="(item, index) in userList" :key="item.id"
          @click="activeIndex = item.id; sendMsg.to = item.id">
          <img class="image" src="../assets/tx.jpg" alt="">
          <div class="text">{{ item.username }}</div>
        </div>
      </aside>
      <main>
        <el-card class="box-card">
          <div class="card-content">
            <div class="friend">
              <img class="image" src="../assets/tx.jpg" alt="">
              <div class="text ">Votter</div>
            </div>
            <div class="right-box">
              <div class="friend">
                <div class="text ">Votter</div>
                <img class="image" src="../assets/tx.jpg" alt="">
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
