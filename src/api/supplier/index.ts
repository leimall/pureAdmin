import service from "@/utils/request";

export const createSupplier = data => {
  return service({
    url: "/api/mall/supplier/create",
    method: "post",
    data: data
  });
};

export const listSupplier = params => {
  return service({
    url: "/api/mall/supplier/list",
    method: "get",
    params
  });
};

export const updateSupplier = data => {
  return service({
    url: "/api/mall/supplier/update",
    method: "put",
    data: data
  });
};

export const createSupplierProduct = data => {
  return service({
    url: "/api/mall/supplier/product",
    method: "post",
    data: data
  });
};

export const listSupplierProduct = params => {
  return service({
    url: "/api/mall/supplier/product",
    method: "get",
    params
  });
};

export const updateSupplierProduct = data => {
  return service({
    url: "/api/mall/supplier/product",
    method: "put",
    data: data
  });
};

export const getSupplierProductID = id => {
  return service({
    url: "/api/mall/supplier/one/" + id,
    method: "get"
  });
};

export const getSupplierImages = params => {
  return service({
    url: "/api/mall/supplier/images",
    method: "get",
    params
  });
};
