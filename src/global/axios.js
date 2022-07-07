import axios from "axios";
//调试时
// axios.defaults.baseURL = "http://localhost:xxxx"
//部署时，填入你的服务器:端口
axios.defaults.baseURL = "http://xxx:xxx"

export default axios;