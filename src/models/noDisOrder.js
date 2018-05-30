/*
*  未分配的订单
* */
import { getNoDisOrder, getNoDisOrderCount } from '../services/api'

export default {
  namespace: 'noDisOrder',
  state: {
    loading: false,
    data: [],
    count: 0
  },
  effects: {
    // 进入页面获取data
    *getData( {payload}, {call, put} ){
      yield put({
        type: 'changeLoading',
        payload: true
      })
      const res = yield call(getNoDisOrder, payload)
      yield put({
        type: 'saveData',
        payload: res.data
      })
      yield put({
        type: 'changeLoading',
        payload: false
      })
    },
    // 轮询获取未分配订单的个数
    *backGetCount({payload}, {call, put}){
      const res = yield call(getNoDisOrderCount, payload)
      yield put({
        type: 'saveCount',
        payload: res.count
      })
    }
  },
  reducers: {
    saveCount( state, {payload} ){
      return {
        ...state,
        count: payload
      }
    },
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
