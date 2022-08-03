# 开发日志

* v1.0.3：
  * 修改package.json，优化调试流程，不需要每次都去改服务器host了
  PS: 以下配置用于以开发或生产环境启动，自动适配host。
  ~~~json
  {
    "backend-wincmd-dev": "set NODE_ENV=development && node ./controllers/fileUpload.js",
    "backend-wincmd-prod": "set NODE_ENV=production && node ./controllers/fileUpload.js",
    "backend-powershell-dev": "$env:NODE_ENV=development && node ./controllers/fileUpload.js",
    "backend-powershell-prod": "$env:NODE_ENV=production && node ./controllers/fileUpload.js",
    "backend-mac-dev": "export NODE_ENV=development && node ./controllers/fileUpload.js",
    "backend-mac-prod": "export NODE_ENV=production && node ./controllers/fileUpload.js"
   }
   ~~~
  * 重写快速排序，解决月份排序不对的Bug，我之前傻了

  
* v1.0.2：
  * 针对日期格式写了个快速排序，让日期从新到旧排列

* v1.0.1：
  - 增加登录鉴权功能，只有站长可以上传和删除图片
  - 自适应日期格式

* v1.0.0
  * 把基本功能弄完就啥也没干了
