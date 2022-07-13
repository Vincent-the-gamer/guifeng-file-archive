<template>
   <div class="header">
     <span>诡锋的个人网站敬请期待！</span>
     <span>
       <a href="https://github.com/Vincent-the-gamer" target="_blank">诡锋的Github</a>
     </span>
     <span>
       <a href="http://imon7o.tk" target="_blank">IMO_N7O的个人网站(诡锋作品)</a>
     </span>
     <button class="login" @click="changeShowLogin" v-show="!token">登录</button>
     <button class="logOut" @click="logOut" v-if="token">退出登录</button>
     <span class="loginMsg" v-if="token">站长：诡锋已登录</span>
      <!--  登录表单   -->
     <div class="loginForm" v-show="showLogin" @mouseleave="changeShowLogin">
       <h2>登录</h2>
       <form @submit.prevent="() => login(user.username,user.password)">
         <p>用户名：</p>
         <input class="input" type="text" v-model="user.username" placeholder="输入用户名" autocomplete=“off”/>
         <br/>
         <p>密码：&nbsp;&nbsp;&nbsp;</p>
         <input class="input" type="password" v-model="user.password" placeholder="输入密码" autocomplete=“off”/>
         <input class="confirmLogin" type="submit" value="确认登录"/>
       </form>
     </div>
   </div>
</template>

<script>
import {onMounted, reactive, ref} from "vue";
import axios from "../global/axios";
import bus from "../global/mitt"

export default {
  name: "Header",
  setup(){
    const user = reactive({
      username: '',
      password: ''
    })
    let token = ref('');
    //挂载后拿到localStorage的token
    onMounted(() => {
       token.value = localStorage.getItem('token');
    })
    //是否显示登录窗口
    let showLogin = ref(false);
    function changeShowLogin(){
      showLogin.value = !showLogin.value;
    }

    //发送登录请求
    function login(username,password){
      const userInfo = {username,password};
      axios.post('/login',userInfo).then(
          response => {
             const {success,token} = response.data;
             if(success){
               alert("登录成功！")
               localStorage.setItem('token',token);
               //自动刷新
               bus.emit('refresh');
             }
             else{
               alert("登录失败！")
             }

          },
          error => {
            console.log("发生错误了！！")
          }
      )
    }

    //退出登录
    function logOut(){
      if(confirm('是否要退出登录？')){
        localStorage.removeItem("token");
        alert("已退出登录！");
        //自动刷新
        bus.emit('refresh');
      }
    }

    return {token,user,showLogin,logOut,login,changeShowLogin}
  }
}
</script>

<style lang="less" scoped>
 .header{
   position: absolute;
   z-index: 1;
   top: 0;
   left: 0;
   height: 50px;
   width: 100%;
   border: 1px solid deeppink;
   box-shadow: -2px 2px 2px deeppink;
   span{
     position: relative;
     top: 15px;
     margin-left: 20px;
   }
   a{
     color: deeppink;
     text-decoration: none;
     &:hover{
       color: aqua;
     }
   }
   .login{
     position: relative;
     top: 10px;
     height: 30px;
     width: 50px;
     margin-right: 15px;
     background-color: deeppink;
     color: white;
     border-radius: 5px;
     border: 1px solid white;
     box-shadow: 0 8px 16px 0 rgba(255,255,255,0.4);
     float: right;
     &:hover{
       background-color: aqua;
       color: black;
       cursor: pointer;
     }
   }
   .loginForm{
     background-color: gray;
     position: absolute;
     right: 0;
     top: 55px;
     border: 2px solid deeppink;
     width: 400px;
     height: 200px;
     h2{
       margin: 8px auto;
       text-align: center;
     }
     p{
       margin: 0 17px;
       display: inline-block;
     }
     .input{
       color: white;
       margin: 4px 10px;
       background-color: black;
       border: 2px solid deeppink;
       height: 25px;
       width: 200px;
       &::placeholder{
         color: gray;
       }
     }
   }
   .confirmLogin{
     position: relative;
     display: block;
     margin: 15px auto;
     width: 100px;
     height: 40px;
     background-color: deeppink;
     color: white;
     border-radius: 5px;
     border: 1px solid white;
     box-shadow: 0 8px 16px 0 rgba(255,255,255,0.4);
     &:hover{
       background-color: aqua;
       color: black;
       cursor: pointer;
     }
   }
   .loginMsg{
     float: right;
     margin-right: 20px;
     &:hover{
       color: aqua;
     }
   }
   .logOut{
     position: relative;
     top: 10px;
     height: 30px;
     width: 70px;
     margin-right: 15px;
     background-color: deeppink;
     color: white;
     border-radius: 5px;
     border: 1px solid white;
     box-shadow: 0 8px 16px 0 rgba(255,255,255,0.4);
     float: right;
     &:hover{
       background-color: aqua;
       color: black;
       cursor: pointer;
     }
   }

 }
</style>