const express = require("express");
const app = express();
const bodyParser = require('body-parser')
const path = require("path");
const cors = require('cors');
//处理multipart文件上传的中间件
const multer = require('multer');
//文件处理库
const fs = require('fs');

//配置请求体解析器
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin",  host+":2333");
    res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Cache-Control","no-store");//304
    next();
});

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
    //按年月日格式返回
    // return dateArr[2] + "-" + dateArr[0] + "-" + dateArr[1]; //调试时 macOS
    return dateArr[0] + "-" + dateArr[1] + "-" + dateArr[2];  //部署时 Windows
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
    if(files !== null){
        json = {
            code: 200,
            message: "上传成功！"
        }
    }
    else {
        json = {
            code: 400,
            message: "上传失败！"
        }
    }
    res.send(json);
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

//解决跨域：使用cors中间件，只能在接口定义完毕后配置
//不然会有个大坑：请求卡住不响应
app.use(cors())

//调试时
// const host = "http://localhost";
//部署时, 填入你的服务器和端口
const host = "http://xxx."
const port = 0;
//存放上传图片文件夹路径
const target = path.resolve(__dirname + "/upload");

app.listen(port,()=>{
    console.log(`上传API运行于：${host}:${port}`)
})
