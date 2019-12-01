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
