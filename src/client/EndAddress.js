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
    this.typeId = window.sessionStorage.getItem('typeId')
    this.title = this.orderType==2?'购货地址':'收货地址'
  }

  renderModal( title='', content='', text='确认', onPress=()=>{} ){
    Modal.alert(title, content, [{
      text, onPress
    }])
  }

  submit=()=>{
    if ( this.typeId==1 ) {
      let {tel, receiverName} = this.props.form.getFieldsValue()
      if (Object.keys(this.props.endPoint).length==0 ||!tel||!receiverName) {
        this.renderModal('请将信息完善后在提交')
        return
      }
      if (/^[\s]*$/.test(receiverName)) {
        this.renderModal('姓名信息不能为空白')
        return
      }
      if (/^[\s]*$/.test(this.refs.address.value)) {
        this.renderModal('收货地址不能为空白')
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
      this.props.dispatch({
        type: 'orderAddress/endAddress',
        payload: this.refs.address.value
      })
      this.props.history.push('/cont/byOrder/tongcheng')
    }
    if(this.orderType==2){
      // 代购服务的提交终点信息
      this.props.history.push(`/cont/byOrder/${this.orderType}`)
    }
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
      <WingBlank>
        <div style={{margin: '7px 0'}} >详细地址：</div>
        <textarea style={{width: '100%', borderRadius: 0,
                          border: '1px solid #d9d9d9'
        }} rows="3" ref='address' ></textarea>
      </WingBlank>
      <WhiteSpace />
      <WingBlank>
        <Button onClick={ this.submit } type='primary'>确定</Button>
      </WingBlank>
    </div>
  }
}
