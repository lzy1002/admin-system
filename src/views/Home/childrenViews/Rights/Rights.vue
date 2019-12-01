<template>
  <div class="rights">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table
              :data="rightsList"
              border
              stripe
              style="width: 100%">
        <el-table-column
                label="#"
                type="index"
                width="80">
        </el-table-column>
        <el-table-column
                prop="authName"
                label="权限名称">
        </el-table-column>
        <el-table-column
                prop="path"
                label="路径">
        </el-table-column>
        <el-table-column
                prop="address"
                label="权限等级">
          <template slot-scope="scope">
            <el-tag :type="rightsTypes[scope.row.level].type">{{rightsTypes[scope.row.level].content}}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
  import {getRightsList} from "../../../../api/rights.js";

  export default {
    name: "Rights",
    data(){
      return {
        rightsList: [],
        rightsTypes: [{type: "", content: "一级"}, {type: "success", content: "二级"}, {type: "warning", content: "三级"}]
      }
    },
    methods: {
      getRightsList(type){
        getRightsList(type).then(res => {
          console.log(res);
          if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
          this.rightsList = res.data;
        })
      }
    },
    created(){
      this.getRightsList("list");
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>