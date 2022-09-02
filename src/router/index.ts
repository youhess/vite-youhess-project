import { RouteRecordRaw,createRouter, createWebHashHistory } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/Home"
  },
  {
    path: "/Home",
    //主页
    name: "首页",
    component: () =>
      import("@/views/Home/index.vue")
  },
  {
    path: "/Resume",
    //简历
    name: "简历",
    component: () =>
      import("@/views/Resume/index.vue")
  }
];

// ↓创建路由实例并传递routes
const router = createRouter({
    // ↓router内部提供了history模式的实现，使用hash模式
    history: createWebHashHistory(),
    routes,
  })

export default router;