/*
* 快递员提现记录
* */

import { driverGetMoneyRecord } from '../services/api'

export default {
  namespace: 'couMoneyRecord',
  state: {
    loading: false,
    data: []
  },
  effects: {
    *getData({payload}, {call, put}){
      yield put({
        type: 'changeLoading',
        payload: true
      })
      const res = yield call( driverGetMoneyRecord, payload )
      console.log(res.data)
      if (res.data) {
        yield put({
          type: 'saveData',
          payload: res.data
        })
      }
      yield put({
        type: 'changeLoading',
        payload: false
      })
    }
  },
  reducers: {
    saveData( state, {payload} ){
      return {
        ...state,
        data: payload
      }
    },
    changeLoading( state, {payload} ){
      return {
        ...state,
        loading: payload
      }
    }
  }
}
