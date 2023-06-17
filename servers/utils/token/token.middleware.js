const { verifyToken } = require('@utils/token/jwt')
const ADMIN_TOKEN_PATH = '/_token'

module.exports = async (request, result, next) => {
  if (request.path.indexOf(ADMIN_TOKEN_PATH) > -1) {
    try {
      // 全部为小写
      const { accesstoken, refreshtoken } = request.headers

      verifyAccess = verifyToken(accesstoken)
      verifyRefresh = verifyToken(refreshtoken)

      if (!verifyAccess) {
        result.send({
          code: 401,
          msg: '需要更新accesstoken',
          data: null
        })
        return
      }
      if (!verifyRefresh) {
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
}