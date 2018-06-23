import React, { Component } from 'react'
import { Flex } from 'antd-mobile'

const FlexItem = Flex.Item
export default class DoneItem extends Component {

  renderOrderType = id => {
    for (var i = 0; i < this.props.orderType.length; i++) {
      if (id == this.props.orderType[i].id) {
        return this.props.orderType[i].type
      }
    }
  }

  // 代购服务订单与物流订单需要有不同的渲染规则
  renderOrderView = data=> {

  }

  render(){
    const {data} = this.props
    return <div style={{
      padding: '10px 7px', margin: '8px 10px', borderRadius: 3,
      backgroundColor: '#fff', height: 1000
    }} >
      <Flex wrap='wrap'>
        <FlexItem style={{flex: 'auto'}} >订单编号：{data.ono}</FlexItem>
        <FlexItem style={{flex: 'auto'}} >{this.renderOrderType(data.typeId)}</FlexItem>
      </Flex>
      <Flex>
        订单成交金额：{data.actualFee} 元
      </Flex>
      {data.typeId==2&&
        <Flex>垫付金额: 30 元</Flex>
      }
      <Flex>
        我的提成：1 元
      </Flex>
    </div>
  }
}
