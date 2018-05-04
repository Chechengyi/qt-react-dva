import { get_supplier_list, get_driver_list, get_customer_list, get_supplier_goods } from '../services/api'

export default {
  namespace: 'global_drop',
  state: {
    gong_list: [],
    driver_list: [],
    cus_list: [],
    goods_list: [],
    current_gong_list: [],
    loading: false
  },
  effects: {
    *get_current_list ( {payload}, {call, put} ) {
      yield put({
        type: 'changeLoading',
        payload: true
      })
      const res = yield call( get_supplier_goods, payload )
      if (res) {
        yield put({
          type: 'save_current_gong_list',
          payload: res
        })
      }
      yield put({
        type: 'changeLoading',
        payload: false
      })
    },
    *get_gong ({payload}, {call, put}) {
      const res = yield call( get_supplier_list )
      yield put({
        type: 'save_gong',
        payload: res
      })
    },
    *get_driver ( {payload}, {call, put} ) {
      const res = yield call(get_driver_list)
      yield put({
        type: 'save_driver',
        payload: res
      })
    },
    *get_cus ( {payload}, {call, put} ) {
      const res = yield call(get_customer_list)
      yield put({
        type: 'save_cus',
        payload: res
      })
    }
  },
  reducers: {
    changeLoading ( state, {payload} ) {
      return {
        ...state,
        loading: payload
      }
    },
    save_current_gong_list ( state, {payload} ) {
      return {
        ...state,
        current_gong_list: payload
      }
    },
    save_gong ( state, {payload} ) {
      return {
        ...state,
        gong_list: payload
      }
    },
    save_driver ( state, {payload} ) {
      return {
        ...state,
        driver_list: payload
      }
    },
    save_cus ( state, {payload} ) {
      return {
        ...state,
        cus_list: payload
      }
    }
  }
}
