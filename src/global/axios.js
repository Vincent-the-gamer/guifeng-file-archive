import axios from "axios";
//调试时
// axios.defaults.baseURL = "http://localhost:你的端口"
//部署时，填入你要请求的后端服务器ip:端口
axios.defaults.baseURL = "http://你的服务器"

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