import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { NavBar, Icon, List, InputItem,
  Button, WhiteSpace, WingBlank, Modal
} from 'antd-mobile'
import { createForm } from 'rc-form'

const ListItem = List.Item

@createForm()
@connect( state=>({
  endPoint: state.orderAddress.endPoint,
  endMsg: state.orderAddress.endMsg
}) )
export default class EndAddress extends PureComponent {

  constructor(props){
    super(props)
    this.orderType = window.sessionStorage.getItem('orderType')
    this.title = this.orderType==2?'购货地址':'收货地址'
  }

  submit=()=>{
    if(this.orderType==2){
      // 代购服务的提交终点信息
      this.props.history.push(`/cont/byOrder/${this.orderType}`)
    }else{
      // 非代购服务的提交终点信息
      let {tel, receiverName} = this.props.form.getFieldsValue()
      if (Object.keys(this.props.endPoint).length==0 ||!tel||!receiverName) {
        Modal.alert('请将信息完善后在提交', '', [{
          text: '确定', onPress: ()=>{}
        }])
        return
      }
      if (/^[\s]*$/.test(receiverName)) {
        Modal.alert('姓名信息不能为空白！', '', [{
          text: '确定', onPress: ()=>{}
        }])
        return
      }
      tel = tel.replace(/\s+/g,"")
      this.props.dispatch({
        type: 'orderAddress/setEndMsg',
        payload: {
          tel,
          receiverName
        }
      })
    }
    this.props.history.push(`/cont/byOrder/${this.orderType}`)
  }

  render(){
    const { getFieldProps } = this.props.form
    return <div>
      <NavBar
        icon={ <Icon type='left' /> }
        onLeftClick={ e=>this.props.history.push(`/cont/byOrder/${this.orderType}`) }
      >{this.title}</NavBar>
      <List renderHeader={ ()=>`第一步，选择${this.title}` } >
        <div style={{display: this.props.endPoint.address?'none':'block',
          padding: 10, textAlign: 'center'
        }} >
          <a onClick={ ()=>this.props.history.push('/cont/chooseEndLocation') } >
            选择准确地址</a>
        </div>
        <div style={{
          padding: '10px 20px',
          display: !this.props.endPoint.address?'none':'block'
        }} >
          {this.props.endPoint.address}
          {this.props.endPoint.name}
          <div style={{textAlign: 'center', marginTop: 5}} >
            <a onClick={ ()=>this.props.history.push('/cont/chooseEndLocation') } >重新选择</a>
          </div>
        </div>
      </List>
      {
        this.orderType==2?null:
          <List renderHeader={ ()=>'第二步，完善收货人基本信息' } >
            <InputItem
              {...getFieldProps('tel')}
              type='phone'
            >
              联系电话
            </InputItem>
            <InputItem
              {...getFieldProps('receiverName')}
            >
              姓名
            </InputItem>
          </List>
      }
      <WhiteSpace />
      <WingBlank>
        <Button onClick={ this.submit } type='primary'>确定</Button>
      </WingBlank>
    </div>
  }
}
