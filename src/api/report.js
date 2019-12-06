import {request} from "./request.js";

export function getReportData() {
  return request({
    url: "reports/type/1"
  })
}
