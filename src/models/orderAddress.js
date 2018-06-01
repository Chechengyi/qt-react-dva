

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
      console.log('起点位置 ')
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
      console.log('终点位置')
      yield put({
        type: 'saveEndPoint',
        payload
      })
    },
    *setEndMsg({payload}, {call, put}){
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
