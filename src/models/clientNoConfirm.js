
import { cusGetNoConfime } from "../services/api";

export default {
  namespace: 'clientNoConfirm',
  state: {
    data: [],
    loading: false
  },
  effects: {
    *refresh( {payload}, {call, put} ){
      const res = yield call( cusGetNoConfime, payload )
      if (res.data) {
        let listData = []
        res.data.forEach( item=>{
          listData.push({
            ...item[0],
            cusUsername: item[1].username,
            cusTel: item[1].tel,
            couUsername: item[2]?item[2].username:undefined,
            couTel: item[2]?item[2].tel:undefined,
            isRate: item[4]?true:false,
            adminUsername: item[3].username
          })
        })
        yield put({
          type: 'saveData',
          payload: listData
        })
      }
    },
    *getData( {payload}, {call, put} ){
      yield put({
        type: 'changeLoading',
        payload: true
      })
      const res = yield call( cusGetNoConfime, payload )
      console.log(res.data)
      if (res.data) {
        let listData = []
        res.data.forEach( item=>{
          listData.push({
            ...item[0],
            cusUsername: item[1].username,
            cusTel: item[1].tel,
            couUsername: item[2]?item[2].username:undefined,
            couTel: item[2]?item[2].tel:undefined,
            isRate: item[4]?true:false,
            adminUsername: item[3].username
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
