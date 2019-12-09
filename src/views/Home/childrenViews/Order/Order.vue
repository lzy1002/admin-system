<template>
  <div class="order">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row style="margin-bottom: 20px">
        <el-col :span="8">
          <el-input v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <el-table
              :data="orderList"
              border
              style="width: 100%">
        <el-table-column
                label="#"
                type="index"
                width="90">
        </el-table-column>
        <el-table-column
                prop="order_number"
                width="600"
                label="订单编号">
        </el-table-column>
        <el-table-column
                prop="order_price"
                label="订单价格">
        </el-table-column>
        <el-table-column
                prop="pay_status"
                label="是否付款">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.pay_status === '0'" type="danger">未付款</el-tag>
            <el-tag v-else type="success">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column
                prop="is_send"
                label="是否发货">
        </el-table-column>
        <el-table-column
                prop="create_time"
                label="下单时间">
          <template slot-scope="scope">
            {{scope.row.create_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column
                label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="editAddress"></el-button>
            <el-button type="success" icon="el-icon-location" @click="showLogisticsDialog"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfo.pagenum"
              :page-sizes="[5, 10, 15, 20]"
              :page-size="queryInfo.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              style="margin-top: 20px"
              :total="total">
      </el-pagination>
    </el-card>

    <el-dialog
            title="修改地址"
            :visible.sync="AddressDialogVisible"
            @close="addressDialogClose"
            width="30%">
      <el-form :model="addressForm" :rules="addressRules" ref="addressFormRef" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
                  v-model="addressForm.address1"
                  :props="addressProps"
                  :options="citydata"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="AddressDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="AddressDialogVisible = false">确 定</el-button>
  </span>
    </el-dialog>

    <el-dialog
            title="物流信息"
            :visible.sync="logisticsDialogVisible"
            width="30%">

      <el-timeline :reverse="true">
        <el-timeline-item
                v-for="(item, index) in logisticsInfo"
                :timestamp="item.time">
          {{item.context}}
        </el-timeline-item>
      </el-timeline>
      <span slot="footer" class="dialog-footer">
    <el-button @click="logisticsDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="logisticsDialogVisible = false">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import citydata from "../../../../common/mockData/citydata.js";

  import {getOrderList, getLogisticsInfo} from "../../../../api/order.js";

  export default {
    name: "Order",
    data(){
      return {
        queryInfo: {
          query: "",
          pagenum: 1,
          pagesize: 5
        },
        orderList: [],
        total: 0,
        AddressDialogVisible: false,
        addressForm: {
          address1: [],
          address2: ""
        },
        citydata: citydata,
        addressProps: {
          value: "value",
          label: "label",
          children: "children"
        },
        addressRules: {
          address1: [
            { required: true, message: '请选择联动地址', trigger: 'blur' }
          ],
          address2: [
            { required: true, message: '请输入详细地址', trigger: 'blur' }
          ]
        },
        logisticsDialogVisible: false,
        logisticsInfo: []
      }
    },
    methods: {
      getOrderList(){
        getOrderList(this.queryInfo).then(res => {
          console.log(res);
          if(res.meta.status !== 200) return this.$message.error("获取数据失败");
          this.orderList = res.data.goods;
          this.total = res.data.total;
        })
      },
      handleCurrentChange(newPage){  // 页码发生改变时触发
        console.log(newPage);
        this.queryInfo.pagenum = newPage;
        this.getOrderList();
      },
      handleSizeChange(newSize){  // 每一页显示的条数发生改变时触发
        console.log(newSize);
        this.queryInfo.pagesize = newSize;
        this.getOrderList();
      },
      search(){
        this.getOrderList();
      },
      editAddress(){
        this.AddressDialogVisible = true;
      },
      addressDialogClose(){
        this.addressForm.address1 = [];
        this.$refs.addressFormRef.resetFields();
      },
      showLogisticsDialog(){
        getLogisticsInfo("1106975712662").then(res => {
          console.log(res);
          if(res.meta.status !== 200) return this.$message.error("获取物流信息失败");
          this.logisticsInfo = res.data;
        });
        this.logisticsDialogVisible = true;
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
      this.getOrderList();
    }
  }
</script>

<style scoped>

</style>