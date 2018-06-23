import React, { Component } from 'react'
import { NavBar, Icon, List, Button, InputItem,
  WhiteSpace, WingBlank, Modal, Picker, TextareaItem } from 'antd-mobile'
import AddressPicker from './AddressPicker'
import { getProvince } from '../services/api'
import { promise_ } from '../services/utils'
import { connect } from 'dva'
import { createForm } from 'rc-form'

@connect( state=>({
  startPoint: state.orderAddress.startPoint,
  startMsg: state.orderAddress.startMsg,
  provinceData: state.pickerAddress.provinceData,
  startAddress: state.orderAddress.startAddress,
  value: state.pickerAddress.value,
  client_name: state.client_login.client_name,
  client_tel: state.client_login.client_tel,
  adminId: state.orderAddress.adminId
}) )
@createForm()
export default class StartAddress extends Component {

  constructor(props){
    super(props)
    this.typeId = window.sessionStorage.getItem('typeId')
    this.state = {
      value: ['520000'],
      adminId: null
    }
  }

  handleLink=()=> {
    if ( this.typeId==1 ) {
      this.props.history.replace('/cont/byOrder/tongcheng')
    } else if (this.typeId==2) {
      this.props.history.replace('/cont/byOrder/daigou')
    } else if (this.typeId==3) {
      this.props.history.replace('/cont/byOrder/wuliu')
    }
  }

  componentDidMount(){
    if( this.props.provinceData.length===0 ){
      this.props.dispatch({
        type: 'pickerAddress/setProvinceData'
      })
    }
  }
  /*
  * 根据this.typeId(订单主键id)判断是什么类型的订单，执行不同的订单地址信息完善操作
  * 1 为同城急送  2 为代购服务 3 为快递物流
  * */
  renderModal( title='', content='', text='确认', onPress=()=>{} ){
    Modal.alert(title, content, [{
      text, onPress
    }])
  }
  submit=()=>{
    // let address = this.refs.address.value   //用户填写的详细地址
    let {tel, receiverName, address} = this.props.form.getFieldsValue()  // 用户填写的电话和寄件人姓名
    // 无论是哪类型的订单， 下面的信息不能少
    if ( Object.keys(this.props.startPoint).length==0 ||!tel||!receiverName ) {
      this.renderModal('请将信息完善后在提交')
      return
    }
    // 订单类型为快递物流时， 寄货人地址不能为空
    if (/^[\s]*$/.test(address) ) {
      this.renderModal('寄货地址信息不能为空')
      return
    }
    if (!this.props.adminId) {
      this.renderModal('选择区域不能为空', '请选择后在提交')
      return
    }
    if (/^[\s]*$/.test(receiverName)) {
      this.renderModal('姓名信息不能为空白')
      return
    }
    tel = tel.replace(/\s+/g,"")
    // 设置下单人信息(起点)的电话和姓名
    this.props.dispatch({
      type: 'orderAddress/setStartMsg',
      payload: {
        tel,
        receiverName
      }
    })
    // 设置下单地点的详细地址  快递物流订单需要这个字段
    if ( this.typeId==3 ) {
      console.log('sdasd')
      this.props.dispatch({
        type: 'orderAddress/startAddress',
        payload: address
      })
    }
    // 跳回下单的页面
    this.handleLink()
  }

  onPickerChange= async (e)=>{
    this.setState({
      value: e
    })
    this.props.dispatch({
      type: 'pickerAddress/setValue',
      payload: e
    })
    if (e.length===1) {  // 选省
      await this.props.dispatch({
        type: 'pickerAddress/setCityData',
        payload: e[0]
      })
      this.refs['picker'].forceUpdate()
      this.setAdmin(e[0])
    } else if ( e.length===2 ) {  // 选市
      this.setAdmin(e[1])
      const res = await this.props.dispatch({
        type: 'pickerAddress/setDistrictData',
        payload: e
      })
      this.refs['picker'].forceUpdate()
    } else if ( e.length===3 ) { // 选区
      this.setAdmin(e[2])
      await this.props.dispatch({
        type: 'pickerAddress/setStreetData',
        payload: e
      })
      this.refs['picker'].forceUpdate()
    } else if (e.length===4) {
      this.setAdmin(e[3])
    }
  }

  onChange=e=>{
    this.setState({
      value: e
    })
    this.props.dispatch({
      type: 'pickerAddress/setValue',
      payload: e
    })
    if (e.length===1) {
      this.setAdmin(e[0])
    } else if ( e.length===2 ) {
      this.setAdmin(e[1])
    } else if (e.length===3) {
      this.setAdmin(e[2])
    } else if (e.length===4) {
      this.setAdmin(e[3])
    }
  }

  setAdmin=e=>{
    this.setState({
      adminId: e.split(',')[1]
    })
    this.props.dispatch({
      type: 'orderAddress/setAdminId',
      payload: e.split(',')[1]
    })
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

  render(){
    const { getFieldProps } = this.props.form
    return <div>
      <NavBar
        icon={<Icon type='left' ></Icon>}
        onLeftClick={ this.handleLink }
      >
        起始位置(快递员上门位置)
      </NavBar>
      <List renderHeader={ ()=>'第一步：选择地理行政区域' } >
        <Picker
          ref='picker'
          cols={4}
          data={this.props.provinceData}
          onPickerChange={ this.onPickerChange }
          onChange={ this.onChange }
          value={this.props.value}
        >
          <List.Item>选择区域</List.Item>
        </Picker>
      </List>
      <List renderHeader={ ()=>'第二步：选择我的准确地址' } >
        <div style={{display: this.props.startPoint.address?'none':'block',
                     padding: 10, textAlign: 'center'
        }} >
          <a onClick={ ()=>this.props.history.push('/cont/chooseLocation/start') } >
            选择准确地址</a>
        </div>
        <div style={{
          padding: '10px 20px',
          display: !this.props.startPoint.address?'none':'block'
        }} >
          {this.props.startPoint.address}
          {this.props.startPoint.name}
          <div style={{textAlign: 'center', marginTop: 5}} >
            <a onClick={ ()=>this.props.history.push('/cont/chooseLocation/start')} >重新选择</a>
          </div>
        </div>
      </List>
      <List renderHeader={ ()=>'第三步：完善基本信息' } >
        <InputItem
          placeholder='请输入联系电话'
          {...getFieldProps('tel', {
            initialValue: this.toTeltype(this.props.client_tel)
          })}
          // defaultValue={this.props.startMsg.tel}
          type='phone' >联系电话</InputItem>
        <InputItem
          placeholder='请输入姓名'
          {...getFieldProps('receiverName', {
            initialValue: this.props.client_name
          })}
          defaultValue={this.props.startMsg.receiverName}
        >姓名</InputItem>
        {this.typeId==3?<TextareaItem
          {...getFieldProps('address', {
            initialValue: this.props.startAddress
          })}
          count={50}
          clear rows={3}
          title='寄件地址' />:null}
      </List>
      <WhiteSpace />
      <WingBlank>
        <Button onClick={ this.submit } type='primary'>确定</Button>
      </WingBlank>
    </div>
  }
}

