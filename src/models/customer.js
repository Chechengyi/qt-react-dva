import { adminGetCus } from '../services/api'

export default {
  namespace: 'customer',
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
      const res = yield call(adminGetCus, payload)
      if (res.status==='OK') {
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
    saveData(state, {payload}){
      return {
        ...state,
        data: payload
      }
    },
    changeLoading(state, {paylaod}){
      return {
        ...state,
        loading: paylaod
      }
    }
  }
}
