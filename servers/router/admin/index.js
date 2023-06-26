const express = require('express')
const router = express.Router()

const { db, genid } = require('@db')

const {
  verifyToken,
  generateAccessToken,
  generateRefreshToken } = require('@utils/token/jwt')

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
        msg: '登录失败, 检查账号或密码'
      })
    } else {

      // 提取id并去除密码
      const { id, password, ...adminInfo } = rows[0];

      // 生成token
      const accessToken = generateAccessToken({ id })
      const refreshToken = generateRefreshToken({ id })

      // 发送到前端的信息
      const adminData = { id, ...adminInfo, accessToken, refreshToken };

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

router.get('/verify_token', async(request,result)=>{
  const { accesstoken, refreshtoken } = request.headers
  
  verifyAccess = verifyToken(accesstoken)
  console.log("verifyAccess", verifyAccess)
  verifyRefresh = verifyToken(refreshtoken)
  console.log("verifyRefresh", verifyRefresh)

  if (!verifyAccess) {
    result.send({
      code: 204,
      msg: '需要更新 accesstoken',
      data: { accesstoken: generateAccessToken({a:1}) }
    })
    return
  }
  if (!verifyRefresh) {
    result.send({
      code: 401,
      msg: '需要登录',
      data: null
    })
    return
  }
  result.status(200).json({
    code: 200,
    msg: 'token有效',
    data: null,
  });
})

module.exports = router