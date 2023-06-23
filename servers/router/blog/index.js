const express = require('express')
const router = express.Router()
const { db, genid } = require('@db')
const { updateTables } = require('@/router/default/updateStatistics')
const Joi = require('joi');

const schemaId = Joi.object({
  id: Joi.number().required(),
});

const schemaAddBlog = Joi.object({
  title: Joi.string().required(),
  // id: Joi.number(), // 添加修改共用
  categoryId: Joi.number().integer().allow(null),
  tags: Joi.string(),
  content: Joi.string(),
  description: Joi.string(),

});

const schemaUpdateBlog = Joi.object({
  id: Joi.number().required(),
  title: Joi.string().required(),
  categoryId: Joi.number().integer().allow(null),
  content: Joi.string(),
  description: Joi.string(),
});

/* 

接口汇总 /blog

/detail
/search
/_token/delete
/_token/update
/_token/add

 */

// GET 单篇文章详情
// 必须参数: id
router.get('/detail', async (request, result) => {

  // 从请求参数中获取查询条件
  const { id } = request.query

  const detailSql = 'SELECT * FROM `blog` WHERE `id` = ?'

  try {
    // 执行查询操作，并获取查询结果和查询数据总数
    const detailResult = await db.async.all(detailSql, [id])
    console.log("detailResult", detailResult)
    // 前端统一使用categoryId
    let updatedDetailResult
    if (detailResult?.category_id) {
      const { category_id, ...rest } = detailResult[0];
      updatedDetailResult = [{ categoryId: category_id, ...rest }];
    }
    // console.log("updatedDetailResult", updatedDetailResult)
    result.send({
      code: 200,
      msg: '加载成功',
      result: updatedDetailResult || detailResult
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
  const { keyword, categoryId, tags, page, pageSize } = request.query

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
    // if (newCategoryId == -1) {
      // whereSql.push(' `category_id` IS NULL ')
    // } else {
      whereSql.push(' `category_id`= ? ')
      params.push(newCategoryId)
    // }
  }

  // 如果 tags 存在则添加至查询语句及参数列表中
  if (newTags != defaultTags) {

    const tagsArr = newTags.split(',')

    if (tagsArr.length > 0) {
      tagsArr.forEach(item => {
        whereSql.push('( `tags` LIKE ? OR  `tags` LIKE ? )')
        params.push(`%"${item}",%`)
        params.push(`%,"${item}"%`)
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

  const fromTwoTableSql = `
  FROM blog AS b
  LEFT JOIN category AS c ON b.category_id = c.id`

  // 构建最终的查询数据的 SQL 语句和参数
  // 只穿description不传内容 substr(\`content\`,0,250) AS \`content\`,
  const searchSql = `
  SELECT b.id, b.category_id, c.type, b.title, b.create_time,b.tags,b.last_edit_time,b.description
  ${fromTwoTableSql}
  ${whereSqlToStr}
  ORDER BY b.create_time DESC LIMIT ?, ?`

  // 构建最终的查询数据总数的 SQL 语句和参数
  const getSearchCountSql = `
  SELECT COUNT(*) 
  ${fromTwoTableSql}
  ${whereSqlToStr}`

  const searchParams = [...params, (newPage - 1) * newPageSize, newPageSize]
  const getSearchCountParams = params

  try {
    // 执行查询操作，并获取查询结果和查询数据总数
    let searchResult = await db.async.all(searchSql, searchParams)
    const getSearchCountResult = await db.async.all(getSearchCountSql, getSearchCountParams)

    // 标签转为数组再发送
    searchResult.forEach(item => {
      item.tags = JSON.parse(item.tags)
    })


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
    await updateTables()
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
  const { error, value } = schemaUpdateBlog.validate(request.body);

  if (error) {
    return result.status(400).send({
      code: 400,
      msg: error.details[0].message
    });
  }
  const last_edit_time = new Date().getTime()

  // 验证成功后获得参数
  let { id, title, categoryId, content, description } = value;
  if (!categoryId) categoryId = -1
  console.log("value", value)
  // 参数顺序固定为 type id

  const findId = await db.async.all('SELECT `id` FROM `blog` WHERE `id`=?', id)
  if (!findId.length) return result.status(400).send({
    code: 400,
    msg: '无对应 id 的文章'
  });

  const updateyBlogSql = 'UPDATE `blog` SET `title` = ?, `category_id` = ?, `content` = ? , `description` = ? , `last_edit_time` = ? WHERE `id` = ?'
  const params = [title, categoryId, content, description, last_edit_time, id]

  try {
    await db.async.run(updateyBlogSql, params)
    await updateTables()
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

  let { title, categoryId, tags, content } = value
  if (!categoryId ) categoryId = -1
  const id = genid.NextId()
  const create_time = new Date().getTime()

  const insertBlogSql = 'INSERT INTO `blog` (`id`, `title`, `category_id`, `tags`,`content`, `create_time`) VALUES (?,?,?,?,?,?)'
  const params = [id, title, categoryId, tags, content, create_time]

  try {
    await db.async.run(insertBlogSql, params)
    await updateTables()
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
  // const getAllTagsSql = `SELECT DISTINCT "value" FROM "blog" CROSS JOIN json_each("tags") WHERE json_valid("tags");`
  const getAllTagsSql = `SELECT "tag" AS "name", "blogs_num" AS "count" FROM "tag_blog_sum" ORDER BY name;`
  try {
    const allTagCount = await db.async.all(getAllTagsSql, [])
    // const uniqueTagsArray = allTag.map((item) => item.value);

    result.send({
      code: 200,
      msg: '标签获取成功',
      result: allTagCount,
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