import React, { Component } from 'react'
import { Flex, Modal, Toast } from 'antd-mobile'
import { courierAddDone } from '../../services/api'

const FlexItem = Flex.Item

export default class Peisongzhong_Item extends Component {

  constructor(props){
    super(props)
    this.state = {
      isDone: false
    }
  }

  renderOrderType = id => {
    for (var i = 0; i < this.props.orderType.length; i++) {
      if (id == this.props.orderType[i].id) {
        return this.props.orderType[i].type
      }
    }
  }

  // 根据订单类型的不同， 渲染不同的地址信息
  renderPlace= (typeId, data)=> {
    if (typeId!=2) {
      return <div>
        <Flex>
          <FlexItem>收货人姓名：{data.receiverName}</FlexItem>
          <FlexItem>电话: {data.receiverTel}</FlexItem>
        </Flex>
        <Flex style={{padding: 3}} >
          收货地址:
          <a href={`http://uri.amap.com/marker?position=${data.endLongitude},${data.endLatitude}`}>
            <img src="/1.png"/>
            {data.receiverAddr}
          </a>
        </Flex>
      </div>
    } else {
      return <Flex>
        <Flex>
          <FlexItem>购货人姓名：{data.senderName}</FlexItem>
          <FlexItem>电话: {data.senderTel}</FlexItem>
        </Flex>
        <Flex style={{padding: 3}} >
          收货地址:
          <a href={`http://uri.amap.com/marker?position=${data.cusLongitude},${data.cusLatitude}`}>
            <img src="/1.png"/>
            {data.receiverAddr}
          </a>
        </Flex>
      </Flex>
    }

  }

  done= id=> {
    Modal.alert('确认送达订单？', '', [{
      text: '取消', onPress: ()=> {}
    }, {
      text: '确定', onPress: ()=> {
        courierAddDone({
          id
        })
          .then( res=>{
            if (res.status==='OK') {
              Toast.success('确认成功', 1)
              this.setState({
                isDone: true
              })
            } else {
              Toast.fail('确认失败，请重新尝试' ,1)
            }

          })
          .catch( res=> {
            Toast.fail('服务器发生错误，请重新尝试', 1)
          } )
    }
    }])
  }

  render() {
    const {data} = this.props
    if (this.state.isDone) {
      return null
    }
    return <div style={{
      padding: '10px 7px', margin: '8px 10px', borderRadius: 3,
      backgroundColor: '#fff'
    }}>
      <Flex warp='wrap' style={{marginBottom: 3}}>
        <FlexItem style={{flex: 8}}>
          <span style={{fontSize: '1.1em', fontWeight: 500}}>订单编号: {data.ono}</span>
        </FlexItem>
        <FlexItem style={{flex: 5, textAlign: 'right'}}>
          <span style={{fontSize: '1.1em', fontWeight: 500}}>{this.renderOrderType(data.typeId)}</span>
        </FlexItem>
      </Flex>
      {this.renderPlace(data.typeId, data)}
      <Flex justify='center'>
        <button onClick={ ()=>this.done(data.id) } style={buttonStyle} >确认送达订单</button>
      </Flex>
    </div>
  }
}

const buttonStyle = {
  borderRadius: 3,
  marginTop: 10,
  backgroundColor: '#fff',
  border: 'none',
  backgroundColor: '#ff6700',
  color: '#fff',
  padding: '3px 13px'
}
