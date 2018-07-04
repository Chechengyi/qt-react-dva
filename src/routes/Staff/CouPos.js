import React, { PureComponent } from 'react';
import { Select, Spin, message, Modal, Button } from 'antd'
import { connect } from 'dva'
import { getCourierPos, dealerDistributeOrder } from '../../services/api'
import { promise_ } from '../../services/utils'


const Option = Select.Option
let AMap = Object.map  // 地图对象
let gloabalMap = null  // 全局地图实例
// let circle = null      // 圆

@connect( state=>({
  data: state.courierPos.data
}) )
export default class Map extends PureComponent {

  constructor(props){
    super(props)
    this.state = {
      loading: false,
      count: 0
    }
    this.markers = {}
    // this.id = this.props.match.params.id
    // this.lnt = this.props.match.params.location.split(',')[0]
    // this.lat = this.props.match.params.location.split(',')[1]
  }
  // 获取快递员位置信息请求
  getPosition = async e=>{
    this.setState({
      loading: true
    })
    const res = await getCourierPos()
    // 先验证返回的res是否为对象
    if (Object.prototype.toString.call(res.data).indexOf('Object')>-1) {
      this.setState({
        count: Object.keys(res.data).length
      })
    }
    if (res.data) {
      Object.keys(res.data).forEach( item => {
        this.drawMarker(res.data[item].id, res.data[item].longitude, res.data[item].latitude, res.data[item].username, res.data[item].tel)
      })
      let markerArr = Object.keys(this.markers).map( item=>{
        return this.markers[item]
      } )
      gloabalMap.add(markerArr)
    }
    this.setState({
      loading: false
    })
  }
  // 绘制地图点
  drawMarker = (courierId, lnt, lat, username, tel) => {
    // var marker = new AMap.Marker({
    //   position: new AMap.LngLat(116.39, 39.9),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
    //   title: '北京'    new AMap.LngLat(lnt, lat)
    // });
    let Dom = document.createElement('div')
    Dom.style.cssText=' background-color: rgba(255,255,255,0.8); padding: 5px;'
    Dom.innerHTML = `
      <img src="/1.png" /> ${username}
    `
    this.markers[courierId] = new AMap.Marker({
      position: new AMap.LngLat(lnt, lat),
      icon: '/1.png',
      content: Dom,
      title: username,
      clickable: true,
      autoRotation: true,  // 路径。方向发生改变是自动转向
      // draggable: true,   //标记是否可拖拽
      // label: {
      //   content: username,
      //   offset: (0,100)
      // },
      extData: {
        courierId,
        username,
        tel
      }
    }).on('click', this.handleMarkerClick)
  }

  componentDidMount () {
    //   27.70846  107.05683
    let self = this
    AMap = Object.AMap
    gloabalMap = new AMap.Map(this.refs.map, {
      resizeEnable: true,
      center: [107.05683, 27.70846],
      zoom: 12
    })
    AMap.plugin(['AMap.ToolBar','AMap.Scale','AMap.OverView'],
      function(){
        gloabalMap.addControl(new AMap.ToolBar());

        gloabalMap.addControl(new AMap.Scale());

        gloabalMap.addControl(new AMap.OverView({isOpen:true}));
      });
    this.getPosition()
  }

  render () {
    return <div>
      <div style={{
        height: 50,
        paddingLeft: 10,
        display: 'flex',
        alignItems: 'center'
      }} >
        {/*<div><a onClick={ () => { this.props.history.goBack() }} >返回</a></div>*/}
        <div>
          {/*<Button onClick={this.getPosition} >刷新</Button>*/}
          <Button
            //onClick={ ()=>this.props.history.replace('/admin/cont/people/couPos') }
            onClick={this.getPosition}
            >
            刷新
          </Button>
        </div>
        <div style={{marginLeft: 10}} >
          当前上班人数：{this.state.count} 人
        </div>
      </div>
      <Spin spinning={this.state.loading} size='large' tip='正在加载快递员位置'  >
        <div ref='map' id='map' style={{
          width: '100%',
          height: document.body.clientHeight || document.documentElement.clientHeight - 50,
        }} >

        </div>
      </Spin>
    </div>
  }
}
