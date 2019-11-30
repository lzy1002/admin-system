import {request} from "./request.js";

export function getUsersList(query, pageNum, pageSize) {
  return request({
    url: "/users",
    params: {
      query: query,
      pagenum: pageNum,
      pagesize: pageSize
    }
  })
}

export function changeUserState(userId, type) {  //type为修改为的状态 布尔值
  return request({
    url: `users/${userId}/state/${type}`,
    method: "put"
  })
}

export function addUser(userData) {
  return request({
    url: "/users",
    method: "post",
    data: userData
  })
}

export function getUserInfo(userId) {
  return request({
    url: `/users/${userId}`,
  })
}

export function editUser(userData) {
  return request({
    url: `/users/${userData.id}`,
    method: "put",
    data: userData
  })
}

export function deleteUser(userId) {
  return request({
    url: `/users/${userId}`,
    method: "delete"
  })
}
