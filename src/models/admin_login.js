import { adminLogin, dealerLogin, logout } from '../services/api'
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
        // res = yield call(adminLogin, payload)
        res = yield call(adminLogin, {
          account: payload.account,
          password: payload.password
        })
      } else {
        res = yield call(dealerLogin, {
          account: payload.account,
          password: payload.password
        })
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
        yield put(routerRedux.push('/admin/cont/order/noDisOrder'))
      } else {
        yield put({
          type: 'saveLogin',
          payload: {
            admin_status: 'ERROR'
          }
        })
      }
      yield put({
        type: 'changeLogin',
        payload: false
      })
    },
    *logout({payload}, {call, put}){
      const res = yield call( logout, payload )
      if (res.status==='OK') {
        window.sessionStorage.removeItem('admin_id')
        window.sessionStorage.removeItem('admin_name')
        window.sessionStorage.removeItem('roleId')
        window.sessionStorage.removeItem('admin_status')
        yield put({
          type: 'saveLogin',
          payload: {
            admin_id: null,
            admin_name: null,
            admin_status: null,
            roleId: null
          }
        })
        yield put(routerRedux.push('/admin/user/login'))
      }
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
