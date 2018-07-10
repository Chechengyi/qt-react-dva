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
      <Flex>
        订单编号: {data.ono}
      </Flex>
      <Flex>
        订单类型：{this.renderOrderType(data.typeId)}
      </Flex>
      <Flex>
        <FlexItem >客户姓名：{data.senderName}</FlexItem>
        <FlexItem >
          <a href={`tel:${data.senderTel}`}>
            <img style={{width: 20, height: 20}} src="/tel.png" alt=""/>
            {data.senderTel}</a>
        </FlexItem>
      </Flex>
      {data.typeId!=2&&
      <Flex>
        <FlexItem>收件人姓名：{data.receiverName}</FlexItem>
        <FlexItem>
          <a href={`tel:${data.receiverTel}`}>
            <img style={{width: 20, height: 20}} src="/tel.png" alt=""/>
            {data.receiverTel}</a>
        </FlexItem>
      </Flex>
      }
      <Flex>
        <FlexItem>客户下单地址：
          {data.senderAddress}</FlexItem>
      </Flex>
      <Flex>
        <FlexItem>商品类型：{data.goodsType}</FlexItem>
        <FlexItem>实际重量：{data.weight} 公斤</FlexItem>
      </Flex>
      <Flex>
        订单预算价格：{data.fee.toFixed(2)}元
      </Flex>
      <Flex>
        订单备注：{data.comment}
      </Flex>
      <Flex>
        <FlexItem>
          下单时间：{ new Date(data.createTime.substring(0, data.createTime.lastIndexOf('.'))).toLocaleString() }
        </FlexItem>
      </Flex>
      <Flex justify='center' style={{marginTop: 5}} >
        订单实际价格：<span style={{fontSize: '1.1em', color: '#ff6700'}} >{data.actualFee.toFixed(2)} 元</span>
      </Flex>
    </div>
  }
}
