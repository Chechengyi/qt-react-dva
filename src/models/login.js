import { routerRedux } from 'dva/router';
import { adminLogin } from '../services/api';

export default {
  namespace: 'login',

  state: {
    admin_status: window.sessionStorage.getItem('admin_status'),
    admin_name: window.sessionStorage.getItem('admin_name'),
    aid: window.sessionStorage.getItem('admin_aid')
  },

  effects: {
    *login({ payload }, { call, put }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });
      const response = yield call(adminLogin, payload);
      console.log(response)
      if (response.status === 'OK') {
        window.sessionStorage.setItem('admin_status', 'OK')
        window.sessionStorage.setItem('admin_name', response.data.name)
        window.sessionStorage.setItem('admin_aid', response.data.id)
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: 'OK',
            aid: response.data.id,
            admin_name: response.data.name
          }
        })
        yield put(routerRedux.push('/admin/cont/home/frontdesk'));
      } else {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: 'ERROR'
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
        admin_name: payload.admin_name,
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
