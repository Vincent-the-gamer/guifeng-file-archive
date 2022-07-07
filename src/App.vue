<template>
  <h1>诡锋的个人图库</h1>
  <h4>点击图片就可以打开图片，获得链接</h4>
  <h4>图片每次最多可以选10张</h4>
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
import PictureUploader from "@/components/PictureUploader";
import PictureShow from "./components/PictureShow";
import Footer from "./components/Footer";

export default {
  name: 'App',
  components: {Footer, PictureShow, PictureUploader},

}
</script>

<style>
  @font-face {
    font-family: xiawu;
    src: url("./assets/xiawu.ttf")
  }
  body{
    background: rgba(0,0,0,0.9);
    color: white;
  }
  h1,h4{
    text-align: center;
  }
  h1,h2,h5,div{
    font-family: xiawu;
  }
</style>