import { routerRedux } from 'dva/router'
import { driverLogin, getDriverMoneyAccount, logout } from '../services/api'
import store from 'store'

export default {
  namespace: 'driver_login',
  state: {
    driver_id: store.get('driverData')?store.get('driverData').driver_id:null,
    // isWork: window.sessionStorage.getItem('driverWork')=='work'?true:false,
    isWork: store.get('driverWork'),
    // workLoading: false
    driver_status: store.get('driverData')?store.get('driverData').driver_status:null,
    driver_name: store.get('driverData')?store.get('driverData').driver_name:null,
    loading: false,
    moneyAccount: {},
    cash: null
  },
  effects: {
    // 获取快递员已有的提现账户
    *getMoneyAccount( {payload}, {call,put} ){
      yield put({
        type: 'changeLoading',
        payload: true
      })
      const res = yield call(getDriverMoneyAccount, payload)
      console.log(res)
      if (res.data) {
        yield put({
          type: 'saveMoneyAccount',
          payload: res.data
        })
        yield put({
          type: 'saveCash',
          payload: res.data.cash
        })
      } else {
        yield put({
          type: 'saveMoneyAccount',
          payload: {}
        })
        yield put({
          type: 'saveCash',
          payload: 0
        })
      }
      yield put({
        type: 'changeLoading',
        payload: false
      })
    },
    // 退出登录
    *logout ( {payload}, {call,put} ) {
      console.log('退出登录执行了')
      yield put({
        type: 'changeLoading',
        payload: true
      })
      // 退出登录异步请求
      const res = yield call( logout, payload )
      if (res.status=='OK') {
        // 清除状态缓存
        store.remove('driverData')
        store.remove('driverWork')
        // 将redux状态重置为未登录
        yield put({
          type: 'saveLogin',
          payload: {
            driver_status: null,
            driver_id: null,
            driver_name: null
          }
        })
        yield put(routerRedux.push('/driverLogin'))
      }
      yield put({
        type: 'changeLoading',
        payload: false
      })
    },
    *login ( {payload}, {call, put} ) {
      yield put({
        type: 'changeLoading',
        payload: true
      })
      const res = yield call(driverLogin, payload)
      console.log(res)
      if ( res.status === "OK" ) {
        yield store.set('driverData', {
          driver_id: res.data.id,
          driver_status: res.status,
          driver_name: res.data.username // 接口文档待验证
        })
        yield put({
          type: 'saveLogin',
          payload: {
            driver_status: 'OK',
            driver_id: res.data.id,
            driver_name: res.data.username
          }
        })
        yield put(routerRedux.push('/driverCont'))
      } else {
        yield put({
          type: 'saveLogin',
          payload: {
            driver_status: 'ERROR'
          }
        })
      }
      yield put({
        type: 'changeLoading',
        payload: false
      })
    },
    *goWork ( {payload}, {call, put} ) {
      yield put({
        type: 'saveWork',
        payload: true
      })
      // window.sessionStorage.setItem('driverWork', 'work')
      store.set('driverWork', 'work')
    },
    *noWork ( {payload}, {call, put} ) {
      yield put({
        type: 'saveWork',
        payload: false
      })
      // window.sessionStorage.setItem('driverWork', 'noWork')
      store.remove('driverWork')
    }
  },
  reducers: {
    // 保存快递员的余额
    saveCash(state, {payload}){
      return {
        ...state,
        cash: payload
      }
    },
    //  保存快递员的提现的账户
    saveMoneyAccount( state, {payload} ){
      return {
        ...state,
        moneyAccount: payload
      }
    },
    saveLogin ( state, {payload} ) {
      console.log('执行了')
      console.log(payload.driver_id)
      return {
        ...state,
        driver_id: payload.driver_id,
        driver_name: payload.driver_name,
        driver_status: payload.driver_status
      }
    },
    saveWork ( state, {payload} ) {
      return {
        ...state,
        isWork: payload
      }
      store.set('driverWork', payload)
    },
    changeLoading ( state, {payload} ) {
      return {
        ...state,
        loading: payload
      }
    }
  }
}
