import React, { PureComponent } from 'react'
import Chat from '../components/Chat/ScrollChat'
import { NavBar } from 'antd-mobile'

export default class ChatView extends PureComponent {

  componentDidMount(){
  }

  render () {
    return <div>
      <NavBar
        leftContent={<div onClick={ ()=> {
          this.props.history.goBack()
        } } >返回</div>}
      >客服</NavBar>
      <Chat />
    </div>
  }
}
