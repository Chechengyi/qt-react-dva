import React, { Component } from 'react'
import { connect } from 'dva'
import { NavBar } from 'antd-mobile'

export default class Done extends Component{
  render(){
    return (
      <div>
        <NavBar
          leftContent={<div onClick={ e=>this.props.history.goBack() } >返回</div>}
        >进行中订单</NavBar>

      </div>
    )
  }
}
