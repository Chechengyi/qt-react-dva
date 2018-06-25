import React, { Component } from 'react'
import styles from './Chat.less'
import { connect } from 'dva'
import { Button, message } from 'antd'
import MsgItem from './MsgItem'
import Iscroll from 'iscroll/build/iscroll-probe'
import { objIsNull } from '../../services/utils'

@connect( state=>({
  userList: state.socketMsg.userList,
  msgList: state.socketMsg.msgList,
  adminId: state.admin_login.admin_id,
  admin_name: state.admin_login.admin_name
}) )
export default class Content extends Component {

  constructor(props){
    super(props)
    this.cusId = this.props.match.params.cusId
    this.username = this.props.match.params.username
  }

  componentDidMount(){
    this.Scroll = new Iscroll(this.refs.scrollWarp, {
      scrollbars: true,
      preventDefault: false,
      mouseWheel: true,
      probeType: 2,
      click: true
    })
  }

  componentDidUpdate(props, state){
    this.Scroll.refresh()
    if ( this.refs.scrollWarp.clientHeight-this.refs.scroll.offsetHeight<0 ) {
      this.Scroll.scrollTo(0,
        this.refs.scrollWarp.clientHeight-this.refs.scroll.offsetHeight,
      )
    }
  }

  enterDown =e=> {
    if (e.keyCode===13) {  // enter键被按下
      this.sendMsg()
    }
  }

  sendMsg = e=> {
    if (/^[\s]*$/.test(this.refs.input.value) || !this.refs.input.value ) {
      message.error('输入聊天信息不能为空！', 1)
      this.refs.input.value=''
      return
    }
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
    let msgObj = {
      adminId: parseInt(this.props.adminId),
      cusId: parseInt(this.cusId),
      fromId: parseInt(this.props.adminId),
      toId: parseInt(this.cusId),
      text: this.refs.input.value,
      roomName: `c${this.cusId}a${this.props.adminId}`,
      sendTime: new Date()
    }
    if ( window.cusWS ) {
      console.log('发送')
      window.cusWS.send(JSON.stringify(msgObj))
    }
    this.props.dispatch({
      type: 'socketMsg/setMsg',
      payload: {
        toUserId: parseInt(this.cusId),
        msg: msgObj
      }
    })
    this.refs.input.value=' '
    // setTimeout( ()=>{
    //   this.moni()
    // },300 )
  }

  moni = e=> {
    let msgObj = {
      adminId: parseInt(this.props.adminId),
      cusId: parseInt(this.cusId),
      fromId: 3,
      toId: parseInt(this.props.adminId),
      text: '你好， 世界',
      roomName: `3a${this.props.adminId}`,
      sendTime: new Date()
    }
    this.props.dispatch({
      type: 'socketMsg/setMsg',
      payload: {
        toUserId: parseInt(this.cusId),
        msg: msgObj
      }
    })
  }

  render(){
    return <div className={styles.warp} >
      <div className={styles.title} >
        {this.username}
      </div>
      <div ref='scrollWarp' className={styles.content} >
        <div ref='scroll' style={{padding: '10px 0'}} >
          {Object.keys(this.props.userList).length!==0&&
            this.props.userList[parseInt(this.cusId)].msg.map( (item,i)=>(
              <MsgItem
                adminId={this.props.adminId}
                username={this.username}
                data={item} key={i} />
            ) )
          }
        </div>
      </div>
      <div className={styles.footer} >
        <textarea
          ref='input'
          onKeyDown={ e=>this.enterDown(e) }
          className={styles.input} ></textarea>
        <div className={styles.button} >
          <Button onClick={this.sendMsg} size='small' type='primary' >发送</Button>
        </div>
      </div>
    </div>
  }
}
