import React, { Component } from 'react'
import { NavBar, Icon, List, InputItem, Picker, Modal, Flex, Toast,
  TextareaItem, Button, WingBlank, WhiteSpace, ActivityIndicator } from 'antd-mobile'
import { connect } from 'dva'
import { createForm } from 'rc-form'
import { objIsNull } from '../../services/utils'
import { getExpectedPrice, addOrder } from "../../services/api";
import Logo from './Logo'
import Radio from '../../components/Radio/Index'

const ListItem = List.Item
const Brief = List.Item.Brief
const FlexItem = Flex.Item

@connect( state=>({
  client_id: state.client_login.client_id,
  client_tel: state.client_login.client_tel,
  startPoint: state.orderAddress.startPoint,
  startMsg: state.orderAddress.startMsg,
  endPoint: state.orderAddress.endPoint,
  endMsg: state.orderAddress.endMsg,
  orderType: state.orderType.data,
  adminId: state.orderAddress.adminId,
  startAddress: state.orderAddress.startAddress,
  endAddress: state.orderAddress.endAddress,
  provinceAddr: state.orderAddress.provinceAddr
}) )
@createForm()
export default class ByOrderDaigou extends Component {

  constructor(props){
    super(props)
    this.typeId = 2
    this.AMap = Object.AMap
    this.state = {
      feeLoading: false,
      expectedFee: null,
      loading: false,
      radio: true
    }
  }

  componentDidMount(){
    let {orderType} = this.props
    // 保存当前订单的提成比例， 供后续订单下单请求时发送给后端
    if ( orderType.length!==0 ) {
      for ( var i=0 ;i<orderType.length; i++ ) {
        if ( orderType[i].id==this.typeId ) {
          window.sessionStorage.setItem('feeRate', orderType[i].feeRate)
        }
      }
    }
    window.sessionStorage.setItem('typeId', this.typeId)
    this.getDistance()
  }

  renderModal( title='', content='', text='确认', onPress=()=>{} ){
    Modal.alert(title, content, [{
      text, onPress
    }])
  }
  // 获取两点之间的距离
  getDistance= e=> {
    // 首先判断起点和终点经纬度是否为空
    if (objIsNull.call(this.props.startPoint) || objIsNull.call(this.props.endPoint) ){
      return
    }
    const {startPoint, endPoint} = this.props
    let start = new this.AMap.LngLat(startPoint.lnt, startPoint.lat)
    let end = new this.AMap.LngLat(endPoint.lnt, endPoint.lat)
    let distance = this.AMap.GeometryUtil.distance(start,end)
    this.distance = parseFloat((distance/1000).toFixed(2))
  }
  //
  sendGetExpectedFee= async e=> {
    // 首先判断 物品距离，重量等信息是否为空 不为空才能发送请求
    const {weight} = this.props.form.getFieldsValue()
    // 如果已经估过价， 返回， 不在继续估价
    // if (this.state.expectedFee) return
    if ( !weight||!this.distance ) return
    this.setState({
      loading: true
    })
    const fee = await getExpectedPrice({
      orderTypeId: this.typeId,
      distance: this.distance,
      weight
    })
      .then( res=> {
        this.setState({
          loading: false
        })
        this.setState({
          expectedFee: res.data.fee
        })
        return res.data.fee
      })
    return fee
  }

  /*
  * 代购订单与物流订单不同， 客户填写的终点位置即使购买商品的位置
  * */
  submit= async e=> {
    if (this.state.loading) return

    // 验证是否同意快递运单条约
    if ( !this.state.radio ) {
      Modal.alert('您不同意快递运单条约无法下单', '', [{
        text: '确认', onPress: ()=> {}
      }])
      return
    }

    if (!this.props.client_id) {
      Modal.alert('下单请先登录！','',[{
        text: '确定', onPress: ()=>{
          this.props.history.replace('/clientUser/login')
        }
      }])
      return
    }
    const { weight, goodsType, comment, couPay } = this.props.form.getFieldsValue()
    const {startPoint, endPoint, startMsg, client_id, adminId, startAddress, endAddress, provinceAddr} = this.props
    //验证商品基本信息是否为空
    if ( !weight || !couPay ) {
      this.renderModal('请先将商品信息完善')
      return
    }
    // 验证位置客户位置信息
    if ( objIsNull.call(this.props.startPoint) ||
          objIsNull.call(this.props.endPoint) ||
          objIsNull.call(this.props.startMsg)
      ) {
      this.renderModal('订单的位置信息还未完善不能下单')
      return
      }

    const fee = await this.sendGetExpectedFee()
    if (!fee) return
    Modal.alert(`订单预算费用为 ${fee.toFixed(2)}元`,'确认提交订单？', [{
      text: '取消', onPress: ()=>{}
    }, {
      text: '确认', onPress: ()=> {
        let posData = {
          adminId: parseInt(adminId),
          cusId: parseInt(client_id),
          typeId: parseInt(this.typeId),
          feeRate: parseFloat(window.sessionStorage.getItem('feeRate')),
          weight: parseFloat(weight),
          comment,   //客户填写的订单备注
          distance: this.distance,
          senderName: startMsg.receiverName,
          // senderTel: this.props.client_tel,
          senderTel: startMsg.tel,
          endLongitude: startPoint.lnt,
          endLatitude: startPoint.lat,
          receiverName: startMsg.receiverName,
          receiverTel: startMsg.receiverTel,
          cusLongitude: endPoint.lnt,
          cusLatitude: endPoint.lat,
          receiverAddr: `${provinceAddr}${startAddress}`,
          senderAddress: endAddress,
          goodsType: goodsType?goodsType:'空',
          fee: fee,
          couPay: parseFloat(couPay)
        }
        addOrder({ ...posData })
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

  handleChange =(e)=> {
    this.setState({
      radio: e
    })
  }

  render () {
    const { getFieldProps } = this.props.form
    return <div>
      <NavBar
        icon={ <Icon type='left' /> }
        onLeftClick={ ()=>{ this.props.history.push('/cont/index') } }
      >代购服务</NavBar>
      <div>
        <List renderHeader={ ()=>'位置信息(必填)' } >
          <ListItem
            thumb={<Logo bgColor='#67a1f4' title='购' />}
            arrow="horizontal"
            onClick={ e=>this.props.history.push('/cont/endAddress') }
          >代购地址
            <Brief>
              {Object.keys(this.props.endPoint).length!==0
                &&this.props.endAddress
                ?'已填':'去完善'}
            </Brief>
          </ListItem>
          <ListItem
            thumb={<Logo bgColor='#eb6487' title='收' />}
            arrow="horizontal"
            onClick={ e=>this.props.history.push('/cont/startAddress') }
          >收货地址
            <Brief>
              {Object.keys(this.props.startPoint).length!==0&&
              Object.keys(this.props.startMsg).length!==0?'已填':'去完善'}
            </Brief>
          </ListItem>
        </List>
        <List renderHeader={ ()=>'购货商品信息' } >
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
            // onBlur={ this.sendGetExpectedFee }
            extra='公斤'
            placeholder='输入物品的大概重量'
          >商品重量</InputItem>
          <InputItem
            extra='元'
            placeholder='输入要商品的预算价格'
            {...getFieldProps('couPay', {  // 垫付商品的价格
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
            // onBlur={ this.sendGetExpectedFee }
          >预算价格</InputItem>
          {/*<InputItem*/}
            {/*{...getFieldProps('goodsType')}*/}
          {/*>商品类型</InputItem>*/}
          <TextareaItem
            {...getFieldProps('goodsType')}
            title='代购清单'  placeholder='需要购买的商品(选填)'
            rows={3}
            count={100}
          />
          {/*<InputItem*/}
            {/*{...getFieldProps('comment')}*/}
          {/*>*/}
            {/*备注*/}
          {/*</InputItem>*/}
        </List>
        <Flex style={{padding: 10}} justify='center' >
          <Radio
            onChange={this.handleChange}
            checked={this.state.radio}
            title={ ()=><div>同意 <a href="/#/cont/tiaoyue">《快递运单契约条款》</a></div> }
          />
        </Flex>
        {/*{ this.state.expectedFee&&*/}
        {/*<WingBlank>*/}
          {/*{this.state.feeLoading?*/}
            {/*<Flex justify='center' style={{marginTop: 15}} >*/}
              {/*<ActivityIndicator animating={this.state.feeLoading} />*/}
            {/*</Flex>:*/}
            {/*<div>*/}
              {/*<div style={{color: '#888', marginTop: 13}} >订单预算费用</div>*/}
              {/*<div style={{textAlign: 'center', padding: '5px'}} >*/}
                {/*<span>{this.state.expectedFee.toFixed(2)} 元</span>*/}
              {/*</div>*/}
            {/*</div>*/}
          {/*}*/}
        {/*</WingBlank>*/}
        {/*}*/}
        <WhiteSpace />
        <WingBlank>
          <Button loading={this.state.loading} onClick={ this.submit } type='primary' >提交订单</Button>
        </WingBlank>
      </div>
    </div>
  }

}
