<template>
  ------------------------------------------------------------
  <br>  
  ------------------------------------------------------------
  <br> 
  ------------------------------------------------------------
  <br> 
  ------------------------------------------------------------
  <br> 
  ------------------------------------------------------------
  <br> 
  ------------------------------------------------------------
  <div style="position: fixed;top: 1rem;right: 1rem;display: block;background-color: antiquewhite;">
    <br> 111{{ activeTitle }}
    <ul>
      <li v-for="item in tableOfContents" :key="item.id" @click="scrollTo(item.el)" :class="{ 'active': activeTitle === item.id }">
        {{ item.text }}
        <ul v-if="item.children.length" v-show="activeTitle === item.id || item.children.some(child => child.id === activeTitle)">          
          activeTitle: {{ activeTitle }}. item.id: {{ item.id }}.
          <li v-for="child in item.children" :key="child.id" @click.stop="scrollTo(child.el)">
            {{ child.text }}

          </li>
        </ul>
      </li>
    </ul>
  </div>
  ------------------------------------------------------------
  <br>

  <ul>
    <li v-for="item in tableOfContents" :key="item.id" @click="scrollTo(item.el)" :class="{ 'active': activeTitle === item.id }">
      <a :href="'#' + item.id">{{ item.text }}</a>
      <TableOfContents v-if="item.children" :toc="item.children" />
    </li>
  </ul>
  <div ref="article">
    <!-- 文章内容 -->

    <!-- {{ getTitles() }} -->
    <h1 id="chapter-1">第一章</h1>
    <p>第一章前言</p>

    <h2 id="chapter-1-section-1">第一节</h2>
    <p>第一节内容</p>

    <h3 id="chapter-1-section-1-subsection-1">第一节第一小节</h3>
    <p>第一节第一小节内容</p>

    <h4 id="chapter-1-section-1-subsection-1-subsubsection-1">第一节第一小节第一小小节</h4>
    <p>第一节第一小节第一小小节内容</p>

    <h3 id="chapter-1-section-1-subsection-2">第一节第二小节</h3>
    <p>第一节第二小节内容</p>

    <h2 id="chapter-1-section-2">第二节</h2>
    <p>第二节内容</p>

    <h3 id="chapter-1-section-2-subsection-1">第二节第一小节</h3>
    <p>第二节第一小节内容</p>

    <h4 id="chapter-1-section-2-subsection-1-subsubsection-1">第二节第一小节第一小小节</h4>
    <p>第二节第一小节第一小小节内容</p>

    <h3 id="chapter-1-section-2-subsection-2">第二节第二小节</h3>
    <p>第二节第二小节内容</p>

    <h2 id="chapter-2">第二章</h2>
    <p>第二章前言</p>

    <h3 id="chapter-2-section-1">第一节</h3>
    <p>第一节内容</p>

    <h4 id="chapter-2-section-1-subsection-1">第一节第一小节</h4>
    <p>第一节第一小节内容</p>

    <h5 id="chapter-2-section-1-subsection-1-subsubsection-1">第一节第一小节第一小小节</h5>
    <p>第一节第一小节第一小小节内容</p>

    <h4 id="chapter-2-section-1-subsection-2">第一节第二小节</h4>
    <p>第一节第二小节内容</p>

    <h3 id="chapter-2-section-2">第二节</h3>
    <p>第二节内容</p>

    <h4 id="chapter-2-section-2-subsection-1">第二节第一小节</h4>
    <p>第二节第一小节内容</p>

    <h5 id="chapter-2-section-2-subsection-1-subsubsection-1">第二节第一小节第一小小节</h5>
    <p>第二节第一小节第一小小节内容</p>

    <h4 id="chapter-2-section-2-subsection-2">第二节第二小节</h4>
    <p>第二节第二小节内容</p>
    ------------------------------------------------------------

  </div>
</template>

<script setup>
import { reactive } from 'vue';


let tableOfContents = reactive([])

const article = ref(null)
onMounted(() => {
  tableOfContents = generateTableOfContents(article.value)
  window.addEventListener("scroll", handleScroll);

})
let activeTitle =ref([])
const scrollTo =(element)=> {
    element.scrollIntoView({ behavior: "smooth" });
}
const handleScroll = ()=> {
    let closestTitle = null;
    let closestOffset = Number.POSITIVE_INFINITY;
    function traverseNestedArray(arr, callback) {
  arr.forEach((item) => {
    callback(item);
    if (item.children && item.children.length > 0) {
      traverseNestedArray(item.children, callback);
    }
  });
}
traverseNestedArray(tableOfContents, (item) => {
      const offset = Math.abs(item.el.getBoundingClientRect().top);
      console.log("item", item)
      console.log("item.el.getBoundingClientRect()", item.el.getBoundingClientRect())
      console.log("offset", offset)

      if (offset < closestOffset) {
        closestTitle = item.id;
        closestOffset = offset;
      }
    })

    activeTitle.value = closestTitle;
  }


/**
 * 生成HTML格式文章的目录
 * @param {HTMLElement} articleElement - 文章的HTML元素
 * @returns {Array} 返回多层目录数组，根据标签名h1，h2，h3等分层
 */

function generateTableOfContents(articleElement) {
  const matches = articleElement.innerHTML.match(/<(h[1-6]).*?(?=id=").*?id="(.*?)">.*?(<\/h[1-6]>)/g);
  if (!matches) return [];

  let tableOfContents = [];
  let stack = [];

  matches.forEach(match => {
    console.log("------------match", match)
    const tag = match.match(/<h[1-6]/)[0].substr(1);
    const id = match.match(/id="(.*?)"/)[1];
    const text = match.match(/>(.*?)</)[1];
    const el = document.getElementById(id);

    const newItem = {
      id,
      el,
      tag,
      text,
      children: []
    };

    if (!stack.length) {
      stack.push(newItem);
      tableOfContents.push(newItem);
    } else {
      while (stack.length) {
        const top = stack[stack.length - 1];
        if (parseInt(top.tag[1], 10) < parseInt(tag[1], 10)) {
          top.children.push(newItem);
          stack.push(newItem);
          break;
        } else {
          stack.pop();
        }
      }
      if (!stack.length) {
        stack.push(newItem);
        tableOfContents.push(newItem);
      }
    }
  });

  return tableOfContents;
}
</script>

<style lang="scss" scoped></style>