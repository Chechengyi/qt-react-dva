import { getAdressList } from '../services/api'

export default {
  namespace: 'client_address',
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
      const res = yield call(getAdressList, payload)
      yield put({
        type: 'saveData',
        payload: res
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
