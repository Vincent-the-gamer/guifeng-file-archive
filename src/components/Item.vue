<template>
   <div class="wrapper">
     <div @mouseenter="delControl.showDel = true;"
          @mouseleave="delControl.showDel = false;">
      <a :href=" `${location}/${fullName}`" target="_blank">
       <img :src=" `${location}/${fullName}` " alt="图片">
      </a>
       <div>
         <button class="delete"
                 v-if="delControl.showDel && delControl.token"
                 @click.stop="delPic"
         >删除图片</button>
       </div>
     </div>
     <div class="title">
       <h3>{{name}}</h3>
       <h4>上传时间：{{date}}</h4>
     </div>
   </div>
</template>

<script>
/**
 * 作者: 诡锋
 * B站：https://space.bilibili.com/3342738
 * Github: https://github.com/Vincent-the-gamer
 */
//显示单个图片的组件
import {onMounted, reactive} from "vue";
import axios from "@/global/axios";
//引入全局事件总线
import bus from '@/global/mitt';

export default {
  name: "Item",
  props:["fullName","name","date","location"],
  setup(props){
    //控制删除按钮是否显示
    let delControl = reactive({showDel: false});
    onMounted(() => {
      delControl.token = localStorage.getItem('token');
    })

    //删除文件方法
    function delPic(){
       if(confirm('确定要删除该图片吗？')){
         //发送请求，删除文件
         axios.post("/delPics",
             { fileName: props.fullName } ).then(
             response => {
               if(response.data.status === 401){
                 alert("您没有登录！删除失败！");
               }
               else{
                 bus.emit('refresh');
               }
             },
             error => {
               alert("删除失败！");
             }
         )
       }
    }
     //显示出来的文件格式
     let name = props.name;
     name = formatName(name);
     let date = props.date;
     let fullName = props.fullName;
     //文件上传到的地方
     let location = props.location;
    //调整显示出来的文件格式，防止文件过长超出显示范围
    function formatName(name){
      for(let i=0; i < name.length - 1;i++){
        if(i !== 0 && i % 12 === 0){
          name = name.substring(0,i) + "\n" + name.substring(i,name.length);
        }
      }
      return name;
    }

     return{ location, delControl, name, date, fullName, delPic }
  }
}
</script>

<style lang="less" scoped>
  @keyframes img-scale {
     from{
       transform: scale(100%,100%);
     }
     to{
      transform: scale(110%,110%);
     }
  }
  @keyframes deleteBtn {
    from{
      left: 50px;
      top: 8px;
    }
    to{
      left: 44px;
      top: 2px;
    }
  }
  .wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    .delete{
      animation: deleteBtn 0.5s;
      z-index: 1;
      width: 70px;
      height: 30px;
      position: absolute;
      left: 44px;
      top: 2px;
      background-color: pink;
      border-color: red;
      border-width: 1px;
      border-style: solid;
      border-radius: 10px;
      cursor: pointer;
    }
  }
  img{
    position: relative;
    z-index: 0;
    margin-top: 5px;
    margin-left: 50px;
    width: 200px;
    height: 200px;
    box-shadow: -4px 2px 2px beige;
    &:hover{
      animation: img-scale 0.5s;
      transform: scale(110%,110%);
      cursor: zoom-in;
    }
  }
  .title{
    h3{
      text-align: center;
      white-space: pre-wrap;
      transform: translateX(20px);
      &:hover{
        color: aqua;
      }
    }
    h4{
      text-align: center;
      /* 处理特殊换行符 */
      white-space: pre-wrap;
      transform: translateX(20px);
      &:hover{
        color: aqua;
      }
    }
  }

</style>