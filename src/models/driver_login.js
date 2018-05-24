import { routerRedux } from 'dva/router'
import { driverLogin, getDriverMoneyAccount } from '../services/api'
import store from 'store'

export default {
  namespace: 'driver_login',
  state: {
    driver_id: store.get('driverData')?store.get('driverData').driver_id:null,
    isWork: false,   //是否上班,
    // workLoading: false
    driver_status: store.get('driverData')?store.get('driverData').driver_status:null,
    driver_name: store.get('driverData')?store.get('driverData').driver_name:null,
    loading: false,
    moneyAccount: []
  },
  effects: {
    // 获取快递员已有的提现账户
    *getMoneyAccount( {payload}, {call,put} ){
      yield put({
        type: 'changeLoading',
        payload: true
      })
      const res = yield call(getDriverMoneyAccount, payload)
      yield put({
        type: 'saveMoneyAccount',
        payload: res
      })
      yield put({
        type: 'changeLoading',
        payload: false
      })
    },
    // 退出登录
    *logout ( {payload}, {call,put} ) {
      yield put({
        type: 'changeLoading',
        payload: true
      })
      store.remove('driverData')
      // 退出登录异步请求
      // 将redux状态重置为未登录
      yield put({
        type: 'saveLogin',
        payload: {
          driver_status: null,
          driver_id: null,
          driver_name: null
        }
      })
      yield put({
        type: 'changeLoading',
        payload: false
      })
      yield put(routerRedux.push('/driverLogin'))
    },
    *login ( {payload}, {call, put} ) {
      yield put({
        type: 'changeLoading',
        payload: true
      })
      const res = yield call(driverLogin, payload)
      if ( res.status === "OK" ) {
        store.set('driverData', {
          driver_id: res.data.id,
          driver_status: res.status,
          driver_name: res.data.User_name // 接口文档待验证
        })
        yield put({
          type: 'saveLogin',
          payload: {
            driver_status: 'OK',
            driver_id: res.data.id,
            driver_name: res.data.User_name
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
    },
    *noWork ( {payload}, {call, put} ) {
      yield put({
        type: 'saveWork',
        payload: false
      })
    }
  },
  reducers: {
    //  保存快递员的提现的账户
    saveMoneyAccount( state, {payload} ){
      return {
        ...state,
        moneyAccount: payload
      }
    },
    saveLogin ( state, {payload} ) {
      return {
        ...state,
        dirver_id: payload.driver_id,
        driver_name: payload.driver_name,
        driver_status: payload.driver_status
      }
    },
    saveWork ( state, {payload} ) {
      return {
        ...state,
        isWork: payload
      }
    },
    changeLoading ( state, {payload} ) {
      return {
        ...state,
        loading: payload
      }
    }
  }
}
