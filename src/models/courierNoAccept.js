import { courierNoAccpetCount, getCourierNoAccpet } from '../services/api'

export default {
  namespace: 'courierNoAccept',
  state: {
    loading: false,
    data: [],
    count: 0
  },
  effects: {
    *getCount( {payload}, {call, put} ){
      const res = yield call( courierNoAccpetCount, payload )
      yield put({
        type: 'saveCount',
        payload: res.data
      })
    },
    *getData( {payload}, {call, put} ){
      yield put({
        type: 'changeLoading',
        payload: true
      })
      const res = yield call( getCourierNoAccpet, payload )
      yield put({
        type: 'saveData',
        payload: res.data
      })
      yield put({
        type: 'changeLoading',
        payload: false
      })
    }
  },
  reducers: {
    saveCount( state, {payload} ){
      return {
        ...state,
        count: payload
      }
    },
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
