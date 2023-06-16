const express = require('express')
const router = express.Router()

const { db, genid } = require('../../db')

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
    id: genid.NextId(),
    out
  })
})

module.exports = router