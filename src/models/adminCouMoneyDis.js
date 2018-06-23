/*
*  管理员已经转账了的快递员请求记录
* */

import { adminGetCouMoneyDis, adminGetCouMoneyDisCount } from '../services/api'

export default {
  namespace: 'adminCouMoneyDis',
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
      const res = yield call( adminGetCouMoneyDis, payload )
      const total = res.data[res.data.length-1]
      //  获取到总到个数诸侯发起改变total到action
      yield put({
        type: 'saveCount',
        payload: total
      })
      //  将服务端返回到res.data转换为需要到数据结构
      if (res.data) {
        let listData = []
        res.data.forEach( item=>{
          if (typeof item === 'number') return
          listData.push({
            username: item[0],
            tel: item[1],
            ...item[2]
          })
        })
        console.log(listData)
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
    saveCount(state, {payload}){
      return {
        ...state,
        total: payload
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
