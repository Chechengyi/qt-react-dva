import React, { Component } from 'react'
import { List, Toast, Flex } from 'antd-mobile'
import {cancelOrder, courierAddAccpet, couCancelOrder} from "../../services/api";
import {Modal} from "antd-mobile/lib/index";

const ListItem = List.Item
const Brief = ListItem.Brief

export default class Weichuli_Item extends Component {

  constructor(props){
    super(props)
    this.state={
      isCancel: false
    }
  }

  renderOrderType =id=> {
    for ( var i=0; i<this.props.orderType.length; i++ ) {
      if (id==this.props.orderType[i].id) {
        return this.props.orderType[i].type
      }
    }
  }

  handleCancel= (id, cusId)=> {
    // Modal.platform('确定取消订单？)
    Modal.alert('确定取消订单？', '', [{
      text: '取消', onPress: ()=> {}
    }, {
      text: '确定', onPress: value=> {
        console.log(value)
        couCancelOrder({
          id: id,
          // cancelReason: value,
          // cancelStatus: 3,
          // cusId
        })
          .then( res=> {
            if (res.status==='OK') {
              Toast.success('取消成功', 0.8)
              this.setState({
                isCancel: true
              })
            }
            // 完成一条后更新数量
            this.props.dispatch({
              type: 'courierNoAccept/getCount',
              payload: {
                id: this.props.driver_id
              }
            })
          })
      }
    }])
  }

  handleChoose= id=> {
    Modal.alert('确认处理', '', [{
      text: '取消', onPress: ()=> {}
    }, {
      text: '确定', onPress: ()=> {
        courierAddAccpet({
          id
        })
          .then( res=> {
            if (res.status==='OK') {
              Toast.success('处理成功，请即刻联系客户完成订单确定工作', 1)
              this.setState({
                isCancel: true
              })
            } else {
              Toast.fail('处理失败， 请重新尝试', 1)
            }
          } )
          .catch( err=> {
            Toast.fail('服务器错误，请重新尝试', 1)
          } )
      }
    }])

  }


  render () {
    const {data} = this.props
    return (
      <div style={{...rowStyle, display: this.state.isCancel?'none':''}} >
        <div>订单类型：{this.renderOrderType(data.typeId)}</div>
        <div>
          客户姓名：{data.senderName}
        </div>
        <div>
          联系电话：
          <a href={`tel:${data.senderTel}`}><img
            style={{width: 25, height: 25}}
            src="/tel.png" alt=""/>{data.senderTel}</a>
        </div>
        <div style={briefStyle} >
          {data.typeId==2?'购货地点':'寄件地址'}：{data.senderAddress}
        </div>
        <div style={briefStyle} >
          {data.typeId==2?'收货地址':'收件地址'}：{data.receiverAddr}
        </div>
        <div style={{fontSize: 15, marginTop: 5, textAlign: 'right'}} >
          <a onClick={ ()=>{ this.handleChoose(data.id) } } style={{marginRight: 10}} >确认处理</a>
          <a onClick={ ()=>{this.handleCancel(data.id, data.cusId)} } >取消订单</a>
        </div>
      </div>
    )
  }
}

const rowStyle = {
  boxSizing: 'content-box',
  width: '300px',
  color: '#000',
  fontSize: '17px',
  // lineHeight: 1.5,
  textAlign: 'left',
  paddingLeft: 15,
  paddingRight: 15,
  overflow: 'hidden'
}

const briefStyle = {
  color: '#888',
  fontSize: '15px',
  lineHeight: 1.5,
}
