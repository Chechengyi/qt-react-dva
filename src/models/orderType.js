import { getOrderType } from '../services/api'

export default {
  namespace: 'orderType',
  state: {
    data: [],
    loading: false
  },
  effects: {
    *getData({payload}, {call,put}){
      yield put({
        type: 'changeLoading',
        payload: true
      })
      const res = yield call(getOrderType, payload)
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
