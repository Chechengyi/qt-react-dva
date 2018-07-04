/*
* 平台所有订单数据的报表
* */

import { getDealerOrderCount } from '../services/api'

export default {
  namespace: 'orderCount',
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
      const res = yield call( getDealerOrderCount, payload )
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
    saveData(state, {payload}){
      return {
        ...state,
        data: payload
      }
    },
    changeLoading(state, {payload}){
      return {
        ...state,
        loading: payload
      }
    }
  }
}
