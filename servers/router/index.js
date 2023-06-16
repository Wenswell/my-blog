const express = require('express')
const router = express.Router()









// 单文件导入
router.use(require('./test'))
router.use('/admin',require('./admin'))
router.use('/category',require('./category'))
router.use('/blog',require('./blog'))


// 多文件导入
const { wildcardRouter,fileRouter } = require('./default')

router.use(fileRouter)
// 通用匹配放最后
router.use(wildcardRouter)

module.exports = router