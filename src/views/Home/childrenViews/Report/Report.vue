<template>
  <div class="report">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div id="main" ref="main" style="width: 1000px;height:600px;"></div>
    </el-card>
  </div>
</template>

<script>
  import echarts from "echarts";
  import _ from "lodash";

  import {getReportData} from "../../../../api/report.js";

  export default {
    name: "Report",
    data(){
      return {
        options: {
          title: {
            text: '用户来源'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#E9EEF3'
              }
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              boundaryGap: false
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ]
        },
        reportData: {}
      }
    },
    mounted(){
      const myChart = echarts.init(this.$refs.main);
      getReportData().then(res => {
        console.log(res);
        if(res.meta.status !== 200) return this.$message.error("获取数据报表数据失败");
        this.reportData = res.data;
        const newOption = _.merge(this.options, this.reportData);
        myChart.setOption(newOption);
      });
    }
  }
</script>

<style scoped>

</style>