# servers
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

# client

> Vue3 项目使用 VSCode 扩展 Volar 而不是 vetur

```bash
# 回到根目录
yarn create vite
# client
# Vue
# JavaScript

# 进入项目
cd client

# 初始化
yarn

# 首次运行
yarn run dev

# 安装库

# axios - 异步 HTTP 请求库 
yarn add axios
# 轻量级 Vue 3 state 管理器
yarn add pinia
# Vue 的路由库
yarn add vue-router@4
# Vue 封装的富文本编辑器 
yarn add @wangeditor/editor
yarn add @wangeditor/editor-for-vue@next

# CSS 预处理器 
yarn add sass -D
# 轻量级 Vue UI 库
yarn add naive-ui -D
# 包含400多款免费字体
yarn add vfonts -D

# 自动导入组件
yarn add unplugin-auto-import -D
yarn add unplugin-vue-components -D

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
app.use(require('@router'))
// 先定义了路由导致multer使用失败
app.use(multer({
  dest: "./public/upload/temp",
}).any())
```


## 保留关键字

```js
[plugin:vite:vue] [vue/compiler-sfc] Unexpected token (66:32)
// 报错找不到原因
// 使用了new作为参数
```


## 绑定


- :searchKeyword 是Props绑定,只有在组件初始化的时候才会生效
- @searchKeyword 是事件绑定,可以响应组件内部的更改和用户操作

具体分析:

- 你使用的:<HomeNav :searchKeyword="searchKeyword" />

这是一个Props绑定,searchKeyword是一个数据,它只会在组件初始化的时候传入子组件。

- 你想要的效果:<HomeNav @searchKeyword="searchKeyword" />

这是一个事件绑定,子组件可以通过$emit触发该事件,并把参数传给父组件的searchKeyword方法。

这相当于一个父子间的通信。

而Props绑定只是一个静态的传值,不会响应后续的变化。


## 依赖变动

- 添加、移除操作之后最好清除缓存 `yarn cache clean`
- 或者重新安装

## ref reactive

> 如果父组件使用`const valueModel = reactive([]);`给子组件绑定props不能得到子组件的值

使用 `reactive` 函数可以将一个普通的 JavaScript 对象转换为响应式对象，从而在 Vue 组件中能够实现自动更新视图的效果。然而，`reactive` 函数只是将一个普通对象转换为响应式对象，它并没有为对象中的属性添加 getter 和 setter，所以在访问对象属性时需要使用 `valueModel.value` 来获取实际的值。

因此，如果在父组件中使用 `const valueModel = reactive([])` 来定义 `valueModel`，则在子组件中通过 `props` 接收到的是一个响应式对象，而不是数组。这时，如果直接在子组件中修改 `valueModel` 的值，就会导致 Vue 无法正确地监听到值的变化，从而无法实现自动更新视图的效果。



