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
      let arr = []
      for ( var i=0; i<res.data.length; i++ ) {
        arr.push(res.data[i][0])
      }
      yield put({
        type: 'saveData',
        // payload: res.data[0]
        payload: arr
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
        payload: res.data
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
      // let count = payload.length
      return {
        ...state,
        data: payload,
        // count
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
