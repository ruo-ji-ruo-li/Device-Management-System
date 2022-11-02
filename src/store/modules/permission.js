import { asyncRoutes, constantRoutes } from '@/router'

/**
 * Use meta.right to determine if the current user has permission
 * @param rights
 * @param route
 */
//匹配权限
function hasPermission(rights, route) {   //rights为用户的rights，不是路由需要的rights
  if (route.meta && route.meta.rights) {
    // console.log(rights.some(right => route.meta.rights.includes(right)))
    return rights.some(right => route.meta.rights.includes(right))  //依次检测，如果 传来的是1和2，那么检查route里面有没有1或者2，只要有一项则通过
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param rights
 */
export function filterAsyncRoutes(routes, rights) {
  const res = []

  routes.forEach(route => {

    const tmp = { ...route }
    if (hasPermission(rights, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, rights)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes) // 将过滤后的路由和constantRoutes存起来
    // console.log('53456546',state)
  }
}

//筛选
const actions = {
  generateRoutes({ commit }, rights) {

    return new Promise(resolve => {
      let accessedRoutes


      //路由是否有admin,有直接全部显示
      if (rights.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      } else {
        //过滤路由
        accessedRoutes = filterAsyncRoutes(asyncRoutes, rights)
        // console.log(accessedRoutes)
        //accessedRoutes这个就是当前角色可见的动态路由
      }
      commit('SET_ROUTES', accessedRoutes)
      // console.log('513531231',accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

