import React, { Component } from 'react'
import { NavBar, Icon, List, Button, InputItem,
  WhiteSpace, WingBlank, Modal, Picker } from 'antd-mobile'
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
  value: state.pickerAddress.value
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
    let address = this.refs.address.value   //用户填写的详细地址
    let {tel, receiverName} = this.props.form.getFieldsValue()  // 用户填写的电话和寄件人姓名
    // 无论是哪类型的订单， 下面的信息不能少
    if ( Object.keys(this.props.startPoint).length==0 ||!tel||!receiverName||/^[\s]*$/.test(this.refs.address.value)  ) {
      this.renderModal('请将信息完善后在提交')
      return
    }
    if (!this.state.adminId) {
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
    // 设置下单地点的详细地址
    console.log(this.refs.address.value)
    this.props.dispatch({
      type: 'orderAddress/startAddress',
      payload: this.refs.address.value
    })
    this.props.history.push(`/cont/byOrder/${this.orderType}`)

    if ( this.typeId==1 ) {  // 同城急送
      this.props.history.push('/cont/byOrder/tongcheng')
    }
  }

  onPickerChange= async (e)=>{
    console.log(e)
    this.setState({
      value: e
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
    console.log(e)
    this.setState({
      value: e
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
          value={this.state.value}
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
          {...getFieldProps('tel')}
          defaultValue={this.props.startMsg.tel}
          type='phone' >联系电话</InputItem>
        <InputItem
          placeholder='请输入姓名'
          {...getFieldProps('receiverName')}
          defaultValue={this.props.startMsg.receiverName}
        >姓名</InputItem>
      </List>
      <WingBlank>
        <div>详细地址：</div>
        <textarea
          defaultValue={this.props.startAddress||' '}
          ref='address'
          style={{width: '100%'}} rows="3">
        </textarea>
      </WingBlank>
      <WhiteSpace />
      <WingBlank>
        <Button onClick={ this.submit } type='primary'>确定</Button>
      </WingBlank>
    </div>
  }
}

