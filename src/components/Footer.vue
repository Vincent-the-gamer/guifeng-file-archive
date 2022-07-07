<template>
  <div class="footer">
     <h4>
       ©2022 诡锋开发 &nbsp;&nbsp;&nbsp;版本: v1.0.0 <br/>
       B站：<a href="https://space.bilibili.com/3342738" target="_blank">访问诡锋的B站</a><br/>
       Github：<a href=" https://github.com/Vincent-the-gamer" target="_blank">访问诡锋的Github</a>
     </h4>
  </div>
<!--  这是一个用来撑布局的div,里面啥也不要写 -->
  <div class="fill"></div>
</template>

<script>
/**
 * 作者: 诡锋
 * B站：https://space.bilibili.com/3342738
 * Github: https://github.com/Vincent-the-gamer
 */
//底部组件
export default {
  name: "Footer"
}
</script>

<style lang="less" scoped>
    @footerHeight: 100px;
    @footerWidth: 100%;
   .footer{
     z-index: 2;
     height: @footerHeight;
     width: @footerWidth;
     background-color: dimgrey;
     position: fixed;
     border-color: pink;
     border-width: 2px;
     border-style: solid;
     bottom: 0;
     transform: scale(103%,103%);
     h4{
       position: relative;
       top: 2px;
       white-space: pre-wrap;
       &:hover{
         color: aqua;
         cursor: default;
       }
     }
     a{
       color: white;
       &:hover{
         color: deeppink;
       }
     }
   }
   .fill{
     height: @footerHeight + 80px;
     width: @footerWidth;
     position: relative;
   }
</style>