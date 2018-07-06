import React, { PureComponent } from 'react';
import { Select, Spin, message, Modal, Button } from 'antd'
import { connect } from 'dva'
import { getCourierPos, dealerDistributeOrder } from '../../services/api'
import { promise_ } from '../../services/utils'


const Option = Select.Option
let AMap = Object.map  // 地图对象
let gloabalMap = null  // 全局地图实例

@connect( state=>({
  data: state.courierPos.data
}))
export default class Map extends PureComponent {

  constructor(props){
    super(props)
    this.state = {
      loading: false,
      count: 0
    }
    this.markers = {}
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
    this.getPos('loading')
    if (!this.timer) {
      this.timer = setInterval( this.getPos, 1000*10 )
    }
  }

  componentWillUnmount(){
    clearInterval(this.timer)
  }


  getPos = async e=> {
    if (e=='loading') {
      this.setState({
        loading: true
      })
    }
    const res = await getCourierPos()
    if (Object.prototype.toString.call(res.data).indexOf('Object')>-1) {
      this.setState({
        count: Object.keys(res.data).length
      })
    }
    if (e=='loading') {
      this.setState({
        loading: false
      })
    }
    this.aggregationMaler(res.data)
  }

  // 聚合获取到快递员位置和以经保存到快递员位置
  aggregationMaler =data=> {
    const dataKeys = Object.keys(data)
    const MakerKeys = Object.keys(this.markers)
    const keys = new Set([...dataKeys, ...MakerKeys])
    keys.forEach( key=>{
      if ( MakerKeys.indexOf(key) > -1&&dataKeys.indexOf(key) > -1 ) {
        // 这是已经存在的快递员， 需要更新位置信息
        this.updateMaker(data[key].id, data[key].longitude, data[key].latitude)
      }
      if ( MakerKeys.indexOf(key) <= -1 && dataKeys.indexOf(key)> -1  ) {
        // 这是新上班的快递员， 需要在maker里添加
        this.addMaker(data[key].id, data[key].longitude, data[key].latitude, data[key].username, data[key].tel)
      }
      if ( MakerKeys.indexOf(key) > -1 && dataKeys.indexOf(key) <= -1 ) {
        // 这是已经下班的快递员， 需要在maker里移除
        this.deleteMaker(key)
      }
    })
  }

  // 删除maker
  deleteMaker = (courierId)=> {
    this.markers[courierId].setMap(null)
    delete this.markers[courierId]
  }

  //  更新快递员的位置
  updateMaker = (courierId, lnt, lat)=> {
    let lntlat = new AMap.LngLat(lnt, lat)
    this.markers[courierId].moveTo(lntlat, 5000, function (k) {
      return k
    })
  }

  // 新添加快递员
  addMaker = (courierId, lnt, lat, username, tel) => {
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
      extData: {
        courierId,
        username,
        tel
      }
    }).on('click', this.handleMarkerClick)
    this.markers[courierId].setMap(gloabalMap)
  }

  render () {
    return <div>
      <div style={{
        height: 50,
        paddingLeft: 10,
        display: 'flex',
        alignItems: 'center'
      }} >
        {/*<div>*/}
          {/*<Button*/}
            {/*onClick={this.getPos}*/}
            {/*>*/}
            {/*刷新*/}
          {/*</Button>*/}
        {/*</div>*/}
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
