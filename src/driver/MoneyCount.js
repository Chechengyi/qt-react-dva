import React, { Component } from 'react'
import { driverGetMoneyCash } from '../services/api'
import { connect } from 'dva'
import { NavBar, Icon } from 'antd-mobile'

@connect( state=>({
  driver_id: state.driver_login.driver_id,
  loading: state.couOrderNum.loading,
  data: state.couOrderNum.data
}))
export default class MoneyCount extends Component{

  componentDidMount(){
    // driverGetMoneyCash({
    //   couId: this.props.driver_id
    // })
    //   .then( res=>{
    //     console.log(res)
    //   })
    this.props.dispatch({
      type: 'couOrderNum/getData',
      payload: {
        couId: this.props.driver_id
      }
    })
  }

  // 计算派出的总单量
  orderSum =()=> {
    var sum =0
    this.props.data.forEach( item=>{
      sum += item[0]
    })
    return sum
  }

  // 算出没种类型订单的数量,和收入金额 传入参数id 为订单类型id
  orderTypeSum =(id)=> {
    var order = {
      sum: 0,
      money: 0
    }
    this.props.data.forEach( item=>{
      if ( item[1]==id ) {
        order.sum = item[0]
        order.money = item[2]
      }
    })
    return order
  }

  render(){
    return (
      <div>
        <NavBar
          icon={ <Icon type='left' ></Icon> }
          onLeftClick={ ()=>this.props.history.goBack() }
        >我的收益</NavBar>
        <div style={{marginTop: 10, textAlign: 'center'}} >
          您已为平台派出 <span
          style={{color: '#ff6700', fontSize: '1.2em'}}
        >{this.orderSum()}</span>  单
        </div>
        <div style={{margin: '10px auto'}}  >
          <OrderItem title='同城急送' obj={this.orderTypeSum(1)} />
          <OrderItem title='代购服务' obj={this.orderTypeSum(2)} />
          <OrderItem title='快递物流' obj={this.orderTypeSum(3)} />
        </div>
      </div>
    )
  }
}

const OrderItem = ({obj, title})=> (
  <div style={{textAlign: 'center '}} >
    {title} 派出 {obj.sum}单
    {/*收入 {obj.money} 元*/}
  </div>
)
