<template>
  <div class="showContainer" align="center">
    <h1>整合自<a href="https://tool.lu">tools.lu</a>,使用爬虫技术来调用</h1>
    <hr/>
    <h1>中文拆字：</h1>
    <h2>
      <a href="https://tool.lu/zhcomponent/index.html">原链接</a> <br/>
      注意：原站要求每次不能输入超过5个字 <br/>
      为了避免大量重复请求，每次请清空结果再重新找
    </h2>
    <br/>
    <input type="text" placeholder="输入要拆分的汉字，每次不超过5个字" v-model="text"/>
    <button @click="chaiZi">开始拆字</button>
    <br/>
    <h2>结果输出：</h2> <br/>
    <div ref="result" class="result">
      <h2 ref="hint" v-if="hint">
        {{hintText}}
      </h2>
    </div>

    <hr/>



  </div>
</template>

<script>
import {reactive, ref, getCurrentInstance} from "vue";
import axios from "../global/axios";

export default {
  name: "Tools",
  setup(){
    //拆字功能的输入框
    let text = ref('');
    // 提示信息“结果会显示在这里” 是否显示
    let hint = ref(true);
    let hintText = ref("结果会显示在这里");
    //获取到的结果
    let result = reactive({});
    //获得DOM
    const _this = getCurrentInstance().proxy;
    //DOM解析器，这里将html字符串解析成html DOM
    let parser = new DOMParser();
    //拆字功能的发请求方法
    function chaiZi(){
      hint.value = true;
      hintText.value = "正在操作中...";
      //不要重复添加结果，结果对象不为空就删除之前的
      if(result.chaizi !== undefined) {
        _this.$refs.result.removeChild(result.chaizi);
      }
      axios.get('/chaizi', {
        params: {
          q: text.value
        }
      }).then(
          response => {
            // 这里将html字符串解析成html DOM
            let val = parser.parseFromString(response.data, "text/html");
            result.chaizi = val.getElementsByTagName('table')[0];
            if(result.chaizi !== undefined){
              hint.value = false;
            }
            _this.$refs.result.appendChild(result.chaizi);
          },
          error => {
            console.log("请求出错： + ", error.message);
          }
      )
    }


    return {hint,text,hintText,result,chaiZi};
  }
}
</script>

<style lang="less" scoped>
.showContainer{
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
  h2{
    margin: 20px auto;
  }
  a{
    color: white;
    &:hover{
      color: yellow;
    }
  }
  input{
    width: 250px;
    height: 30px;
    border-radius: 5px;
    border-style: solid;
    border-width: 3px;
    border-color: deeppink;
    margin: 2px;
    &::placeholder{
      font-family: xiawu;
    }
  }
  button{
    width: 100px;
    height: 35px;
    font-family: xiawu;
    border-radius: 5px;
    border-style: solid;
    border-width: 3px;
    border-color: deeppink;
    background-color: gray;
    color: yellow;
    &:hover{
      color: chartreuse;
      background-color: blueviolet;
    }
  }
  // 这里为动态添加的table绑定css
  .result{
    width: 230px;
    border-color: white;
    border-style: dashed;
    border-collapse: separate;
    border-spacing: 1px;
  }
}
</style>