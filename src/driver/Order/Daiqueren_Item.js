import React, { Component } from 'react'
import { Flex } from 'antd-mobile'

const FlexItem = Flex.Item
export default class Daiqueren_Item extends Component {

  renderOrderType =id=> {
    for ( var i=0; i<this.props.orderType.length; i++ ) {
      if (id==this.props.orderType[i].id) {
        return this.props.orderType[i].type
      }
    }
  }

  renderLink= data=> {
    return <a href={`http://uri.amap.com/marker?position=${data.cusLongitude},${data.cusLatitude}`}>
      <img style={{width: 25, height: 25}} src="/1.png" alt=""/> 导航到{data.typeId==2?'购物':'客户'}处
    </a>
  }

  linkConfirm= data=> {
    this.props.history.push({
      pathname: '/driverElseCont/confirmOrder',
      params: {
        ...data,
        orderType: this.renderOrderType(data.typeId),
        typeId: data.typeId
      }
    })
  }

  render(){
    const {data} = this.props
    return (
      <div style={{backgroundColor: '#fff', padding: 5, marginBottom: 5}} >
        <div>
          订单编号：{data.ono}
        </div>
        <div>
          订单类型：{this.renderOrderType(data.typeId)}
        </div>
        <Flex>
          <Flex.Item>客户姓名：{data.senderName}</Flex.Item>
          <Flex.Item>
            <a href={`tel:${data.senderTel}`}><img
              style={{width: 25, height: 25}}
              src="/tel.png" alt=""/>{data.senderTel}</a>
          </Flex.Item>
        </Flex>
        <div>
          {data.typeId!=2&&
            <span>寄件地点: {data.senderAddress}</span>
          }
          {
            data.typeId==2&&
              <span>收件地点：{data.receiverAddr}</span>
          }
        </div>
        {data.typeId!=2&&
        <Flex>
          <Flex.Item>
            收件人：{data.receiverName}
          </Flex.Item>
          <Flex.Item>
            <a href={`tel:${data.receiverTel}`}><img
              style={{width: 25, height: 25}}
              src="/tel.png" alt=""/>{data.receiverTel}</a>
          </Flex.Item>
        </Flex>
        }
        <div>
          {data.typeId==2?'购物清单':'物品类型'}：  {data.goodsType}
        </div>
        {data.typeId!=2&&
        <div>
          备注：{data.comment}
        </div>
        }
        <div style={{textAlign: 'center'}} >
          <a href={`http://uri.amap.com/marker?position=${data.cusLongitude},${data.cusLatitude}`}>
            <img style={{width: 25, height: 25}} src="/1.png" alt=""/>
            {data.typeId==2?'导航到购物处':
              '导航到客户处(上门取件)'
            }
          </a>
        </div>
        <div style={{textAlign: 'center', padding: 5}} >
          <span onClick={ ()=>this.linkConfirm(data) } style={{color: 'green', textDecoration: 'underline'}} >
            到达{data.typeId==2?'购物':'客户'}处，开始核对信息</span>
        </div>
      </div>
    )
  }
}
