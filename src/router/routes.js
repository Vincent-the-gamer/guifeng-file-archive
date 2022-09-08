import PictureManager from "../pages/PictureManager";
import Tools from "../pages/Tools";
import FileManager from "../pages/FileManager";

//配置路由
const routes = [
    {
        path: '/',
        redirect: '/pictures'  //配置重定向，默认查看图片
    },
    {
        path: '/pictures',
        component: PictureManager
    },
    {
        path: '/tools',
        component: Tools
    },
    {
        path: '/files',
        component: FileManager
    }
];

export default routes;