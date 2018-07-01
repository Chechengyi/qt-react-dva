import React, { Component } from 'react'
import { driverGetMoneyCash } from '../services/api'
import { connect } from 'dva'

@connect( state=>({
  driver_id: state.driver_login.driver_id
}))
export default class MoneyCount extends Component{

  componentDidMount(){
    driverGetMoneyCash({
      couId: this.props.driver_id
    })
      .then( res=>{
        console.log(res)
      })
  }

  render(){
    return (
      <div>
        快递员查看收益总计
      </div>
    )
  }
}
