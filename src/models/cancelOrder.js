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
        const listData = []
        res.data.forEach( item=>{
          listData.push(item[0])
        })
        yield put({
          type: 'saveData',
          payload: listData
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
