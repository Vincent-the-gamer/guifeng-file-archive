# 诡锋搭建的私人图床软件

## 使用 Vite + Vue 3 + Node.js开发 


## 关于作者

作者：诡锋

B站： - 诡锋丿Lavafall - \
https://space.bilibili.com/3342738


## 功能


我做这个网站的契机是Github的CDN: jsdelivr 显示不出github上传的图片了，也就是说我的图床寄了。

所以这个网站就是用来部署到私人服务器上当图床的，功能只有上传图片和删除图片而已。

各版本变动请查看开发日志：

[查看开发日志](./版本信息(Version%20Info).md)

**目前版本：v1.0.4**

测试功能：v1.0.4使用爬虫技术来直接白嫖了https://tool.lu的中文拆字功能，结论是可行。
之后打算全部缝合进来233

v1.0.3以后的启动方式有所改变

部署时，在服务器上项目中的package.json的scripts里面增加这两条命令
~~~json
# Windows
{
  "start-backend": "set NODE_ENV=production && node fileUpload.js",
  "start-frontend": "set NODE_ENV=production && node app.js"
}
# macOS/Linux
{
"start-backend": "export NODE_ENV=production && node fileUpload.js",
"start-frontend": "export NODE_ENV=production && node app.js"
}
~~~

~~~shell
# 启动前端
npm run start-frontend
# 启动后端
npm run start-backend
~~~
## 效果演示

### 未登录时：
![](http://124.222.43.240:2334/upload/2022-7-13$17754DTENy.png)

### 已登录时：
![](http://124.222.43.240:2334/upload/2022-7-13$73077hHwaE.jpg)


## 如何使用这个项目

### 克隆项目

很简单，只需要把项目克隆下来

~~~shell
git clone https://github.com/Vincent-the-gamer/CustomizedPicBed.git
~~~

### 调试项目
如何启动项目：

请查看开发日志，里面有针对不同操作系统下的启动命令配置，直接用npm run xxx就行

[查看开发日志](./版本信息(Version%20Info).md)


### 按需求配置

进入controllers/fileUpload.js，配置好您自己服务器的ip和端口（这就是后端）

~~~js
const host = "http://xxx.xxx"
const port = 0;
~~~

然后进入axios.js，填入您的后端（也就是上面的配置），这样前端就可以全局请求了

~~~js
//部署时，填入你的服务器:端口
axios.defaults.baseURL = "http://xxx:xxx"
~~~

### 关于文件名日期的格式

js在Windows下和macOS下的 new Date().toLocaleDateString(); 方法返回的格式是不一样的

macOS : 月/日/年

Windows: 年/月/日

Linux没测过

v1.0.1新特性：这个格式已经针对macOS和Windows进行自适配，无需手动调整代码

### v1.0.1新增配置：
**crypto.js**

在里面填写你的加密规则即可，推荐使用ssl公钥私钥对，为后续生成token做准备

**tokenUtil.js**

用于生成和校验token，是鉴权的核心模块

### 打包部署

把fileUpload.js，cryto.js,tokenUtil.js单独拷贝出来，然后

~~~shell
npm run build
~~~

会生成一个dist文件夹, 然后单独创建一个文件夹，

把dist整个扔进去，然后在这个文件夹下安装依赖
先初始化npm
~~~shell
# 初始化npm环境
npm init 
~~~
这里记住把package.json里面需要的依赖配置好，然后
~~~shell
npm install
~~~

也可以手动单独安装依赖

下一步：创建app.js

~~~js
const express = require('express');
const app = express();

app.use(express.static('./dist')) //这个路径是你的dist文件夹的

const port = 1234; //看你的端口是多少
app.listen(port, () => {
  console.log(`该应用运行于：${port} 端口`) //这里是ES6模板字符串
})
~~~

然后把fileUpload.js，cryto.js, tokenUtil.js放入这个文件夹，方便启动

**<font color="red">注意，在fileUpload.js同级目录下创建一个upload文件夹（文件夹名字看你的配置），用于存放上传的图片，不然后端会报错！</font>**

然后在这一级目录下启动两个命令行终端（开启两个服务)，分别输入以下命令

~~~shell
# 启动前端
npm run start-frontend
# 启动后端
npm run start-backend
~~~

然后就可以根据你的端口访问前端了

这时候就愉快的推到你的服务器吧！！！！

