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
io.on('connection', async (socket) => {
  // 新用户连接
  const { id, username } = socket.handshake.query
  console.log(`${username} 已连接`)
  const res = await prisma.user.update({
    where: {
      id: Number(id)
    },
    data: {
      socketId: socket.id
    }
  })
  const userList = await prisma.user.findMany({
    where: {
      // 筛选出socketId存在且非空的用户
      socketId: {
        not: null,
        not: ''
      }
    },
    // 只选择需要的字段：id和username
    select: {
      id: true,
      username: true,
      socketId: true
    }
  });
  // 向所有用户发送消息列表
  io.emit('userList', userList) // 向所有用户发送在线用户列表
  // 私聊
  socket.on('send', (msg) => {
    console.log('收到消息:', msg)

  })
  socket.on('disconnect', async (data) => {
    console.log('已断开连接')
    // const res = await prisma.user.update({
    //   where: {
    //     socketId: socket.id
    //   },
    //   data: {
    //     socketId: ''
    //   }
    // })
  })
})
// 注册接口
app.post('/register', async (req, res) => {
  try {
    console.log("调用注册接口", req.body)
    const { username, password, email } = req.body
    const existingUser = await prisma.user.findMany({
      where: {
        email
      }
    })
    // 数据判断 是否存在该用户
    if (existingUser.length > 0) {
      return res.json({
        code: 0,
        msg: '该邮箱已被注册'
      })
    }
    // 数据添加
    await prisma.user.create({
      data: {
        username,
        password,
        email
      }
    });

    res.json({
      code: 1,
      msg: '注册成功'
    });

  } catch (error) {
    console.error('注册接口错误:', error);  // 记录具体错误信息
    res.json({
      code: -1,
      msg: '注册接口错误'
    });
  }
})

// 登录接口
app.post('/login', async (req, res) => {
  try {
    console.log('收到用户登录请求:', req.body)
    // 从请求体中获取用户名和密码
    const { username, password } = req.body;
    // 查找匹配的用户
    const userInfo = await prisma.user.findMany({
      where: {
        username,
        password,
      }
    })
    console.log(userInfo)

    if (userInfo.length > 0) {
      res.json({
        code: 1,
        msg: '登录成功',
        data: {
          id: userInfo[0].id,
          username: userInfo[0].username
        }
      });
    } else {
      res.json({
        code: 0,
        msg: '用户名或密码不正确'
      });
    }
  } catch (error) {
    console.error('登录接口错误:', error);
    res.json({
      code: -1,
      msg: '服务器错误'
    });
  }
})

// 发送消息接口
app.post('/sendMsg', async (req, res) => {
  try {
    console.log(req.body)
    const newMessage = await prisma.message.create({
      data: {
        content: req.body.msg,
        senderId: req.body.sendId,
        receiverId: req.body.reciveId,
      }
    })
    console.log(newMessage)
    io.to(req.body.toSocketId).emit('message', {
      reciveName: req.body.reciveName,
      sendName: req.body.sendName,
      sendId: req.body.sendId,
      reciveId: req.body.reciveId,
      msg: req.body.msg
    })
    res.json(
      {
        code: 1,
        msg: '发送消息成功'
      }
    )
  }
  catch {
    res.json(
      {
        code: 0,
        msg: '发送消息失败'
      }
    )
  }
})

// 获取好友列表
app.post('/getFriends', async (req, res) => {
  try {
    // 查询当前用户的好友关系，包含好友的详细信息
    const userWithFriends = await prisma.user.findUnique({
      where: {
        id: req.body.id, // 根据实际情况替换获取userId的方式
      },
      include: {
        // 查询当前用户主动发起的好友关系（已接受的）
        friendships: {
          where: {
            status: 'accepted', // 只获取已接受的好友关系，可根据需求调整
          },
          include: {
            friend: true, // 包含好友的用户信息
          },
        },
        // 查询当前用户被他人添加的好友关系（已接受的）
        friendOf: {
          where: {
            status: 'accepted', // 只获取已接受的好友关系，可根据需求调整
          },
          include: {
            user: true, // 包含发起好友关系的用户信息（即好友的信息）
          },
        },
      },
    });

    // 整合主动发起和被动接受的好友信息
    const friends = [
      ...userWithFriends.friendships.map((f) => f.friend),
      ...userWithFriends.friendOf.map((f) => f.user),
    ];

    // 去重（防止同一好友在主动和被动关系中重复出现，可选操作，根据业务需求决定）
    const uniqueFriends = [...new Map(friends.map((friend) => [friend.id, friend])).values()];

    res.json({
      code: 1,
      data: uniqueFriends,
      msg: '获取好友列表成功'
    })
  }
  catch (error) {
    res.json({
      code: 0,
      // data: uniqueFriends,
      msg: `获取好友列表失败->${error}`
    })
  }
})

server.listen(3000, () => {
  log('服务器已启动，http://localhost:3000')
})