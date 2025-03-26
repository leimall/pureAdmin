import service from "@/utils/request";

export const createProductBrand = data => {
  return service({
    url: "/api/mall/brand/create",
    method: "post",
    data: data
  });
};
