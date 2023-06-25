const { verifyToken, generateAccessToken } = require('@utils/token/jwt')
const ADMIN_TOKEN_PATH = '/_token'

module.exports = async (request, result, next) => {
  if (request.path.indexOf(ADMIN_TOKEN_PATH) > -1) {
    try {
      // 全部为小写
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
}