import React, { PureComponent } from 'react';

var gloabalMap = null
var AMap = Object.AMap
var map = null
var ws = null
var maker = null
let SockJs = null  // sockJs
let stompClient = null  // stomp

export default class Position extends PureComponent {

  constructor (props) {
    super(props)
    this.state = {
      place: null
    }
  }

  componentDidMount () {
    var self = this

    //   27.70846  107.05683
    AMap = Object.AMap
    map = new AMap.Map(this.refs.map, {
      resizeEnable: true,
      zoom:14,
      center: ["107.05683","27.70846"]
    });
    AMap.plugin(['AMap.ToolBar','AMap.Scale','AMap.OverView'],
      function(){
        map.addControl(new AMap.ToolBar());

        map.addControl(new AMap.Scale());

        map.addControl(new AMap.OverView({isOpen:true}));
    });
    gloabalMap = map
    // AMap.getAddress()
    // 根据经纬度获得地址
    AMap.service('AMap.Geocoder',function(){//回调函数
      //实例化Geocoder
      var geocoder = new AMap.Geocoder({
        city: "010"//城市，默认：“全国”
      });
      geocoder.getAddress(["107.05683","27.70846"], function(status, result) {
        if (status === 'complete' && result.info === 'OK') {
          //获得了有效的地址信息:
          //即，result.regeocode.formattedAddress
          self.setState({
            place: result.regeocode.formattedAddress
          })
        }else{
          //获取地址失败
        }
      })
    })
    new AMap.Marker({
      position: ["107.05683","27.70846"],
      icon: '/place.png',
      title: '客户',
      // animation: 'AMAP_ANIMATION_BOUNCE',
      map: map
    })

  }

  handle_socket = () => {
    var self = this
    // ws = new WebSocket('ws://localhost:3000')
    // ws.onmessage = function(evt) {
    //   // evt.data
    //   self.drawMarker(evt.data.split(','))
    // };
    SockJs = new Object.SockJs('/ws')
    stompClient = Object.Stomp.over(SockJs)
    stompClient.connect({}, (frame) => {
      console.log('Connected: ' + frame);
      stompClient.subscribe('/topic/greetings',(greeting) => {
        // showMsg(JSON.parse(greeting.body).content);
        console.log(JSON.parse(greeting.body))
      })
    }, (err) => {
      // 连接错误
      console.log(err)
    });
  }

  drawMarker = (arr) => {
    maker = new AMap.Marker({
      position: arr,
      icon: '/1.png',
      title: '司机'
    })
    maker.setMap(map)
    if ( maker ) {
      maker.moveTo(arr,300)
    } else {
      maker = new AMap.Marker({
        position: arr,
        icon: '/1.png',
        title: '司机'
      })
    }
  }

  closeWs = () => {
    if ( !ws ) {
      ws.close()
      // ws.onclose = function (etv) {
      //   console.log(etv)
      // }
      ws = null
    }
  }

  render () {
    return <div style={{backgroundColor: '#fff', padding: 20}} >
        {this.state.place&&<div>客户地址：{this.state.place}</div>}
        <div>
          <button onClick={this.handle_socket} >查看附近司机————</button>
          <button onClick={this.closeWs} >关闭连接</button>
        </div>
        <div ref='map' id='map' style={{width:'80%', height: 400}} >

        </div>
    </div>
  }
}
