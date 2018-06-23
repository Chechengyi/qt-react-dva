/*
*  管理员没有确认转账的快递员的体现请求
* */
import { adminGetCouMoneyNoDis } from '../services/api'


export default {
  namespace: 'adminCouMoneyNoDis',
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
      const res = yield call( adminGetCouMoneyNoDis, payload )
      if (res.data) {
        let listData = []
        res.data.forEach( item=>{
          listData.push({
            username: item[0],
            tel: item[1],
            ...item[2]
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
    },
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
