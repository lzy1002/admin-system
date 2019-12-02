import {request} from "./request.js";

export function getCategoriesList(queryInfo) {
  return request({
    url: "/categories",
    params: queryInfo
  })
}

export function addCategories(categoriesData) {
  return request({
    url: "/categories",
    method: "post",
    data: categoriesData
  })
}

export function editCategories(editCategoriesData) {
  return request({
    url: `categories/${editCategoriesData.cat_id}`,
    method: "put",
    data: {
      cat_name: editCategoriesData.cat_name
    }
  })
}

export function deleteCategories(categoriesId) {
  return request({
    url: `/categories/${categoriesId}`,
    method: "delete"
  })
}
