/*
* 以取消的订单
* */

import { dealerCancelOrder } from '../services/api'

export default {
  namespace: 'cancelOrder',
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
      const res = yield call( dealerCancelOrder, payload )
      if (res.data) {
        yield put({
          type: 'saveData',
          payload: res.data
        })
      } else {
        yield put({
          type: 'saveData',
          payload: []
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
