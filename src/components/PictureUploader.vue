<template>
   <!-- 图片上传： 允许多上传 -->
    <div class="upload" v-if="token">
        <h2>上传图片</h2>
        <div class="file">
          <h4>点击这里上传图片</h4>
          <input type="file" ref="file"
                 @change="handleUpload"
                 accept=".jpg, .png, .jpeg, .webp, .ico"
                 multiple>
        </div>
        <h2>{{message}}</h2>
    </div>
</template>

<script>
/**
 * 作者: 诡锋
 * B站：https://space.bilibili.com/3342738
 * Github: https://github.com/Vincent-the-gamer
 */
//图片上传组件
import {getCurrentInstance, onMounted} from "vue";
import axios from '@/global/axios';
import {ref} from "vue";
//引入全局事件总线
import bus from '@/global/mitt';

export default {
  name: "Pictures",
  setup(){
    let message = ref('');
    let token = ref('');
    //拿到组件实例对象，使用$refs拿ref
    const _this = getCurrentInstance().proxy
    //上传图片功能
    const handleUpload = () => {
      let fileList = _this.$refs.file.files;
      const files = [...fileList]; //把FileList对象里面的每一个值拿到数组中
      const formData = new FormData();
      /*
        后端node.js使用multer上传文件的大坑！！！！
        添加formData数据的时候，如果是上传一个数组
        要遍历数组中的每一个元素重复append到一个键中，不能直接加数组
        不然后端会获取到空数组！！！！
       */
      files.map(item => {
        formData.append("files",item);
      })
      if(fileList.length > 0 && fileList.length <= 10){ //后端规定最多传10个
        axios.post("/handleUpload",formData).then(
            response => {
              if(response.data.status === 401){
                message.value = "您没有登录！请先登录再上传!";
              }
              else{
                message.value = "上传成功！";
                //触发自定义事件
                bus.emit('refresh');
              }
            },
            error => {
              message.value = "上传出错了！";
            }
        )
        setTimeout(() => {
          message.value = "";
        },2000)
      }
      else{
        alert("上传的文件个数不符合要求！")
      }
    }

    onMounted(() => {
      token.value = localStorage.getItem('token');
    })
    return { message, handleUpload,token }
  }
}
</script>

<style lang="less" scoped>
   //上传控件统一高度
   @uploadHeight: 40px;
   //上传控件统一宽度
   @uploadWidth: 150px;

   .upload{
     text-align: center;
     .file{
       margin: 0 auto;
       border-width: 1px;
       border-color: red;
       border-style: solid;
       border-radius: 4px;
       background-color: purple;
       box-shadow: 0 8px 16px 0 rgba(255,255,255,0.4);
       color: white;
       height: @uploadHeight;
       width: @uploadWidth;
       font-size: 15px;
       h4{
         text-align: center;
         transform: translateY(-10px);
       }
       &:hover{
         background-color: gold;
         color: black;
       }
     }
     input{
       position: absolute;
       height: @uploadHeight;
       width: @uploadWidth;
       cursor: pointer;
       transform: translateX(-75px) translateY(-58px);
       opacity: 0;
       border-width: 1px;
       border-style: solid;
     }
   }

</style>