import {request} from "./request.js";

export function getCategoriesList() {
  return request({
    url: "/categories"
  })
}

export function getAttributes(cateId, sel) {
  return request({
    url: `categories/${cateId}/attributes`,
    params: {
      sel: sel
    }
  })
}

export function addGoods(goodsForm) {
  return request({
    url: "/goods",
    method: "post",
    data: goodsForm
  })
}
