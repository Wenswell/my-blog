const express = require('express')
const router = express.Router()
const { db, genid } = require('@db')
const Joi = require('joi');

const schemaId = Joi.object({
  id: Joi.number().required(),
});

const schemaType = Joi.object({
  type: Joi.string().min(1).max(25).required(),
});

const schemaIdType = Joi.object({
  id: Joi.number().required(),
  type: Joi.string().min(1).max(25).required(),
});

/* 

接口汇总 /category
/get
/_token/delete
/_token/update
/_token/add

 */


// GET 获取分类
// 必须参数: id
// 格式： /category/delete?id={id}
router.get('/get', async (request, result) => {
  const getCategorySql = 'SELECT * FROM `category`'
  try {
    const rows = await db.async.all(getCategorySql, [])
    console.log("rows", rows)
    result.send({
      code: 200,
      msg: '获取成功',
      result: rows
    })

  } catch (err) {
    result.send({
      code: 500,
      msg: '获取失败'
    })
    console.log(err);
    // 抛出错误
    throw err;
  }
})

// DELETE 删除分类
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
  const deleteCategorySql = 'DELETE FROM `category` WHERE `id` = ?'
  try {
    await db.async.run(deleteCategorySql, [id])
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

// PUT 修改分类
// 必须参数: id, NEW-type
router.put('/_token/update', async (request, result) => {
  const { error, value } = schemaIdType.validate(request.body);

  if (error) {
    return result.status(400).send({
      code: 400,
      msg: error.details[0].message
    });
  }

  // 验证成功后获得参数
  const { id, type } = value;
  // 参数顺序固定为 type id

  const findId = await db.async.all('SELECT `id` FROM `category` WHERE `id`=?', id)
  // console.log("findId", findId)
  if (!findId.length) return result.status(400).send({
    code: 400,
    msg: '无对应 id 的分类'
  });

  const updateCategorySql = 'UPDATE `category` SET `type` = ? WHERE `id` = ?'
  try {
    await db.async.run(updateCategorySql, [type, id])
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

// POST 新增分类
// 必须参数: type
router.post('/_token/add', async (request, result) => {
  const { error, value } = schemaType.validate(request.body);

  if (error) {
    return result.status(400).send({
      code: 400,
      msg: error.details[0].message
    });
  }

  const type = value.type
  const insertCategorySql = 'INSERT INTO `category` (`id`, `type`) VALUES (?,?)'
  try {
    await db.async.run(insertCategorySql, [genid.NextId(), type])
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








module.exports = router