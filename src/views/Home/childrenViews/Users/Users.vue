<template>
  <div class="users">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div style="margin-top: 15px;">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input placeholder="请输入内容" v-model="params.query" clearable @clear="getUsersList">
              <el-button slot="append" icon="el-icon-search" @click="getUsersList"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="addUserDialogVisible = true">添加用户</el-button>
          </el-col>
        </el-row>
      </div>
      <el-table
              :data="usersList"
              border
              stripe
              style="width: 100%">
        <el-table-column
                label="#"
                type="index"
                width="80">
        </el-table-column>
        <el-table-column
                prop="username"
                label="姓名"
                width="260">
        </el-table-column>
        <el-table-column
                prop="email"
                label="邮箱"
                width="260">
        </el-table-column>
        <el-table-column
                prop="mobile"
                label="电话"
                width="260">
        </el-table-column>
        <el-table-column
                prop="role_name"
                label="角色"
                width="260">
        </el-table-column>
        <el-table-column
                prop="address"
                label="状态"
                width="230">
          <template slot-scope="scope">
            <el-switch
                    v-model="scope.row.mg_state"
                    active-color="#409eff"
                    inactive-color="#ff4949"
                    @change="changeUserState(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
                prop="address"
                label="操作">
          <template slot-scope="scope">  <!--使用scope.row可以拿到当前行的数据-->
            <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" @click="deleteUser(scope.row.id)"></el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top-end" :enterable="false">
              <el-button type="warning" icon="el-icon-s-tools"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="params.pageNum"
              :page-sizes="[1, 2, 5, 10]"
              :page-size="params.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
      </el-pagination>
    </el-card>
    <el-dialog
            title="添加用户"
            :visible.sync="addUserDialogVisible"
            width="30%"
            @close="addDialogClose">
      <el-form :model="addUserData" :rules="addUserRules" ref="addFormRef" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserData.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserData.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserData.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addUserData.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addUserDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
    </el-dialog>

    <el-dialog
            title="修改用户"
            :visible.sync="editUserDialogVisible"
            width="30%"
            @close="editDialogClose">
      <el-form :model="editUserData" :rules="editUserRules" ref="editFormRef" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editUserData.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserData.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editUserData.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editUserDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUser">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import {getUsersList, changeUserState, addUser, getUserInfo, editUser, deleteUser} from "../../../../api/users.js";

  export default {
    name: "Users",
    data() {
      var emailRules = (rule, value, callback) => {
        const emailReg = /^[A-Za-z0-9]+([_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/;
        if (emailReg.test(value)) {
          return callback();  //正确调用callback 什么都不传表示正确
        }
        callback(new Error("邮箱格式不正确"));  //如果有错误 那么调用callback时需要new Error并传入错误的提示信息 而这个信息会被显示在页面上
      };
      var mobileRules = (rule, value, callback) => {
        const mobileReg = /^1(3|4|5|7|8)\d{9}$/;
        if (mobileReg.test(value)) {
          return callback();
        }
        callback(new Error("手机号格式不正确"));
      };
      return {
        params: {
          query: "",
          pageNum: 1,
          pageSize: 2
        },
        usersList: [],
        total: 0,
        addUserDialogVisible: false,
        addUserData: {
          username: "admin",
          password: "123456",
          email: "123456@admin.com",
          mobile: "13911111111"
        },
        addUserRules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur'}
          ],
          email: [
            {required: true, message: '请输入邮箱', trigger: 'blur'},
            {validator: emailRules, trigger: "blur"}
          ],
          mobile: [
            {required: true, message: '请输入手机号', trigger: 'blur'},
            {validator: mobileRules, trigger: "blur"}
          ]
        },
        editUserDialogVisible: false,
        editUserData: {
          id: "",
          username: "",
          email: "",
          mobile: ""
        },
        editUserRules: {
          email: [
            {required: true, message: '请输入邮箱', trigger: 'blur'},
            {validator: emailRules, trigger: "blur"}
          ],
          mobile: [
            {required: true, message: '请输入手机号', trigger: 'blur'},
            {validator: mobileRules, trigger: "blur"}
          ]
        }
      };
    },
    methods: {
      getUsersList() {
        getUsersList(this.params.query, this.params.pageNum, this.params.pageSize).then(res => {
          console.log(res);
          if (res.meta.status !== 200) return this.$message.error("获取数据失败");
          this.total = res.data.total;
          this.usersList = res.data.users;
        })
      },
      handleSizeChange(newSize) {
        this.params.pageSize = newSize;
        this.getUsersList();
      },
      handleCurrentChange(newPage) {
        this.params.pageNum = newPage;
        this.getUsersList();
      },
      changeUserState(userInfo) {
        console.log(userInfo);
        changeUserState(userInfo.id, userInfo.mg_state).then(res => {
          console.log(res);
          if (res.meta.status !== 200) {
            userInfo.mg_state = !userInfo.mg_state;
            return this.$message.error(res.meta.msg);
          }
          this.$message.success(res.meta.msg);
        })
      },
      addDialogClose() {
        this.$refs.addFormRef.resetFields();
      },
      addUser() {
        this.$refs.addFormRef.validate((valid) => {
          if (!valid) return;
          addUser(this.addUserData).then(res => {
            console.log(res);
            if (res.meta.status !== 201) return this.$message.error(res.meta.msg);
            this.addUserDialogVisible = false;
            this.getUsersList();
          })
        })
      },
      showEditDialog(userId){
        getUserInfo(userId).then(res => {
          console.log(res);
          if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
          this.editUserData = res.data;
        });
        this.editUserDialogVisible = true;
      },
      editUser(){
        this.$refs.editFormRef.validate((valid) => {
          if(!valid) return;
          editUser(this.editUserData).then(res => {
            console.log(res);
            if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
            this.editUserDialogVisible = false;
            this.getUsersList();
            this.$message.success("修改用户信息成功");
          })
        })
      },
      editDialogClose(){
        this.$refs.editFormRef.resetFields();
      },
      deleteUser(userId){
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteUser(userId).then(res => {
            if(res.meta.status !== 200) return this.$message.error("删除用户失败");
            this.$message.success(res.meta.msg);
            this.getUsersList();
          })
        }).catch(() => {
          this.$message.warning("取消删除成功");
        });
      }
    },
    created() {
      this.getUsersList();
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .el-table
    margin-top 20px

  .el-pagination
    margin-top 20px
</style>