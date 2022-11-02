import { userLogin, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import {ElMessage} from "element-plus";
import store from "@/store";
import request from "@/utils/request";
import permission from "@/store/modules/permission";
// import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    rights: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_RIGHTS: (state, rights) => {
    state.rights = rights
  }
}

const actions = {
  // user login
  login ({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      userLogin({ username: username.trim(), password: password }).then(response => {

        const { data } = response //data=response.data.data
        // console.log(data)
        commit('SET_TOKEN',data.username) //把token=response.data.data.username保存到vuex里面
        setToken(data.username)           //把token=response.data.data.username保存到浏览器里面

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo ({ commit, state }) {
    return new Promise((resolve, reject) => {
      // console.log(state.token)
      getInfo(state.token).then(response => {

        const { data } = response  //data=response.data.data
        // console.log(response)
        // console.log(data)


        if (!data) {
          return reject(new Error('验证失败，请重新登陆'))
        }

        const { username, avatar,roles } = data  //username=response.data.data.username
        console.log(roles)


        let rights=[]
        //获取权限数组
        roles.forEach(role=>{
          role.permissions.forEach(permission=>{
            rights.push(permission.remark)
          })
        })
        rights=Array.from(new Set(rights))//权限去重
        console.log(rights)


        if (!rights || rights.length <= 0) {
          reject('权限必须为非空!')
        }
        // console.log(userInfo.username)
        commit('SET_NAME', username)
        // commit('SET_AVATAR', avatar)
        commit('SET_RIGHTS',rights)

        //将用户信息存入session
        // sessionStorage.setItem("username",username);
        // sessionStorage.setItem("rights",rights);
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout ({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(response => {
        // console.log(response)
        removeToken() // must remove  token  first

        // resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken ({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
