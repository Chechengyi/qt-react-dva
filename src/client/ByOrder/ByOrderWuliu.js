import React, { Component } from 'react'
import { NavBar, Icon, WingBlank, WhiteSpace, Flex,
  InputItem, Modal, Toast, List, Button, ActivityIndicator, TextareaItem
} from 'antd-mobile'
import { connect } from 'dva'
import { createForm } from 'rc-form'
import orderType from "../../models/orderType";
import { objIsNull } from '../../services/utils'
import { getExpectedPrice, addOrder } from '../../services/api'
import Logo from './Logo'

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
  startAddress: state.orderAddress.startAddress,
  endAddress: state.orderAddress.endAddress,
  provinceCode: state.orderAddress.provinceCode
}) )
@createForm()
export default class ByOrderTongcheng extends Component {

  constructor(props){
    super(props)
    this.typeId = 3
    this.AMap = Object.AMap
    this.state = {
      ExpectedFee: null,
      feeLoading: false
    }
  }
  componentDidMount(){
    console.log(this.props.client_id)
    let {orderType} = this.props
    // 保存当前订单的提成比例， 供后续订单下单请求时发送给后端
    if ( orderType.length!==0 ) {
      for ( var i=0 ;i<orderType.length; i++ ) {
        if ( orderType[i].id==3 ) {
          window.sessionStorage.setItem('feeRate', orderType[i].feeRate)
        }
      }
    }
    window.sessionStorage.setItem('typeId', this.typeId)
    // 每次进入此页面，调用算距离功能函数
    // this.getDistance()
    this.sendGetExpectedFee()
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
  *  cusLongitude(取货地址经度)(this.props.startPoint.lnt),
  *  cusLatitude(取货地址纬度)(this.props.startPoint.lat)
  *  endLongitude(收货人经度) (this.props.endPoint.lnt)
  *  endLatitude(收货人纬度)(this.props.endPoint.lat)
  *  goodsType(寄货商品的类型)
  * */
  submit=()=> {
    if (!this.props.client_id) {
      Modal.alert('下单请先登录！','',[{
        text: '确定', onPress: ()=>{
           this.props.history.replace('/clientUser/login')
        }
      }])
      return
    }
    // 从sessionStorage里取出当前订单的提价比例
    const feeRate = window.sessionStorage.getItem('feeRate')
    let {weight, goodsType, comment} = this.props.form.getFieldsValue()
    const {startPoint, endPoint, startMsg, endMsg, client_id, adminId, endAddress, provinceCode, startAddress} = this.props

    // 如果订单预算费用还没有返回 直接return
    if (!this.state.expectedFee) return

    // 检验商品信息是否完善
    if ( !weight || !goodsType ) {
      Modal.alert('请先完善要寄物品嘻嘻', '订单信息不完善不能提交订单！',[{
        text: '确定', onPress: ()=>{}
      }])
       return
    }

    //  检验信息是否完善
    if (objIsNull.call(startPoint) ||  // 起点经纬度是否为空
      // objIsNull.call(endPoint) || // 终点经纬度是否为空
      objIsNull.call(startMsg) ||  // 起点寄件人信息是否为空
      objIsNull.call(endMsg)   // 终点收件人信息是否为空
      || !provinceCode
    ) {
      Modal.alert('请先完善订单信息', '订单信息不完善不能提交订单！',[{
        text: '确定', onPress: ()=>{}
      }])
    }



    Modal.alert(`订单预算费用为 ${this.state.expectedFee.toFixed(2)}元`,'确认提交订单？', [{
      text: '取消', onPress: ()=>{}
    }, {
      text: '确认', onPress: ()=>{
        let posData = {
          adminId: parseInt(adminId),
          cusId: client_id,
          typeId: this.typeId,
          feeRate: parseFloat(feeRate),
          weight: parseFloat(weight),
          //distance: this.distance,  // 具体以后估算的为准
          receiverName: endMsg.receiverName,
          receiverTel: endMsg.tel,
          receiverAddr: endAddress,
          senderName: startMsg.receiverName,
          senderTel: startMsg.tel,
          senderAddress: startAddress,
          cusLongitude: startPoint.lnt,
          cusLatitude: startPoint.lat,
          comment,
          goodsType,
          proCode: provinceCode,
          fee: this.state.expectedFee
        }
        console.log(posData)
        addOrder({...posData})
          .then( res=> {
            this.setState({
              loading: false
            })
            if (res.status==='OK') {
              Modal.alert('下单成功，快递员正在向您赶来的路上。可在订单中心查看订单详情','', [{
                text: '确认', onPress: ()=> { this.props.history.replace('/cont/index') }
              }])
            } else {
              Toast.fail('下单失败，请重新尝试', 1)
            }
          } )
          .catch( err=>{
            Modal.alert('服务器发生错误，请重新尝试','', [{
              text: '确认', onPress: ()=>{}
            }])
          } )
      }
    }])

  }

  // 发送获取估算运费请求
  sendGetExpectedFee = e=> {
    // 首先判断 物品距离，重量等信息是否为空 不为空才能发送请求
    const {weight} = this.props.form.getFieldsValue()
    // 如果省code和重量其中有一个不存在，则返回
    if (!this.props.provinceCode || !weight ) return
    this.setState({
      feeLoading: true
    })
    getExpectedPrice({
      orderTypeId: this.typeId,
      weight,
      proCode: this.props.provinceCode,
      distance: 0
    })
      .then( res=> {
        this.setState({
          feeLoading: false
        })
        this.setState({
          expectedFee: res.data.fee
        })
      })
  }

  render () {
    const { getFieldProps } = this.props.form
    return <div>
      <NavBar
        onLeftClick={ ()=>{ this.props.history.push('/cont/index') } }
        icon={<Icon type='left' ></Icon>}
      >快递物流</NavBar>
      <div>
        <List renderHeader={ ()=>'位置信息(必填)' } >
          <ListItem
            thumb={<Logo bgColor='#67a1f4' title='寄' />}
            arrow="horizontal"
            onClick={ e=>this.props.history.push('/cont/startAddress') }
          >寄件地址
            <Brief>
              {Object.keys(this.props.startPoint).length!==0&&
              Object.keys(this.props.startMsg).length!==0&&
                this.props.startAddress
                ?'已填':'去完善'}
            </Brief>
          </ListItem>
          <ListItem
            thumb={<Logo bgColor='#eb6487' title='收' />}
            arrow="horizontal"
            onClick={ e=>this.props.history.push('/cont/endAddress') }
          >收件地址
            <Brief>
              { Object.keys(this.props.endMsg).length!==0&&
                this.props.endAddress && this.props.provinceCode ?
                '已填':'去完善'}
            </Brief>
          </ListItem>
        </List>
        <List renderHeader={ ()=>'物品信息(必填)' } >
          <InputItem
            {...getFieldProps('weight', {
              normalize: (v, prev) => {  //验证金额(再次验证重量)
                if (v && !/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(v)) {
                  if (v === '.') {
                    return '0.';
                  }
                  return prev;
                }
                return v;
              },
            })}
            onBlur={ this.sendGetExpectedFee }
            extra='公斤'
            placeholder='输入物品的大概重量'
          >物品重量</InputItem>
          <InputItem
            {...getFieldProps('goodsType')}
            placeholder='电子设备/文件/...'
          >商品类型
          </InputItem>
          <TextareaItem
            {...getFieldProps('comment')}
            placeholder='可选'
            title='备注' />
        </List>
        { this.state.expectedFee&&
        <WingBlank>
          {this.state.feeLoading?
            <Flex justify='center' style={{marginTop: 15}} >
              <ActivityIndicator animating={this.state.feeLoading} />
            </Flex>:
            <div>
              <div style={{color: '#888', marginTop: 13}} >订单预算费用</div>
              <div style={{textAlign: 'center', padding: '5px'}} >
                <span>{this.state.expectedFee.toFixed(2)} 元</span>
              </div>
            </div>
          }
        </WingBlank>
        }
        <WhiteSpace />
        <WingBlank>
          <Button onClick={ this.submit } type='primary' >提交订单</Button>
        </WingBlank>
      </div>
    </div>
  }
}
