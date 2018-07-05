import { getDealers } from '../services/api'

export default {
  namespace: 'dealer',
  state: {
    loading: false,
    data: [],
    total: 0
  },
  effects: {
    *getData({payload}, {call, put}){
      yield put({
        type: 'changeLoading',
        payload: true
      })
      const res = yield call( getDealers, payload )
      if (res.status==='OK') {
        yield put({
          type: 'saveData',
          payload: res.data.content
        })
        yield put({
          type: 'saveTotal',
          payload: res.data.totalElements
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
    },
    saveTotal( state, {payload} ){
      return {
        ...state,
        total: payload
      }
    }
  }
}
