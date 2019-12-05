<template>
  <div class="list">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row style="margin-bottom: 20px" :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @change="searchInputChange">
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="toAddGoods">添加商品</el-button>
        </el-col>
      </el-row>

      <el-table
              :data="goodsList"
              border
              stripe
              style="width: 100%">
        <el-table-column
                label="#"
                type="index"
                width="90">
        </el-table-column>
        <el-table-column
                prop="goods_name"
                label="商品名称">
        </el-table-column>
        <el-table-column
                prop="goods_price"
                width="180px"
                label="商品价格(元)">
        </el-table-column>
        <el-table-column
                prop="goods_weight"
                width="180px"
                label="商品重量">
        </el-table-column>
        <el-table-column
                prop="add_time"
                width="180px"
                label="创建时间">
          <template slot-scope="scope">
            {{scope.row.add_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column
                width="250px"
                label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit">修改</el-button>
            <el-button type="danger" icon="el-icon-delete" @click="deleteGoods(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
              @size-change="goodsListSizeChange"
              @current-change="goodsListCurrentChange"
              :current-page="queryInfo.pagenum"
              :page-sizes="[10, 30, 50, 100]"
              :page-size="queryInfo.pagesize"
              style="margin-top: 20px"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
  import {getGoodsList, deleteGoods} from "../../../../api/list.js";

  export default {
    name: "List",
    data(){
      return {
        queryInfo: {
          query: "",
          pagenum: 1,
          pagesize: 10
        },
        goodsList: [],
        total: 0
      }
    },
    methods: {
      getGoodsList(){
        getGoodsList(this.queryInfo).then(res => {
          console.log(res);
          if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
          this.goodsList = res.data.goods;
          this.total = res.data.total;
        })
      },
      goodsListSizeChange(newSize){
        console.log(newSize);
        this.queryInfo.pagesize = newSize;
        this.getGoodsList();
      },
      goodsListCurrentChange(newPage){
        console.log(newPage);
        this.queryInfo.pagenum = newPage;
        this.getGoodsList();
      },
      search(){
        this.getGoodsList();
      },
      searchInputChange(){
        this.getGoodsList();
      },
      deleteGoods(rowData){
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteGoods(rowData.goods_id).then(res => {
            console.log(res);
            if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
            this.getGoodsList();
            this.$message.success(res.meta.msg);
          })
        }).catch(() => {
            this.$message.error("取消删除");
        });
      },
      toAddGoods(){
        this.$router.push("/add-goods");
      }
    },
    filters: {
      dateFormat(date){
        const dt = new Date(date);
        const y = dt.getFullYear();
        const m = (dt.getMonth() + 1 + "").padStart(2, "0");  // .padStart()方法  用于字符串  参数一：理想的长度  参数二：当没有达到理想的长度时在前面拼接的内容
        const d = (dt.getDate() + "").padStart(2, "0");
        const h = (dt.getHours() + 1 + "").padStart(2, "0");
        const M = (dt.getMinutes() + "").padStart(2, "0");
        const s = (dt.getSeconds() + "").padStart(2, "0");

        return `${y}-${m}-${d} ${h}:${M}:${s}`;
      }
    },
    created(){
      this.getGoodsList();
    }
  }
</script>

<style scoped>

</style>