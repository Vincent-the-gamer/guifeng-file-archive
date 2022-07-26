<template>
   <div class="showContainer">
     <h1 v-if="hasNoPic">图片列表为空！</h1>
   <!--  一定要注意，item是完整的文件名，传路径的时候文件名是这个   -->
      <Item v-for="(item,index) in picsArray"
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
import {onMounted, onBeforeUnmount, ref, reactive,toRaw} from "vue";
import Item from "./Item";
import axios from '@/global/axios';
//引入全局事件总线
import bus from '@/global/mitt';

export default {
  name: "PictureShow",
  components: {Item},
  setup() {
    //显示图片功能
    let srcs = reactive({});
    let location = ref('');
    let hasNoPic = ref(true);
    let picsArray = ref([]);


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
           srcs.pics = response.data.data.files;
           location.value = response.data.data.location;
           picsArray.value = toRaw(srcs.pics);
           if(picsArray.value.length !== 0){
             hasNoPic.value = false;
             picsArray.value = sort(toRaw(picsArray.value));
           }
        }
    )

    //把文件名的日期和文件名提取出来
    function getFileInfo(rawName){
        let arr = rawName.split("$");
        let name = arr[1];
        let date = arr[0];
        return {name, date}
    }

    //拿到日期的年月日
    function getDate(rawName){
      let arr = rawName.split("$");
      let dateArr = arr[0].split("-");
      //后端已经把日期统一成年月日格式了
      let year = dateArr[0];
      let month = dateArr[1];
      let day = dateArr[2];
      return {year,month,day}
    }

    //把图片按照日期从新到旧排序显示
    function sort(picArray){
      let picArr = [];
      for(let i=0;i<picArray.length;i++){
        picArr[i] = picArray[i];
      }
      //快排一下日期,注意，上面函数返回的对象是{year,month,day}，记得按照对象取值
      quickSort(picArr,0,picArr.length - 1,"year");
      quickSort(picArr,0,picArr.length - 1,"month");
      quickSort(picArr,0,picArr.length - 1,"day");

      return picArr;
    }

    //对日期快速排序,递减顺序,type表示对年，月还是日排序
    function quickSort(arr,begin,end,type){
      if(begin < end){
        debugger;
        let i = begin;
        let j = end;
        let pivot = arr[begin];
        let pivotDate = parseInt(getDate(arr[begin])[`${type}`]);
        while(i < j){
          while(parseInt(getDate(arr[j])[`${type}`]) <= pivotDate && i < j){
            j--;
          }
          arr[i] = arr[j];
          while(parseInt(getDate(arr[i])[`${type}`]) >= pivotDate && i < j){
            i++;
          }
          arr[j] = arr[i];
        }
        arr[i] = pivot;
        quickSort(arr,begin,i-1,type);
        quickSort(arr,i+1,end,type);
      }else{
        return;
      }
    }

    return { picsArray,location,getFileInfo,hasNoPic }

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