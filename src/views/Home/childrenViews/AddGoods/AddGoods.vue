<template>
  <div class="add-goods">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-alert
              title="添加商品信息"
              type="info"
              center
              show-icon>
      </el-alert>
      <el-steps style="margin: 20px 0" :active="activePosition - 0" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
        <el-tabs v-model="activePosition" :tab-position="'left'" :before-leave="beforeTabsLeave" @tab-click="tabClick">
          <el-tab-pane label="基本信息" :name="'0'">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <el-cascader
                      v-model="addForm.goods_cat"
                      :options="categoriesList"
                      :props="cascaderProps"
                      clearable
                      @change="selectChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" :name="'1'">
            <el-form-item :label="item.attr_name" v-for="(item, index) in tableData.many">
              <el-checkbox-group v-model="item.attr_vals_arr">
                <el-checkbox style="margin: 0 10px 0 0" v-for="(item1, index) in item.attr_vals_arr" :label="item1" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" :name="'2'">
            <el-form-item :label="item.attr_name" v-for="(item, index) in tableData.only">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" :name="'3'">
            <el-upload
                    action="http://127.0.0.1:8888/api/private/v1/upload"
                    :headers="headerObj"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :on-success="uploadSuccess"
                    list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" :name="'4'">
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-row style="margin: 20px 0">
              <el-col>
                <el-button type="primary" @click="addGoods">添加商品</el-button>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <el-dialog
            title="查看图片"
            :visible.sync="showImgDialogVisible"
            style="text-align: center"
            width="50%">
      <img :src="perviewImgUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
  import _ from "lodash";

  import {getCategoriesList, getAttributes, addGoods} from "../../../../api/addGoods.js";

  export default {
    name: "AddGoods",
    data() {
      return {
        activePosition: "0",
        addForm: {
          goods_name: "",
          goods_cat: [],
          goods_price: "",
          goods_weight: "",
          goods_number: "",
          pics: [],
          goods_introduce: "",
          attrs: []
        },
        addFormRules: {
          goods_name: [
            { required: true, message: '请输入商品名称', trigger: 'blur' }
          ],
          goods_price: [
            { required: true, message: '请输入商品价格', trigger: 'blur' }
          ],
          goods_weight: [
            { required: true, message: '请输入商品重量', trigger: 'blur' }
          ],
          goods_number: [
            { required: true, message: '请输入商品数量', trigger: 'blur' }
          ]
        },
        categoriesList: [],  // 分类列表
        cascaderProps: {
          label: "cat_name",
          value: "cat_id",
          children: "children"
        },
        tableData: {
          "many": [],
          "only": []
        },
        headerObj: {
          Authorization: window.sessionStorage.getItem("token")
        },
        perviewImgUrl: "",
        showImgDialogVisible: false
      }
    },
    methods: {
      getCategoriesList(){
        getCategoriesList().then(res => {
          console.log(res);
          if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
          this.categoriesList = res.data;
        })
      },
      selectChange(){
        if(this.addForm.goods_cat.length !== 3){
          this.addForm.goods_cat = [];
        }
      },
      beforeTabsLeave(activeName, oldActiveName){
        console.log(activeName, oldActiveName);
        if(oldActiveName === "0" && this.addForm.goods_cat.length !== 3){
          this.$message.error("请选择三级分类");
          return false;  // 该方法中 只要return的false 那么tabs就不会进行切换
        }
      },
      getAttributes(cateId, sel){
        getAttributes(cateId, sel).then(res => {
          console.log(res);
          if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
          res.data.forEach((item) => {
             item.attr_vals_arr = item.attr_vals.length <= 0 ? [] : item.attr_vals.split(" ");
          });
          this.tableData[sel] = res.data;
        })
      },
      tabClick(){  // 当tab发生点击时触发
        console.log(this.activePosition);
        if(this.activePosition === "1"){  // 进入商品参数
          this.getAttributes(this.addForm.goods_cat[2], "many");
        }else if(this.activePosition === "2"){  // 进入商品属性
          this.getAttributes(this.addForm.goods_cat[2], "only");
        }
      },
      handlePreview(file){
        console.log(file);
        this.perviewImgUrl = file.response.data.url;
        this.showImgDialogVisible = true;

      },
      handleRemove(file, fileList){
        console.log(file);
        const removeFileUrl = file.response.data.tmp_path;
        const removeFileIndex = this.addForm.pics.findIndex(item => {
          return item.pic === removeFileUrl;
        });
        this.addForm.pics.splice(removeFileIndex, 1);
      },
      uploadSuccess(response){  // response为上传成功后 后台返回的数据
        console.log(response);
        if(response.meta.status !== 200) return this.$message.error("上传失败");
        const picObj = {
          pic: response.data.tmp_path
        };
        this.addForm.pics.push(picObj);
      },
      addGoods(){
        console.log(this.addForm);
        this.$refs.addFormRef.validate((valid) => {
          if(!valid) return this.$message.error("请填写必要的表单项");
          const form = _.cloneDeep(this.addForm);
          form.goods_cat = form.goods_cat.join(",");
          console.log(form);
          this.tableData.many.forEach(item => {
            form.attrs.push({
              attr_id: item.attr_id,
              attr_value: item.attr_vals_arr.join(" ")
            })
          });
          this.tableData.only.forEach(item => {
            form.attrs.push({
              attr_id: item.attr_id,
              attr_value: item.attr_vals
            })
          });
          console.log(form);
          addGoods(form).then(res => {
            console.log(res);
            if(res.meta.status !== 201) return this.$message.error(res.meta.msg);
            this.$router.push("/goods");
            this.$message.success(res.meta.msg);
          })
        })
      }
    },
    created(){
      this.getCategoriesList();
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>