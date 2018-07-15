import React, { Component } from 'react'
import { List, message, Popconfirm } from 'antd'
import { adminAccpetCouMoney } from '../../services/api'

const ListItem = List.Item
const LissItemMeta = ListItem.Meta

export default class NoDisItem extends Component{

  constructor(props){
    super(props)
    this.state = {
      isHidden: false,
      loading: false
    }
  }

  handleClick =id=> {
    if (this.state.loading) {
      return
    }
    this.setState({
      loading: true
    })
    adminAccpetCouMoney({
      id,
      adminId: parseInt(this.props.adminId)
    })
      .then( res=>{
        this.setState({
          loading: false
        })
        if (res.status==='OK') {
          message.success('操作成功！', 0.8)
          this.setState({
            isHidden: true
          })
        }
      })
      .catch( err=>{
        this.setState({
          loading: false
        })
        message.error('服务器发生错误，请重新尝试', 1)
      })
  }

  render(){
    const {data} = this.props
    return <ListItem
      style={{display: this.state.isHidden?'none':''}}
      actions={[
        <Popconfirm
          title='确认？'
          onConfirm={ ()=>this.handleClick(data.id) }
        ><a>确认转账</a></Popconfirm>
      ]}
    >
      <List.Item.Meta
        title={<div>
          <div>申请金额：<span style={{color: '#ff6700'}} >{data.putCash}</span> 元</div>
          <div>提现方式：
            <div style={{display: 'inline-block'}} >
              {data.accountSign=='alipay'?
                <div><img style={{width: 25}} src="/apy.png" alt="apliy"/> 支付宝</div>:
                <div><img style={{width: 25}} src="/wechat.png" alt="wechat" /> 微信</div>
              }
            </div>
          <span style={{marginLeft: 20}} >账户：{data.putAccount}</span> </div>
        </div>}
        //description={`申请时间：${new Date(data.putTime).toLocaleString()}`}
        description={`申请时间：${new Date(data.putTime.substring(0, data.putTime.lastIndexOf('.'))).toLocaleString()}`}
      />
      申请人：{data.username} 电话:{data.tel}
    </ListItem>
  }
}
