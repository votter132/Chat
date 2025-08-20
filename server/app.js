const express = require('express')
const { Server } = require('socket.io')
const http = require('http')
const { log } = require('console')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const cors = require('cors')
const e = require('express')
const app = express()
app.use(cors())
app.use(express.json())

const server = http.createServer(app)
const io = new Server(server, {
  cors: true
})
let users = []
io.on('connection', (socket) => {
  // 新用户连接
  const username = socket.handshake.query.username
  console.log(`${username} 已连接`)
  if (users.some(user => user.username === username)) {
    users = users.map(user => user.username === username ? { ...user, id: socket.id } : user)
  } else {
    users.push({ id: socket.id, username: username })
  }
  // 一对一聊天
  io.emit('userList', users) // 向所有用户发送在线用户列表
  // 私聊
  socket.on('send', (msg) => {
    console.log('收到消息:', msg)
    socket.to(msg.to).emit('message', {
      from: msg.username,
      msg: msg.content,
    })
  })
  socket.on('disconnect', () => {
    console.log('已断开连接')
  })

})

app.post('/user', (req, res) => {
  console.log('收到用户注册请求:', req.body)
  const { username, password } = req.body
  console.log('用户名:', username)
  prisma.user.create({
    data: {
      name: username,
      // password: password
    }
  }).then(user => {
    res.status(201).json({ message: '用户创建成功', user })
  }).catch(error => {
    console.error('创建用户失败:', error)
    res.status(500).json({ message: '创建用户失败' })
  })
})

server.listen(3000, () => {
  log('服务器已启动，http://localhost:3000')
})