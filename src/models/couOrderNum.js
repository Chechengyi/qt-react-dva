 /*
 * 快递员送单数量总计
 * 返回res类型
 * [ 订单数量，类型，月份，订单实际价格，快递员支付钱，实际价格+快递员支出， 时间 ]
 * */

 import { driverGetMoneyCash } from '../services/api'

 export default {
   namespace: 'couOrderNum',
   state: {
     loading: false,
     data: [],
     couId: null,   // 当前查看快递员couId， 管理员查看快递员时需要
     couUsername: null,  //当前查看的快递员的username
     isModal: false,  // 管理员端状态， 控制modal显隐
   },
   effects: {
      // 改变modal的显隐
      *changeModal({payload}, {_, put}){
        yield put({
          type: 'saveModal',
          payload
        })
      },
      // 改变当前modal展示的快递员
      *changeCouId({payload}, {_, put}){
        yield put({
          type: 'saveCouId',
          payload
        })
      },
      *getData({payload}, {call, put}){
        yield put({
          type: 'changeLoading',
          payload: true
        })
        const res = yield call(driverGetMoneyCash, payload)
        console.log(res.data)
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
     saveCouId(state, {payload}){
       return {
         ...state,
         couId: payload.id,
         couUsername: payload.username
       }
     },
     saveModal(state, {payload}){
       return {
         ...state,
         isModal: payload
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
