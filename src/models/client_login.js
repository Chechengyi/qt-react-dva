import { clientLogin, logout } from '../services/api'
import { routerRedux } from 'dva/router';
import store from 'store'

export default {
  namespace: 'client_login',
  state: {
    client_id: store.get('clientData')?store.get('clientData').client_id:null,
    client_name: store.get('clientData')?store.get('clientData').client_name:null,
    client_status: store.get('clientData')?store.get('clientData').client_status:null,
    client_tel: store.get('clientData')?store.get('clientData').client_tel:null,
    loading: false
  },
  effects: {
    *login ( {payload}, {call, put} ) {
      yield put({
        type: 'changeLoading',
        payload: true
      })
      const res = yield call( clientLogin, payload )
      console.log(res)
      if ( res.status === 'OK' ) {
        store.set('clientData', {
          client_id: res.data.id,
          client_name: res.data.username,
          client_status: 'OK',
          client_tel: res.data.tel
        }, new Date().getTime() + 5*24*60*60*1000)
        yield put({
          type: 'saveLogin',
          payload: {
            client_id: res.data.id,
            client_name: res.data.username,
            client_status: 'OK',
            client_tel: res.data.tel
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
        type: 'changeLoading',
        payload: false
      })
    },
    *logout ( {payload}, {call, put} ) {
      const res = yield call( logout, payload )
      if (res.status=='OK') {
        store.remove('clientData')
        yield put({
          type: 'saveLogin',
          payload: {
            client_id: null,
            client_name: null,
            client_status: null,
            client_tel: null
          }
        })
        yield put(routerRedux.push('/clientUser/login'))
      }
    }
  },
  reducers: {
    saveLogin ( state, {payload} ) {
      return {
        ...state,
        client_id: payload.client_id,
        client_name: payload.client_name,
        client_status: payload.client_status,
        client_tel: payload.client_tel
      }
    },
    changeLoading ( state, {paylaod} ) {
      return {
        ...state,
        loading: paylaod
      }
    }
  }
}
