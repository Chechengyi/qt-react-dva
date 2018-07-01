import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { NavBar, Icon, List, Radio,
  Modal, InputItem, Button,
  WingBlank, WhiteSpace, Toast, ActivityIndicator
} from 'antd-mobile'
import { AnimateNumber } from '../services/utils'
import { createForm } from 'rc-form';
import { driverTixian } from '../services/api'

const ListItem = List.Item
const RadioItem = Radio.RadioItem
const alert = Modal.alert
@connect(state=>({
  driver_id: state.driver_login.driver_id,
  moneyAccount: state.driver_login.moneyAccount,
  loading: state.driver_login.loading,
  cash: state.driver_login.cash
}))
@createForm()
export default class Money extends PureComponent {
  constructor(props){
    super(props)
    this.state={
      num: 0,
      aaccountType: 'alipay',
      modalVisible: false,
      loading: false, // 提现申请的等待状态
    }
  }
  componentDidMount(){
    // 如果没有登录， 不能进入此页

    // 发送获取快递员提现账户的 action
     this.props.dispatch({
       type: 'driver_login/getMoneyAccount',
       payload: {
        id: this.props.driver_id
        //  id: 8
       }
     })
  }
  // 提现账户选中的回调函数
  handleRadioChoose=(e)=>{
    this.setState({
      aaccountType: e.target.name
    })
  }
  // 渲染用户提现方式的函数
  renderMoneyAccountList=()=>{
    return <List renderHeader={() => '选择提现账户'} >
      {Object.keys(this.props.moneyAccount).map( item=>(
        this.props.moneyAccount[item]?<div key={item} >{item==='wxpay'||item==='alipay'?<RadioItem
          key={item}
          name={item}
          checked={this.state.aaccountType===item}
          onChange={this.handleRadioChoose}
          thumb={<img style={{width:30,height:30}} src={item==='wxpay'?'/wechat.png':'/apy.png'} />}
        >{this.props.moneyAccount[item]}</RadioItem>:null}</div>:null
      ) )}
    </List>
  }
  // 点击申请提现按钮
  clickTixian=()=>{
    if (!this.props.moneyAccount['wxpay']&&!this.props.moneyAccount['alipay']){
      alert('没有提现账户','先去添加提现账户',[{
        text: '取消', onPress: ()=>{}
      },{
        text:'确认', onPress: (e)=>{
          // console.log(e)
          this.props.history.push('/driverElseCont/account')
        }
      }])
      return
    }
    this.setState({
      modalVisible: true
    })
  }
  // 处理提现函数
  tixian=()=>{
    // 还在等待提现申请响应，不能执行此函数
    if (this.state.loading){
      return
    }
    const {money} = this.props.form.getFieldsValue()
    if (!money) {
      Toast.fail('提现金额不能为空！', 1)
      return
    }
    if (money>this.props.cash) {
      Toast.fail('提现金额超出总金额', 1)
      return
    }
    // console.log(this.state.aaccountType)
    // return
    alert(<div>
      <div>提现金额{money}元</div>
      <div>提现账户为{this.state.aaccountType==='wxpay'?'微信':'支付宝'}</div>
    </div>,<div>确定提现？</div>,[{
      text:'取消', onPress: ()=>{},
    },{
      text:'确定', onPress: ()=>{
        this.setState({
          loading: true
        })
        // 发起提现的请求
        driverTixian({
          couId: this.props.driver_id,
          putCash: money,
          // putAccount: this.state.aaccountType
          accountSign: this.state.aaccountType
        })
          .then(res=>{
            // this.props.history.replace('/driverElseCont/money')
            this.props.form.resetFields('money')
            this.setState({
              loading: false
            })
            if(res.status==='OK'){
              alert('提现申请成功','待管理员处理',[{
                text:'确认', onPress: ()=>{
                  this.props.history.replace('/driverElseCont/money')
                }
              }])
            }else{
              alert('提现申请失败','请重新尝试',[{
                text:'确认', onPress: ()=>{
                  this.setState({
                    modalVisible: false
                  })
                }
              }])
            }
          })
          .catch( res=>{  // 服务器响应失败
            this.setState({
              loading: false
            })
            alert('提现错误','请与管理员联系',[{
              text:'确认', onPress: ()=>{
                this.props.history.replace('/driverElseCont/money')
              }
            }])
          })
      }
    }])
  }
  render(){
    const { getFieldProps } = this.props.form
    return <div>
      <Modal
        popup
        visible={this.state.modalVisible}
        animationType="slide-up"
        onClose={()=>{
          this.setState({modalVisible: false})
          this.props.form.resetFields('money')
        }}
      >
        <div style={{padding: '30px 0'}} >
          <List style={{marginBottom: 0}} >
            <InputItem
              {...getFieldProps('money', {
                normalize: (v, prev) => {  //验证金额
                  if (v && !/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(v)) {
                    if (v === '.') {
                      return '0.';
                    }
                    return prev;
                  }
                  return v;
                },
              })}
              placeholder='请输入提现金额'>提现金额</InputItem>
          </List>
          {this.renderMoneyAccountList()}
          <WhiteSpace size='lg' />
          <WingBlank>
            <Button loading={this.state.loading} type='primary' onClick={this.tixian} >确认提现</Button>
          </WingBlank>
        </div>
      </Modal>
      <NavBar
        icon={<Icon type="left" />}
        onLeftClick={()=>this.props.history.goBack()}
      >账户余额</NavBar>
      <div style={{
        height: 180, backgroundColor: '#108ee9',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        flexDirection: 'column'
      }} >
        <div style={{width: 129, height: 63, display: 'flex', justifyContent: 'center',alignItems:'center'}} >
          {this.props.loading?<ActivityIndicator animating={this.props.loading} />:
            <span style={{fontSize: '3em', color: '#fff'}} >{this.props.cash}</span>}
        </div>
        <div style={{
          width: 100, borderRadius: 3,
          textAlign: 'center', marginTop: 35,
          padding: '5px 0',
          backgroundColor: '#fff'
        }} onClick={this.clickTixian} ><span>申请提现</span></div>
      </div>
      <div style={{backgroundColor: '#f7f7f7'}} >
         <List renderHeader={ ()=>'我的' } >
           <ListItem
             arrow="horizontal"
             onClick={ ()=>{this.props.history.push('/driverElseCont/account')} }
           >账户管理</ListItem>
           <ListItem
             arrow="horizontal"
             onClick={ ()=>this.props.history.push('/driverElseCont/moneyRecord') }
           >提现记录</ListItem>
           <ListItem
             arrow="horizontal"
             onClick={ ()=>this.props.history.push('/driverElseCont/moneyCount') }
           >我的收益</ListItem>
         </List>
      </div>
    </div>
  }
}
