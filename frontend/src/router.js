import { createWebHistory, createRouter } from "vue-router";
import guard from './guard.js';

//Define all routes for the web application
const routes =  [
  {
    path: "/exercises",
    name: "exercises",
    component: () => import("./views/Exercises.vue"),
    beforeEnter: guard
  },
  {
    path: "/routines",
    name: "routines",
    component: () => import("./views/Routines.vue"),
    beforeEnter: guard
  },
  {
    path: "/login",
    name: "login",
    component: () => import("./views/Login.vue")
  },
  {
    path: "/register",
    name: "register",
    component: () => import("./views/Register.vue")
  },
  {
    path: "/",
    name: "home",
    component: () => import("./views/Home.vue")
  },
  {
    path: "/help",
    name: "help",
    component: () => import("./views/Help.vue")
  }

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;