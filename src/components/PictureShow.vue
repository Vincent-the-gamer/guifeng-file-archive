<template>
   <div class="showContainer">
     <h1 v-if="hasNoPic">图片列表为空！</h1>
   <!--  一定要注意，item是完整的文件名，传路径的时候文件名是这个   -->
      <Item v-for="(item,index) in pictures.pics"
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
    const srcs = reactive({});
    let location = ref('');
    let hasNoPic = ref(true);
    let picsArray = [];
    const pictures = reactive({});

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
           picsArray= toRaw(srcs.pics);
           if(picsArray.length !== 0){
             hasNoPic.value = false;
             picsArray = sort(picsArray);
             pictures.pics = picsArray;
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

    //比较日期大小,具体过程看代码就行
    function compareDate(date1,date2){
      let formatDate1 = new Date(date1);
      let formatDate2 = new Date(date2);
      if(formatDate1 > formatDate2){
        return 1;
      }
      else if(formatDate1 === formatDate2){
        return 0;
      }
      else{
        return -1;
      }
    }

    //把图片按照日期从新到旧排序显示
    function sort(picArray){
      //快排一下日期,注意，上面函数返回的对象是{year,month,day}，记得按照对象的key来填写type
      quickSort(picArray,0,picArray.length - 1);
      return picArray;
    }

    //对日期快速排序,递减顺序
    function quickSort(arr,begin,end){
      if(begin < end){
        let i = begin;
        let j = end;
        let pivot = arr[begin];
        let pivotDate = `${parseInt(getDate(arr[begin])["year"])}-${parseInt(getDate(arr[begin])["month"])}-${parseInt(getDate(arr[begin])["day"])}`;
        while(i < j){
          while(compareDate(`${parseInt(getDate(arr[j])["year"])}-${parseInt(getDate(arr[j])["month"])}-${parseInt(getDate(arr[j])["day"])}`,pivotDate) <= 0 && i < j){
            j--;
          }
          arr[i] = arr[j];
          while(compareDate(`${parseInt(getDate(arr[i])["year"])}-${parseInt(getDate(arr[i])["month"])}-${parseInt(getDate(arr[i])["day"])}`,pivotDate) > 0 && i < j){
            i++;
          }
          arr[j] = arr[i];
        }
        arr[i] = pivot;
        quickSort(arr,begin,i-1);
        quickSort(arr,i+1,end);
      }else{
        return;
      }
    }



    return { pictures,location,getFileInfo,hasNoPic }

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