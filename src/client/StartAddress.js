import React, { PureComponent } from 'react'
import { NavBar, Icon, List, Button, InputItem,
  WhiteSpace, WingBlank, Modal } from 'antd-mobile'
import AddressPicker from './AddressPicker'
import { getProvince } from '../services/api'
import { promise_ } from '../services/utils'
import { connect } from 'dva'
import { createForm } from 'rc-form'

@connect( state=>({
  startPoint: state.orderAddress.startPoint,
  startMsg: state.orderAddress.startMsg
}) )
@createForm()
export default class StartAddress extends PureComponent {

  constructor(props){
    super(props)
    this.orderType = window.sessionStorage.getItem('orderType')
    this.state = {
      pickerData: [
        [{
          value: 1,
          label: '贵州',
          code: 520000
        }],
        [{
          value: 1,
          label: '遵义',
          code: 33344
        }]
      ],
      value: []
    }
  }

  componentDidMount(){
    this.getData('all')
  }

  getData= async (type, code) =>{
    if (type==='all'){
      const res = await promise_(getProvince)
      let arr = []
      for ( var i=0; i<res.data.length; i++ ) {
        arr.push({
          value: res.data[i].code,
          label: res.data[i].name,
          code: res.data[i].code
        })
      }
      let nextData=[...this.state.pickerData]
      nextData[0]=arr
      this.setState({
        pickerData: nextData
      })
    } else if ( type==='province' ) {
      const res = await promise_(getProvinceDealers, {code})
      console.log(res)
    }
  }

  submit=()=>{
    let {tel, receiverName} = this.props.form.getFieldsValue()
    if ( Object.keys(this.props.startPoint).length==0 ||!tel||!receiverName ) {
      Modal.alert('请将信息完善后在提交', '', [{
        text: '确认', onPress: ()=>{}
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
      type: 'orderAddress/setStartMsg',
      payload: {
        tel,
        receiverName
      }
    })
    this.props.history.push(`/cont/byOrder/${this.orderType}`)
  }

  render(){
    const { getFieldProps } = this.props.form
    return <div>
      <NavBar
        icon={<Icon type='left' ></Icon>}
        onLeftClick={ e=>this.props.history.push(`/cont/byOrder/${this.orderType}`) }
      >
        起始位置(快递员上门位置)
      </NavBar>
      <List renderHeader={ ()=>'第一步：选择地理行政区域' } >
      <AddressPicker
        cascade={false}
        onChange={ this.onChange }
        title='选择最近服务区'
        data={this.state.pickerData}
        children={ ()=>'选择最近服务区' }
        onPickerChange={ this.onPickerChange }
        value={this.state.value}
      />
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
          type='phone' >联系电话</InputItem>
        <InputItem
          placeholder='请输入姓名'
          defaultValue={this.props.startMsg.receiverName}
          {...getFieldProps('receiverName')}
        >姓名</InputItem>
      </List>
      <WhiteSpace />
      <WingBlank>
        <Button onClick={ this.submit } type='primary'>确定</Button>
      </WingBlank>
    </div>
  }
}
