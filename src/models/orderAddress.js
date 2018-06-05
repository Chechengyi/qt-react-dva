
export default {
  namespace: 'orderAddress',
  state: {
    startPoint: {},  // lat,lnt(起点经纬度) address name
    startMsg: {},  // tel(下单人电话) receiverName(下单人姓名)
    startAddress: null,  //起点详细地址
    endPoint: {}, // lat lnt(终点经纬度)   address name
    endMsg: {},  // tel(收件人电话) receiverName(收件人姓名)
    endAddress: null, // 终点详细地址
    adminId: 1  // 选择省市区三级联动后设置的下单的归属adminId
  },
  effects: {
    *endAddress ( {payload}, {call, put} ) {
      yield put({
        type: 'saveEndAddress',
        payload
      })
    },
    *startAddress( {payload}, {call, put} ){
      yield put({
        type: 'saveStartAddress',
        payload
      })
    },
    *endAddress( {paylaod}, {call, put} ){
      yield put({
        type: 'saveEndAddress',
        payload
      })
    },
    *setAdminId( {payload}, {call, put} ){
      yield put({
        type: 'saveAdminId',
        payload
      })
    },
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
    saveEndAddress( state, {payload} ){
      return {
        ...state,
        endAddress: payload
      }

    },
    saveStartAddress( state, {payload} ){
      return {
        ...state,
        startAddress: payload
      }
    },
    saveEndAddress( state, {paylaod} ){
      return {
        ...state,
        endAddress: paylaod
      }
    },
    saveAdminId( state, {payload} ){
      return {
        ...state,
        adminId: payload
      }
    },
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
