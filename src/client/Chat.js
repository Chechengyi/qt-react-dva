import React, { Component } from 'react'
import Chat from '../components/Chat/ScrollChat'
import { NavBar } from 'antd-mobile'
import { connect } from 'dva'

@connect(state=>({
  client_id: state.client_login.client_id,
  client_name: state.client_login.client_name
}))
export default class ChatView extends Component {

  constructor(props){
    super(props)
    this.state = {
      data: []
    }
  }

  componentWillMount(){
  }

  componentDidMount(){
    this.refs.chat.Scroll.refresh()
  }

  onSend=(msg)=>{
    this.setState({
      data: [...this.state.data, msg]
    })
    this.resiveMsg()
  }

  resiveMsg = ()=> {
    setTimeout( ()=>{
      this.setState({
        data: [...this.state.data, {
          userId: 10,
          username: '管理员',
          text: 'hello world'
        }]
      })
    }, 300 )
  }

  render () {
    return <div>
      <NavBar
        leftContent={<div onClick={ ()=> {
          this.props.history.goBack()
        } } >返回</div>}
      >客服</NavBar>
      <Chat
        height={document.documentElement.clientHeight-44}
        ref='chat'
        backgroundColor='#f1f1f1'
        message={this.state.data}
        userInfo={{
          userId: this.props.client_id,
          username: this.props.client_name
        }}
        onSend={ this.onSend }  //点击发送按钮的回调函数
        placeholder='请输入聊天内容'
      />
    </div>
  }
}
