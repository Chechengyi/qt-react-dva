import React, { Component } from 'react'
import { adminGetCouTime, cusPay } from '../../services/api'
import { Button } from 'antd'

export default class OrderTime extends Component{

  componentDidMount(){
    adminGetCouTime({
      pageNo: 1,
      pageSize: 20
    })
      .then(res=>{
        console.log(res.data)
      })
  }

  pay = ()=> {
    cusPay({
      ono: '45083011061918374'
    })
      .then(res=>{
        console.log(res)
      })
  }

  render(){
    return <div>
      查看订单时间
      <Button onClick={this.pay} >付款</Button>
    </div>
  }
}
