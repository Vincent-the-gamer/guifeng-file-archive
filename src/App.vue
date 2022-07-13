<template>
  <Header/>
  <div class="headTitle">
    <h1>诡锋的个人图库</h1>
    <h4>点击图片就可以打开图片，获得链接</h4>
    <h4>图片每次最多可以选10张</h4>
  </div>
  <hr/>
  <PictureUploader/>
  <PictureShow/>
  <Footer/>
</template>

<script>
/**
 * 作者: 诡锋
 * B站：https://space.bilibili.com/3342738
 * Github: https://github.com/Vincent-the-gamer
 */
import PictureUploader from "./components/PictureUploader";
import PictureShow from "./components/PictureShow";
import Footer from "./components/Footer";
import Header from "./components/Header";
import {onMounted} from "vue";
import axios from "./global/axios";
import bus from './global/mitt';

export default {
  name: 'App',
  components: {Header, Footer, PictureShow, PictureUploader},
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
</style>