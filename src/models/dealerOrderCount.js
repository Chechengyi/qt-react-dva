/*
* 经销商派单总计
* [ 订单数量，类型，月份，订单实际价格，快递员支付钱，实际价格+快递员支出， 时间 ]
* */
import { getDealerOrderCount, driverGetMoneyCash } from '../services/api'

export default {
  namespace: 'dealerOrderCount',
  state: {
    loading: false,
    data: [],
    dealerId: null,
    dealerName: null,
    isModal: false
  },
  effects: {
    *getData({payload}, {call, put}){
      yield put({
        type: 'changeLoading',
        payload: true
      })
      const res = yield call( driverGetMoneyCash, payload)
      console.log(res)
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
    },
    // 控制modal显隐
    *setModal({payload}, {call, put}){
      yield put({
        type: 'saveModal',
        payload
      })
    },
    // 设置经销商信息
    *setDealerInfo({payload}, {call, put}){
      yield put({
        type: 'saveDealerInfo',
        payload
      })
    }
  },
  reducers: {
    saveModal(state, {payload}){
      return {
        ...state,
        isModal: payload
      }
    },
    saveDealerInfo(state, {payload}){
      return {
        ...state,
        dealerId: payload.dealerId,
        dealerName: payload.dealerName
      }
    },
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
