/*
* {
*   adminId,
*   cusId,
*   formId,
*   roomName,
*   sendTime,
*   text,
*   toId
* }
* */

import { cusGetChatObj, adminGetChatObj,
  adminGetChatMsg, cusGetChatMsg
} from '../services/api'
import {routerRedux} from 'dva/router'

export default {
  namespace: 'socketMsg',
  state: {
    msgList: [],   //
    userList: {}  // 聊天对象列表
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
    *getAjaxMsg({payload}, {call, put}){
      // 判断是管理员还是客户
      let res
      if ( payload.type==='cus' ) {
        res = yield call(cusGetChatMsg, payload)
      } else {
        res = yield call(adminGetChatMsg, payload)
      }
      console.log(res)
      yield put({
        type: 'saveAjaxMsg',
        payload: {
          toUserId: payload.type=='cus'?payload.adminId:payload.cusId,
          msg: res.data
        }
      })
    },
    *setUserList({payload}, {call, put}){
      let res
      console.log('....')
      if (payload.type==='admin') {
        res = yield call( adminGetChatObj, {adminId: payload.adminId} )
      } else {
        res = yield call( cusGetChatObj, {cusId: payload.cusId} )
      }
      if (res.data) {
        // 把后台返回的数据转换为期望的数据结构
        let listData = {}
        res.data.forEach( item=>{
          listData[item[0]]={
            id: item[0],
            room: item[1],
            username: item[2],
            msg: []
          }
        })
        yield put({
          type: 'saveUserList',
          payload: listData
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
    saveAjaxMsg( state, {payload}){
      console.log(payload)
      let toUserId = payload.toUserId
      let obj = {...state.userList}
      obj[toUserId]['msg'] = payload.msg
      return {
        ...state,
        userList: obj
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
