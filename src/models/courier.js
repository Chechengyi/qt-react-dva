import { getCourier } from '../services/api'

export default {
  namespace: 'courier',
  state: {
    loading: false,
    data: []
  },
  effects: {
    *getData( {payload}, {call,put} ){
      yield put({
        type: 'changeLoading',
        payload: true
      })
      const res = yield call(getCourier, payload)
      yield put({
        type: 'saveData',
        payload: res.data.content
      })
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
