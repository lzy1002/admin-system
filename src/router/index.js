import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

const Login = () => import(/* webpackChunkName: "Login_Home_Welcome" */ "../views/Login/Login.vue");
const Home = () => import(/* webpackChunkName: "Login_Home_Welcome" */ "../views/Home/Home.vue");
const Welcome = () => import(/* webpackChunkName: "Login_Home_Welcome" */ "../views/Home/childrenViews/Welcome/Welcome.vue");

const Users = () => import(/* webpackChunkName: "Users" */ "../views/Home/childrenViews/Users/Users.vue");

const Rights = () => import(/* webpackChunkName: "Right_Roles" */ "../views/Home/childrenViews/Rights/Rights.vue");
const Roles = () => import(/* webpackChunkName: "Right_Roles" */ "../views/Home/childrenViews/Roles/Roles.vue");

const Categories = () => import(/* webpackChunkName: "Categories_Params_List_AddGoods" */ "../views/Home/childrenViews/Categories/Categories.vue");
const Params = () => import(/* webpackChunkName: "Categories_Params_List_AddGoods" */ "../views/Home/childrenViews/Params/Params.vue");
const List = () => import(/* webpackChunkName: "Categories_Params_List_AddGoods" */ "../views/Home/childrenViews/List/List.vue");
const AddGoods = () => import(/* webpackChunkName: "Categories_Params_List_AddGoods" */ "../views/Home/childrenViews/AddGoods/AddGoods.vue");

const Order = () => import(/* webpackChunkName: "Order" */ "../views/Home/childrenViews/Order/Order.vue");

const Report = () => import(/* webpackChunkName: "Report" */ "../views/Home/childrenViews/Report/Report.vue");

const routes = [
  {path: "/", redirect: "/login"},
  {path: "/login", component: Login},
  {path: "/home", component: Home, redirect: "/welcome",
    children: [
      {path: "/welcome", component: Welcome},
      {path: "/users", component: Users},
      {path: "/rights", component: Rights},
      {path: "/roles", component: Roles},
      {path: "/categories", component: Categories},
      {path: "/params", component: Params},
      {path: "/goods", component: List},
      {path: "/add-goods", component: AddGoods},
      {path: "/orders", component: Order},
      {path: "/reports", component: Report}
    ]
  }
];

const router = new VueRouter({
  routes
});

router.beforeEach((to, from, next) => {  //路由守卫  在每次路由即将切换之前触发
  if(to.path === "/login") return next();  //判断要进入的路由是否是登录 如果是登陆则直接放行
  const tokenStr = window.sessionStorage.getItem("token");  //如果不是登录 那么就需要拿到token
  if(!tokenStr) return next("/login");  //判断token是否不存在 如果不存在则强制跳转到登录页
  next();  //如果token存在 则放行
});

export default router;
