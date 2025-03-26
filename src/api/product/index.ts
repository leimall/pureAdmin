import service from "@/utils/request";

export const createProduct = data => {
  return service({
    url: "/api/mall/product/create",
    method: "post",
    data: data
  });
};

export const listProduct = params => {
  return service({
    url: "/api/mall/product/list",
    method: "get",
    params
  });
};

export const updateProductStatus = data => {
  return service({
    url: "/api/mall/product/status",
    method: "post",
    data: data
  });
};

export const getProductById = id => {
  return service({
    url: "/api/mall/product/detail/" + id,
    method: "get"
  });
};

export const updateProduct = data => {
  return service({
    url: "/api/mall/product/update",
    method: "post",
    data: data
  });
};

export const deleteProduct = data => {
  return service({
    url: "/api/mall/product/delete",
    method: "post",
    data: data
  });
};

export const createCategory = data => {
  return service({
    url: "/api/mall/category/create",
    method: "post",
    data: data
  });
};

export const updateCategory = data => {
  return service({
    url: "/api/mall/category/update",
    method: "post",
    data: data
  });
};

export const getCategoryListApi = data => {
  return service({
    url: "/api/mall/category/list",
    method: "post",
    data: data
  });
};

export const saveMarkdwonforDetail = data => {
  return service({
    url: "/api/mall/product/savedetail",
    method: "post",
    data: data
  });
};

export const getSkuTitle = () => {
  return service({
    url: "/api/mall/tags/sku",
    method: "get"
  });
};

export const getBrandListDBApi = () => {
  return service({
    url: "/api/mall/tags/brandlists",
    method: "get"
  });
};

export const postProductSKUTitle = data => {
  return service({
    url: "/api/mall/product/skutitle",
    method: "post",
    data: data
  });
};
export const postProductSKUValue = data => {
  return service({
    url: "/api/mall/product/skuvalue",
    method: "post",
    data: data
  });
};

export const getProductCategory = () => {
  return service({
    url: "/api/mall/tags/category",
    method: "get"
  });
};
export const updateProductCategory = data => {
  return service({
    url: "/api/mall/tags/category",
    method: "post",
    data: data
  });
};
export const deleteProuductCategory = data => {
  return service({
    url: "/api/mall/tags/category",
    method: "delete",
    data: data
  });
};

export const getProductTags = () => {
  return service({
    url: "/api/mall/tags/tags",
    method: "get"
  });
};

export const updateProductTags = data => {
  return service({
    url: "/api/mall/tags/tags",
    method: "post",
    data: data
  });
};
export const deleteProuductTag = data => {
  return service({
    url: "/api/mall/tags/tags",
    method: "delete",
    data: data
  });
};

export const createProductDetail = data => {
  return service({
    url: "/api/mall/product/detail",
    method: "post",
    data: data
  });
};
