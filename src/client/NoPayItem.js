import React, { Component } from 'react'
import { Flex } from 'antd-mobile'

const FlexItem = Flex.Item

export default class NoPayItem extends Component {

  renderOrderType =id=> {
    for ( var i=0; i<this.props.orderType.length; i++ ) {
      if (id==this.props.orderType[i].id) {
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

  render(){
    const {data, orderType} = this.props
    return <div style={{padding: '20px 10px', backgroundColor: '#fff', marginBottom: 5}} >
      <Flex wrap='wrap' style={{marginBottom: 5, fontSize: '1.1em', fontWeight:500}} >
        <FlexItem style={{flex: 'auto'}} >
            订单编号： {data.ono}
        </FlexItem>
        <FlexItem style={{flex: 'auto'}} >
          {this.renderOrderType(data.typeId)}
        </FlexItem>
      </Flex>
      {/*<Flex>*/}
        {/*<FlexItem>快递员姓名：{data.couName}</FlexItem>*/}
        {/*<FlexItem>电话：<a href={`tel:${data.couTel}`}>{data.couTel}</a></FlexItem>*/}
      {/*</Flex>*/}
      <div>
        <div>快递员姓名： {data.couName}</div>
        <div>联系电话：
          <a href={`tel:${data.couTel}`}>
            <img src="/tel.png" style={{width: 30, height: 30}} alt=""/>
            {data.couTel}</a>
        </div>
      </div>
      <div>
        <a onClick={ e=>this.gotoMsg(data.adminId, data.adminUsername) } >
          <img style={{width: 25, height: 25}} src="/wechat.png" alt=""/> 与管理员聊天
        </a>
      </div>
      <div>
        订单预算费用：{data.fee} 元
      </div>
      {data.typeId==2&&
      <div>商品垫付费用：{data.couPay} 元</div>
      }
      <div>订单实际费用：<span style={{color:'#ff6700', fontSize: '1.1em'}} >{data.actualFee} 元</span></div>
      <div style={{textAlign: 'center', marginTop: 10}} >
        <button
          style={{padding: '3px 30px', border: 'none',
                  backgroundColor: '#ff6700', color: '#fff'
          }} >
          确认付款</button>
      </div>
    </div>
  }
}
