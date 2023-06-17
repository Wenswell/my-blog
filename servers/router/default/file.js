const router = require('express').Router()
const fs = require('fs')
const path = require('path')
const { db, genid } = require('@db')


/* 

接口汇总 /

/_token/rich_editor_upload
/_token/upload
/download

 */


// wangEditor的图片上传接口
router.post('/_token/rich_editor_upload', async (requset, result) => {
  // https://www.wangeditor.com/v5/menu-config.html#上传图片

  const files = requset.files
  const fileNameList = []

  if (!files) {
    result.send({
      "errno": 1, // 只要不等于 0 就行
      "message": "失败信息"
    })
    return
  }
  
  // console.log("result.files", requset.files)
  // console.log("files", files)
  files.forEach(file => {

    // 获取后缀
    const lastDotIndex = file.originalname.lastIndexOf('.');
    // 获取文件名 => const filename = file.originalname.substring(0, lastDotIndex);
    const ext = file.originalname.substring(lastDotIndex + 1);
    // 生成新文件名      
    const newFilename = genid.NextId() + '.' + ext;

    // 移动并修改文件名
    fs.renameSync(
      path.join(process.cwd(), 'public', 'upload', 'temp', file.filename),
      path.join(process.cwd(), 'public', 'upload', newFilename)
    )

    // 收集文件名用于返回
    fileNameList.push(`/upload/${newFilename}`)
  })

  result.send({
    "errno": 0, // 注意：值是数字，不能是字符串
    "data": {
      // 每次只能上传一张图片
      "url": fileNameList[0], // 图片 src ，必须
      // "alt": "yyy", // 图片描述文字，非必须
      // "href": "zzz" // 图片的链接，非必须
    }
  })

})



// 上传文件
router.post('/_token/upload', (request, result) => {

  // 获取所有上传的文件
  const files = request.files

  if (!files) {
    result.send({
      code: 400,
      msg: "上传文件不能为空"
    })
    return
  }

  // 收集服务端文件名用于返回
  const fileNameList = []

  // 遍历所有文件
  files.forEach(file => {

    // 获取后缀
    const lastDotIndex = file.originalname.lastIndexOf('.');
    // 获取文件名 => const filename = file.originalname.substring(0, lastDotIndex);
    const ext = file.originalname.substring(lastDotIndex + 1);
    // 使用时间戳作为新文件名      
    const newFilename = Date.now() + '.' + ext;

    // 移动并修改文件名
    fs.renameSync(
      path.join(process.cwd(), 'public', 'upload', 'temp', file.filename),
      path.join(process.cwd(), 'public', 'upload', newFilename)
    )

    // 收集文件名用于返回
    // 拼接地址后即可访问
    // eg. http://localhost:3123/upload/1686923848106.jpg
    fileNameList.push(`/upload/${newFilename}`)
  })

  result.send({
    code: 200,
    msg: "ok",
    data: fileNameList,
  })

})

// 下载文件
router.get('/download', async (req, res) => {
  // 获取查询参数中的文件名
  const fileName = req.query.fileName;
  // 构建文件的完整路径
  const filePath = `${process.cwd()}/public/upload/${fileName}`;
  // 使用 res.download() 方法发送文件给客户端进行下载
  res.download(filePath);
  // .download 完整方法：
  // res.download(filePath, 'img.png', err=>{
  //   if(err){
  //     // 处理错误
  //   } else {
  //     // 下载成功后执行，比如扣除积分
  //   }
});


// 导出路由 
module.exports = router