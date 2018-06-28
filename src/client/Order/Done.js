import React, { Component } from 'react'
import { connect } from 'dva'
import { NavBar } from 'antd-mobile'
import { Rate } from 'antd'

export default class Done extends Component{
  render(){
    return (
      <div>
        <NavBar
          leftContent={<div onClick={ e=>this.props.history.goBack() } >返回</div>}
        >已完成订单</NavBar>
        <Rate></Rate>
      </div>
    )
  }
}
