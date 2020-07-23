import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import store from '@/store'

Vue.use(VueRouter)

const requireAuth = async (to, from, next) => {
  try {
    if (store.state.token) {
      next()
    } else {
      next({
        path: '/auth',
        query: { redirect: to.fullPath }
      })
    }
  } finally {
  
  }
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    beforeEnter: requireAuth
  },
  {
    path: '/warehouse',
    name: 'Warehouse',
    // route level code-splitting
    // this generates a separate chunk (warehouse.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "warehouse" */ '../views/warehouse/')
  },
  {
    path: '/board',
    name: 'Board',
    // route level code-splitting
    // this generates a separate chunk (board.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "board" */ '../views/board/')
  },
  {
    path: '/storage',
    name: 'Storage',
    // route level code-splitting
    // this generates a separate chunk (storage.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "storage" */ '../views/storage/')
  },
  {
    path: '/editor',
    name: 'Editor',
    // route level code-splitting
    // this generates a separate chunk (editor.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "editor" */ '../views/editor/')
  },
  {
    path: '/qrcode',
    name: 'QrCode',
    // route level code-splitting
    // this generates a separate chunk (qrcode.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "qrcode" */ '../views/qrcode/')
  },
  {
    path: '/uploadtest',
    name: 'UploadTest',
    // route level code-splitting
    // this generates a separate chunk (uploadtest.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "uploadtest" */ '../views/uploadtest/')
  },
  {
    path: '/uploadtest2',
    name: 'UploadTest2',
    // route level code-splitting
    // this generates a separate chunk (uploadtest2.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "uploadtest2" */ '../views/uploadtest/test2')
  },
  {
    path: '/form-validation',
    name: 'FormValidationTest',
    // route level code-splitting
    // this generates a separate chunk (form-validation.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "form-validation" */ '../views/form-validation/')
  },
  {
    path: '/stockchange',
    name: 'StockChange',
    // route level code-splitting
    // this generates a separate chunk (stockchange.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "stockchange" */ '../views/stockchange/')
  },
  {
    path: '/confirm',
    name: 'Confirm',
    // route level code-splitting
    // this generates a separate chunk (confirm.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "confirm" */ '../views/confirm')
  },
  {
    path: '/:collection/:document',
    name: 'collection-document',
    // route level code-splitting
    // this generates a separate chunk (collection-document.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "collection-document" */ '../views/renderer')
  },
  {
    path: '/:collection/:document/:action',
    name: 'collection-document-action',
    // route level code-splitting
    // this generates a separate chunk (collection-document-action.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "collection-document-action" */ '../views/renderer')
  },
  {
    path: '/auth',
    name: 'auth',
    // route level code-splitting
    // this generates a separate chunk (auth.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "auth" */ '../views/auth/')
  },
  {
    path: '*',
    name: '404',
    // route level code-splitting
    // this generates a separate chunk (404.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "404" */ '../views/404')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
