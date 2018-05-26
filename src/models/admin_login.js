import { adminLogin, dealerLogin } from '../services/api'
import {routerRedux} from "dva/router";


export default {
  namespace: 'admin_login',
  state: {
    // 管理员的角色id
    roleId: window.sessionStorage.getItem('roleId')||null,
    admin_id: window.sessionStorage.getItem('admin_id')||null,
    admin_name: window.sessionStorage.getItem('admin_name')||null,
    admin_status: window.sessionStorage.getItem('admin_status')||null,
    loading: false
  },
  effects: {
    *login({payload}, {call,put}){
      yield put({
        type: 'changeLogin',
        payload: true
      })
      let res
      // 1是超级管理员登录操作 2是经销尚登录操作
      if ( payload.type===1 ) {
        res = yield call(adminLogin, payload)
      } else {
        res = yield call(dealerLogin, payload)
      }
      if ( res.status==='OK' ) {
        window.sessionStorage.setItem('admin_id',res.data.id)
        window.sessionStorage.setItem('admin_name',res.data.username)
        window.sessionStorage.setItem('roleId', res.data.roleId)
        window.sessionStorage.setItem('admin_status', res.status)
        yield put({
          type: 'saveLogin',
          payload: {
            admin_id: res.data.id,
            admin_name: res.data.username,
            admin_status: res.status,
            roleId: res.data.roleId
          }
        })
        yield put(routerRedux.push('/admin/cont/home/frontdesk'))
      } else {
        yield put({
          admin_status: 'ERROR'
        })
      }
      yield put({
        type: 'changeLogin',
        payload: false
      })
    }
  },
  reducers: {
    saveLogin(state, {payload}){
      return {
        ...state,
        ...payload
      }
    },
    changeLogin(state, {payload}){
      return {
        ...state,
        loading: payload
      }
    }
  }
}
