import React, { Component } from 'react'
import styles from './ScrollChatItem.less'

export default class ScrollChatItem extends Component {

  renderRow = e=> {
    if (e.user.id === this.props.userInfo.id) {
      return (
        <div className={styles.row}
             style={{float: 'right', backgroundColor: '#ffb300'}} >
          {e.text}
        </div>
      )
    } else {
      return (
        <div className={styles.row}
             style={{float: 'left', backgroundColor: '#ffffff'}}
        >
          {e.text}
        </div>
      )
    }
  }

  isMe = data=> {
    return  data.user && data.user.id == this.props.userInfo.id
  }

  render () {
    const {message, userInfo} = this.props
    // return <div className={styles.rowBox} >
    //   {this.renderRow(message)}
    // </div>
    if ( this.isMe(message) ) {  // 用户发的信息
      return <div className={styles.msgRow}
        style={{justifyContent: 'flex-end'}}
      >
        <div className={styles.msgBox}
          style={{backgroundColor: '#37b7e9', color: '#fff'}}
        >
          {message.text}
        </div>
      </div>
    } else {  // 接受的其他人的信息
      return <div className={styles.msgRow}
        style={{justifyContent: 'flex-start'}}
      >
        <div className={styles.headImg} >
          管
        </div>
        <div className={styles.msgBox}
          style={{backgroundColor: '#fff'}}
        >
          {message.text}
        </div>
      </div>
    }
  }
}
