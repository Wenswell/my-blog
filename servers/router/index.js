const express = require('express')
const router = express.Router()

/* 

接口汇总

/admin/login

/category/get
/category/_token/delete
/category/_token/update
/category/_token/add

/blog/search
/blog/_token/delete
/blog/_token/update
/blog/_token/add

/_token/rich_editor_upload
/_token/upload
/download

 */







// 单文件导入
router.use(require('./test'))
router.use('/admin', require('./admin'))
router.use('/category', require('./category'))
router.use('/blog', require('./blog'))


// 多文件导入
const { wildcardRouter, fileRouter } = require('./default')

router.use(fileRouter)
// 通用匹配放最后
router.use(wildcardRouter)

module.exports = router