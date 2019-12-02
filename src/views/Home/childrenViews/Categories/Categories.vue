<template>
  <div class="categories">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row style="margin-bottom: 20px">
        <el-col>
          <el-button type="primary" @click="showAddCategoriesDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <tree-table :data="categoriesList" :columns="columns" children-prop="children" :selection-type="false" :expand-type="false" :show-index="true" index-text="#" :show-row-hover="false">
        <template slot="isOk" slot-scope="scope">
          <i style="font-size: 18px" class="el-icon-success" v-if="!scope.row.cat_deleted"></i>
          <i style="font-size: 18px" class="el-icon-error" v-else></i>
        </template>
        <template slot="level" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level === 1" type="success">二级</el-tag>
          <el-tag v-else-if="scope.row.cat_level === 2" type="danger">三级</el-tag>
        </template>
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" @click="showEditCategoriesDialog(scope.row)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" @click="deleteCategories(scope.row)">删除</el-button>
        </template>
      </tree-table>
      <el-pagination
              @size-change="categoriesSizeChange"
              @current-change="categoriesCurrentChange"
              :current-page="queryInfo.pagenum"
              :page-sizes="[3, 5, 10, 15]"
              :page-size="queryInfo.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              style="margin-top: 20px">
      </el-pagination>
    </el-card>

    <el-dialog
            title="添加分类"
            :visible.sync="addCategoriesDialogVisible"
            @close="addCategoriesDialogClose"
            width="50%">
      <el-form :model="addCategoriesForm" :rules="addCategoriesRules" ref="addCategoriesRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCategoriesForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
                  :options="parentCategoriesList"
                  :props="{ expandTrigger: 'hover', children: 'children', label: 'cat_name', value: 'cat_id', checkStrictly: true}"
                  @change="addCategoriesChange"
                  v-model="selectKeys"
                  clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addCategoriesDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCategories">确 定</el-button>
  </span>
    </el-dialog>

    <el-dialog
            title="编辑分类"
            :visible.sync="editCategoriesDialogVisible"
            width="30%">
      <el-form :model="editCategoriesForm" :rules="editCategoriesRules" ref="editCategoriesForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCategoriesForm.cat_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
    <el-button @click="editCategoriesDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editCategories">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import {getCategoriesList, addCategories, editCategories, deleteCategories} from "../../../../api/categories.js";

  export default {
    name: "Categories",
    data(){
      return {
        queryInfo: {
          type: 3,
          pagenum: 1,
          pagesize: 5
        },
        categoriesList: [],
        total: 0,
        columns: [  // 列的数组 数组中每一个对象 都是一个列
          {
            label: "分类名称",
            prop: "cat_name"
          },
          {
            label: "是否有效",  // 表示当前列的title
            type: "template",  // 表示当前列是自定义列
            template: "isOk"  // 表示当前列作用域插槽替换的插槽的名称
          },
          {
            label: "等级",
            type: "template",
            template: "level"
          },
          {
            label: "操作",
            type: "template",
            template: "opt"
          }
        ],
        addCategoriesDialogVisible: false,
        addCategoriesForm: {
          cat_pid: 0,
          cat_name: "",
          cat_level: 0
        },
        addCategoriesRules: {
          cat_name: [
            { required: true, message: '请输入分类名称', trigger: 'blur' }
          ]
        },
        parentCategoriesList: [],
        selectKeys: [],
        editCategoriesDialogVisible: false,
        editCategoriesForm: {
          cat_name: "",
          cat_id: ""
        },
        editCategoriesRules: {
          cat_name: [
            { required: true, message: '请输入分类名称', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      getCategoriesList(queryInfo){
        getCategoriesList(queryInfo).then(res => {
          console.log(res);
          if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
          this.categoriesList = res.data.result;
          this.total = res.data.total;
        })
      },
      categoriesSizeChange(pageSize){
        this.queryInfo.pagesize = pageSize;
        this.getCategoriesList(this.queryInfo);
      },
      categoriesCurrentChange(pageNum){
        this.queryInfo.pagenum = pageNum;
        this.getCategoriesList(this.queryInfo);
      },
      showAddCategoriesDialog(){
        getCategoriesList({type: 2}).then(res => {
          console.log(res);
          if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
          this.parentCategoriesList = res.data;
        });
        this.addCategoriesDialogVisible = true;
      },
      addCategoriesChange(selectValue){  // 该方法为级联选择器中子内容选中发生改变时触发 selectValue：当前选中的子内容的id的集合 是一个数组
        console.log(selectValue);
        console.log(this.addCategoriesForm.cat_pid);
        if(selectValue.length !== 0){ // 判断当前级联选择器选择的子内容的长度是否不为0  如果不为0 说明用户指定了当前添加的分类的父分类
          this.addCategoriesForm.cat_pid = selectValue[selectValue.length - 1];  // 那么就要拿到返回的包含所有选中子内容的id的数组中的最后一项 (因为最后一项才是新添加的分类的父分类)
          this.addCategoriesForm.cat_level = selectValue.length;  // 获取到当前添加的分类的等级 等级可以使用当前选中的父分类的id的个数 因为接口中给出提示：不能为空，0表示一级分类；1表示二级分类；2表示三级分类
        }else {
          this.addCategoriesForm.cat_pid = 0;
          this.addCategoriesForm.cat_level = 0;
        }
      },
      addCategories(){
        this.$refs.addCategoriesRef.validate((valid) => {
          if(!valid) return;
          addCategories(this.addCategoriesForm).then(res => {
            if(res.meta.status !== 201) return this.$message.error(res.meta.msg);
            this.getCategoriesList(this.queryInfo);
            this.$message.success(res.meta.msg);
            this.addCategoriesDialogVisible = false;
          })
        });

      },
      addCategoriesDialogClose(){
        this.addCategoriesForm.cat_name = "";
        this.addCategoriesForm.cat_pid = 0;
        this.addCategoriesForm.cat_level = 0;
        this.$refs.addCategoriesRef.resetFields();
        this.selectKeys = [];
      },
      showEditCategoriesDialog(activeRowData){
        this.editCategoriesForm.cat_name = activeRowData.cat_name;
        this.editCategoriesForm.cat_id = activeRowData.cat_id;
        this.editCategoriesDialogVisible = true;
        console.log(activeRowData);
      },
      editCategories(){
        this.$refs.editCategoriesForm.validate(valid => {
          if(!valid) return;
          editCategories(this.editCategoriesForm).then(res => {
            console.log(res);
            if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
            this.getCategoriesList(this.queryInfo);
            this.$message.success(res.meta.msg);
            this.editCategoriesDialogVisible = false;
          })
        })
      },
      deleteCategories(deleteCategoriesData){
        this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteCategories(deleteCategoriesData.cat_id).then(res => {
            if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
            this.getCategoriesList(this.queryInfo);
            this.$message.success(res.meta.msg);
          })
        }).catch(() => {
          this.$message.error("已取消删除");
        });
      }
    },
    created(){
      this.getCategoriesList(this.queryInfo);
    }
  }
</script>

<style scoped>

</style>