<template>
  <el-container class="home-container">
    <el-header>
      <div class="header-left">
        <img src="../../common/images/heima.png" alt="">
        <span>后台管理页面</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="collapse-bar" @click="changeCollapse">|||</div>
        <el-menu
                background-color="#333744"
                text-color="#fff"
                active-text-color="#409eff"
                :collapse="isCollapse"
                :collapse-transition="false"
                :unique-opened="true"
                :router="true"
                :default-active="activePath">
          <el-submenu v-for="(fItem, fIndex) in menuList" :index="fIndex + ''">
            <template slot="title">
              <i :class="iconList[fIndex]"></i>
              <span>{{fItem.authName}}</span>
            </template>
            <el-menu-item v-for="(cItem, cIndex) in fItem.children" :index="'/' + cItem.path" @click="changeActive('/' + cItem.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{cItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import {getMenuList} from "../../api/Home.js";

  export default {
    name: "Home",
    data(){
      return {
        menuList: [],
        iconList: ["iconfont icon-user", "iconfont icon-tijikongjian", "iconfont icon-shangpin", "iconfont icon-danju", "iconfont icon-baobiao"],
        isCollapse: false,
        activePath: ""
      }
    },
    methods: {
      logout(){
        window.sessionStorage.removeItem("token");
        this.$router.push("/login");
      },
      getMenuList(){
        getMenuList().then(res => {
          console.log(res);
          if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
          this.menuList = res.data;
          console.log(this.menuList);
        })
      },
      changeCollapse(){
        this.isCollapse = !this.isCollapse;
      },
      changeActive(path){
        this.activePath = path;
        window.sessionStorage.setItem("activePath", path);
      }
    },
    created(){
      this.getMenuList();
      this.activePath = window.sessionStorage.getItem("activePath");
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .home-container
    height 100%
    .el-header
      display flex
      justify-content space-between
      align-items center
      padding-left 0
      background-color #373d41
      .header-left
        display flex
        align-items center
        img
          margin-right 15px
        span
          font-size 20px
          color #eee
    .el-container
      .el-aside
        background-color #333744
        .collapse-bar
          color #eee
          text-align center
          font-size 10px
          line-height 24px
          background-color #4a5064
          cursor pointer
          letter-spacing 0.2em
        .el-menu
          border-right none
        .iconfont
          margin-right 8px
      .el-main
        background-color #eaedf1
</style>