import React, { Component } from 'react'
import { Modal, Spin } from 'antd'
import { connect } from 'dva'
import TimePicker from '../../components/TimePicker/TimePicker'
import Pie from '../../components/Chart/Pie'

@connect( state=>({
  isModal: state.dealerOrderCount.isModal,
  dealerId: state.dealerOrderCount.dealerId,
  dealerName: state.dealerOrderCount.dealerName,
  data: state.dealerOrderCount.data,
  loading: state.dealerOrderCount.loading
}))
export default class ModalDeaOrderCount extends Component{


  componentWillReceiveProps(nextProps){
    // 检测当经销上id改变
    if (this.props.dealerId!==nextProps.dealerId && nextProps.dealerId ) {
      this.loadingData(nextProps.dealerId)
      this.setState({
        dealerId: nextProps.dealerId
      })
    }
  }

  loadingData = dealerId=> {
    this.props.dispatch({
      type: 'dealerOrderCount/getData',
      payload: {
         adminId: dealerId
      }
    })
  }

  reset =()=> {
    this.props.dispatch({
      type: 'dealerOrderCount/getData',
      payload: {
        adminId: this.props.dealerId
      }
    })
  }

  onCancel =()=> {
    this.props.dispatch({
      type: 'dealerOrderCount/setModal',
      payload: false
    })
    this.props.dispatch({
      type: 'dealerOrderCount/setDealerInfo',
      payload: {
        dealerId: null,
        dealerName: null
      }
    })
    this.refs.time.resetTime()
  }

  search =arr=>{
    this.props.dispatch({
      type: 'dealerOrderCount/getData',
      payload: {
        adminId: this.props.dealerId,
        startTime: new Date(arr[0]),
        endTime: new Date(arr[1])
      }
    })
  }

  sum =()=> {
    // return this.props.data.reduce( (prev, next)=>(prev[0]+next[0]))
    let numArr = []
    numArr = this.props.data.map( item=>item[0])
    if (numArr.length===0) return 0
    return numArr.reduce( (prev, next)=>prev+next)
  }

  // 算出总营业额
  moneySum =()=> {
    let numArr = []
    numArr = this.props.data.map( item=>item[3] )
    if (numArr.length===0) return 0
    return numArr.reduce( (prev, next)=>prev+next )
  }

  //展示各订单类型单量，营业额
  orderType_num_money =()=> {
    let domArr = []
    let arr = [{
      name: '同城急送',
      orderNum: 0,
      money: 0
    }, {
      name: '代购服务',
      orderNum: 0,
      money: 0
    }, {
      name: '快递物流',
      orderNum: 0,
      money: 0
    }]

    this.props.data.forEach( item=>{
      if (item[1]==1) {
        arr[0].orderNum = item[0]
        arr[0].money = item[3]
      } else if (item[1]==2) {
        arr[1].orderNum = item[0]
        arr[1].money = item[3]
      } else {
        arr[2].orderNum = item[0]
        arr[3].money = item[3]
      }
    })

    domArr = arr.map( (item, i)=>(
        <tr style={{textAlign: 'center'}} key={i} >
          <td>{item.name}</td>
          <td>{item.orderNum} 单</td>
          <td>{item.money.toFixed(2)} 元</td>
        </tr>
    ))
    return domArr
  }

  render(){
    return (
      <Modal
        title={`经销商--${this.props.dealerName}--订单统计`}
        width={700}
        visible={this.props.isModal}
        onCancel={ this.onCancel }
        onOk={ this.onCancel }
      >
        <Spin
          size='large'
          tip='加载中...'
          spinning={this.props.loading}
        >
          <div>
            <div>
              <h3 style={{textAlign: 'center'}} >总计派出{this.sum()}单---总营业额为{this.moneySum().toFixed(2)}  元</h3>
            </div>
            <div style={{width: 250, margin: '0 auto'}} >
              <table style={{width: '100%'}} >
                <tbody>
                  <tr style={{textAlign: 'center'}} >
                    <th>订单类型</th>
                    <th>订单数量</th>
                    <th>总计金额</th>
                  </tr>
                  {this.orderType_num_money()}
                </tbody>
              </table>
            </div>
          </div>
          <div style={{display: 'flex', justifyContent: 'center'}} >
            <Pie
              pieStyle={{
                width: 400,
                height: 350
              }}
              data={this.props.data} />
          </div>
          <div style={{marginTop: 20, display: 'flex', justifyContent: 'center'}} >
            <TimePicker
              ref='time'
              search={this.search}
              reset={this.reset}
            />
          </div>
        </Spin>
      </Modal>
    )
  }
}
