import { cusGetOngoing } from "../services/api";

export default {
  namespace: 'clientOngoing',
  state: {
    loading: false,
    data: []
  },
  effects: {
    *refresh( {payload}, {call, put} ){
      const res = yield call( cusGetOngoing, payload )
      yield put({
        type: 'saveData',
        payload: res.data
      })
    },
    *getData( {payload}, {call, put} ){
      yield put({
        type: 'changeLoading',
        payload: true
      })
      const res = yield call( cusGetOngoing, payload )
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
