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
    console.log(this.refs.input.value)
    if (/^[\s]*$/.test(this.refs.input.value) || !this.refs.input.value ) {
      message.error('输入聊天信息不能为空！', 1)
      this.refs.input.value=''
      return
    }
    let msgObj = {
      text: this.refs.input.value,
      createAt: new Date(),
      toUser: parseInt(this.cusId),
      room: `c${this.cusId}a${this.props.adminId}`,
      user: {
        id: parseInt(this.props.adminId),
        name: this.props.admin_name
      }
    }
    console.log(msgObj)
    this.props.dispatch({
      type: 'socketMsg/setMsg',
      payload: {
        toUserId: parseInt(this.cusId),
        msg: msgObj
      }
    })
    this.refs.input.value=' '
    setTimeout( ()=>{
      this.moni()
    },300 )
  }

  moni = e=> {
    let msgObj = {
      text: '你好， 世界',
      createAt: new Date(),
      toUser: this.adminId,
      room: `c${this.cusId}a${this.props.adminId}`,
      user: {
        id: 999,
        name: '车'
      }
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
            console.log(this.props.userList[parseInt(this.cusId)].msg)
          }
          {Object.keys(this.props.userList).length!==0&&
            this.props.userList[parseInt(this.cusId)].msg.map( (item,i)=>(
              <MsgItem adminId={this.props.adminId} data={item} key={item.id} />
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
