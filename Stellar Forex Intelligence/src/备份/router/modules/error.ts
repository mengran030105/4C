export default {
  path: "/error",
  redirect: "/error/403",
  meta: {
    icon: "ri:information-line",
    // showLink: false,
    title: "货币对",
    rank: 9
  },
  children: [
    {
      path: "/error/403",
      name: "403",
      component: () => import("@/views/error/403.vue"),
      meta: {
        title: "多货币对"
      }
    },
    {
      path: "/error/404",
      name: "404",
      component: () => import("@/views/error/404.vue"),
      meta: {
        title: "单货币对"
      }
    }
  ]
} satisfies RouteConfigsTable;
