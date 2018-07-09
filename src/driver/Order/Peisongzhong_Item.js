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

  done= id=> {
    Modal.alert('确认送达订单？', '', [{
      text: '取消', onPress: ()=> {}
    }, {
      text: '确定', onPress: ()=> {
        courierAddDone({
          id,
          couId: this.props.driver_id
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
      <Flex>
        订单编号：{data.ono}
      </Flex>
      <Flex>
        订单类型：{this.renderOrderType(data.typeId)}
      </Flex>
      <Flex>
        <FlexItem>收件人姓名：{data.senderName}</FlexItem>
        <FlexItem>电话: {data.senderTel}</FlexItem>
        {/*<FlexItem>收件地址:{data.receiverAddr}</FlexItem>*/}
      </Flex>
      <Flex>
        收件地址：{data.receiverAddr}
      </Flex>
      <Flex justify='center' >
        <a href={`http://uri.amap.com/marker?position=${data.cusLongitude},${data.cusLatitude}`}>
          <img src="/1.png"/>
          导航到客户处
        </a>
      </Flex>
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
