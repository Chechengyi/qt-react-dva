import React, { Component } from 'react'
import { Flex } from 'antd-mobile'

const FlexItem = Flex.Item

export default class Daifukuan_Item extends Component {

  renderOrderType =id=> {
    for ( var i=0; i<this.props.orderType.length; i++ ) {
      if (id==this.props.orderType[i].id) {
        return this.props.orderType[i].type
      }
    }
  }

  render () {
    const {data} = this.props
    return <div style={{padding: '10px 7px', marginBottom: 8, backgroundColor: '#fff'}} >
      <Flex warp='wrap' >
        <FlexItem style={{flex: 6}} >
          订单编号: {data.ono}
        </FlexItem>
        <FlexItem style={{flex: 5}} >
          订单类型：{this.renderOrderType(data.typeId)}
        </FlexItem>
      </Flex>
      <Flex>
        <FlexItem >客户姓名：{data.senderName}</FlexItem>
        <FlexItem >电话：{data.senderTel}</FlexItem>
      </Flex>
      <Flex>
        <FlexItem>客户下单地址：
          {data.typeId==2?data.receiverAddr:data.senderAddress}</FlexItem>
      </Flex>
      <Flex>
        <FlexItem>商品类型：{data.goodsType}</FlexItem>
        <FlexItem>实际重量：{data.weight} 公斤</FlexItem>
      </Flex>
      <Flex>
        <FlexItem>下单时间：{new Date(data.createTime).toLocaleString()}</FlexItem>
      </Flex>
      <Flex justify='center' style={{marginTop: 5}} >
        订单实际价格：<span style={{fontSize: '1.1em', color: '#ff6700'}} >{data.actualFee} 元</span>
      </Flex>
    </div>
  }
}
