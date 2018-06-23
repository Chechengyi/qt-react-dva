/**
 *  客户未付款的订单
 *@autor: Chechengyi
 *@time: 2018/6/11  下午2:27
 *@params:
 *@return:
 */

import { cusGetNoPayCount, cusGetNoPayList} from '../services/api'

export default {
  namespace: 'CusNoPay',
  state: {
    data: [],
    loading: false,
    count: 0
  },
  effects:{
    *getCount( {payload}, {call, put} ){
      const res = yield call( cusGetNoPayCount, payload )
      yield put({
        type: 'saveCount',
        payload: res.data
      })
    },
    *refresh( {payload}, {call, put} ){
      const res = yield call( cusGetNoPayList, payload )
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
      const res = yield call( cusGetNoPayList, payload )
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
    },
    saveCount( state, {payload} ){
      return {
        ...state,
        count: payload
      }
    }
  }
}
