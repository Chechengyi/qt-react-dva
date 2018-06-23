import React, { Component } from 'react'
import Chat from '../components/Chat/ScrollChat'
import { NavBar } from 'antd-mobile'
import { connect } from 'dva'

@connect(state=>({
  client_id: state.client_login.client_id,
  client_name: state.client_login.client_name,
  userList: state.socketMsg.userList
}))
export default class ChatView extends Component {

  constructor(props){
    super(props)
    this.state = {
      data: []
    }
    this.adminId = parseInt(this.props.match.params.adminId)
    this.username = this.props.match.params.username
  }

  componentDidMount(){
    this.parseToMsg(this.props.userList[this.adminId])
  }

  // 把数据格式转换成渲染需要的格式 然后setState给data
  parseToMsg = (data)=> {
    if (!data) return
    this.setState({
      data: data.msg
    })
  }

  onSend=(msg)=>{
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
    let sendObj = {
      text: msg.text,
      createAt: new Date(),
      room: `c+${this.props.client_id}+a+${this.adminId}`,
      toUser: this.adminId,
      user: {
        id: parseInt(this.props.client_id),
        name: this.props.client_name
      }
    }
    console.log(sendObj)
    if ( window.cusWS ) {
      console.log('发送')
      window.cusWS.send(JSON.stringify(sendObj))
    }
    this.props.dispatch({
      type: 'socketMsg/setMsg',
      payload: {
        toUserId: this.adminId,
        msg: sendObj
      }
    })
    this.resiveMsg()
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.userList!==this.props.userList) {
      this.parseToMsg(this.props.userList[this.adminId])
    }
  }

  resiveMsg = ()=> {
    let msgObj = {
      text: '你好， 世界',
      createAt: new Date(),
      toUser: parseInt(this.props.client_id),
      room: `c${this.props.client_id}a${this.adminId}`,
      user: {
        id: 999,
        name: '管理员'
      }
    }
    this.props.dispatch({
      type: 'socketMsg/setMsg',
      payload: {
        toUserId: this.adminId,
        msg: msgObj
      }
    })
  }

  render () {
    return <div>
      <NavBar
        leftContent={<div onClick={ ()=> {
          this.props.history.goBack()
        } } >返回</div>}
      >{this.props.match.params.username}</NavBar>
      <Chat
        height={document.documentElement.clientHeight-44}
        ref='chat'
        backgroundColor='#f1f1f1'
        message={this.state.data}
        userInfo={{
          id: this.props.client_id,
          name: this.props.client_name
        }}
        onSend={ this.onSend }  //点击发送按钮的回调函数
        placeholder='请输入聊天内容'
      />
    </div>
  }
}
