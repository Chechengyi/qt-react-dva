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
      <Flex>
        <FlexItem>客户下单地址：
          {/*{data.typeId==2?data.receiverAddr:data.senderAddress}*/}
          {data.typeId==2?
            <a href={`http://uri.amap.com/marker?position=${data.endLongitude},${data.endLatitude}`}>
              <img style={{width: 25, height: 25}} src="/1.png" alt=""/>
              {data.receiverAddr}
            </a>:
            <a href={`http://uri.amap.com/marker?position=${data.cusLongitude},${data.cusLatitude}`}>
              <img style={{width: 25, height: 25}} src="/1.png" alt=""/>
              {data.senderAddress}
            </a>
          }
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
      {
        data.typeId==3?null:data.typeId==2?
        <Flex>
          购货地址：
          <a href={`http://uri.amap.com/marker?position=${data.endLongitude},${data.endLatitude}`}>
            <img style={{width: 25, height: 25}} src="/1.png" alt=""/>
            {data.senderAddress}
          </a>
        </Flex>:
        <Flex>
          收货地址：
          <a href={`http://uri.amap.com/marker?position=${data.endLongitude},${data.endLatitude}`}>
            <img style={{width: 25, height: 25}} src="/1.png" alt=""/>
            {data.receiverAddr}
          </a>
          {/*<FlexItem>*/}
            {/*收货地址：{data.receiverAddr}*/}
            {/*</FlexItem>*/}
        </Flex>
      }
      {
        data.typeId==3&&
        <Flex>
          收货地址：{data.receiverAddr}
        </Flex>
      }
      <Flex>
        <FlexItem>{data.typeId==2?'代购清单':'物品类型'}：{data.goodsType}</FlexItem>
      </Flex>
      <Flex>
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
