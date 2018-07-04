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
      console.log('sadsad')
      yield put({
        type: 'changeLoading',
        payload: true
      })
      const res = yield call( dealerCancelOrder, payload )
      // console.log(res.data)
      // return
      if (res.data) {
        const listData = []
        res.data.forEach( item=>{
          listData.push({
            ...item[0],
            cusUsername: item[1].username,
            cusTel: item[1].tel,
            couUsername: item[2]?item[2].username:'没有快递员',
            couTel: item[2]?item[2].tel:'没有快递员'
          })
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
