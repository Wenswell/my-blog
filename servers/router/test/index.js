const express = require('express')
const router = express.Router()
const { db, genid } = require('@db')
const { getKey, getNewKey } = require('@config')

// console.log('ADMIN_SECRET_KEY:', getKey('ADMIN_SECRET_KEY'));
// console.log('USER_SECRET_KEY:', getKey('USER_SECRET_KEY'));
// console.log('ADMIN_SECRET_KEY:', getNewKey('ADMIN_SECRET_KEY'));
// console.log('USER_SECRET_KEY:', getNewKey('USER_SECRET_KEY'));

router.get('/test', async (requset, result) => {
  // 普通方式
  db.all('select * from `admin`', [], (err, rows) => {
    if (err) console.log(err.message)
    else console.log('success, ', genid.NextId())
  })

  // 新增方法
  db.async.all('select * from `admin`', []).then(res => {
    console.log('then res: ', res)
  })

  let out = await db.async.all('select * from `admin`')

  result.send({
    genid: genid.NextId(),
    out
  })
})

module.exports = router