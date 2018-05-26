import React, { PureComponent } from 'react';
import { Drawer, Flex, ActivityIndicator } from 'antd-mobile'
import DrawCont from './DrawCont'
import { connect } from 'dva'
import NavBar from '../components/NavBar/Index'

let AMap = null
let mapObj = null

@connect(state=>({
  client_name: state.client_login
}))
export default class Index extends PureComponent {

  constructor(props){
    super(props)
    this.state={
      isOpen: false,
      longitude: 107.05683,
      latitude: 27.70846,
      loadMap: true
    }
  }

  componentDidMount () {
    this.props.selectedTab('index')
    AMap = Object.AMap
    // this.getPos()
    this.createMap()
  }
  /*
  *  这里有两种方案待选择，一是定位出客户的位置，展现是地图 二是只展示地图，像顺丰快递一样
  * */
  // 测试，  直接生成地图
  createMap=()=>{
    this.map = new AMap.Map(this.refs.map, {
      resizeEnable: true,
      zoom:7,
      center: [107.05683,27.70846]
    });
  }

  //获取客户定位
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
        console.log(e)
        console.log(333)
        self.drawPos({
          latitude: e.position.P,
          longitude: e.position.O
        })
        self.setState({
          loadMap: false
        })
      });//返回定位信息
      AMap.event.addListener(geolocation, 'error', (err)=>{
        self.drawPos({
          latitude: 27.70846,
          longitude: 107.05683
        })
        self.setState({
          loadMap: false
        })
      });      //返回定位出错信息
    });
  }

  //  生成地图，并在地图上画出客户的位置
  drawPos=(position)=>{
    console.log(position)
    this.map = new AMap.Map(this.refs.map, {
      resizeEnable: true,
      zoom:14,
      center: [position.longitude,position.latitude]
    });
    let marker = new AMap.Marker({
      // position: [position.longitude, position.latitude],
      map: this.map
    })
  }

  chat = (e) => {
    e.stopPropagation()
    this.props.history.push('/clientChat')
  }

  handleDrawOpen=(e)=>{
    if (e==='revers'){
      this.setState((prevState,props)=>({
        isOpen: !prevState.isOpen
      }))
    } else {
      this.setState({
        isOpen: e
      })
    }
  }

  render () {
    const sidebar=(<DrawCont history={this.props.history} />)
    return <div>
      <NavBar
        title='快递员上门服务'
        leftContent={ ()=>(<img onClick={(e)=>{this.handleDrawOpen('revers')}} src="/Category.png" style={{width: 20, height: 20}} alt=""/>
        ) }
        rightContent={()=>(<img onClick={ ()=>{ this.props.history.push('/clientChat') } } style={{width: 20, height: 20}} src="/chat.png" alt=""/>
        )}
        navBarStyle={{
          height: 35,
          backgroundColor: 'rgba(255,255,255,0.5)', zIndex: 5,
          position: 'fixed', top: 0, width: '100%', padding: '0 16px'
        }}
      />
      <Drawer
        sidebar={sidebar}
        open={this.state.isOpen}
        sidebarStyle={{
          width: '85%',
          zIndex: 200,
          touchAction: 'none'
        }}
        onOpenChange={ (e)=>{this.handleDrawOpen(e)} }
      >
        <Flex justify='center' style={{position: 'absolute', top: 0,
          bottom: 0, width: document.documentElement.clientWidth}} >
          <div style={{position: 'absolute', top: 0,
            bottom: 0, width: '100%', left: 0,
            visible: this.state.loadMap?'hidden':'visible'
          }} ref='map' >
          </div>
          {/*<ActivityIndicator text='正在确定您的位置' animating={this.state.loadMap} />*/}
          <div style={{
            position: 'absolute', width: '100%', height: 30,
            bottom: 0, left: 0, zIndex: 199, lineHeight: '30px',
            backgroundColor: '#fff', textAlign: 'center'
          }} >
            查看并同意<span>《快递运单契约条款》</span>
          </div>
        </Flex>
      </Drawer>
    </div>
  }
}
