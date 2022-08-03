import axios from "axios";
//调试时
if(process.env.NODE_ENV.trim() === 'development'){
    //调试时
    axios.defaults.baseURL = "http://localhost:2334";
}
else if(process.env.NODE_ENV.trim() === 'production'){
    //部署时
    axios.defaults.baseURL = "http://124.222.43.240:2334";
}
else{
    console.log("axios环境错误，现在的环境为：" + process.env.NODE_ENV);
}


//配置拦截器：全局添加鉴权用token请求头
axios.interceptors.request.use(
    config => {
        if(localStorage.getItem('token')){
            config.headers.Authorization = `Bearer ${ localStorage.getItem('token') }`;
        }
        return config;
    },
    error => Promise.reject("获取Token失败，您可能未登录!")
)

export default axios;