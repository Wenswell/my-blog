const { db, genid } = require('@db')

// 更新category表（对应category_id的 博客数量、博客详情列表
function syncUpdateCategoryBlogSumTable() {

  // 如果Blog文章的category_id对应的category已经删除就重置为-1
  const resetCategoryIdSql = `
  UPDATE blog
  SET category_id = -1
  WHERE category_id NOT IN (SELECT id FROM category);`

  // 删除旧 category_updated
  // 创建新 category_updated
  // 用 category 的 id 查找 blog 的数据
  // 保存新数据至 新 category_updated
  const updateNewInfoSql = `UPDATE category
SET blogs_num = (
    SELECT COUNT(blog.id)
    FROM blog
    WHERE blog.category_id = category.id
  ),
  blog_id_title_arr = (
    SELECT '[' || group_concat(json_object('id', blog.id, 'title', blog.title)) || ']'
    FROM blog
    WHERE blog.category_id = category.id
  );`

  return new Promise(async (resolve, reject) => {
    try {
      await db.async.run(resetCategoryIdSql, []);
      await db.async.run(updateNewInfoSql, []);
      resolve('done UpdateCategoryBlogSumTable');
    } catch (err) {
      reject(err);
    }
  });
}


// 更新tag表（对应tag的 博客数量、博客详情列表
function syncUpdateTagBlogSumTable() {
  const emptyTableSql = `
DELETE FROM tag_blog_sum;`
  const insertNewInfoSql = `
INSERT INTO tag_blog_sum (tag, blogs_num, blog_id_title_arr,blog_all_info_arr)
SELECT  tag.value,
        COUNT(*) as blogs_num,
        json_group_array(json_object(
          'id', blog.id, 
          'title', blog.title
          )) as blog_id_title_arr,
        json_group_array(json_object(
         'id', blog.id, 
         'title', blog.title,
         'description', blog.description,
         'category_id', blog.category_id,
         'tags', blog.tags,
         'create_time', blog.create_time,
         'last_edit_time', blog.last_edit_time
         )) as blog_all_info_arr
FROM blog, 
    json_each(blog.tags) tag
WHERE json_valid(blog.tags)
GROUP BY tag.value
ORDER BY blogs_num DESC;`

  return new Promise(async (resolve, reject) => {
    try {
      await db.async.run(emptyTableSql, []);
      await db.async.run(insertNewInfoSql, []);
      resolve('done UpdateTagBlogSumTable');
    } catch (err) {
      reject(err);
    }
  });
}


function updateTables() {
  return Promise.all([
    syncUpdateCategoryBlogSumTable(),
    syncUpdateTagBlogSumTable()
  ]);
}

module.exports = { updateTables };