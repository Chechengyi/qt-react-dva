import React, { Component } from 'react'
import { NavBar, Icon, List, Button, InputItem,
  WhiteSpace, WingBlank, Modal, Picker, TextareaItem, Flex } from 'antd-mobile'
import { connect } from 'dva'
import { createForm } from 'rc-form'

const ListItem = List.Item

@connect( state=>({
  startPoint: state.orderAddress.startPoint,
  startMsg: state.orderAddress.startMsg,
  provinceData: state.pickerAddress.provinceData,
  startAddress: state.orderAddress.startAddress,
  value: state.pickerAddress.value,
  client_name: state.client_login.client_name,
  client_tel: state.client_login.client_tel,
  adminId: state.orderAddress.adminId,
  address: state.pickerAddress,
  chooseAddress: state.orderAddress.chooseAddress
}))
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

  componentWillUnmount(){
    this.props.dispatch({
      type: 'orderAddress/setChooseAddress',
      payload: null
    })
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
    let {tel, receiverName, address, province} = this.props.form.getFieldsValue()  // 用户填写的电话和寄件人姓名
    tel = tel.replace(/\s+/g,"")
    // 无论是哪类型的订单， 下面的信息不能少
    if ( Object.keys(this.props.startPoint).length==0 ||!tel||!receiverName ) {  // ||!tel||!receiverName
      this.renderModal('请将信息完善后在提交')
      return
    }
    // 设置下单地点的详细地址， 代购订单里就是收获地址， 此字段不能为空
    if (/^[\s]*$/.test(address) || !address || /^[\s]*$/.test(province) || !province ) {
      if (this.typeId==2) {
        this.renderModal('收货地址信息不能为空')
      } else {
        this.renderModal('寄货地址信息不能为空')
      }
      return
    }
    if (!this.props.adminId) {
      this.renderModal('选择区域不能为空', '请选择后在提交')
      return
    }
    this.props.dispatch({
      type: 'orderAddress/setStartMsg',
      payload: {
        tel,
        receiverName
      }
    })
    // 设置下单地点的详细地址， 代购订单里就是收获地址， 此字段不能为空
    this.props.dispatch({
      type: 'orderAddress/startAddress',
      payload: address
    })
    this.props.dispatch({
      type: 'orderAddress/setProvinceAddr',
      payload: province
    })
    // 跳回下单的页面
    this.handleLink()
  }

  // 保存选择的省市区街道
  saveAdress= e=> {
    //  type: pickerAddress/setSelectAddress
    let province = e[0]
    let city = e[1]
    let district = e[2]
    let street = e[3]
    let obj = {}
    if (province) {
      obj['province'] = province.split(',')[2]
    }
    if (city) {
      obj['city'] = city.split(',')[2]
    }
    if (district) {
      obj['district'] = district.split(',')[2]
    }
    if (street) {
      obj['street'] = street.split(',')[2]
    }
    console.log(obj)
    this.props.dispatch({
      type: 'pickerAddress/setSelectAddress',
      payload: obj
    })
  }

  onPickerChange= async (e)=>{
    this.setState({
      value: e
    })
    this.saveAdress(e)
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
    this.saveAdress(e)
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

  linkChooseAddress =()=> {
    this.props.history.push('/cont/myAdress/1')
    this.saveMsg()
  }

  saveMsg =()=> {
    let {tel, receiverName} = this.props.form.getFieldsValue()  // 用户填写的电话和寄件人姓名
    this.props.dispatch({
      type: 'orderAddress/setStartMsg',
      payload: {
        tel,
        receiverName
      }
    })
  }

  handleGoBack = () => {
    Modal.alert('是否保存填写的信息', '', [{
      text: '取消', onPress: ()=> {this.handleLink()}
    }, {
      text: '保存', onPress: ()=>{ this.submit() }
    }])
  }

  render(){
    const { getFieldProps } = this.props.form
    const {address} = this.props
    return <div>
      <NavBar
        icon={<Icon type='left' ></Icon>}
        //onLeftClick={ this.handleLink }
        onLeftClick={this.handleGoBack}
      >
        {this.typeId==2?'收件地址':'发货地址(快递员上门)'}
      </NavBar>
      <List>
        <InputItem
          placeholder='请输入姓名'
          {...getFieldProps('receiverName', {
            initialValue: this.props.startMsg.receiverName||this.props.client_name
          })}
        ><span style={{color: '#e38466'}} >{this.typeId==2?'收件人':'发件人'}</span></InputItem>
        <InputItem
          placeholder='请输入联系电话'
          {...getFieldProps('tel', {
            //initialValue: this.toTeltype(this.props.startMsg.tel||this.props.client_tel)
            initialValue: this.props.startMsg.tel||this.props.client_tel
          })}
          type='phone' ><span style={{color: '#e38466'}} >{this.typeId==2?'收件电话':'发件电话'}</span>
        </InputItem>
        <Picker
          ref='picker'
          cols={4}
          data={this.props.provinceData}
          onPickerChange={ this.onPickerChange }
          onChange={ this.onChange }

          value={this.props.value}
        >
          <List.Item arrow='horizontal' ><span style={{color: '#e38466'}} >选择城市</span></List.Item>
        </Picker>
        <ListItem
          onClick={ ()=>this.props.history.push('/cont/chooseLocation/start') }
          extra='去选择'
          arrow='horizontal'
        >
          <span style={{color: '#e38466'}} >地图定位</span>
          <List.Item.Brief>
            {this.props.startPoint.address}
            {this.props.startPoint.name}
          </List.Item.Brief>
        </ListItem>
        <div style={{display: 'none'}} >
          <TextareaItem
            {...getFieldProps('province', {
              initialValue: `${address.province?address.province:''}${address.city?address.city:''}${address.district?address.district:''}${address.street?address.street:''}`
            })}
            rows={2}
            title='省/市/区'
          />
        </div>
        {/*<ListItem*/}
          {/*//extra={`${address.province?address.province:''}${address.city?address.city:''}${address.district?address.district:''}${address.street?address.street:''}`}*/}
        {/*>*/}
           {/*<span style={{color: '#e38466', marginRight: 10}} >省/市/区</span>*/}
           {/*<span>*/}
             {/*{`${address.province?address.province:''}${address.city?address.city:''}${address.district?address.district:''}${address.street?address.street:''}`}*/}
           {/*</span>*/}
        {/*</ListItem>*/}
        <TextareaItem
          {...getFieldProps('address', {
            initialValue: this.props.chooseAddress||this.props.startAddress
          })}
          extra='去选择'
          rows={3}
          // placeholder='详细地址'
          placeholder={this.typeId==2?'收货地址':'详细地址'}
          title={<span style={{color: '#e38466'}} >{this.typeId==2?'收货地址':'详细地址'}</span>}
        />
      </List>
       <Flex justify='center' style={{padding: 20}} >
         <a onClick={this.linkChooseAddress} >我的常用地址</a>
       </Flex>
      <WhiteSpace />
      <WingBlank>
        <Button onClick={ this.submit } type='primary'>确定</Button>
      </WingBlank>
    </div>
  }
}

