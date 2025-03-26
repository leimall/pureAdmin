export type productType = {
  id: number;
  type: string;
  productId: string;
};

export type Result = {
  code: number;
  msg: string;
  data: Array<productType>;
};
