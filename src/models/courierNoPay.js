/*
*  快递员获取用户未付款的订单
*  isShip为1， isPay为0的订单
* */

import {courierGetCusNoPay} from '../services/api'

export default {
  namespace: 'courierNoPay',
  state: {
    loading: false,
    data: []
  },
  effects: {
    *refresh( {payload}, {call, put} ){
      const res = yield call( courierGetCusNoPay, payload )
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
      const res = yield call( courierGetCusNoPay, payload )
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
