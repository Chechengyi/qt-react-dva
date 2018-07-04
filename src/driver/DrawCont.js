import React, { Component } from 'react'
import { Flex, Switch, WingBlank, WhiteSpace, List, Modal } from 'antd-mobile'
import { connect } from 'dva'
import { throttle } from '../services/utils'
import { sendPos, offWork } from '../services/api'
import pubStyle from '../index.less'
import { routerRedux } from 'dva/router';

const alert = Modal.alert
const ListItem = List.Item
const FlexItem = Flex.Item
let AMap = Object.AMap
let geolocation = null
let mapObj = null
let timer = null

@connect( state=>({
  driver_id: state.driver_login.driver_id,
  driver_name: state.driver_login.driver_name,
  isWork: state.driver_login.isWork
}))
export default class DrawCont extends Component{

  constructor(props) {
    super(props)
    this.state = {
      loading: false
    }
  }

  componentDidMount(){
    console.log('...')
    console.log(this.props.driver_id)
    // this.noWork()
    if ( this.props.driver_id ) {
      if ( this.props.isWork ) {
        this.work()
      } else {
        this.noWork()
      }
    }
  }

  componentWillUnmount(){
    // if ( timer ) {
    //   this.noWork()
    // }
    // this.noWork()
  }

  handle_work = (e) => {
    if (e) {
      //  上班
      this.work()
      this.props.dispatch({
        type: 'driver_login/goWork',
        payload: e
      })
    } else {
      this.noWork()
    }
  }
  // 下班
  noWork = () => {
    //  发送下班请求
    offWork({
      id: this.props.driver_id
    })
      .then( res => {
        if (timer) {
          clearInterval(timer)
          // 发送下班请求
        }
        this.props.dispatch({
          type: 'driver_login/noWork',
        })
      } )
  }
  //  上班
  work = async () => {

    let self = this
    mapObj = new AMap.Map('iCenter');
    mapObj.plugin('AMap.Geolocation', function () {
      geolocation = new AMap.Geolocation({
        enableHighAccuracy: true,//是否使用高精度定位，默认:true
        timeout: 10000,          //超过10秒后停止定位，默认：无穷大
        maximumAge: 0,           //定位结果缓存0毫秒，默认：0
        convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
        showButton: true,        //显示定位按钮，默认：true
        buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
        buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
        showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
        showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
        panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
        zoomToAccuracy:true      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
      });
      mapObj.addControl(geolocation);
      geolocation.getCurrentPosition()
      AMap.event.addListener(geolocation, 'complete', throttle(self.senPos,60000, self))
      AMap.event.addListener(geolocation, 'error', (err) => {console.log(err)});      //返回定位出错信息
    });
  }
  //  获取位置
  getPost = (e) => {
    if (this.props.isWork){
      geolocation.getCurrentPosition()
    }
    console.log(e)
  }
  // 发送位置给后台
  senPos = (e) => {
    console.log('...')
    console.log(this.props.driver_id)
    if (this.props.isWork){
      geolocation.getCurrentPosition()
      console.log(e.position.lng)
      sendPos({
        id: this.props.driver_id,
        createTime: new Date(),
        latitude: e.position.lat,
        longitude: e.position.lng
      })
        .then( res=>{

        })
    } else {
      console.log('已经下班了')
    }
  }

  render () {
    return <div  style={{width: '100%', position: 'absolute',
      top: 0, bottom: 0, zIndex: 55 }}>
      <WhiteSpace />
      <div className={pubStyle.onePxBor} style={{padding: '10px 0'}} >
        <WingBlank>
          <Flex style={{width: '100%'}} >
            <FlexItem style={{fontSize: '1.2em'}} >{this.props.driver_name}</FlexItem>
            <FlexItem>
              <span>{this.props.isWork?'下班':'上班'}</span>&nbsp;&nbsp;
              <Switch checked={this.props.isWork} onChange={ this.handle_work } />
            </FlexItem>
          </Flex>
        </WingBlank>
      </div>
      <div style={{backgroundColor: 'rgb(236, 236, 237)'}} >
        <List style={{marginTop: 20}} >
          <ListItem
            thumb="/money.png"
            arrow="horizontal"
            onClick={() => this.props.dispatch(routerRedux.push('/driverElseCont/money')) }
          >
            账户余额
          </ListItem>
          <ListItem
            thumb="/tongji.png"
            arrow="horizontal"
            onClick={() =>this.props.dispatch(routerRedux.push('/driverElseCont/done'))}
          >
            送单统计
          </ListItem>
        </List>
      </div>
      <Flex  align='center' style={{height:44,position: 'absolute',bottom:0,width:'100%'}} >
        <div style={{width: '30%'}} ></div>
        <div style={{width: '60%'}} >
          <a href='/#/driverCont/updatePsw' >修改密码</a>
          <a onClick={ ()=> {
            alert('退出登录','确定吗？',[
              {

                text: '取消', onPress: ()=>{}
              },
              {
                text: '确定', onPress: ()=>{
                  // 退出登录 下班
                  this.noWork()
                  this.props.dispatch({
                    type: 'driver_login/logout',
                    payload: {
                      sign: 'cou'
                    }
                  })
                }
              }
            ])
          } } style={{marginLeft: 15}} >退出登录</a>
        </div>
      </Flex>
    </div>
  }
}
