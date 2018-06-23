import React, { Component } from 'react'
import styles from './Chat.less'

export default class UserItem extends Component {

  handleClick =data=> {
    this.props.history.replace(`/admin/cont/chat/content/${data.cusId}/${data.username}`)
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
