/*
*  快递员配送中的订单
* */

import { courierDistribution } from '../services/api'

export default {
  namespace: 'courierDistribution',
  state: {
    loading: false,
    data: []
  },
  effects: {
    *refresh( {payload}, {call, put} ){
      const res = yield call( courierDistribution, payload )
      yield put({
        type: 'saveData',
        payload: res.data
      })
    },
    *getData( {payload}, {call, put} ){
      yield put({
        type: 'changeLoading',
        payload: true
      })
      const res = yield call( courierDistribution, payload )
      yield put({
        type: 'saveData',
        payload: res.data
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
