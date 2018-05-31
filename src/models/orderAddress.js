

export default {
  namespace: 'orderAddress',
  state: {
    startPoint: {},
    startMsg: {},
    endPoint: {},
    endMsg: {}
  },
  effects: {
    *setStartPos({payload}, {call, put}){
      yield put({
        type: 'saveStartPoint',
        payload
      })
    },
    *setStartMsg({payload}, {call, put}){
      yield put({
        type: 'saveStartMsg',
        payload
      })
    },
    *setEndPos({payload}, {call,put}){
      console.log(payload)
      yield put({
        type: 'saveEndPoint',
        payload
      })
    },
    *setEndMsg({payload}, {call, put}){
      console.log(payload)
      yield put({
        type: 'saveEndMsg',
        payload
      })
    }
  },
  reducers: {
    saveEndPoint( state, {payload} ){
      return {
        ...state,
        endPoint: payload
      }
    },
    saveEndMsg( state, {payload} ){
      return {
        ...state,
        endMsg: payload
      }
    },
    saveStartPoint( state, {payload} ){
      return {
        ...state,
        startPoint: payload
      }
    },
    saveStartMsg( state, {payload} ){
      return {
        ...state,
        startMsg: payload
      }
    }
  }
}
