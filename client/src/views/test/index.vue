<template>
  <div ref="article">
    <!-- 文章内容 -->
    <span style="position: fixed;" class="progress">p{{ progress }}</span>

    {{  }}
    <!-- {{ getTitles() }} -->
    <h1>目录</h1>
    <ul>
      <li><a href="#chapter-1">第一章</a></li>
      <li><a href="#chapter-2">第二章</a></li>
    </ul>

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
    titles{{ titles }}
    ------------------------------------------------------------

    <div class="catalog-content">catalog-content
      <div v-for="title in titles" :key="title.id" @click="scrollToView(title.scrollTop)" :class="[
        'catalog-item',
        title.id == title.id ? 'active' : 'not-active',
      ]" v-show="title.isVisible" :title="title.rawName">
        {{ title.name }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';

const aass = (() => {
  
  return getTitles(article.value);
});


const article = ref(null)

onMounted(() => {
  console.log("xxx", xxx)
  xxx = aass()
  console.log("xxx", xxx)
  console.log("aass", aass())
  console.log("titles", titles)
  console.log(JSON.parse(JSON.stringify(xxx, function(key, value) {
  if (key === 'parent' && value) {
    return '[Circular]';
  }
  return value;
}, 2)))
});

let xxx = reactive([])

let progress = ref(0);

function getTitles (theNode) {
  console.log("aaarticless", article.value)
  let titles = [];
  let levels = ["h2", "h3", "h4"];

  let articleElement = article.value;
  if (!articleElement) {
    return titles;
  }

  let elements = Array.from(articleElement.querySelectorAll("*"));

  // 调整标签等级
  let tagNames = new Set(
    elements.map((el) => el.tagName.toLowerCase())
  );
  for (let i = levels.length - 1; i >= 0; i--) {
    if (!tagNames.has(levels[i])) {
      levels.splice(i, 1);
    }
  }

  let serialNumbers = levels.map(() => 0);
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    let tagName = element.tagName.toLowerCase();
    let level = levels.indexOf(tagName);
    if (level == -1) continue;

    let id = tagName + "-" + element.innerText + "-" + i;
    let node = {
      id,
      level,
      parent: null,
      children: [],
      rawName: element.innerText,
      scrollTop: element.offsetTop,
    };

    if (titles.length > 0) {
      let lastNode = titles.at(-1);

      // 遇到子标题
      if (lastNode.level < node.level) {
        node.parent = lastNode;
        lastNode.children.push(node);
      }
      // 遇到上一级标题
      else if (lastNode.level > node.level) {
        serialNumbers.fill(0, level + 1);
        let parent = lastNode.parent;
        while (parent) {
          if (parent.level < node.level) {
            parent.children.push(node);
            node.parent = parent;
            break;
          }
          parent = parent.parent;
        }
      }
      // 遇到平级
      else if (lastNode.parent) {
        node.parent = lastNode.parent;
        lastNode.parent.children.push(node);
      }
    }

    serialNumbers[level] += 1;
    let serialNumber = serialNumbers.slice(0, level + 1).join(".");

    node.isVisible = node.parent == null;
    node.name = serialNumber + ". " + element.innerText;
    titles.push(node);
  }

  console.log("titles", titles)
  titles = titles
  return titles;
}

let titles = JSON.parse(JSON.stringify(xxx, function(key, value) {
  if (key === 'parent' && value) {
    return '[Circular]';
  }
  return value;
}, 2));

window.addEventListener("scroll", function () {
  progress.value =
    parseInt(
      (window.scrollY / document.documentElement.scrollHeight) *
      100
    ) + "%";

  let visibleTitles = [];

  for (let i = titles.length - 1; i >= 0; i--) {
    const title = titles[i];
    if (title.scrollTop <= window.scrollY) {
      if (currentTitle.id === title.id) return;

      Object.assign(currentTitle, title);

      // 展开节点
      setChildrenVisible(title, true);
      visibleTitles.push(title);

      // 展开父节点
      let parent = title.parent;
      while (parent) {
        setChildrenVisible(parent, true);
        visibleTitles.push(parent);
        parent = parent.parent;
      }

      // 折叠其余节点
      for (const t of titles) {
        if (!visibleTitles.includes(t)) {
          setChildrenVisible(t, false);
        }
      }

      return;
    }
  }
});
function setChildrenVisible(title, isVisible) {
  for (const child of title.children) {
    child.isVisible = isVisible;
  }
}

// 滚动到指定的位置
function scrollToView(scrollTop) {
  window.scrollTo({ top: scrollTop, behavior: "smooth" });
}

// return { titles, currentTitle, progress, scrollToView };
</script>

<style lang="scss" scoped></style>