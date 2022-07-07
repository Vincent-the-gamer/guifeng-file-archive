<template>
   <div class="showContainer">
     <h1 v-if="srcs.length === 0">图片列表为空！</h1>
   <!--  一定要注意，item是完整的文件名，传路径的时候文件名是这个   -->
      <Item v-for="(item,index) in srcs"
            :key="index"
            :fullName="item"
            :name="getFileInfo(item).name"
            :date="getFileInfo(item).date"
            :location="location"
      />
   </div>
</template>

<script>
//图片展示组件
import {onMounted, onBeforeUnmount, ref} from "vue";
import Item from "./Item";
import axios from '@/global/axios';
//引入全局事件总线
import bus from '@/global/mitt';

export default {
  name: "PictureShow",
  components: {Item},
  setup() {
    //显示图片功能
    let srcs = ref([]);
    let location = ref('');

    //生命周期：挂载后
    onMounted(() => {
      //可以使用mitt来实现事件总线
      bus.on('refresh',() => {
        //刷新页面
        window.location.reload();
      })
    })
    //生命周期：卸载前
    onBeforeUnmount(() => {
      bus.off('refresh');
    })

    //组件挂载前：在updated的时候就发请求，但是vue3没有了，
    //setup是生命周期最早的时候，直接写在setup里就好

    //从后端拿到图片文件名数组
    axios.get("/getPics").then(
        response => {
           srcs.value = response.data.data.files;
           location.value = response.data.data.location;
        }
    )

    //把文件名的日期和文件名提取出来
    function getFileInfo(rawName){
        let arr = rawName.split("$");
        let name = arr[1];
        let date = arr[0];
        return {name, date}
    }

    return { srcs,location,getFileInfo }

  }
}
</script>

<style lang="less" scoped>
   .showContainer{
     display: flex;
     flex-wrap: wrap;
     flex-direction: row;
     background-color: transparent;
     height: auto;
     width: 1050px;
     margin-top: 25px;
     margin-left: auto;
     margin-right: auto;
     backdrop-filter: blur(15px);
     border-color: deeppink;
     border-width: 3px;
     border-style: solid;
     box-shadow: 4px 5px 6px deeppink;
     h1{
       margin: 20px auto;
     }
   }
</style>