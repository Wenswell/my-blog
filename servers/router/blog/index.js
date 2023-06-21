const express = require('express')
const router = express.Router()
const { db, genid } = require('@db')
const Joi = require('joi');

const schemaId = Joi.object({
  id: Joi.number().required(),
});

const schemaAddBlog = Joi.object({
  title: Joi.string().required(),
  categoryId: Joi.number().integer().allow(null),
  tags: Joi.string(),
  content: Joi.string()
});

const schemaIdTitleCateCont = Joi.object({
  id: Joi.number().required(),
  title: Joi.string().required(),
  categoryId: Joi.number().integer().allow(null),
  content: Joi.string()
});

/* 

接口汇总 /blog

/detail
/search
/_token/delete
/_token/update
/_token/add

 */

// GET 搜索文章
// 必须参数: id
router.get('/detail', async (request, result) => {

  // 从请求参数中获取查询条件
  const { id } = request.query

  const detailSql = 'SELECT * FROM `blog` WHERE `id` = ?'

  try {
    // 执行查询操作，并获取查询结果和查询数据总数
    const detailResult = await db.async.all(detailSql, [id])
    // 前端统一使用categoryId
    const { category_id, ...rest } = detailResult[0];
    const updatedDetailResult = [{ categoryId: category_id, ...rest }];
    // console.log("updatedDetailResult", updatedDetailResult)
    result.send({
      code: 200,
      msg: '加载成功',
      result: updatedDetailResult
    })


  } catch (err) {
    result.send({
      code: 500,
      msg: '加载失败'
    })
    console.log(err);
    // 抛出错误
    throw err;
  }

})

// GET 搜索文章
// 必须参数: id
router.get('/search', async (request, result) => {

  // 从请求参数中获取查询条件
  const { keyword, categoryId,tags , page, pageSize } = request.query

  // 设置默认值
  const defaultPage = 1
  const defaultPageSize = 10
  const defaultCategoryId = 0
  const defaultTags = ''
  const defaultKeyword = ''


  // 规范化查询条件，避免 undefined null
  const newPage = page || defaultPage
  const newPageSize = pageSize || defaultPageSize
  const newCategoryId = categoryId || defaultCategoryId
  const newTags = tags || defaultTags
  const newKeyword = keyword || defaultKeyword

  // 初始化参数列表
  const params = []
  // 初始化查询语句列表
  const whereSql = []

  // 如果 categoryId 存在则添加至查询语句及参数列表中
  if (newCategoryId != defaultCategoryId) {
    whereSql.push(' `category_id`= ? ')
    params.push(newCategoryId)
  }

  // 如果 tags 存在则添加至查询语句及参数列表中
  if (newTags != defaultTags) {
    const tagsArr = newTags.split(',')
    if(tagsArr.length>0){
      tagsArr.forEach(item=>{
        whereSql.push(' `tags` LIKE ? ')
        params.push(`%${item}%`)
      })
    }

  }

  // 如果 keyword 存在则添加至查询语句及参数列表中
  if (newKeyword != defaultKeyword) {
    whereSql.push(' (`title` LIKE ? OR `content` LIKE ?) ')
    params.push(`%${newKeyword}%`)
    params.push(`%${newKeyword}%`)
  }

  // 根据 whereSql 查询语句列表 的长度来确定 查询语句
  // 避免出现 WHERE 关键字缺失或多余的情况
  const whereSqlToStr = whereSql.length > 0 ? `WHERE ${whereSql.join(' AND ')}` : ''

  // 构建最终的查询数据的 SQL 语句和参数
  const searchSql = `SELECT \`id\`,\`category_id\`,\`tags\`,\`title\`,substr(\`content\`,0,250) AS \`content\`, \`create_time\` FROM \`blog\` ${whereSqlToStr} ORDER BY \`create_time\` DESC LIMIT ?, ?`
  const searchParams = [...params, (newPage - 1) * newPageSize, newPageSize]
  
  // 构建最终的查询数据总数的 SQL 语句和参数
  const getSearchCountSql = `SELECT COUNT(*) FROM \`blog\` ${whereSqlToStr}`
  const getSearchCountParams = params
  
  try {
    // 执行查询操作，并获取查询结果和查询数据总数
    const searchResult = await db.async.all(searchSql, searchParams)
    const getSearchCountResult = await db.async.all(getSearchCountSql, getSearchCountParams)

    result.send({
      code: 200,
      msg: '加载成功',
      result: {
        page: newPage,
        pageSize: newPageSize,
        categoryId: newCategoryId,
        keyword: newKeyword,
        list: searchResult,
        count: getSearchCountResult[0]['COUNT(*)']
      }
    })


  } catch (err) {
    result.send({
      code: 500,
      msg: '加载失败'
    })
    console.log(err);
    // 抛出错误
    throw err;
  }

})


// DELETE 删除文章
// 必须参数: id
// 格式： /category/delete?id={id}
router.delete('/_token/delete', async (request, result) => {
  const { error, value } = schemaId.validate({ id: request.query.id });

  if (error) {
    return result.status(400).send({
      code: 400,
      msg: error.details[0].message
    });
  }

  const id = value.id
  const deleteBlogSql = 'DELETE FROM `blog` WHERE `id` = ?'
  try {
    await db.async.run(deleteBlogSql, [id])
    result.send({
      code: 200,
      msg: '删除成功'
    })

  } catch (err) {
    result.send({
      code: 500,
      msg: '删除失败'
    })
    console.log(err);
    // 抛出错误
    throw err;
  }
})

// PUT 修改文章
// 必须参数: id, title
// 可选参数: categoryId content
router.put('/_token/update', async (request, result) => {
  const { error, value } = schemaIdTitleCateCont.validate(request.body);

  if (error) {
    return result.status(400).send({
      code: 400,
      msg: error.details[0].message
    });
  }

  // 验证成功后获得参数
  const { id, title, categoryId, content } = value;
  console.log("value", value)
  // 参数顺序固定为 type id

  const findId = await db.async.all('SELECT `id` FROM `blog` WHERE `id`=?', id)
  if (!findId.length) return result.status(400).send({
    code: 400,
    msg: '无对应 id 的文章'
  });

  const updateyBlogSql = 'UPDATE `blog` SET `title` = ?, `category_id` = ?, `content` = ? WHERE `id` = ?'
  const params = [title, categoryId, content, id]

  try {
    await db.async.run(updateyBlogSql, params)
    result.send({
      code: 200,
      msg: '更新成功'
    })

  } catch (err) {
    result.send({
      code: 500,
      msg: '更新失败'
    })
    console.log(err);
    // 抛出错误
    throw err;
  }
})

// POST 新增博客文章
// 必须参数: title
// 可选参数: categoryId content
router.post('/_token/add', async (request, result) => {
  const { error, value } = schemaAddBlog.validate(request.body);

  if (error) {
    return result.status(400).send({
      code: 400,
      msg: error.details[0].message
    });
  }

  const { title, categoryId, tags, content } = value
  const id = genid.NextId()
  const create_time = new Date().getTime()

  const insertBlogSql = 'INSERT INTO `blog` (`id`, `title`, `category_id`, `tags`,`content`, `create_time`) VALUES (?,?,?,?,?,?)'
  const params = [id, title, categoryId, tags, content, create_time]

  try {
    await db.async.run(insertBlogSql, params)
    result.send({
      code: 200,
      msg: '添加成功'
    })

  } catch (err) {
    result.send({
      code: 500,
      msg: '添加失败'
    })
    console.log(err);
    // 抛出错误
    throw err;
  }
})


// GET 获取标签tags
router.get('/get_tags', async (requset, result) => {
  // const getAllTagsSql = `SELECT DISTINCT "tags" FROM "blog" WHERE "tags" IS NOT NULL;`
  const getAllTagsSql = `SELECT DISTINCT "value" FROM "blog" CROSS JOIN json_each("tags") WHERE json_valid("tags");`
  try {
    const allTag = await db.async.all(getAllTagsSql, [])
    const uniqueTagsArray = allTag.map((item) => item.value);
    // const tagsArray = [];
    // 展开为一维数组
    // allTag.forEach(obj => tagsArray.push(...obj.tags.split(",")));
    // 用set去重
    // const uniqueTagsArray = [...new Set(tagsArray)];
    result.send({
      code: 200,
      msg: '标签获取成功',
      result: uniqueTagsArray,
    })

  } catch (err) {
    result.send({
      code: 500,
      msg: '加载失败'
    })
    console.log(err);
    // 抛出错误
    throw err;
  }
})

// // 必须参数: id
// // 格式： /category/delete?id={id}
// router.get('/get', async (request, result) => {
//   const getCategorySql = 'SELECT * FROM `category`'
//   try {
//     const rows = await db.async.all(getCategorySql, [])
//     console.log("rows", rows)
//     result.send({
//       code: 200,
//       msg: '获取成功',
//       result: rows
//     })

//   } catch (err) {
//     result.send({
//       code: 500,
//       msg: '获取失败'
//     })
//     console.log(err);
//     // 抛出错误
//     throw err;
//   }
// })









module.exports = router