import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

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
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
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
    path: '/rack/:rackId',
    name: 'rack-rackId',
    // route level code-splitting
    // this generates a separate chunk (rack-rackId.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "rack-rackId" */ '../views/rack-renderer')
  },
  {
    path: '/rack/:rackId/:boxId',
    name: 'rack-rackId-boxId',
    // route level code-splitting
    // this generates a separate chunk (rack-rackId-boxId.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "rack-rackId-boxId" */ '../views/rack-renderer')
  },
  {
    path: '/rack/:rackId/:boxId/:sampleId',
    name: 'rack-rackId-boxId-sampleId',
    // route level code-splitting
    // this generates a separate chunk (rack-rackId-boxId-sampleId.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "rack-rackId-boxId-sampleId" */ '../views/rack-renderer')
  },
  {
    path: '/rack/:rackId/:boxId/:sampleId/:action',
    name: 'rack-rackId-boxId-sampleId-action',
    // route level code-splitting
    // this generates a separate chunk (rack-rackId-boxId-sampleId-action.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "rack-rackId-boxId-sampleId-action" */ '../views/rack-renderer')
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
