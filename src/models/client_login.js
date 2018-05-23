import { clientLogin } from '../services/api'
import { routerRedux } from 'dva/router';
import store from 'store'

export default {
  namespace: 'client_login',
  state: {
    client_id: store.get('clientData')?store.get('clientData').client_id:null,
    client_name: store.get('clientData')?store.get('clientData').client_name:null,
    client_status: store.get('clientData')?store.get('clientData').client_status:null,
    loading: false
  },
  effects: {
    *login ( {payload}, {call, put} ) {
      yield put({
        type: 'changLoading',
        payload: true
      })
      const res = yield call( clientLogin, payload )
      if ( res.status === 'OK' ) {
        store.set('clientData', {
          client_id: res.data.id,
          client_name: res.data.name,
          client_status: 'OK'
        })
        yield put({
          type: 'saveLogin',
          payload: {
            client_id: res.data.id,
            client_name: res.data.name,
            client_status: 'OK'
          }
        })
        yield put(routerRedux.push('/cont'))
      } else {
        yield put({
          type: 'saveLogin',
          payload: {
            client_status: 'ERROR'
          }
        })
      }
      yield put({
        type: 'changLoading',
        payload: false
      })
    },
    *logout ( {payload}, {call, put} ) {

    }
  },
  reducers: {
    saveLogin ( state, {payload} ) {
      return {
        ...state,
        client_id: payload.client_id,
        client_name: payload.client_name,
        client_status: payload.client_status
      }
    },
    changLoading ( state, {paylaod} ) {
      return {
        ...state,
        loading: paylaod
      }
    }
  }
}
