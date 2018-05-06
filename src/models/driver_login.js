import { routerRedux } from 'dva/router';

export default {
  namespace: 'driver_login',
  state: {
    id: null
  },
  effects: {
    *login ( {payload}, {call, put} ) {
      yield put(routerRedux.push('/driver'))
    }
  },
  reducers: {

  }
}
