import React, { Component } from 'react'
import { NavBar, Icon, WingBlank, WhiteSpace,
  InputItem, Modal, Toast, List, Button
} from 'antd-mobile'
import { connect } from 'dva'
import { createForm } from 'rc-form'
import orderType from "../../models/orderType";
import { objIsNull } from '../../services/utils'

const ListItem = List.Item
const Brief = List.Item.Brief
@connect( state=>({
  client_id: state.client_login.client_id,
  startPoint: state.orderAddress.startPoint,
  startMsg: state.orderAddress.startMsg,
  endPoint: state.orderAddress.endPoint,
  endMsg: state.orderAddress.endMsg,
  orderType: state.orderType.data,
  adminId: state.orderAddress.adminId,
  startAddress: state.orderAddress.startAddress
}) )
@createForm()
export default class ByOrderTongcheng extends Component {

  constructor(props){
    super(props)
    this.typeId = 1
  }
  componentDidMount(){
    let {orderType} = this.props
    // 保存当前订单的提成比例， 供后续订单下单请求时发送给后端
    if ( orderType.length!==0 ) {
      for ( var i=0 ;i<orderType.length; i++ ) {
        if ( orderType[i].id==1 ) {
          window.sessionStorage.setItem('feeRate', orderType[i].feeRate||0.03)
        }
      }
    }
    window.sessionStorage.setItem('typeId', this.typeId)

  }
  /*
  *  下单之前验证参数
  *  所需参数： adminId(选择区域经销商)，cusId(客户id)，typeId(订单类型id)，
  *  feeRate(订单提成比例)，weight(客户填写的商品的估算重量)，distance(终点和起点的距离)
  *  receiverName(收货人姓名)(this.props.endMsg.receiverName)，
  *  receiverTel(收货人电话)(this.props.endMsg.tel)，
  *  receiverAddr(收货人地址)
  *  senderName(发货人姓名)(this.props.startMsg.receiverName)，
  *  senderTel(发货人电话)(this.props.startMsg.tel)，
  *  senderAddr(发货人地址)
  *  cusLongitude(取货地址经度)(this.props.startPoint.lnt),
  *  cusLatitude(取货地址纬度)(this.props.startPoint.lat)
  *  endLongitude(收货人经度) (this.props.endPoint.lnt)
  *  endLatitude(收货人纬度)(this.props.endPoint.lat)
  *  goodsType(寄货商品的类型)
  * */
  submit=()=> {
    console.log(this.props.startAddress)
    // 从sessionStorage里取出当前订单的提价比例
    const feeRate = window.sessionStorage.getItem('feeRate')
    let {weight, goodsType} = this.props.form.getFieldsValue()
    const {startPoint, endPoint, startMsg, endMsg, client_id, adminId} = this.props
    //  检验信息是否完善
    if (objIsNull.call(startPoint) ||  // 起点经纬度是否为空
        objIsNull.call(endPoint) || // 终点经纬度是否为空
        objIsNull.call(startMsg) ||  // 起点寄件人信息是否为空
        objIsNull.call(endMsg) || !weight || !goodsType    // 终点收件人信息是否为空
        ) {
      Modal.alert('请先完善订单信息', '订单信息不完善不能提交订单！',[{
        text: '确定', onPress: ()=>{}
      }])
    }
    console.log({
      adminId: parseInt(adminId),
      cusId: client_id,
      typeId: this.typeId,
      feeRate: parseFloat(feeRate),
      weight: parseFloat(weight),
      distance: 10,  // 具体以后估算的为准
      receiverName: endMsg.receiverName, receiverTel: endMsg.tel,
      receiverAddr: this.props.endAddress,
      senderName: startMsg.receiverName, senderTel: startMsg.tel,
      senderAddr: this.props.startAddress,
      cusLongitude: startPoint.lnt, cusLatitude: startPoint.lat,
      endLongitude: endPoint.lnt, endLatitude: endPoint.lat,
      goodsType
    })
  }

  render () {
    const { getFieldProps } = this.props.form
    return <div>
      <NavBar
        onLeftClick={ ()=>{ this.props.history.push('/cont/index') } }
        icon={<Icon type='left' ></Icon>}
      >同城急送</NavBar>
      <div>
        <List renderHeader={ ()=>'位置信息(必填)' } >
          <ListItem
            thumb={<img style={{width: 30, height: 30}} src="/qidian.png" alt=""/>}
            arrow="horizontal"
            onClick={ e=>this.props.history.push('/cont/startAddress') }
          >起始位置(快递员上门位置)
            <Brief>
              {Object.keys(this.props.startPoint).length!==0&&
              Object.keys(this.props.startMsg).length!==0?'已填':'去完善'}
            </Brief>
          </ListItem>
          <ListItem
            thumb={<img style={{width: 30, height: 30}} src="/zhongdian.png" alt=""/>}
            arrow="horizontal"
            onClick={ e=>this.props.history.push('/cont/endAddress') }
          >收货地址填写
            <Brief>
              {Object.keys(this.props.endPoint).length!==0&&
              Object.keys(this.props.endMsg).length!==0?'已填':'去完善'}
            </Brief>
          </ListItem>
        </List>
        <List renderHeader={ ()=>'物品信息(必填)' } >
          <InputItem
            {...getFieldProps('weight')}
            placeholder='输入物品的大概重量(公斤)'
          >物品重量</InputItem>
          <InputItem
            {...getFieldProps('goodsType')}
            placeholder='电子设备/文件/...'
          >商品类型
          </InputItem>
        </List>
        <WhiteSpace />
        <WingBlank>
          <Button onClick={ this.submit } type='primary' >提交订单</Button>
        </WingBlank>
      </div>
    </div>
  }
}
