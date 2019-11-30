<template>
  <div class="login-container">
    <div class="login-box">
      <div class="avatar-box">
        <img src="../../common/images/heima.png" alt="">
      </div>
      <div class="form-box">
        <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px">
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima"></el-input>
          </el-form-item>
          <el-form-item class="btn-box">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="resetLoginForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  import {login} from "../../api/login.js";

  export default {
    name: "Login",
    data(){
      return {
        loginForm: {
          username: "admin",
          password: "123456"
        },
        loginFormRules: {
          username: [
            { required: true, message: '请输入登录名称', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入登录密码', trigger: 'blur' },
            { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      resetLoginForm(){
        this.$refs.loginFormRef.resetFields();
      },
      login(){
        this.$refs.loginFormRef.validate((valid) => {
          console.log(valid);
          if(!valid) return;
          login({
            url: "/login",
            method: "post",
            data: this.loginForm
          }).then(res => {
            console.log(res);
            if(res.meta.status !== 200) return this.$message.error("登录失败");
            this.$message.success("登陆成功");
            const tokenStr = res.data.token;
            window.sessionStorage.setItem("token", tokenStr);
            this.$router.push("/home");
          })
        })
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .login-container
    width 100%
    height 100%
    background-color #2b4b6b
    .login-box
      position absolute
      left 50%
      top 50%
      width 450px
      height 300px
      transform translate(-50%, -50%)
      background-color #fff
      border-radius 3px
      .avatar-box
        position absolute
        left 50%
        transform translate(-50%, -50%)
        width 130px
        height 130px
        padding 10px
        border 1px solid #eee
        border-radius 50%
        box-shadow 0 0 10px #eee
        img
          width 100%
          height 100%
          border-radius 50%
      .form-box
        position absolute
        bottom 0
        width 100%
        padding 0 20px
        box-sizing border-box
        .btn-box
          display flex
          justify-content flex-end
</style>