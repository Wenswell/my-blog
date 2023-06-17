const sqlit3 = require('sqlite3').verbose()
const path = require('path')
const GenId = require('../utils/IdGenerator')
const genid = new GenId({
  WorkerId: 1
})

const db = new sqlit3.Database(
  path.join(__dirname, './blog.sqlite3')
);


// 定义一个通用的函数，将具有回调函数参数的函数转换为 Promise 对象的函数
const asyncFunc = func => {
  return (...args) => new Promise((resolve, reject) => {
    // 调用原始函数，并将收集到的所有参数（即 ...args）作为参数传递给它
    func(...args, (err, rows) => {
      if (err) reject(err); // 如果操作出错，将 Promise 对象的状态设置为 rejected
      resolve(rows); // 如果操作成功，将 Promise 对象的状态设置为 fulfilled
    })
  });
}

// 在 db 对象上创建一个新的属性 async，包含三个方法 all、get 和 run
db.async = {
  // bind 确保在异步调用方法时，this 值正确地传递给 SQLite Statement 构造函数
  all: asyncFunc(db.all.bind(db)),
  get: asyncFunc(db.get.bind(db)),
  run: asyncFunc(db.run.bind(db))
};

// db.async = {}
// db.async.all = (sql, params) => {
//   return new Promise((resolve, rejects)=>{
//     db.all(sql,params,(err, rows)=>{
//       resolve({err,rows})
//     })
//   })
// }
// db.async.run = (sql, params) => {
//   return new Promise((resolve, rejects)=>{
//     db.run(sql,params,(err, rows)=>{
//       resolve({err,rows})
//     })
//   })
// }


module.exports = { db, genid }
