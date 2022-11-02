import router from './index'
import store from '../store'
import { ElMessage } from 'element-plus'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()   //显示进度条

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()


  if (hasToken) {

    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()   //显示完成进度条
    } else {
      const hasGetUserInfo = store.getters.name
      // const hasRights = store.getters.rights && store.getters.rights.length > 0//这里指的是src/store/getters.js的rights
      // console.log(hasrights)
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          // get user info
          // await store.dispatch('user/getInfo')// 拉取info

          // 获取rights
          await store.dispatch('user/getInfo')//第一步
          const rights=store.getters.rights
          console.log("rights:",rights)



          // generate accessible routes map based on rights
          //获取通过权限验证的路由
          const accessRoutes = await store.dispatch('permission/generateRoutes', rights)//第二步
          console.log(store.getters.permission_routes)


          //更新加载路由
          router.options.routes = store.getters.permission_routes//第三步
          // dynamically add accessible routes
          accessRoutes.forEach(v => {
            router.addRoute(v)
          })
          // router.addRoute(accessRoutes)
          // console.log(router)
          // console.log(store)
          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })

          // next()
        } catch (error) {
          // remove token and go to login page to re-login

          await store.dispatch('user/resetToken')
          ElMessage.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {



    /* has no token */

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
