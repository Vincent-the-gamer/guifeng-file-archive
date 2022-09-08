<template>
  <div class="showContainer">
    <ul v-if="token !== undefined && token !== null && hasFile">
      <li v-for="(file,index) in fileObj.files" :key="index">
          <h3 @click="() => {download(file,token)}">{{file}}</h3>
          <button class="deleteBtn" @click="() => {deleteFile(file)}">删除该资源</button>
      </li>
    </ul>
    <h1 v-else-if="!token">
      您害妹登录呢，搁这看哈呢！
    </h1>
    <h1 v-else-if="!hasFile">
      害妹上传呢，看个锤子！
    </h1>

  </div>
</template>

<script>
//文件展示组件
import {ref, reactive} from "vue";
import axios from '@/global/axios';
//引入全局事件总线
import bus from '@/global/mitt';
import {onBeforeUnmount, onMounted} from "vue";

export default {
  name: "FileShow",
  setup() {
    //显示文件功能
    //文件对象：文件名数组，文件保存路径
    const fileObj = reactive({})
    //有没有文件存在
    const hasFile = ref(false)

    //从后端拿到文件名数组和文件统一路径
    let getFiles = async() => {
      let response = await axios.get('/getFiles')
      fileObj.files = response.data.data.files
      fileObj.location = response.data.data.location
      if(fileObj.files !== undefined && fileObj.files.length > 0){
        hasFile.value = true
      }
    }
    getFiles()

    let token = ref("")
    //生命周期：挂载后
    onMounted(() => {
      //可以使用mitt来实现事件总线
      bus.on('refresh',() => {
        //刷新页面
        window.location.reload();
      })
      //鉴权
       token.value = localStorage.getItem("token");
    })
    //生命周期：卸载前
    onBeforeUnmount(() => {
      bus.off('refresh');
    })


    //下载文件
    function download(target,token){
      axios(
          {
              url: `/filesUpload/${target}`,
              method: "post",
              headers: {
                'Authorization': 'Bearer ' + token
              },
              responseType: 'blob'
          }
      ).then(
          response => {
           //增加一个a节点
            let blob = new Blob([response.data],{type: "application/zip"})
            let a = document.createElement('a')
            let objectURL = window.URL.createObjectURL(blob)
            let timestamp = (new Date()).valueOf();
            a.href = objectURL
            a.download = timestamp + target.substring(target.lastIndexOf(".")) //补全后缀
            a.target = "_blank"
            document.body.appendChild(a)
            a.click() //自动点击
            document.body.removeChild(a)
            window.URL.revokeObjectURL(objectURL)
          },
          error => {
            console.log(error.message)
          }
      )
    }

    //删除文件
    function deleteFile(fileName){
      if(confirm('确定要删除该文件吗？')){
        //发送请求，删除文件
        axios({
              url: "/delFiles",
              method: "post",
              headers: {
                'Authorization': 'Bearer ' + token
              },
              data: { fileName }
        }).then(
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
    return {fileObj, token, download, hasFile, deleteFile}
  }

}


</script>

<style lang="less" scoped>
  .showContainer {
    margin: 0 auto;
    border: 3px solid deeppink;
    width: 800px;
    h3{
      color: white;
      cursor: pointer;
      &:hover{
        color: deeppink;
      }
    }
    .deleteBtn{
      position: relative;
      font-family: xiawu;
      transform: translateY(-45px);
      float: right;
      margin-right: 10px;
      width: 100px;
      height: 30px;
      background-color: blue;
      color: white;
      border: 1px solid red;
      border-radius: 7px;
      &:hover{
        background-color: yellow;
      }
    }
  }
</style>