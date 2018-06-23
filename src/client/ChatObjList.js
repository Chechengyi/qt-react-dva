import React, { Component } from 'react'
import { connect } from 'dva'
import { NavBar, Icon, List } from 'antd-mobile'

const ListItem = List.Item

@connect(state=>({
  client_id: state.client_login.client_id,
  userList: state.socketMsg.userList
}))

export default class ChatObjList extends Component {

  componentDidMount(){
    // this.props.dispatch({
    //   type: 'socketMsg/setUserList',
    //   payload: {
    //     cusId: this.props.client_id,
    //     type: 'cus'
    //   }
    // })
  }

  linkToChat = (adminId, username)=> {
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
                onClick={ ()=>this.linkToChat(item, this.props.userList[item]['username']) }
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
