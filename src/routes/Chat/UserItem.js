import React, { Component } from 'react'
import styles from './Chat.less'
import { connect } from 'dva'

@connect()
export default class UserItem extends Component {

  handleClick =data=> {
    console.log(data.room)
    this.props.dispatch({
      type: 'socketMsg/getAjaxMsg',
      payload: {
        type: 'admin',
        cusId: data.id,
        roomName: data.room,
        adminId: this.props.adminId
      }
    })
    this.props.history.replace(`/admin/cont/chat/content/${data.id}/${data.username}`)
  }

  render(){
    const {data} = this.props
    return <div
      onClick={ e=>this.handleClick(data) }
      className={styles.userItem} >
      {data.username}
    </div>
  }
}
