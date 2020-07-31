import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import store from '@/store'

Vue.use(VueRouter)

const requireAuth = () => (to, from, next) => {
  try {
    if (store.getters.isLogged) {
      next()
    } else {
      next({
        path: '/auth',
        query: { redirect: to.fullPath },
      })
    }
  } finally {
  }
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/About.vue'),
    beforeEnter: requireAuth(),
  },
  {
    path: '/warehouse',
    name: 'warehouse',
    // route level code-splitting
    // this generates a separate chunk (warehouse.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "warehouse" */ '../views/warehouse/'),
  },
  {
    path: '/board',
    name: 'board',
    // route level code-splitting
    // this generates a separate chunk (board.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "board" */ '../views/board/'),
  },
  {
    path: '/board/:info',
    name: 'board-info',
    // route level code-splitting
    // this generates a separate chunk (board-info.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "board-info" */ '../views/board/info'),
  },
  {
    path: '/board/:info/:article',
    name: 'board-info-article',
    // route level code-splitting
    // this generates a separate chunk (board-info-article.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(
        /* webpackChunkName: "board-info-article" */ '../views/board/article'
      ),
  },
  {
    path: '/rack',
    name: 'rack',
    // route level code-splitting
    // this generates a separate chunk (rack.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "rack" */ '../views/rack/'),
  },
  {
    path: '/rack/:info',
    name: 'rack-info',
    // route level code-splitting
    // this generates a separate chunk (rack-info.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "rack-info" */ '../views/rack/info'),
  },
  {
    path: '/rack/:info/:box',
    name: 'rack-info-box',
    // route level code-splitting
    // this generates a separate chunk (rack-info-box.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "rack-info-box" */ '../views/rack/box'),
  },
  {
    path: '/box',
    name: 'box',
    // route level code-splitting
    // this generates a separate chunk (box.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "box" */ '../views/box/'),
  },
  {
    path: '/box/:info',
    name: 'box-info',
    // route level code-splitting
    // this generates a separate chunk (box-info.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "box-info" */ '../views/box/info'),
  },
  {
    path: '/box/:info/:sample',
    name: 'box-info-sample',
    // route level code-splitting
    // this generates a separate chunk (box-info-sample.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "box-info-sample" */ '../views/box/sample'),
  },
  {
    path: '/sample',
    name: 'sample',
    // route level code-splitting
    // this generates a separate chunk (sample.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "sample" */ '../views/sample/'),
  },
  {
    path: '/sample/:info',
    name: 'sample-info',
    // route level code-splitting
    // this generates a separate chunk (sample-info.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "sample-info" */ '../views/sample/info'),
  },
  {
    path: '/confirm',
    name: 'Confirm',
    // route level code-splitting
    // this generates a separate chunk (confirm.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "confirm" */ '../views/confirm'),
  },
  {
    path: '/auth',
    name: 'auth',
    // route level code-splitting
    // this generates a separate chunk (auth.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "auth" */ '../views/auth/'),
  },
  {
    path: '*',
    name: '404',
    // route level code-splitting
    // this generates a separate chunk (404.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "404" */ '../views/404'),
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
