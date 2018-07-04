import React, { Component } from 'react'
import { connect } from 'dva'
import { NavBar, Icon, List, Toast } from 'antd-mobile'
import loginHoc from '../Hoc/LoginHoc'

const ListItem = List.Item


@connect(state=>({
  client_id: state.client_login.client_id,
  userList: state.socketMsg.userList,
  client_status: state.client_login.client_status
}))
@loginHoc({
  redirectPath: '/#/clientUser/login',
  propsSelector: props=>props.client_status == 'OK',
  redirectBefore: ()=> {
    Toast.fail('需要登录才能进行此操作，请先登录', 1.5)
  },
  // redirectBeforeTime: 1000
})

export default class ChatObjList extends Component {

  componentDidMount(){
    // 获取用户聊天对象
    this.props.dispatch({
      type: 'socketMsg/setUserList',
      payload: {
        cusId: this.props.client_id,
        type: 'cus'
      }
    })
  }

  linkToChat = (adminId, username, roomName)=> {
    this.props.dispatch({
      type: 'socketMsg/getAjaxMsg',
      payload: {
        type: 'cus',
        adminId: parseInt(adminId),
        roomName
      }
    })
    this.props.history.push(`/cont/clientChat/${adminId}/${username}`)
  }

  render(){
    return <div>
      <NavBar
        leftContent={ <div onClick={ e=>this.props.history.goBack() } >返回</div> }
      >聊过的人</NavBar>
      <div>
        <List>
          {/*<ListItem*/}
            {/*onClick={ ()=>this.props.history.push('/clientChat/1/超级管理员') }*/}
            {/*extra='总管理员'*/}
          {/*>超级管理员</ListItem>*/}
          {
            Object.keys(this.props.userList).map( (item,i)=>(
              <ListItem
                onClick={ ()=>this.linkToChat(item, this.props.userList[item]['username'], this.props.userList[item]['room']) }
                key={i} >
                {this.props.userList[item]['username']}
              </ListItem>
            ) )
          }
        </List>
      </div>
    </div>
  }
}

// export default loginHoc(ChatObjList)({
//   redirectPath: '/#/clientUser/login',
//   authenticatedSelector: state=>state.client_status == 'OK'
// })
