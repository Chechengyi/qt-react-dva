import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { NavBar, Icon, List, Modal, Toast } from 'antd-mobile'
import { addAccount, updateAccount } from '../services/api'

const ListItem = List.Item
const prompt = Modal.prompt;
const alert = Modal.alert

@connect(state=>({
  driver_id: state.driver_login.driver_id,
  moneyAccount: state.driver_login.moneyAccount
}))
export default class AccountManagement extends PureComponent {
  componentDidMount(){
    // 发送获取快递员提现账户的 action
    this.props.dispatch({
      type: 'driver_login/getMoneyAccount',
      payload: {
        id: this.props.driver_id
        //  id: 8
      }
    })
  }

  handleAddAccount=( type )=>{
    prompt(<div><img style={{width: 50, height: 50}} src={type==='alipay'?'/apy.png':'/wechat.png'} /></div>,
            <div>添加{type==='alipay'?'支付宝':'微信'}账号</div>,
          [{
              text: '取消', onPress: ()=>{}
          },{
              text: '确认', onPress: value => new Promise((reslove,reject)=>{
                if (value.indexOf(' ')>-1) {
                  Toast.fail('输入的账户中不能含有空格！', 1)
                  reject('error')
                } else if (!value) {
                  Toast.fail('输入账户不能为空！',1)
                  reject('error')
                } else {
                  alert('确定添加该账户？','',[{
                    text: '取消', onPress: ()=>{
                    }
                  },{
                    text: '确定', onPress: ()=>{
                      console.log({
                        id: this.props.driver_id,
                        [type]: value
                      })
                      addAccount({
                        id: this.props.driver_id,
                        [type]: value,
                        sign: type==='alipay'?'ali':'wx'
                      })
                        .then(res=>{
                          if (res.status==='OK'){
                            Toast.success('添加成功！',1)
                            this.props.history.replace('/driverElseCont/account')
                          }
                        })
                      reslove()
                    }
                  }])
                }
            })
          }]
      )
  }

  handleUpdateAccount=(type)=>{
    prompt(<div><img style={{width: 50, height: 50}} src={type==='alipay'?'/apy.png':'/wechat.png'} /></div>,
      <div>修改{type==='alipay'?'支付宝':'微信'}账号</div>,
      [{
        text: '取消', onPress: ()=>{}
      },{
        text: '确认', onPress: value => new Promise((reslove,reject)=>{
          if (value.indexOf(' ')>-1) {
            Toast.fail('输入的账户中不能含有空格！', 1)
            reject('error')
          } else {
            alert('确定修改该账户？','',[{
              text: '取消', onPress: ()=>{
              }
            },{
              text: '确定', onPress: ()=>{
                console.log({
                  id: this.props.driver_id,
                  [type]: value,
                  sign: type==='alipay'?'ali':'wx'
                })
                updateAccount({  // 对接口有疑问，
                  id: this.props.driver_id,
                  [type]: value,
                })
                  .then(res=>{
                    if(res.status==='OK'){
                      Toast.success('修改成功！',1)
                      this.props.history.replace('/driverElseCont/account')
                    }
                  })
                reslove()
              }
            }])
          }
        })
      }], 'default',this.props.moneyAccount[type]
    )
  }

  render(){
    const {moneyAccount} = this.props
    return <div>
      <NavBar
        icon={<Icon type="left" />}
        onLeftClick={()=>this.props.history.goBack()}
      >账户管理</NavBar>
      <List>
        <ListItem
          thumb={<img style={{width: 30, height: 30}} src="/apy.png" />}
          extra={moneyAccount['alipay']?<span onClick={()=>this.handleUpdateAccount('alipay')} >修改</span>:
            <a onClick={()=>this.handleAddAccount('alipay')} >添加</a>}
        >{moneyAccount['alipay']}</ListItem>
        <ListItem
          thumb={<img style={{width: 30, height: 30}} src="/wechat.png" />}
          extra={moneyAccount['wxpay']?<span onClick={()=>this.handleUpdateAccount('wxpay')} >修改</span>:
            <a onClick={()=>this.handleAddAccount('wxpay')} >添加</a>}
        >{moneyAccount['wxpay']}</ListItem>
      </List>
    </div>
  }
}
