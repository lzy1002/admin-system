import {request} from "./request.js";

export function getCategoriesList(queryInfo) {
  return request({
    url: "/categories",
    params: queryInfo
  })
}

export function getAttributes(id, selectName) {
  return request({
    url: `/categories/${id}/attributes`,
    params: {
      sel: selectName
    }
  })
}

export function addAttributes(id, attrName, selectName) {
  return request({
    url: `/categories/${id}/attributes`,
    method: "post",
    data: {
      attr_name: attrName,
      attr_sel: selectName
    }
  })
}

export function editAttributes(cateId, attrId, attrName, selectName, attrVals) {
  return request({
    url: `/categories/${cateId}/attributes/${attrId}`,
    method: "put",
    data: {
      attr_name: attrName,
      attr_sel: selectName,
      attr_vals: attrVals
    }
  })
}

export function getAttributesById(cateId, attrId, selectName) {
  return request({
    url: `/categories/${cateId}/attributes/${attrId}`,
    params: {
      attr_sel: selectName
    }
  })
}

export function deleteAttributes(cateId, attrId) {
  return request({
    url: `/categories/${cateId}/attributes/${attrId}`,
    method: "delete"
  })
}
