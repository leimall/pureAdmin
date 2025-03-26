export default {
  path: "/product",
  redirect: "/product/index",
  meta: {
    icon: "ri:information-line",
    // showLink: false,
    title: "商品管理",
    rank: 9
  },
  children: [
    {
      path: "/product/index",
      name: "Product",
      component: () => import("@/views/product/index.vue"),
      meta: {
        title: "商品页面",
        showParent: true
      }
    },
    {
      path: "/product/edit",
      name: "ProductEdit",
      component: () => import("@/views/product/edit.vue"),
      meta: {
        title: "商品编辑",
        showParent: true
      }
    }
    // {
    //   path: "/product/500",
    //   name: "500",
    //   component: () => import("@/views/product/index.vue"),
    //   meta: {
    //     title: "500"
    //   }
    // }
  ]
} satisfies RouteConfigsTable;
