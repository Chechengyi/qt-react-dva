/*
*   快递员已经完成的订单
* */

import { courierGetDone } from '../services/api'

export default {
  namespace: 'courierDone',
  state: {
    loading: false,
    data: []
  },
  effects: {
    *refresh( {payload}, {call, put} ){
      const res = yield call( courierGetDone, payload )
      yield put({
        type: 'saveData',
        payload: res.data.content
      })
    },
    *getData( {payload}, {call, put} ){
      yield put({
        type: 'changeLoading',
        payload: true
      })
      const res = yield call( courierGetDone, payload )
      yield put({
        type: 'saveData',
        payload: res.data.content
      })
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
