import React, { Component } from 'react'
import Chat from '../components/Chat/ScrollChat'
import { NavBar } from 'antd-mobile'
import { connect } from 'dva'

@connect(state=>({
  client_id: state.client_login.client_id,
  client_name: state.client_login.client_name
}))
export default class ChatView extends Component {

  componentWillMount(){
    console.log('父亲，willmount')
  }

  componentDidMount(){
    this.refs.chat.Scroll.refresh()
    // this.refs.chat.forceUpdate()
    console.log('fu')
  }

  handleSend=(msg)=>{
    console.log(msg)
  }

  render () {
    return <div>
      <NavBar
        leftContent={<div onClick={ ()=> {
          this.props.history.goBack()
        } } >返回</div>}
      >客服</NavBar>
      <Chat
        ref='chat'
        backgroundColor='#d9d9d9'
        message={[1,2,3,4,5,6,7,8,9,10,11,12]}
        user={{
          id: this.props.client_id,
          username: this.props.client_name
        }}
        onSend={e=>this.handleSend(e)}  //点击发送按钮的回调函数
        placeholder='请输入聊天内容'
      />
    </div>
  }
}
