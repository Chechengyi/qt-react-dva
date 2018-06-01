import { getCourierPos } from '../services/api'

export default {
  namespace: 'courierPos',
  state: {
    data: [],
    loading: false
  },
  effects: {
    *getData( {payload}, {call, put} ){
      yield put({
        type: 'changeLoading',
        payload: true
      })
      const res= yield call( getCourierPos )
      console.log(res)
      if (res.data){
        yield put({
          type: 'saveData',
          payload: res.data
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
