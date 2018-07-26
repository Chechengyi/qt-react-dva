import React, { PureComponent } from 'react';
import { Select, Spin, message, Modal } from 'antd'
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
      loading: false
    }
    this.markers = {}
    this.id = this.props.match.params.id
    this.lnt = this.props.match.params.location.split(',')[0]
    this.lat = this.props.match.params.location.split(',')[1]
  }
  // 获取快递员位置信息请求
  getPosition = async e=>{
    this.setState({
      loading: true
    })
    const res = await getCourierPos()
    console.log(res)
    if (res.data) {
      Object.keys(res.data).forEach( item => {
        this.drawMarker(res.data[item].id, res.data[item].longitude, res.data[item].latitude, res.data[item].username, res.data[item].tel)
      })
      let markerArr = Object.keys(this.markers).map( item=>{
        return this.markers[item]
      } )
      // console.log(markerArr)
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

  handleMarkerClick = e=> {
    console.log(e.target.F.extData)
    Modal.confirm({
      title: `确认将订单分配给快递员  ${e.target.F.extData.username}?`,
      content: '',
      onOk: ()=>{
        dealerDistributeOrder({
          id: this.id,
          couId: e.target.F.extData.courierId
        })
          .then( res=>{
            if (res.status==='OK'){
              message.success('订单分配成功！', 1, ()=>{
                this.props.history.goBack()
              } )
            } else {
              message.error(`快递员${e.target.F.extData.username}下班了，请分配给其他人`, 0,8)
              this.props.history.replace(this.props.match.url)
            }
          } )
      }
    })
  }

  componentDidMount () {
    //   27.70846  107.05683
    console.log(this)

    let self = this
    AMap = Object.AMap
    gloabalMap = new AMap.Map(this.refs.map, {
      resizeEnable: true,
      center: [this.lnt,this.lat],
      zoom: 15
    })
    AMap.plugin(['AMap.ToolBar','AMap.Scale','AMap.OverView'],
      function(){
        gloabalMap.addControl(new AMap.ToolBar());

        gloabalMap.addControl(new AMap.Scale());

        gloabalMap.addControl(new AMap.OverView({isOpen:true}));
      });
    new AMap.Marker({
      position: [this.lnt,this.lat],
      icon: '/place.png',
      title: '客户',
      // animation: 'AMAP_ANIMATION_BOUNCE',
      map: gloabalMap
    })
    // 绘制圆  绘制的时候默认圆的半径为1公里
    this.changeR = this.drawRound()
    this.changeR(1000)
    // 获取快递员经纬度
    this.getPosition()
  }

  //  显示圆范围   r 为圆的半径
  drawRound = (r) => {
    let circle = circle = new AMap.Circle({
      center: new AMap.LngLat(this.lnt,this.lat),// 圆心位置
      // radius: r, //半径 /m
      // strokeColor: "#FF33FF", //线颜色
      // strokeOpacity: 0.2, //线透明度
      // strokeWeight: 3,    //线宽
      // fillColor: "#1791fc", //填充色
      // fillOpacity: 0.05//填充透明度
      strokeColor: "#4196ff", //线颜色
      strokeOpacity: .4, //线透明度
      strokeWeight: 2,    //线宽
      fillColor: "#4196ff", //填充色
      fillOpacity: 0.05//填充透明度
    });
    circle.setMap(gloabalMap);//显示圆圈
    return (r) => {
      circle.setRadius(r)
      gloabalMap.setFitView();//根据地图上添加的覆盖物分布情况，自动缩放地图到合适的视野级别
    }
  }


  // 快递员位置撒点
  driverMaker = () => {

  }


  render () {
    return <div>
      <div style={{
        height: 50,
        paddingLeft: 10,
        display: 'flex',
        alignItems: 'center'
      }} >
        <div><a onClick={ () => { this.props.history.goBack() }} >返回</a></div>
        <div style={{marginLeft: 30}} >选择范围：</div>
        <div>
          <Select defaultValue={1000} onChange={ (e) => {
            this.changeR(e)
          } } >
            <Option key={1000} value={1000} >1000米</Option>
            <Option key={2000} value={1500} >2000米</Option>
            <Option key={3000} value={2000} >3000米</Option>
          </Select>
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
