import { routerRedux } from 'dva/router';
import { fakeAccountLogin } from '../services/api';

export default {
  namespace: 'login',

  state: {
    status: window.sessionStorage.getItem('admin_status'),
    name: window.sessionStorage.getItem('admin_name'),
    aid: window.sessionStorage.getItem('admin_aid')
  },

  effects: {
    *login({ payload }, { call, put }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });
      const response = yield call(fakeAccountLogin, payload);
      if (response.status === 'ok') {
        window.sessionStorage.setItem('admin_status', 'ok')
        window.sessionStorage.setItem('admin_name', response.name)
        window.sessionStorage.setItem('admin_aid', response.aid)
        yield put({
          type: 'changeLoginStatus',
          payload: response
        })
        yield put(routerRedux.push('/admin/cont/home/frontdesk'));
      } else {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: 'error'
          }
        })
      }
    },
    *logout(_, { put }) {
      window.sessionStorage.clear()
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
        },
      });
      yield put(routerRedux.push('/admin/user/login'));
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      return {
        ...state,
        status: payload.status,
        // type: payload.type,
        name: payload.name,
        aid: payload.aid,
        submitting: false,
      };
    },
    changeSubmitting(state, { payload }) {
      return {
        ...state,
        submitting: payload,
      };
    },
  },
};
