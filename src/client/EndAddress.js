import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { NavBar, Icon, List, InputItem, Picker,
  Button, WhiteSpace, WingBlank, Modal, TextareaItem
} from 'antd-mobile'
import { createForm } from 'rc-form'


const ListItem = List.Item

@createForm()
@connect( state=>({
  endPoint: state.orderAddress.endPoint,
  endMsg: state.orderAddress.endMsg,
  endAddress: state.orderAddress.endAddress,
  provinceList: state.orderAddress.provinceList,
      provinceCode: state.orderAddress.provinceCode
}) )
export default class EndAddress extends PureComponent {

  constructor(props){
    super(props)
    this.typeId = window.sessionStorage.getItem('typeId')
    this.title = this.typeId==2?'购货地址':'收货地址'
  }

  renderModal( title='', content='', text='确认', onPress=()=>{} ){
    Modal.alert(title, content, [{
      text, onPress
    }])
  }

  componentDidMount(){
    if ( this.typeId==3&&this.props.provinceList.length===0 ) {
      this.props.dispatch({
        type: 'orderAddress/getProvinceList'
      })
    }
  }

  submit=()=>{
    let {tel, receiverName, address} = this.props.form.getFieldsValue()
    if ( this.typeId==1 || this.typeId==3 ) { // 同城急送订单 快递物流订单
      // 物流订单必须选择省code 验证
      if (!this.props.provinceCode &&this.typeId==3 ) {
        this.renderModal('目的地的省归属地不能为空！')
        return
      }
      // 同城寄送参数验证目标地点经纬度不能为空
      if (this.type==1&&Object.keys(this.props.endPoint).length==0) {
        this.renderModal('请将信息完善后在提交')
      }
      // 快递物流与同城急送都适用的参数验证规则
      if ( !tel||!receiverName || !address ) {
        this.renderModal('请将信息完善后在提交')
        return
      }
      if (/^[\s]*$/.test(receiverName)) {
        this.renderModal('姓名信息不能为空白')
        return
      }
      if (/^[\s]*$/.test(address)) {
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
        payload: address
      })
    }
    if(this.typeId==2){
      // 代购服务的提交终点信息
      if (Object.keys(this.props.endPoint).length==0) {
        this.renderModal('请选择代购的地点后在提交')
        return
      }
    }
    this.handleBack()
  }

  toTeltype= tel=> {
    let index = 2
    let telArr = tel.split('')
    let endTel = ''
    for ( var i=0; i<telArr.length; i++ ) {
      if ( i==3 || i==7 ) {
        endTel += ' '+telArr[i]
      } else {
        endTel += telArr[i]
      }
    }
    return endTel
  }

  handleBack= e=> {
    if (this.typeId==1) {  // 同城急送
      this.props.history.push('/cont/byOrder/tongcheng')
    } else if (this.typeId==2) {
      this.props.history.push('/cont/byOrder/daigou')
    } else if (this.typeId==3) {
      this.props.history.push('/cont/byOrder/wuliu')
    }
  }

  onPickerChange= e=> {
    this.props.dispatch({
      type: 'orderAddress/setProvinceCode',
      payload: e[0]
    })
  }

  render(){
    const { getFieldProps } = this.props.form
    return <div>
      <NavBar
        icon={ <Icon type='left' /> }
        onLeftClick={ e=>this.handleBack() }
      >{this.title}</NavBar>
      {
        this.typeId!=3&&
        <List renderHeader={ ()=>`选择${this.title}` } >
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
      }
      {
        this.typeId==2?null:
          <List renderHeader={ ()=>'完善收货人基本信息' } >
            <InputItem
              {...getFieldProps('tel', {
                initialValue: this.props.endMsg.tel
              })}
              type='phone'
            >
              联系电话
            </InputItem>
            <InputItem
              {...getFieldProps('receiverName', {
                initialValue: this.props.endMsg.receiverName
              })}
            >
              姓名
            </InputItem>
            {this.typeId==3&&
            <Picker
              onPickerChange={ this.onPickerChange }
              cols={1}
              value={[this.props.provinceCode]}
              data={this.props.provinceList} >
              <ListItem>省归属地</ListItem>
            </Picker>
            }
            <TextareaItem
              {...getFieldProps('address', {
                initialValue: this.props.endAddress
              })}
              rows={3}
              count={50}
              title='详细地址' />
          </List>
      }
      <WhiteSpace />
      <WingBlank>
        <Button onClick={ this.submit } type='primary'>确定</Button>
      </WingBlank>
    </div>
  }
}
