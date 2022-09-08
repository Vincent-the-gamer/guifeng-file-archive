<template>
  <Header/>
  <div class="headTitle">
    <h1>诡锋的个人文件库</h1>
    <h4>图片：点击图片就可以打开图片，获得链接</h4>
    <h4>图片每次最多可以选10张</h4>
    <h4>文件上传下载仅站长可用，需要登录，目前只支持zip格式</h4>
    <div align="center">
      <router-link to="/pictures">
        <button class="routeNav">
          <h4>查看图片</h4>
        </button>
      </router-link>
      <router-link to="/tools">
        <button class="routeNav">
          <h4>tool.lu小工具</h4>
        </button>
      </router-link>
      <router-link to="/files">
        <button class="routeNav">
          <h4>压缩包文件管理</h4>
        </button>
      </router-link>
    </div>
  </div>
  <hr/>
  <!-- 路由组件显示在这 -->
  <router-view></router-view>
  <Footer/>
</template>

<script>
/**
 * 作者: 诡锋
 * B站：https://space.bilibili.com/3342738
 * Github: https://github.com/Vincent-the-gamer
 */

import Footer from "./components/Footer";
import Header from "./components/Header";
import {onMounted} from "vue";
import axios from "./global/axios";
import bus from './global/mitt';


export default {
  name: 'App',
  components: {Header, Footer},
  setup(){
    //检验token是否过期
    onMounted(() =>{
      if(localStorage.getItem('token')){
        axios.post('/isExpired',localStorage.getItem('token')).then(
            response => {
              if(response.data.status === 401){
                alert("您的登录信息已过期，请重新登录");
                localStorage.removeItem("token");
                //自动重新刷新
                bus.emit('refresh');
              }
            }
        )
      }
    })
  }
}
</script>

<style lang="less">
  @font-face {
    font-family: xiawu;
    src: url("./assets/xiawu.ttf")
  }
  body{
    background: rgba(0,0,0,0.9);
    color: white;
    overflow-x: hidden;
  }
  h1,h4{
    text-align: center;
  }
  h1,h2,h5,div{
    font-family: xiawu;
  }
  .headTitle{
     margin-top: 80px;
  }
  .routeNav{
    margin-right: 8px;
    border-width: 1px;
    border-color: red;
    border-style: solid;
    border-radius: 4px;
    background-color: purple;
    box-shadow: 0 8px 16px 0 rgba(255,255,255,0.4);
    color: white;
    height: 40px;
    width: 150px;
    font-size: 15px;
    h4{
      text-align: center;
      transform: translateY(-13px);
      font-family: xiawu;
    }
    &:hover{
      background-color: gold;
      color: black;
    }
  }

  //给router-link用的自定义active-class
  .activeClass{
    button{
      background-color: chartreuse;
      color: black;
    }
  }
</style>