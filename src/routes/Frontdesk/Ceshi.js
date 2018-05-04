import React, { PureComponent } from 'react';
// import WebSocket from 'ws'

var globalMap = null
// var AMap = null
var wsServer = null
var maker = null

export default class Ceshi extends PureComponent {

  componentDidMount () {
    var AMap = Object.AMap
    var map = new AMap.Map(this.refs.map, {
      resizeEnable: true,
      zoom:11,
      center: [116.397428, 39.90923]
    });
    AMap.plugin(['AMap.ToolBar','AMap.Scale','AMap.OverView'],
      function(){
        map.addControl(new AMap.ToolBar());

        map.addControl(new AMap.Scale());

        map.addControl(new AMap.OverView({isOpen:true}));
      });
    map.on('click', function (e) {
      console.log(e)
    })
    globalMap = map
  }

  getDriverPlace = () => {
    var self = this
    wsServer = new WebSocket('ws://localhost:3000')
    wsServer.onmessage = function (msg) {
      self.drawMaker(msg.data.split(','))
    }
  }

  drawMaker = (arr) => {
    // setPosition(lnglat:LngLat)
    console.log(arr)
      //["27.644754", "106.8937"]
    new AMap.Marker({
      position: [arr[0], arr[1]],
      title: '当前位置',
      // content: 'here',
      // animation: 'AMAP_ANIMATION_DROP',
      map: globalMap
    })
    // if (maker) {
    //   maker = new AMap.Marker({
    //     position: [107.0613, 27.72651],
    //     title: '司机位置',
    //     map: globalMap
    //   })
    // } else {
    //   maker.setPosition([107.0613, 27.72651])
    // }
  }

  close = () => {
    wsServer.onclose = () => {
      console.log('关闭连接')
    }
  }

  handleClick = () => {
    var AMap = Object.AMap
    var mapObj = new AMap.Map('iCenter');
    mapObj.plugin(["AMap.Geolocation"],function(){    //添加浏览器定位服务插件
      var geolocation = new AMap.Geolocation({
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
      geolocation.getCurrentPosition( function (data) {
      } );
      AMap.event.addListener(geolocation, 'complete', function (data) {
        console.log(data)
        globalMap.setCenter([data.position.lng,data.position.lat]);
        globalMap.setZoom(23)
        // var m_ = new AMap.Marker({
        //   // position: [data.position.lng,data.position.lat],
        //   position: ['107.0613','27.72651'],
        //   title: '当前位置',
        //   // content: 'here',
        //   animation: 'AMAP_ANIMATION_DROP',
        //   map: globalMap
        // })
        // m_.on('click', function (e) {
        //   console.log(e)
        // })
      });//返回定位信息
      AMap.event.addListener(geolocation, 'error', function (err) {
        console.log(err)
      });      //返回定位出错信息
    });
  }

  render () {
    return <div style={{backgroundColor: '#fff'}} >
        测试
      <button onClick={this.handleClick} onTouchStart={this.handleClick} > 点击定位 </button>
      <button onClick={this.getDriverPlace} >获取快递员位置</button>
      <button onClick={this.close} >关闭连接</button>
      <div ref='map' tabIndex="0" style={{width:500, height: 400}} >

      </div>
      <a href="http://uri.amap.com/marker?position=116.473195,39.993253">高德导航</a>
      <button>发送数据</button>
    </div>
  }
}
