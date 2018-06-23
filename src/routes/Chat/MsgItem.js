import React, { Component } from 'react'
import styles from './Chat.less'

export default class MsgItem extends Component {

  renderMsgRow = (data, adminId)=> {
    if (!data.user) return null
    if ( data.fromId==adminId ) { // 用户本人发的消息显示在右边
      return <div className={styles.msgBoxMe} style={{float: 'right'}} >
        <div style={{marginRight: 10, color: 'green'}} >我</div>
        <div>{data.text}</div>
      </div>
    } else { // 与用户聊天的人的信息显示在左边
      return <div style={{float: 'left'}} >
        <div className={styles.msgBoxCus} style={{
          marginLeft: 10, color: 'blue', minWidth: 200 }} >
          {data.user.name}
          <div className={styles.textBox} >{data.text}</div>
        </div>
      </div>
    }
  }

  render(){
    const {data} = this.props
    console.log(data)
    return <div className={styles.msgItem} >
      dd
      <div>{this.renderMsgRow(data, this.props.adminId)}</div>
    </div>
  }
}
