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

  renderOrderPlace = (typeId, data)=> {
    if ( typeId==2 ) { // 代购订单
      return <div>
        <Flex align='center' >
          购货地点：
          <a href={`http://uri.amap.com/marker?position=${data.cusLongitude},${data.cusLatitude}`}>
            <img style={{width: 25, height: 25}} src="/1.png" alt=""/>
            {data.senderAddress}
          </a>
        </Flex>
      </div>
    } else {   // 物流订单
       return <div>
         <Flex align='center' >
           取货地点：
           <a href={`http://uri.amap.com/marker?position=${data.endLongitude},${data.endLatitude}`}>
             <img style={{width: 25, height: 25}} src="/1.png" alt=""/>
             {data.senderAddress}
           </a>
         </Flex>
       </div>
    }
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
    if ( data.typeId==2 ) { //代购服务
      return <div style={{padding: '10px 7px', marginBottom: 8, backgroundColor: '#fff7f4'}} >
        <Flex warp='wrap' >
          <FlexItem style={{fontSize: '1.1em', fontWeight: 500,
            flex: 7}} >
            订单编号: {data.ono}
          </FlexItem>
          <FlexItem style={{fontSize: '1.1em', fontWeight: 500,
            flex: 4, textAlign: 'right', paddingRight: 15}} >
            {this.renderOrderType(data.typeId)}
          </FlexItem>
        </Flex>
        <Flex>
          <FlexItem>
            客户姓名：{data.receiverName}
          </FlexItem>
          <FlexItem>
            电话: {data.receiverTel}
          </FlexItem>
        </Flex>
        <Flex>
          下单时间：{new Date(data.createTime).toLocaleString()}
        </Flex>
        {this.renderOrderPlace(data.typeId, data)}
        <Flex style={{justifyContent: 'center', marginTop: 10}} >
          <span onClick={ ()=>this.linkConfirm(data) } style={{color: 'green', textDecoration: 'underline'}} >
            到达购物处，开始核对信息</span>
        </Flex>
      </div>
    } else { // 物流类订单
      return <div style={{padding: '10px 7px', marginBottom: 8, backgroundColor: '#fff7f4'}} >
        <Flex warp='wrap' >
          <FlexItem style={{fontSize: '1.1em', fontWeight: 500, flex: 7}} >
            订单编号: {data.ono}
          </FlexItem>
          <FlexItem style={{fontSize: '1.1em',
            fontWeight: 500, textAlign: 'right', flex: 4, paddingRight: 15}} >
            {this.renderOrderType(data.typeId)}
          </FlexItem>
        </Flex>
        <Flex>
          <FlexItem>
            客户姓名：{data.senderName}
          </FlexItem>
          <FlexItem>
            电话: {data.senderTel}
          </FlexItem>
        </Flex>
        <Flex>
          下单时间：{new Date(data.createTime).toLocaleString()}
        </Flex>
        {this.renderOrderPlace(data.typeId, data)}
        <Flex style={{justifyContent: 'center', marginTop: 10}} >
          <span onClick={ ()=>this.linkConfirm(data) } style={{color: 'green', textDecoration: 'underline'}} >
            到达客户处，开始核对信息</span>
        </Flex>
      </div>
    }
  }
}
