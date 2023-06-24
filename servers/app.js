// module-alias changes the default behavior of require
// 必须放在最开始
require('module-alias/register')
// 引入 module-alias 定义路径别名
const moduleAlias = require('module-alias')

moduleAlias.addAlias('@', __dirname)
moduleAlias.addAlias('@db', __dirname + '/db')
moduleAlias.addAlias('@utils', __dirname + '/utils')
moduleAlias.addAlias('@config', __dirname + '/utils/config')
moduleAlias.addAlias('@router', __dirname + '/router')
moduleAlias.addAlias('@public', __dirname + '/public')

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

// 验证token
app.use(require('@utils/token/token.middleware'))

// 默认导向router，不在app.js中写请求处理
// app.use('/db',require('@router/DbRouter'))
app.use(require('@router'))

// 监听端口
const server = app.listen(port, '0.0.0.0', () => {
  const { address, port } = server.address();
  console.log(`服务启动成功: http://${address}:${port}/`);
});