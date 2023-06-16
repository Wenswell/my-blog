```bash
mkdir client
mkdir servers

cd servers

yarn add express        # 创建Web应用
yarn add nodemon        # 自动重启服务
yarn add multer         # 处理文件上传
yarn add sqlite3@5.0.0  # 操作 SQLite 数据库
yarn add uuid
yarn add ejs

echo > app.js
# 引入文件
# 使用中间件
# # 开放跨域请求
# # 解析JSON
# # 允许上传文件
# 开启监听

mkdir ./utils
# 引入雪花id生成器 https://github.com/yitter/IdGenerator/blob/master/JavaScript/README.md

mkdir ./public/upload/temp

mkdir ./db
# 创建 SQLite 数据库
# 3 张表
# # admin
# # blog
# # category
# db/index.js
# # 导出db、genid

mkdir ./router
# 测试 db、genid
# 设置好路由后在app.js中导入

```

```bash
nodemon app.js
```


# 踩坑

## db.run 不能查询
```js
const getCategorySql = 'SELECT * FROM `category`'
// 查询使用db.all而不是db.run
const rows = await db.async.run(getCategorySql, [])
console.log(rows === undefined)
```

## 中间件顺序

```js
app.use(require('./router'))
// 先定义了路由导致multer使用失败
app.use(multer({
  dest: "./public/upload/temp",
}).any())
```