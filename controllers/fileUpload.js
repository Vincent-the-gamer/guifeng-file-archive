const express = require("express");
const app = express();
const bodyParser = require('body-parser')
const path = require("path");
const cors = require('cors');
//处理multipart文件上传的中间件
const multer = require('multer');
//文件处理库
const fs = require('fs');

//引入axios
const axios = require('axios');
//引入cheerio,解析html标签
const cheerio = require('cheerio');

//服务端创建，校验Token
const {createToken, authJwt} = require('./tokenUtil')

//解决跨域：使用cors中间件，在路由之前调用app.use(cors())
app.use(cors())

//配置请求体解析器
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin",  host+":2333");
    res.header("Access-Control-Allow-Headers", "content-type");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Cache-Control","no-store"); //304
    next();
});

//注册鉴权中间件
app.use(authJwt)

//注册鉴权错误捕获中间件
app.use((err,req,res,next)=>{
    if(err.name === 'UnauthorizedError'){
        return res.send({
            status: 401,
            message:'无效token'
        })
    }
    res.send({
        status: 401,
        message:'其他错误'
    })
})


//生成指定长度的随机字符串
function randomString(e) {
    e = e || 32;
    var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
        a = t.length,
        n = "";
    for (let i = 0; i < e; i++) {
        n += t.charAt(Math.floor(Math.random() * a));
    }
    return n;
}

// 生成Min到Max的随机数
function GetRandomNum(Min,Max)
{
    var Range = Max - Min;
    var Rand = Math.random();
    return(Min + Math.round(Rand * Range));
}


//获得已经格式化的当前时间
function getCurrentTime(){
    //toLocaleDateString():
    //macOS 月/日/年  格式
    //Windows 年/月/日 格式
    let date = new Date().toLocaleDateString();
    let dateArr = date.split("/");

    //判断当前操作系统, 由于不同系统的new Date().toLocaleDateString();返回值不同
    //我们需要专门适配：
    //macOS: 月/日/年
    //Windows: 年/月/日
    let result = "";
    switch (process.platform){
        case "darwin": // Unix系统内核 (macOS等)
            result = dateArr[2] + "-" + dateArr[0] + "-" + dateArr[1];
            break;
        case "win32": // Windows 系统内核
            result = dateArr[0] + "-" + dateArr[1] + "-" + dateArr[2];
            break;
    }
    return result;
}

//遍历读取文件夹的文件
function readFiles(path){
    let filesList = [];
    //需要同步读取
    let files = fs.readdirSync(path);
    files.forEach(file => {
        let states = fs.statSync(path + "/" + file);
        // 判断是否是目录，是就继续递归
        if (states.isDirectory()) {
            readFiles(path + "/" + file, filesList);
        } else {
            // 不是就将文件push进数组
            filesList.push(file);
        }
    });
    return filesList;
}

//删除图片的方法
function deletePic(path){
    //判断是文件还是文件夹
    fs.stat(path, (err,stateObj) => {
            //如果是文件
            if(stateObj.isFile()){
                //只能用于删除文件
                fs.unlink(path,(err,data) => {
                    if(err){
                        console.log(err);
                    }
                    else{
                        console.log("删除成功");
                    }
                });
            }
            //如果是文件夹
            else if(stateObj.isDirectory()) {
                //用于删除文件夹
                fs.rmdir(path,(err,data) => {
                    if(err){
                        console.log(err);
                    }
                    else{
                        console.log("删除成功");
                    }
                });
            }
        }
    )
}

// 使用硬盘存储模式设置存放接收到的文件的路径以及文件名
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // 接收到文件后输出的保存路径（若不存在则需要创建）
        cb(null, target);
    },
    filename: function (req, file, cb) {
        // 将保存文件名设置为 时间戳转为的当前日期 + 随机数字 + 后缀
        // 注意后缀是file.originalname.substring(file.originalname.lastIndexOf("."),file.originalname.length)
        // 一定要取出原来的后缀
        cb(null, getCurrentTime() + "$" + GetRandomNum(10000,99999) + randomString(5) +
            file.originalname.substring(file.originalname.lastIndexOf("."),file.originalname.length) );
    }
});

//创建 multer 对象
let upload = multer({storage});

//所有接口必须在跨域前面配置
//上传图片接口，每次最多上传10张
app.post('/handleUpload', upload.array('files',10), (req,res) => {
    let files = req.files;
    let json;
    if (files !== null) {
        json = {
            code: 200,
            message: "上传成功！"
        }
    } else {
        json = {
            code: 400,
            message: "上传失败！"
        }
    }
    res.send(json);
});

//登录校验接口，我这里懒得用数据库，就直接写死了
app.post("/login",(req,res,next) => {
    const {username, password} = req.body;
    if(username === "kk" && password === "bbsd"){
        res.send({
            success: true,
            message: "登录成功！",
            token: createToken({username})
        });
    }
    else{
        res.send({
            success: false,
            message: "登录失败！"
        })
    }
});



//拿到图片的接口，把所有图片文件名数组返回给前端
app.get('/getPics',(req,res) => {
    //返回文件名数组给前端
    let fileList = readFiles(target);
    res.send({
        code: 200,
        data: {
            files: fileList,
            location: host + ":" + port + "/upload"
        }
    })
})
//显示图片的接口
app.get('/upload/*',(req,res) => {
    res.sendFile(__dirname + "/" + req.url);
})

//删除图片的接口
app.post('/delPics',(req,res) => {
    let name = req.body.fileName;
    deletePic(target + "/" + name);
    res.send({
        code: 200,
        message: "删除成功！"
    });
});

//tool.lu工具箱：中文拆字  爬取接口
app.get('/chaizi',(req,res) => {
    axios.get('https://tool.lu/zhcomponent/index.html',{
        params:{
            q: req.query.q
        },
        headers:{
            "user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36"
        }
    }).then(
        response => {
            let $ = cheerio.load(response.data);
            let result = `<table>
              ${ $('table[class=tbl]').html()} 
              </table>`
            res.send(result);
        },
        error => {
            console.log(error.message);
            res.send(error.message);
        }
    )
})



//检验token是否过期，这里啥也不用写，因为如果token过期会被前面的中间件拦截，自动返回401
app.post('/isExpired',(req,res) => {
    res.send({
        status: 200,
        message: 'token没过期'
    })
})


let host = "";
//调试时
if(process.env.NODE_ENV.trim() === 'development'){
    host = "http://localhost";
}
else if(process.env.NODE_ENV.trim() === 'production'){
    //部署时
    host = "http://124.222.43.240";
}
else{
    console.log("所处环境既不是开发环境也不是生产环境，配置出错，值为：" + process.env.NODE_ENV);
    host = "error";
}
const port = 2334;
//存放上传图片文件夹路径
const target = path.resolve(__dirname + "/upload");


app.listen(port,()=>{
    console.log(`后端运行于：${host}:${port}`)
})
