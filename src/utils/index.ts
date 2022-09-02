
/**
 * 过滤对象中falsey 然后剔除 主要用于列表页的条件搜索
 * @param form 
 * @returns {object}
 * eg:
 * form  {
  CategoryUuid: "123",
  ShowState: 0,
  SkuKind: 0,
  IsHot: 0,
  SkuName:"",
  PointsRealBeginString: "",
  PointsRealEndString: "",
  H: ""
}
 */
export function toSearch(form: object = {}): object {
  let formTrans = JSON.parse(JSON.stringify(form));

  for (let key in formTrans) {
    if (!formTrans[key]) {
      delete formTrans[key];
    } else if (formTrans[key] && formTrans[key].length == 0) {
      delete formTrans[key];
    } else if (JSON.stringify(formTrans[key]) === "{}") {
      delete formTrans[key];
    }
  }

  return formTrans;
}

/**
 * 清空筛选
 * @param obj 查询对象
 * @param pageReset 刷新列表
 * @returns {object}
 */
export function empty(obj: object, pageReset: Function): void {
  // // 清空搜索对象
  for (let key in obj) {
    if (typeof obj[key] === "number") {
      obj[key] = 0;
    } else {
      obj[key] = "";
    }
  }
  pageReset();
}
