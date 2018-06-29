import React, { Component } from 'react'
import { List, Rate, Button, Icon, message, Popconfirm } from 'antd'
import { adminSendArbitration } from '../../services/api'

const ListItem = List.Item

export default class OrderRate_Item extends Component{

  state = {
    isHidden: false
  }

  renderTitle = (data)=>{
    return (
      <div style={{display: 'flex'}} >
        <div>订单编号： {data.ono}</div>
        <div style={{marginLeft: 20}} >
          <span>
            <Rate disabled value={data.starLevel} ></Rate> {data.starLevel} 星
        </span>
        </div>
      </div>
    )
  }

  onClick =id=> {
    adminSendArbitration({
      id
    })
      .then( res=>{
        if (res.status=='OK') {
          this.setState({
            isHidden: true
          })
          console.log(res)
          message.success('发起仲裁成功！', 1)
        }
      })
  }

  render(){
    const {data} = this.props
    return (
      <ListItem
        style={{display: this.state.isHidden?'none':''}}
        extra={
          <Popconfirm
            title='确认发起仲裁？'
            onConfirm={ ()=>this.onClick(data.id) }
          >
            <Button type='primary' >发起仲裁</Button>
          </Popconfirm>
        }
      >
        <List.Item.Meta
          title={this.renderTitle(data)}
          description={<div>用户评价：{data.text||'无'}</div>}
        />
        <div>
          <div>快递员：{data.couUsername}
            <span style={{marginLeft: 10, color: '#ff6700'}} ><Icon type="phone" />{data.couTel}</span>
          </div>
          <div>客户：{data.cusUsername}
            <span style={{marginLeft: 10, color: '#ff6700'}} ><Icon type="phone" />{data.couTel}</span>
          </div>
        </div>
      </ListItem>
    )
  }
}
