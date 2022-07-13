//生成token和验证token
const { secretKey } = require('./crypto');
const jwt = require("jsonwebtoken");
//注意：express-jwt新版本不支持这样引入了
// const jwtExpress = require("express-jwt");
//引入express-jwt的新方法：
const { expressjwt:expressJwt } = require("express-jwt");

//生成token
//payload: 载荷
const createToken = payload => {
    return jwt.sign(payload,secretKey,{
        expiresIn: 1000 * 60 * 60  //设置token的有效期，单位：毫秒  这里代表有效期1小时
    });
}

//校验token
const authJwt = expressJwt({
    secret: secretKey,
    algorithms:['HS256'],
    credentialsRequired: true, //false:不鉴权
}).unless({
    path: ['/login',/upload\/(.*?)/,'/getPics']
});


module.exports = { createToken, authJwt };