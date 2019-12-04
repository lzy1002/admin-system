<template>
  <div class="params">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分页参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-alert
              title="注意: 只允许第三级分类设置相关参数!"
              type="warning"
              show-icon>
      </el-alert>
      <el-row style="margin: 20px 0">
        <el-col>
          <span>选择商品分类: </span>
          <el-cascader
                  :options="categoriesList"
                  :props="{ children: 'children', value: 'cat_id', label: 'cat_name' }"
                  v-model="selectKeys"
                  @change="selectChange"
                  clearable></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleTabsClick">
        <el-tab-pane label="动态参数" name="many">
          <el-row style="margin-bottom: 20px">
            <el-col>
              <el-button type="primary" :disabled="selectKeys.length !== 3" @click="showAddDialog">添加参数</el-button>
            </el-col>
          </el-row>
          <el-table
                  :data="tableData[activeName]"
                  border
                  stripe
                  style="width: 100%">
            <el-table-column type="index" label="#">

            </el-table-column>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-row>
                  <el-col>
                    <el-tag style="margin: 10px 10px" @close="tagClose(scope.row, index)" v-for="(item, index) in scope.row.attr_vals_arr" closable>
                      {{item}}
                    </el-tag>

                    <el-input
                            v-if="scope.row.inputVisible"
                            v-model="scope.row.inputValue"
                            ref="saveTagInput"
                            style="width: 120px"
                            size="small"
                            @keyup.enter.native="handleInputConfirm(scope.row)"
                            @blur="handleInputConfirm(scope.row)">
                    </el-input>
                    <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>

            <el-table-column
                    label="参数名称"
                    prop="attr_name">
            </el-table-column>
            <el-table-column
                    label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row)">修改</el-button>
                <el-button type="danger" icon="el-icon-delete" @click="deleteAttributes(scope.row)">删除</el-button>
              </template>
            </el-table-column>

          </el-table>
        </el-tab-pane>


        <el-tab-pane label="静态属性" name="only">
          <el-row style="margin-bottom: 20px">
            <el-col>
              <el-button type="primary" :disabled="selectKeys.length !== 3" @click="showAddDialog">添加属性</el-button>
            </el-col>
          </el-row>
          <el-table
                  :data="tableData[activeName]"
                  border
                  stripe
                  style="width: 100%">
            <el-table-column type="index" label="#">

            </el-table-column>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-row>
                  <el-col>
                    <el-tag style="margin: 10px 10px" @close="tagClose(scope.row, index)" v-for="(item, index) in scope.row.attr_vals_arr" closable>
                      {{item}}
                    </el-tag>

                    <el-input
                            v-if="scope.row.inputVisible"
                            v-model="scope.row.inputValue"
                            ref="saveTagInput"
                            style="width: 120px"
                            size="small"
                            @keyup.enter.native="handleInputConfirm(scope.row)"
                            @blur="handleInputConfirm(scope.row)">
                    </el-input>
                    <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>

            <el-table-column
                    label="属性名称"
                    prop="attr_name">
            </el-table-column>
            <el-table-column
                    label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row)">修改</el-button>
                <el-button type="danger" icon="el-icon-delete" @click="deleteAttributes(scope.row)">删除</el-button>
              </template>
            </el-table-column>

          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog
            :title="'添加' + titleText"
            :visible.sync="addDialogVisible"
            @close="addDialogClose"
            width="30%">
      <el-form :model="addForm" :rules="addRule" ref="addRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addAttributes">确 定</el-button>
  </span>
    </el-dialog>

    <el-dialog
            :title="'修改' + titleText"
            :visible.sync="editDialogVisible"
            @close="editDialogClose"
            width="30%">
      <el-form :model="editForm" :rules="editRule" ref="editRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editAttributes">确 定</el-button>
  </span>
    </el-dialog>

  </div>
</template>

<script>
  import {getCategoriesList, getAttributes, addAttributes, getAttributesById, editAttributes, deleteAttributes} from "../../../../api/params.js";

  export default {
    name: "Params",
    data(){
      return {
        queryInfo: {
          type: 3
        },
        categoriesList: [],
        selectKeys: [],
        activeName: "many",
        tableData: {
          "many": [],
          "only": []
        },
        addDialogVisible: false,
        addForm: {
          attr_name: ""
        },
        addRule: {
          attr_name: [
            { required: true, message: '请输入动态参数', trigger: 'blur' }
          ]
        },
        editDialogVisible: false,
        editForm: {
          attr_name: ""
        },
        editVals: "",
        editRule: {
          attr_name: [
            { required: true, message: '请输入动态参数', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      getCategoriesList(queryInfo){
        getCategoriesList(queryInfo).then(res => {
          console.log(res);
          if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
          this.categoriesList = res.data;
          console.log(this.categoriesList);
        })
      },
      selectChange(){
        console.log(this.selectKeys);
        if(this.selectKeys.length !== 3){
          this.selectKeys = [];
          this.tableData.many = [];
          this.tableData.only = [];
          return;
        }
        this.getAttributes(this.activeKey, this.activeName);
      },
      handleTabsClick(){
        console.log(this.activeName);
        if(this.selectKeys.length !== 3) return;
        this.getAttributes(this.activeKey, this.activeName);
      },
      getAttributes(id, selectName){
        getAttributes(id, selectName).then(res => {
          console.log(res);
          if(res.meta.status !== 200) return;
          res.data.forEach((item) => {
            if(item.attr_vals){
              item.attr_vals_arr = item.attr_vals.split(" ");
            }
            item.inputVisible = false;
            item.inputValue = "";
          });
          this.tableData[this.activeName] = res.data;
        })
      },
      showAddDialog(){
        this.addDialogVisible = true;
      },
      addDialogClose(){
        this.$refs.addRef.resetFields();
      },
      addAttributes(){
        this.$refs.addRef.validate((valid) => {
          if(!valid) return;
          addAttributes(this.selectKeys[2], this.addForm.attr_name, this.activeName).then(res => {
            console.log(res);
            if(res.meta.status !== 201) return this.$message.error(res.meta.msg);
            this.getAttributes(this.selectKeys[2], this.activeName);
            this.$message.success(res.meta.msg);
            this.addDialogVisible = false;
          })
        })
      },
      showEditDialog(attrData){
        getAttributesById(this.selectKeys[2], attrData.attr_id, this.activeName).then(res => {
          if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
          this.editForm = res.data;
        });
        this.editDialogVisible = true;
        console.log(attrData);
      },
      editDialogClose(){
        this.$refs.editRef.resetFields();
      },
      editAttributes(){
        this.$refs.editRef.validate((valid) => {
          if(!valid) return;
          editAttributes(this.selectKeys[2], this.editForm.attr_id, this.editForm.attr_name, this.activeName, this.editVals).then(res => {
            console.log(res);
            if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
            this.getAttributes(this.selectKeys[2], this.activeName);
            this.$message.success(res.meta.msg);
            this.editDialogVisible = false;
          })
        })
      },
      deleteAttributes(attrData){
        this.$confirm('此操作将永久删除该属性, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteAttributes(this.selectKeys[2], attrData.attr_id).then(res => {
            console.log(res);
            if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
            this.getAttributes(this.selectKeys[2], this.activeName);
            this.$message.success(res.meta.msg);
          })
        }).catch(() => {
          this.$message.error("取消删除");
        });
      },
      tagClose(rowData, index){
        rowData.attr_vals_arr.splice(index, 1);
        const newValsStr = rowData.attr_vals_arr.join(" ");
        console.log(this.selectKeys[2], rowData.attr_id, rowData.attr_name, this.activeName, newValsStr)
        editAttributes(this.selectKeys[2], rowData.attr_id, rowData.attr_name, this.activeName, newValsStr).then(res => {
          console.log(res);
          if(res.meta.status !== 200) return this.$message.error("删除失败");
          this.$message.success("删除成功");
        })
      },
      showInput(rowData){  // 点击按钮时触发
        rowData.inputVisible = true;
        this.$nextTick(() => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      handleInputConfirm(rowData){  // 输入框失去焦点时触发
        rowData.inputVisible = false;
        if(rowData.inputValue.trim().length === 0) return rowData.inputValue = "";
        rowData.attr_vals_arr.push(rowData.inputValue);
        const newValsStr = rowData.attr_vals_arr.join(" ");
        editAttributes(this.selectKeys[2], rowData.attr_id, rowData.attr_name, this.activeName, newValsStr).then(res => {
          console.log(res);
          if(res.meta.status !== 200) return this.$message.error("添加失败");
          this.$message.success("添加成功");
          rowData.inputValue = "";
        });

      }
    },
    computed: {
      activeKey(){  // 返回当前选中的三级分类的id
        if(this.selectKeys.length !== 3) return null;
        return this.selectKeys[2];
      },
      titleText(){
        return this.activeName === "many" ? "动态参数" : "静态属性";
      }
    },
    created(){
      this.getCategoriesList(this.queryInfo);
    }
  }
</script>

<style scoped>

</style>