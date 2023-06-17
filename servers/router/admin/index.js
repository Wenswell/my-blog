const express = require('express')
const router = express.Router()

const { v4: uuidv4 } = require('uuid')

const { db, genid } = require('../../db')

// 管理员登录
router.post('/login', async (requset, result) => {

  try {

    // 提取账号密码
    const { account, password } = requset.body

    // 查询账号密码
    const sql = ` select * from \`admin\`
                  where \`account\` = ?
                  and \`password\` = ?`
    const rows = await db.async.all(sql, [account, password])

    // 无结果则失败
    if (rows.length === 0) {
      result.send({
        code: 500,
        msg: '登录失败'
      })
    } else {

      // 生成token
      const loginTkoen = uuidv4()
      // 提取id并去除密码
      const { id, password, ...adminInfo } = rows[0];
      // 发送到前端的信息
      const adminData = { ...adminInfo, token: loginTkoen };

      // 更新服务器的token
      const updataTokenSql = 'UPDATE admin SET token = ? WHERE id = ?';
      await db.async.run(updataTokenSql, [loginTkoen, id]);
      result.status(200).json({
        code: 200,
        msg: '登录成功',
        data: adminData,
      });
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
})

module.exports = router