// 引入express
const express = require('express')
// 创建一个 express 的实例 app
const app = express()
// 引入 path 处理路径
const path = require('path')
// 引入 multer 用于上传文件
const multer = require('multer')
// 指定端口
const port = 3123
// 引入数据库
const { db } = require('./db')

// 全局中间件
// 固定代码：开放跨域请求
app.use(function (req, res, next) {
  // 允许来自所有域名的请求
  res.header("Access-Control-Allow-Origin", "*");
  // 允许请求带有Content-Type头
  res.header("Access-Control-Allow-Headers", "*");
  // 允许的HTTP方法
  res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
  // 如果是预检请求(OPTIONS),则直接返回状态200
  if (req.method == "OPTIONS") res.sendStatus(200);
  // 不是预检请求,则继续向下执行其他路由或中间件函数
  else next();
})

// 使用中间件解析JSON
app.use(express.json())

// 定义接收上传文件的目录
const upload = multer({
  dest: "./public/upload/temp",
})

// 所有接口都允许上传
app.use(upload.any())

// 允许访问静态文件
// 当客户端访问匹配的路径时,Express 直接返回对应的静态文件,不需要额外的路由处理
// 根路径默认导向 './public/index.html'
app.use(express.static(path.join(__dirname, 'public')));



const ADMIN_TOKEN_PATH = '/_token'
app.use(async (request, result, next) => {
  if (request.path.indexOf(ADMIN_TOKEN_PATH) > -1) {
    try {
      const { token } = request.headers

      const adminTokenSql = 'SELECT `id` FROM `admin` WHERE `token` = ?'
      const adminTokenResult = await db.async.all(adminTokenSql, [token])
      // adminTokenResult 为 [ { id: 1 } ] 或者 [ ]
      if (adminTokenResult.length === 0) {
        result.send({
          code: 403,
          msg: '需要登录',
          data: null
        })
        return
      }
    } catch (err) {
      console.error(err)
      result.send({
        code: 500,
        msg: '服务器错误',
        data: null
      })
      return
    }
  }
  next()
})


// 默认导向router，不在app.js中写请求处理
// app.use('/db',require('./router/DbRouter'))
app.use(require('./router'))

// 监听端口
app.listen(port, () => {
  console.log(`服务启动成功: http://localhost:${port}/`)
})