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
import Radio from '../../components/Radio/Index'

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
  provinceAddr: state.orderAddress.provinceAddr
}))
@createForm()
export default class ByOrderTongcheng extends Component {

  constructor(props){
    super(props)
    this.typeId = 1
    this.AMap = Object.AMap
    this.state = {
      ExpectedFee: null,
      feeLoading: false,
      loading: false,
      radio: true
    }
  }

  componentDidMount(){
    let {orderType} = this.props
    // 保存当前订单的提成比例， 供后续订单下单请求时发送给后端
    if ( orderType.length!==0 ) {
      for ( var i=0 ;i<orderType.length; i++ ) {
        if ( orderType[i].id==1 ) {
          window.sessionStorage.setItem('feeRate', orderType[i].feeRate)
          this.feeRate = orderType[i].feeRate
        }
      }
    }
    window.sessionStorage.setItem('typeId', this.typeId)
    // 每次进入此页面，调用算距离功能函数
    this.getDistance()
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

  submit=async ()=> {
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
    // 从sessionStorage里取出当前订单的提价比例
    let {weight, goodsType, comment} = this.props.form.getFieldsValue()
    const {startPoint, endPoint, startMsg, endMsg, client_id, adminId, endAddress, startAddress, provinceAddr} = this.props

    // 检验商品信息是否完善
    // if ( !weight || !goodsType ) {
    //   Modal.alert('请先完善要寄物品信息', '信息不完善不能提交订单', [{
    //     text: '确定', onPress: ()=> {}
    //   }])
    //   return
    // }

    if ( !weight ) {
      Modal.alert('请先完善要寄物品信息', '信息不完善不能提交订单', [{
        text: '确定', onPress: ()=> {}
      }])
      return
    }

    //  检验地址信息是否完善
    if (objIsNull.call(startPoint) ||  // 起点经纬度是否为空
        objIsNull.call(endPoint) || // 终点经纬度是否为空
        objIsNull.call(startMsg) ||  // 起点寄件人信息是否为空
        objIsNull.call(endMsg)    // 终点收件人信息是否为空
        ) {
      Modal.alert('请先完善订单信息', '订单信息不完善不能提交订单！',[{
        text: '确定', onPress: ()=>{}
      }])
      return
    }

    // 下单之前再次发请求计算订单预算费用
    let fee = await this.sendGetExpectedFee()

    // 下单之前先弹出窗口询问是否确定提交订单， 也检验在订单预算费用出来之后才提交订单
    Modal.alert(`订单预算费用为 ${fee.toFixed(2)}元`,'确认提交订单？', [{
      text: '取消', onPress: ()=> false
    }, {
      text: '确认', onPress: () => {
        let posData = {
          adminId: parseInt(adminId),
          cusId: client_id,
          typeId: this.typeId,
          feeRate: this.feeRate,
          weight: parseFloat(weight),
          distance: this.distance,  // 具体以后估算的为准
          receiverName: endMsg.receiverName,
          receiverTel: endMsg.tel,
          receiverAddr: endAddress,
          senderName: startMsg.receiverName,
          senderTel: startMsg.tel,
          senderAddress: `${provinceAddr}${startAddress}`,
          // Cou_pay: startAddress,
          cusLongitude: startPoint.lnt,
          cusLatitude: startPoint.lat,
          endLongitude: endPoint.lnt,
          endLatitude: endPoint.lat,
          goodsType: goodsType?goodsType:'空',
          fee: fee,
          comment
        }
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
  // 获取起点与终点之间的距离，用于核算运费
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
    // this.sendGetExpectedFee()
  }
  // 发送获取估算运费请求
  sendGetExpectedFee = async e=> {
    // 首先判断 物品距离，重量等信息是否为空 不为空才能发送请求
    const {weight} = this.props.form.getFieldsValue()

    if ( !weight||!this.distance ) return false
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

  handleChange =(e)=> {
    this.setState({
      radio: e
    })
  }

  render () {
    const { getFieldProps } = this.props.form
    return <div>
      <NavBar
        onLeftClick={ ()=>{ this.props.history.push('/cont/index') } }
        icon={<Icon type='left' ></Icon>}
      >同城配送</NavBar>
      <div>
        <List renderHeader={ ()=>'位置信息(必填)' } >
          <ListItem
            //thumb={<img style={{width: 30, height: 30}} src="/qidian.png" alt=""/>}
            thumb={<Logo bgColor='#67a1f4' title='寄' />}
            arrow="horizontal"
            onClick={ e=>this.props.history.push('/cont/startAddress') }
          >寄件地址
            <Brief>
              {Object.keys(this.props.startPoint).length!==0&&
              Object.keys(this.props.startMsg).length!==0?'已填':'去完善'}
            </Brief>
          </ListItem>
          <ListItem
            //thumb={<img style={{width: 30, height: 30}} src="/zhongdian.png" alt=""/>}
            thumb={<Logo bgColor='#eb6487' title='收' />}
            arrow="horizontal"
            onClick={ e=>this.props.history.push('/cont/endAddress') }
          >收件地址
            <Brief>
              {Object.keys(this.props.endPoint).length!==0&&
              Object.keys(this.props.endMsg).length!==0?'已填':'去完善'}
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
            // onBlur={ this.sendGetExpectedFee }
            extra='公斤'
            placeholder='输入物品的大概重量(必填)'
          >物品重量</InputItem>
          <InputItem
            {...getFieldProps('goodsType')}
            placeholder='选填'
          >商品类型</InputItem>
          <TextareaItem
            {...getFieldProps('comment')}
            title='备注'
            rows={3}
            count={50}
            placeholder=' 选填'
          />
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

const radio = {
  padding: '2.5px',
  border: '1px solid #ccc',
  borderRadius: '50%',
  marginRight: '5px',
}
