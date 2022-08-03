import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from "path"

export default defineConfig({
    //插件配置
    plugins: [vue()],
    server: {
        //自动打开浏览器
        open: true,
        //host配置，也就是跑起来的Network ip地址
        host:'localhost',
        //端口号
        port: 2333, //写入你自己的服务器配置
    },
    //打包配置
    build:{
        //指定输出路径
        outDir: 'dist',
        // 指定生成静态资源的存放路径
        assetsDir: 'assets',
        //混淆器，terser构建后文件体积更小
        minify: 'terser',
        //代码压缩配置
        terserOptions:{
            //生产环境移除console和debugger
            compress:{
                drop_console: true,
                drop_debugger: true
            }
        }
    },
    //配置路径别名，需要安装@types/node插件
    resolve:{
        alias: {
            '@': resolve(__dirname,'src'),
            'root': resolve(__dirname,'/')
        },
        //配置引入以下类型文件时不需要加后缀（可以省略后缀）
        extensions:['.vue','.js','json']
    },

})