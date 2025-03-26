import service from "@/utils/request";

export const listImages = params => {
  return service({
    url: "/api/mall/images/list",
    method: "get",
    params
  });
};

export const deleteImage = data => {
  return service({
    url: "/api/mall/images/list",
    method: "delete",
    data
  });
};

export const alllistImages = params => {
  return service({
    url: "/api/mall/images/alist",
    method: "get",
    params
  });
};
export const updateImage = data => {
  return service({
    url: "/api/mall/images/alist",
    method: "put",
    data
  });
};
