const express = require('express')
const router = express.Router()

const app = express()

// 引入&使用 EJS 模板引擎
const ejs = require('ejs');
app.set('view engine', 'ejs');

// 定义模板
const template = `
<html>
 <head>
  <style>
    #requset-info-table{zoom:0.75;border-collapse:collapse;border:2px solid #c8c8c8;letter-spacing:1px;table-layout:fixed;max-width:100vw;margin:auto}#requset-info-table caption{font-size:1.5em;font-weight:bold;margin:.25em}#requset-info-table thead{background-color:#307998aa;color:#fff}#requset-info-table tbody{background-color:#30799811}#requset-info-table td,#requset-info-table th{border:1px solid #bebebe;padding:5px 10px}#requset-info-table th{max-width:30vw}#requset-info-table td{font-family:'Consolas',monospace;min-width:60vw;max-width:80vw;word-wrap:break-word}#requset-info-table .headers td{zoom:.5}
  </style>
 </head>
 <body>
  <table id="requset-info-table"> 
   <caption>
    There is no corresponding useful interface
   </caption> 
   <thead> 
    <tr> 
     <th>Property</th> 
     <th>Value</th> 
    </tr> 
   </thead> 
   <tbody> 
    <tr> 
     <th>Method</td> 
     <td><%= method %></td> 
    </tr> 
    <tr> 
     <th>Path</td> 
     <td><%= path %></td> 
    </tr> 
    <tr> 
     <th>Query</td> 
     <td><%= JSON.stringify(query) %></td> 
    </tr> 
    <tr> 
     <th>Params</td> 
     <td><%= JSON.stringify(params) %></td> 
    </tr> 
    <tr class="headers"> 
     <th>Headers</td> 
     <td><%= JSON.stringify(headers) %></td> 
    </tr> 
    <tr> 
     <th>Cookies</td> 
     <td><%= JSON.stringify(cookies) %></td> 
    </tr> 
    <tr> 
     <th>Body</td> 
     <td><%= JSON.stringify(body) %></td> 
    </tr> 
    <tr> 
     <th>IP</td> 
     <td><%= ip %></td> 
    </tr> 
    <tr> 
     <th>Protocol</td> 
     <td><%= protocol %></td> 
    </tr> 
    <!-- 添加其他需要的属性 --> 
   </tbody> 
  </table>
 </body>
</html>
`;

// 以下为通用匹配

// GET 请求处理程序
router.get('/*', (req, res) => {
  const { method, path, params, headers, cookies, body, ip, protocol, query } = req;
  const renderedTemplate = ejs.render(template, { method, path, params, headers, cookies, body, ip, protocol, query });
  res.send(renderedTemplate);
});

// POST 请求处理程序
router.post('/*', (req, res) => {
  const { method, path, params, headers, cookies, ip, protocol, body } = req;
  const renderedTemplate = ejs.render(template, { method, path, params, headers, cookies, ip, protocol, query: {}, body });
  res.send(renderedTemplate);
});

// PUT 请求处理程序
router.put('/*', (req, res) => {
  const { method, path, params, headers, cookies, ip, protocol, body } = req;
  const renderedTemplate = ejs.render(template, { method, path, params, headers, cookies, ip, protocol, query: {}, body });
  res.send(renderedTemplate);
});

// DELETE 请求处理程序
router.delete('/*', (req, res) => {
  const { method, path, params, headers, cookies, ip, protocol, body } = req;
  const renderedTemplate = ejs.render(template, { method, path, params, headers, cookies, ip, protocol, query: {}, body });
  res.send(renderedTemplate);
});

// 导出路由 
module.exports = router