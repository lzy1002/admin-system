import {request} from "./request.js";

export function getGoodsList(queryInfo) {
  return request({
    url: "/goods",
    params: queryInfo
  })
}

export function deleteGoods(goodsId) {
  return request({
    url: `/goods/${goodsId}`,
    method: "delete"
  })
}
