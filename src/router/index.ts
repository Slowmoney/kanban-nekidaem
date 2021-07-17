import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import KanBan from "../views/KanBan.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "KanBan",
    component: KanBan,
  },
  {
    path: "/auth",
    name: "Auth",
    component: () => import(/* webpackChunkName: "Auth" */ "../views/Auth.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
