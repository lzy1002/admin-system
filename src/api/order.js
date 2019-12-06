import {request} from "./request.js";

export function getOrderList(queryInfo) {
  return request({
    url: "/orders",
    params: queryInfo
  })
}

export function getLogisticsInfo(logisticsId) {
  return request({
    url: `/kuaidi/${logisticsId}`
  })
}
