/*
*  省计价方式
* */

import { adminGetProvincePrice } from '../services/api'

export default {
  namespace: 'provincePriceList',
  state: {
    loading: false,
    data: [],
    total: 0,
  },
  effects: {
    *getData({payload}, {call, put}){
      yield put({
        type: 'changeLoading',
        payload: true
      })
      const res = yield call( adminGetProvincePrice, payload )
      //  将服务端返回到res.data转换为需要到数据结构
      if (res.data) {
        let listData = []
        res.data.forEach( item=>{
          listData.push({
            name: item[0],
            ...item[1]
          })
        })
        yield put({
          type: 'saveData',
          // payload: res.data
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
