/*
* 管理员端待确定订单
* */

import { adminGetOrderConfirm } from '../services/api'

export default {
  namespace: 'admin_confirm',
  state: {
    loading: false,
    data: []
  },
  effects: {
    *getData( {payload}, {call, put} ){
      yield put({
        type: 'changeLoading',
        payload: true
      })
      const res = yield call( adminGetOrderConfirm, payload )
      if(res.data){
        let listData = []
        res.data.forEach( (item, i)=>{
          listData.push(item[0])
        })
        yield put({
          type: 'saveData',
          payload: listData
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
