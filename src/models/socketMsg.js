// {
//   text: '发送消息的内容',
//   createAt: '消息创建的时间',
//   toUser: '接受方的id',
//   room: “c”+uesrId+”a”+toUser,
//   user: {
//     id: '发送方的id',
//     name: '发送方的名字'
//   }
// }

// {
//   id: []
// }

import { cusGetChatUserList, adminGetChatObj } from '../services/api'
import {routerRedux} from 'dva/router'

export default {
  namespace: 'socketMsg',
  state: {
    msgList: [],   //
    userList: {}  // 聊天对象列表
    // List: {}
  },
  effects: {
    *setMsg({payload}, {call, put}){
      console.log('====')
      console.log(payload)
      yield put({
        type: 'saveMsg',
        payload
      })
    },
    *setUserList({payload}, {call, put}){
      let res
      console.log('....')
      if (payload.type==='admin') {
        res = yield call( adminGetChatObj, {adminId: payload.adminId} )
      } else {
        res = yield call( cusGetChatUserList, {cusId: payload.cusId} )
      }
      console.log(res)
      return
      if (res.data) {
        yield put({
          type: 'saveUserList',
          payload: res.data
        })
      }

    },
    // 添加聊天对象
    *addUser({payload}, {call ,put}){
      yield put({
        type: 'saveAddUser',
        payload
      })
      // 跳转到聊天页面
      yield put(routerRedux.push(`/cont/clientChat/${payload.toUserId}/${payload.content.username}`));
    }
  },
  reducers: {
    saveAddUser(state, {payload}){
      const {toUserId, content} = payload
      let currentUserList = {...state.userList}
      // 判断需要添加的聊天对象是否已经存在
      if (currentUserList[toUserId]) {
        // 存在的话不对现在聊天对象做任何操作
        return {
          ...state
        }
      } else {
        // 不存在的话， 把管理员id添加进聊天列表
        currentUserList[toUserId] = content
        return {
          ...state,
          userList: currentUserList
        }
      }
    },
    saveUserList(state, {payload}){
      return {
        ...state,
        userList: payload
      }
    },
    saveMsg( state, {payload} ){
      let toUserId = payload.toUserId
      let obj = {...state.userList}
      obj[toUserId]['msg'].push(payload.msg)
      return {
        ...state,
        userList: obj
      }
    }
  },
  subscriptions: {

  }
}
