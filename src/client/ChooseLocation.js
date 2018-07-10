import React, { PureComponent } from 'react'
import { Modal, NavBar, Toast } from 'antd-mobile'
import { connect } from 'dva'

let mapObj = null
@connect()
export default class ChooseLocation extends PureComponent {

  constructor(props){
    super(props)
    this.state = {
      lat: 27.70846,
      lnt: 107.05683,
      zoom: 15,
      loading: true
    }
  }

  componentDidMount(){
    console.log(window)
    console.log(window.parent)
    let self = this
    // this.getPos()
    // Toast.loading('正在定位您的位置...', 5)
    // 因是单页web结构，所以判断是否监听过选址事件，如果监听过就不在重复监听
    if ( !window.isStartLs ) {
      window.isStartLs = true
      window.top.addEventListener("message", function(e){
        console.log(e)
        // 判断这个message事件是否是当前页面触发的，如果是其他页面触发则不执行函数
        if (e.target.location.hash==='#/cont/chooseLocation/start') {
          self.sendPos(e.data)
        }
      }, false);
      //  绘制选址组件
    }
    this.drawMap()
  }

  componentWillUnmount(){
    Toast.hide()
  }

  handleBack=e=>{
    if(this.props.match.params.type==='start'){
      this.props.history.push('/cont/startAddress')
    } else {
      this.props.history.push('/cont/endAddress')
    }
  }

  // 获取用户当前的位置
  getPos=()=>{
    let self = this
    mapObj = new AMap.Map('iCenter');
    mapObj.plugin('AMap.Geolocation', function () {
      let geolocation = new AMap.Geolocation({
        enableHighAccuracy: true,//是否使用高精度定位，默认:true
        timeout: 2000,          //超过10秒后停止定位，默认：无穷大
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
      geolocation.getCurrentPosition();
      AMap.event.addListener(geolocation, 'complete', (e)=>{
        Toast.hide()
        self.setState({
          lat: e.position.P,
          lnt: e.position.O,
          zoom: 15
        })
        self.drawMap()
      });//返回定位信息
      AMap.event.addListener(geolocation, 'error', (err)=>{
        Toast.hide()
        Modal.alert('或许您禁用了定位,或定位出错了', '请打开手机设置允许定位')
        self.drawMap()
      });      //返回定位出错信息
    });
  }

  // 绘制选址组件
  drawMap=()=>{
    let self = this;
    (function(){
      window.start_iframe = document.getElementById('start').contentWindow;
      document.getElementById('start').onload = function(){
        window.start_iframe.postMessage('hello','https://m.amap.com/picker/');
      };
    })()
  }

  // 选址组件选择后调用
  sendPos=e=>{
    let pos = e.location.split(',')
    this.props.dispatch({
      type: 'orderAddress/setStartPos',
      payload: {
        name: e.name,
        address: e.address,
        lnt: pos[0],
        lat: pos[1]
      }
    })
    this.handleBack()
  }

  render(){
    return <div onTouchMove={e=>e.preventDefault()} >
      <NavBar>
        <div onClick={ this.handleBack } >返回地址填写页面</div>
      </NavBar>
      <iframe
        id='start'
        //src={`https://m.amap.com/picker/?keywords=写字楼,小区,学校&zoom=${this.state.zoom}&center=${this.state.lnt},${this.state.lat}&radius=1000&total=20&key=b807bced59e4c8d89a323ae23159e562`}
        src={`https://m.amap.com/picker/?keywords=写字楼,小区,学校&zoom=${this.state.zoom}&radius=1000&total=20&key=b807bced59e4c8d89a323ae23159e562`}
        style={{width: '100%',
                height: document.documentElement.clientHeight-44
        }} frameBorder="0">
      </iframe>
    </div>
  }
}
