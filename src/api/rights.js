import {request} from "./request.js";

export function getRightsList(type) {
  return request({
    url: `/rights/${type}`
  })
}
