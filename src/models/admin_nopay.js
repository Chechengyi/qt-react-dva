/*
*  管理员查看未付款订单数据
* */

import {adminGetOrderNopay} from "../services/api";

export default {
  namespace: 'admin_nopay',
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
      const res = yield call( adminGetOrderNopay, payload )
      if(res.data){
        let listData = []
        res.data.forEach( (item, i)=>{
          listData.push({
            ...item[0],
            cusUsername: item[1].username,
            cusTel: item[1].tel,
            couUsername: item[2].username,
            couTel: item[2].tel
          })
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
