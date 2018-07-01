import { adminGetOrderRate } from '../services/api'

export default {
  namespace: 'adminArbitration',
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
      const res = yield call( adminGetOrderRate, payload )
      if (res.data) {
        const listData = []
        res.data.forEach( item=>{
          listData.push({
            ...item[0],
            ono: item[1].ono,
            adminId: item[1].adminId,
            orderId: item[1].id,
            actualFee: item[1].actualFee,
            typeId: item[1].typeId,
            cusUsername: item[2].username,
            cusTel: item[2].tel,
            couUsername: item[3].username,
            couTel: item[3].tel
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
