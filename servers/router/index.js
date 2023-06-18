const express = require('express')
const router = express.Router()

/* 

接口汇总

/admin/login

/category/get
/category/_token/delete
/category/_token/update
/category/_token/add


/blog/detail
/blog/search
/blog/_token/delete
/blog/_token/update
/blog/_token/add

/rich_editor_upload // 注意：上传接口未做鉴权！
/_token/upload
/download

 */







// 单文件导入
router.use(require('@router/test'))
router.use('/admin', require('@router/admin'))
router.use('/category', require('@router/category'))
router.use('/blog', require('@router/blog'))


// 多文件导入
const { wildcardRouter, fileRouter } = require('@router/default')

router.use(fileRouter)
// 通用匹配放最后
router.use(wildcardRouter)

module.exports = router