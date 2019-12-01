import {request} from "./request.js";

export function getRolesList() {
  return request({
    url: "/roles"
  })
}

export function deleteRoleRight(roleId, rightId) {
  return request({
    url: `roles/${roleId}/rights/${rightId}`,
    method: "delete"
  })
}

export function getRightsList(type) {
  return request({
    url: `/rights/${type}`
  })
}

export function addRoleRight(roleId, rids) {
  return request({
    url: `roles/${roleId}/rights`,
    method: "post",
    data: {
      rids: rids
    }
  })
}

export function editRoleInfo(roleInfo) {
  return request({
    url: `roles/${roleInfo.id}`,
    method: "put",
    data: {
      roleName: roleInfo.roleName,
      roleDesc: roleInfo.roleDesc
    }
  })
}

export function addRole(roleInfo) {
  return request({
    url: "/roles",
    method: "post",
    data: roleInfo
  })
}

export function deleteRole(roleId) {
  return request({
    url: `roles/${roleId}`,
    method: "delete"
  })
}
