<template>
  <div class="roles">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddRoleDialog">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table
              :data="rolesList"
              border
              stripe
              style="width: 100%">
        <el-table-column
                type="expand"
                width="80">
          <template slot-scope="scope">
            <el-row class="vcenter bd-bottom" v-for="(item1, index1) in scope.row.children">
              <el-col :span="5">
                <el-tag @close="deleteRightById(scope.row, item1.id)" closable>
                  {{item1.authName}}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row class="vcenter" v-for="(item2, index2) in item1.children">
                  <el-col :span="5">
                    <el-tag @close="deleteRightById(scope.row, item2.id)" type="success" closable>
                      {{item2.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="19">
                    <el-tag type="danger" @close="deleteRightById(scope.row, item3.id)" v-for="(item3, index3) in item2.children" closable>
                      {{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column
                label="#"
                type="index"
                width="80">
        </el-table-column>
        <el-table-column
                prop="roleName"
                label="角色名称">
        </el-table-column>
        <el-table-column
                prop="roleDesc"
                label="角色描述">
        </el-table-column>
        <el-table-column
                prop="address"
                label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="medium" @click="showEditRoleDialog(scope.row)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="medium" @click="showDeleteRoleConfirm(scope.row)">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="medium" @click="showRightsDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
            title="全部权限"
            :visible.sync="showRightsDialogVisible"
            @close="setRightDialogClose"
            width="50%">
      <el-tree :data="rightsList" :props="defaultProps" ref="treeRef" node-key="id" :default-checked-keys="defKeys" @getCheckedKeys="getCheckedKeys" show-checkbox default-expand-all></el-tree>
      <span slot="footer" class="dialog-footer">
    <el-button @click="showRightsDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addRoleRight">确 定</el-button>
  </span>
    </el-dialog>

    <el-dialog
            title="编辑角色"
            :visible.sync="editRoleDialogVisible"
            width="30%">
      <el-form :model="editRoleInfo" :rules="editRoleRules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleInfo.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色介绍" prop="roleDesc">
          <el-input v-model="editRoleInfo.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editRoleDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editRole">确 定</el-button>
  </span>
    </el-dialog>

    <el-dialog
            title="添加角色"
            :visible.sync="addRoleDialogVisible"
            width="30%">
      <el-form ref="form" :model="addRoleData"  :rules="addRoleRules" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleData.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色介绍" prop="roleDesc">
          <el-input v-model="addRoleData.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addRoleDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addRole">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  import {getRolesList, deleteRoleRight, getRightsList, addRoleRight, editRoleInfo, addRole, deleteRole} from "../../../../api/roles.js";

  export default {
    name: "Roles",
    data(){
      return {
        rolesList: [],
        showRightsDialogVisible: false,
        rightsList: [],
        defaultProps:{  //树形控件的规则对象
          children: "children",  //以哪一个键实现下一级
          label: "authName"  //以哪一个键为title
        },
        defKeys: [],  //默认选中的节点的key的数组,
        currentRoleId: "",  //保存点击分配权限时当前角色的id
        editRoleDialogVisible: false,
        editRoleInfo: {},
        editRoleRules: {
          roleName: [
            { required: true, message: '请输入角色名称', trigger: 'blur' }
          ],
          roleDesc: [
            { required: true, message: '请输入角色介绍', trigger: 'blur' }
          ]
        },
        addRoleDialogVisible: false,  //控制添加角色弹出框的显示和隐藏,
        addRoleData: {
          roleName: "",
          roleDesc: ""
        },
        addRoleRules: {
          roleName: [
            { required: true, message: '请输入角色名称', trigger: 'blur' }
          ],
          roleDesc: [
            { required: true, message: '请输入角色名称', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      getRolesList(){
        getRolesList().then(res => {
          console.log(res);
          if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
          this.rolesList = res.data;
          console.log(this.rolesList);
        })
      },
      deleteRightById(role, rightId){  //roleId 角色id
        this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteRoleRight(role.id, rightId).then(res => {
            console.log(res);
            if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
            this.$message.success(res.meta.msg);
            role.children = res.data;
          })
        }).catch(() => {
          this.$message.error("取消删除");
        });
      },
      showRightsDialog(node){
        this.currentRoleId = node.id;
        this.addDefKeys(node, this.defKeys);
        getRightsList("tree").then(res => {
          console.log(res);
          if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
          this.rightsList = res.data;
          console.log(this.rightsList);
        });
        this.showRightsDialogVisible = true;
      },
      addDefKeys(node, arr){
        if(!node.children){
          return arr.push(node.id);
        }
        node.children.forEach((item) => {
          this.addDefKeys(item, arr);
        })
      },
      setRightDialogClose(){
        this.defKeys = [];
      },
      getCheckedKeys(keysArr){
        console.log(keysArr);
      },
      addRoleRight(){
        const keysArr = [
          ...this.$refs.treeRef.getCheckedKeys(),
          ...this.$refs.treeRef.getHalfCheckedKeys()
        ];
        const keysStr = keysArr.join(",");
        addRoleRight(this.currentRoleId, keysStr).then(res => {
          console.log(res);
          if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
          this.getRolesList();
          this.$message.success(res.meta.msg);
          this.showRightsDialogVisible = false;
        })
      },
      showEditRoleDialog(roleInfo){
        this.editRoleInfo = {
          id: roleInfo.id,
          roleName: roleInfo.roleName,
          roleDesc: roleInfo.roleDesc
        };
        console.log(this.editRoleInfo);
        this.editRoleDialogVisible = true;
      },
      editRole(){
        editRoleInfo(this.editRoleInfo).then(res => {
          console.log(res);
          if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
          this.getRolesList();
          this.$message.success(res.meta.msg);
          this.editRoleDialogVisible = false;
        })
      },
      showAddRoleDialog(){
        this.addRoleDialogVisible = true;
      },
      addRole(){
        addRole(this.addRoleData).then(res => {
          console.log(res);
          if(res.meta.status !== 201) return this.$message.error(res.meta.msg);
          this.getRolesList();
          this.$message.success(res.meta.msg);
          this.addRoleDialogVisible = false;
          this.addRoleData = {};
        })
      },
      showDeleteRoleConfirm(roleInfo){
        this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteRole(roleInfo.id).then(res => {
            console.log(res);
            if(res.meta.status !== 200) return this.$message.error("删除失败");
            this.getRolesList();
            this.$message.success("删除成功");
          })
        }).catch(() => {
          this.$message.error("取消删除");
        });
      }
    },
    created(){
      this.getRolesList();
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .el-table
    margin-top 20px
  .el-tag
    margin 10px
  .vcenter
    display flex
    align-items center
</style>