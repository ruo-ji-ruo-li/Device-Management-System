import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '@/layout'
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },


  {
    path: '/',
    component: Layout,
    meta: { icon: 'dashboard', affix: true },
    redirect: '/dashboard',   //网站主页
    children: [{
      path: 'dashboard',
      name: 'dashboard',
      component: () => import(/* webpackChunkName: "dashboard" */ '../views/ContractList'),
      meta: { title: '合同列表', icon: 'open' }
    }]
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/example',
    name: 'example',
    redirect: '/example/test',
    component: Layout,
    meta: { title: 'Example', icon: 'example', affix: true },
    children: [
      {
        path: 'test',
        name: 'Test',
        component: () => import(/* webpackChunkName: "test" */ '../views/test'),
        meta: { title: 'test', affix: true }
      },
      {
        path: 'about',
        name: '',
        component: () => import(/* webpackChunkName: "about" */ '../views/About'),
        meta: { title: 'About', affix: true }
      }
    ]
  }
]

export const asyncRoutes = [

  {
    path: '/example1',
    component: Layout,
    name: 'Example1',
    meta: { title: 'Example1',rights: ['查看界面']},
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/table/index'),
        meta: { title: 'Table', rights: ['查看界面']}
      },
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('@/views/tree/index'),
        meta: { title: 'Tree',rights: ['用户管理']}
      },
      {
        path: 'tree1',
        name: 'Tree1',
        component: () => import('@/views/tree1/index'),
        meta: { title: 'Tree1',rights: ['哈哈']}
      }
    ]
  },
  { path: '/:catchAll(.*)', redirect: '/404', hidden: true }
];


const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes
})




export default router
