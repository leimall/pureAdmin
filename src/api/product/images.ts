import service from "@/utils/request";
import type { Result } from "./types";

export const getProductImgList = data => {
  return service({
    url: "/api/mall/product/image",
    method: "post",
    data
  });
};

export const setMainImgApi = data => {
  return service({
    url: "/api/mall/product/image/setmain",
    method: "post",
    data
  });
};

export const setSortImgApi = data => {
  return service({
    url: "/api/mall/product/image/setsortid",
    method: "post",
    data
  });
};

export const deleteImage = data => {
  return service<Result>({
    url: "/api/mall/product/image",
    method: "delete",
    data
  });
};
