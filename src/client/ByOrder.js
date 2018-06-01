import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { NavBar, Picker, List, Button,
  WingBlank, WhiteSpace, InputItem, Modal, Toast
} from 'antd-mobile'
import { createForm } from 'rc-form'
import { addOrder, getExpectedPrice } from '../services/api'

const ListItem = List.Item
const Brief = List.Item.Brief
@connect(state=>({
  client_id: state.client_login.client_id,
  orderType: state.orderType.data,
  startPoint: state.orderAddress.startPoint,
  startMsg: state.orderAddress.startMsg,
  endPoint: state.orderAddress.endPoint,
  endMsg: state.orderAddress.endMsg
}))
@createForm()
export default class ByOrder extends PureComponent {

  constructor(props){
    super(props)
    this.state = {
      expectedPrice: null
    }
    this.AMap = Object.AMap
    this.orderType=this.props.match.params.id||window.sessionStorage.getItem('orderType')
  }

  componentDidMount(){
    if (this.props.orderType.length===0) {
      this.props.dispatch({
        type: 'orderType/getData'
      })
    }
    // 将选择的订单类型保存到sessionStorage中 为了在选择起始页中始终能返回待此页面
    window.sessionStorage.setItem('orderType', this.props.match.params.id)
    // 如果订单类型是 代购服务，则进页面就先执行 getExpected 函数
    if ( this.props.match.params.id==2 ) {
      this.getExpected()
    }
  }
  /*
  * 获取订单估算价格
  * 1 判断订单类型，代购服务只需要发送终点和起点， 物流服务需要终点起点和货物重量估算价格
  * 2 判断起点和终点的经纬度是否都以填写， 填写了之后才发送估算价格
  * */
  getExpected=(e)=>{
    let startLnt = this.props.startPoint.lnt,
      starLat = this.props.startPoint.lat,
      endLnt = this.props.endPoint.lnt,
      endLat = this.props.endPoint.lat,
      distance = null    // 终点和起点之间的距离
    if ( this.orderType==2 ) {
      if (startLnt&&starLat&&endLnt&&endLat) {
        distance = this.getDistance(this.props.startPoint, this.props.endPoint)
        console.log('距离为。。。'  + distance)
        getExpectedPrice()  //参数对接在填写
          .then( res=>{
            if (res.status==='OK') {
              console.log(res)
              this.setState({
                expectedPrice: res.price
              })
            }
          } )
      }
    } else {
      let {weight} = this.props.form.getFieldsValue()
      if (startLnt&&starLat&&endLnt&&endLat&&weight) {
        distance = this.getDistance(this.props.startPoint, this.props.endPoint)
        console.log('距离为。。。'  + distance)
        getExpectedPrice()  //参数对接在填写
          .then( res=>{
            console.log(res)
            if (res.status==='OK') {
              this.setState({
                expectedPrice: res.price
              })
            }
          } )
      }
    }
  }
  // 求两点之间的距离
  getDistance = ( startPoint, endPoint )=>{
    let start = new this.AMap.LngLat(startPoint.lnt, startPoint.lat)
    let end = new this.AMap.LngLat(endPoint.lnt, endPoint.lat)
    let distance = this.AMap.GeometryUtil.distance(start,end)
    return parseFloat((distance/1000).toFixed(2))
  }
  // 发送下单请求
  sendAddOrder=(params)=>{
    addOrder({
      ...params
    })
      .then( res=>{
        if (res.status==='OK') {
          Toast.success('下单成功', 1)
        } else {
          Toast.fail('下单失败，请重新尝试', 1)
        }
      } )
      .catch( err=>{
        Toast.fail('服务器发生错误，请重新尝试', 1)
      } )
  }
  // 下单操作
  submit=()=>{
    console.log(this.props.startPoint)
    console.log(this.props.startMsg)
    if ( this.orderType==2 ) {  // 代购订单
      console.log('提交代购订单')
      if ( Object.keys(this.props.startPoint).length==0||
           Object.keys(this.props.startMsg).length==0||
           Object.keys(this.props.endPoint).length==0
      ) {
        Modal.alert('请先完善订单信息在提交')
        return
      }
      this.sendAddOrder({
        cusId: this.props.client_id,
        adminId: 5,   //经销商
        typeId: this.orderType,
        receiverName: this.props.endMsg.receiverName, //收货人姓名
        receiverTel: this.props.endMsg.tel,  //收货人电话
        cusLongitude: this.props.startPoint.lnt,  //取货地址经纬度
        cusLatitude: this.props.startPoint.lat    //取货地址经纬度
      })
    } else { // 物流订单
      let {weight} = this.props.form.getFieldsValue()
      if ( Object.keys(this.props.startPoint).length==0||
        Object.keys(this.props.startMsg).length==0 ||
        Object.keys(this.props.endPoint).length==0||
        Object.keys(this.props.endMsg).length==0 || !weight
      ) {
        Modal.alert('请先完善订单信息在提交', '', [{
          text: '确定', onPress: ()=>{}
        }])
        return
      }
      if ( weight.indexOf(' ')>-1 ) {
        Toast.fail('填写的重量参数中不能含有空格！', 1)
        return
      }
      // 发送下单请求
      this.sendAddOrder({
        cusId: this.props.client_id,
        adminId: 5,   //经销商
        typeId: this.orderType,
        receiverName: this.props.endMsg.receiverName, //收货人姓名
        receiverTel: this.props.endMsg.tel,  //收货人电话
        cusLongitude: this.props.startPoint.lnt,  //取货地址经纬度
        cusLatitude: this.props.startPoint.lat    //取货地址经纬度
      })
    }
  }

  render(){
    const { getFieldProps } = this.props.form
    return <div>
      <NavBar
        leftContent={<div onClick={e=>this.props.history.push('/cont/index')} >返回</div>}
      >
        {this.props.orderType.map( (item,i)=>(
          <div key={i} >{item.id==this.props.match.params.id?<span>{item.type}</span>:null}</div>
        ) )}
      </NavBar>
      <div>
        <List renderHeader={ ()=>'位置信息' } >
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
          {this.orderType==2?
            <ListItem
              thumb={<img style={{width: 30, height: 30}} src="/zhongdian.png" alt=""/>}
              arrow="horizontal"
              onClick={ e=>this.props.history.push('/cont/endAddress') }
            >{this.orderType==2?'购货地址填写':'收货地址填写'}
              <Brief>
                {Object.keys(this.props.endPoint).length!==0?'已填':'去完善'}
              </Brief>
            </ListItem>
            :
            <ListItem
              thumb={<img style={{width: 30, height: 30}} src="/zhongdian.png" alt=""/>}
              arrow="horizontal"
              onClick={ e=>this.props.history.push('/cont/endAddress') }
            >{this.orderType==2?'购货地址填写':'收货地址填写'}
              <Brief>
                {Object.keys(this.props.endPoint).length!==0&&
                Object.keys(this.props.endMsg).length!==0?'已填':'去完善'}
              </Brief>
            </ListItem>
          }
        </List>
        {
          this.orderType==2?null:
            <List renderHeader={()=>'物品信息'} >
              <InputItem
                onBlur={ this.getExpected }
                onChange={ e=>{
                  console.log(e)
                  clearTimeout( this.time )
                  this.time = setTimeout( ()=>{
                    this.getExpected(e)
                  }, 300 )
                } }
                {...getFieldProps('weight')}
                placeholder='输入物品的大概重量(公斤)'
                // type="digit"
              >物品重量</InputItem>
            </List>
        }
        <div  style={{padding: 20, textAlign: 'center', fontSize: '1.2em'}} >
          估算价格： {this.state.expectedPrice}元
        </div>
        <WhiteSpace />
        <WingBlank>
          <Button onClick={ this.submit } type='primary' >提交订单</Button>
        </WingBlank>
      </div>
    </div>
  }
}
