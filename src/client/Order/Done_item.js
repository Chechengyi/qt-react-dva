import React, { Component } from 'react'
import { Flex } from 'antd-mobile'

const FlexItem = Flex.Item

export default class Done_item extends Component{

  renderOrderType = id => {
    for (var i = 0; i < this.props.orderType.length; i++) {
      if (id == this.props.orderType[i].id) {
        return this.props.orderType[i].type
      }
    }
  }

  gotoMsg =(id, username)=> {
    var userObj = {
      adminId: id,
      username,
      msg: []
    }
    this.props.dispatch({
      type: 'socketMsg/addUser',
      payload: {
        toUserId: id,
        content: userObj
      }
    })
  }

  renderOrderItem = (typeId, data) => {
    if (typeId==2) {  // 代购服务订单
      return <div>
        <Flex wrap='wrap'>
          <FlexItem style={{flex: 'auto'}} >订单编号：{data.ono}</FlexItem>
          <FlexItem style={{flex: 'auto'}} >{this.renderOrderType(data.typeId)}</FlexItem>
        </Flex>
        { data.couId&&
        <Flex>
          <FlexItem>快递员姓名：{data.couUsername}</FlexItem>
          <FlexItem>
            <a href={`tel:${data.couTel}`} ><img style={{width: 20, height: 20}} src="/tel.png" alt=""/> {data.couTel}</a>
          </FlexItem>
        </Flex>
        }
        <Flex>代购物品：{data.goodsType}</Flex>
        <Flex>
          物品费用: {data.couPay} 元
        </Flex>
      </div>
    } else {  //  同城急送订单或快递物流订单
      return <div>
        <Flex wrap='wrap'>
          <FlexItem style={{flex: 'auto'}} >订单编号：{data.ono}</FlexItem>
          <FlexItem style={{flex: 'auto'}} >{this.renderOrderType(data.typeId)}</FlexItem>
        </Flex>
        { data.couId&&
        <Flex>
          <FlexItem>快递员姓名：{data.couUsername}</FlexItem>
          <FlexItem>
            <a href={`tel:${data.couTel}`} ><img style={{width: 20, height: 20}} src="/tel.png" alt=""/> {data.couTel}</a>
          </FlexItem>
        </Flex>
        }
        <Flex>
          目标地点：{data.receiverAddr}
        </Flex>
      </div>
    }
  }

  render(){
    const {data, orderType} = this.props
    return (
      <div style={{backgroundColor: '#fff', padding: 5, marginBottom: 10 }} >
        {this.renderOrderItem(data.typeId, data)}
        <div>
          <a onClick={ e=>this.gotoMsg(data.adminId, data.adminUsername) } >
            <img style={{width: 25, height: 25}} src="/wechat.png" alt=""/> 与管理员聊天
          </a>
        </div>
        <Flex>
          <FlexItem>
            订单费用：{data.actualFee} 元
          </FlexItem>
        </Flex>
        <Flex>
          {!data.isRate&&
          <a onClick={ ()=>this.props.history.replace(`/cont/star/${data.id}`) }>
            评价订单
          </a>
          }
        </Flex>
      </div>
    )
  }
}
