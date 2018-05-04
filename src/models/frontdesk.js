import { get_customer_list } from '../services/api'

export default {
  namespace: 'frontdesk',
  state: {
    data: [],
    loading: false
  },
  effects: {
    *getData ( {payload}, {call, put} ) {
      yield put({
        type: 'changeLoading',
        payload: true
      })
      const res = yield call( get_customer_list, payload )
      if (res) {
        yield put({
          type: 'saveData',
          payload: res
        })
      }
      yield put({
        type: 'changeLoading',
        payload: false
      })
    }
  },
  reducers: {
    saveData ( state, {payload} ) {
      return {
        ...state,
        data: payload
      }
    },
    changeLoading ( state, {payload} ) {
      return {
        ...state,
        loading: payload
      }
    }
  }
}
