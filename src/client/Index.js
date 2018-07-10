import React, { Component } from 'react';
import { Drawer, Flex, ActivityIndicator, Modal } from 'antd-mobile'
import DrawCont from './DrawCont'
import { connect } from 'dva'
import NavBar from '../components/NavBar/Index'
import styles from './index.less'

let AMap = null
let mapObj = null

@connect(state=>({
  client_name: state.client_login,
  orderData: state.orderType.data,
  orderLoading: state.orderType.loading,
  client_status: state.client_login.client_status,
  count: state.CusNoPay.count,
  client_id: state.client_login.client_id
}))
export default class Index extends Component {

  constructor(props){
    super(props)
    this.state={
      isOpen: false,
      longitude: 107.05683,
      latitude: 27.70846,
      loadMap: true,
      selectOrderTypeId: 1
    }
  }



  componentDidMount () {
    this.props.selectedTab('index')
    AMap = Object.AMap
    // this.getPos()
    // 如果订单类型列表长度为0 ， 则向后台请求获取订单类型列表
    if (this.props.orderData.length===0) {
      this.props.dispatch({
        type: 'orderType/getData',
      })
    }
    this.props.dispatch({
      type: 'CusNoPay/getCount',
      payload: {
        cusId: this.props.client_id
      }
    })
    this.createMap()   // 直接创建地图
    // this.getPos()   // 根据客户定位创建地图
  }
  /*
  *  这里有两种方案待选择，一是定位出客户的位置，展现是地图 二是只展示地图，像顺丰快递一样
  * */
  // 测试，  直接生成地图
  createMap=()=>{
    this.map = new AMap.Map(this.refs.map, {
      resizeEnable: true,
      zoom:7,
      // center: [107.05683,27.70846]
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
      map: this.map,
    })
  }

  chat = (e) => {
    e.stopPropagation()
    this.props.history.push('/clientChat')
  }

  handleDrawOpen=(e)=>{
    this.props.dispatch({
      type: 'CusNoPay/getCount',
      payload: {
        cusId: this.props.client_id
      }
    })
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

  handleRadio=e=>{
    this.setState({
      selectOrderTypeId: e
    })
  }

  handleOrderLink = ()=> {
    // if (this.state.selectOrderTypeId==1) {
    //   this.props.history.push('/cont/byOrder/tongcheng')
    // } else if (this.state.selectOrderTypeId==2) {
    //   this.props.history.push('/cont/byOrder/daigou')
    // } else if (this.state.selectOrderTypeId==3) {
    //   this.props.history.push('/cont/byOrder/wuliu')
    // }
    // return
    if (this.props.client_status==='OK') {
      var road
      // this.props.history.push(`/cont/byOrder/${this.state.selectOrderTypeId}`)
      if ( this.state.selectOrderTypeId==1 ) { //去往同城急送下单页面
        // this.props.history.push('/cont/byOrder/tongcheng')
        // road = '/#/cont/byOrder/tongcheng'
        road = 'tc'
      } else if ( this.state.selectOrderTypeId==2 ) { // 代购服务下单页面
        // this.props.history.push('/cont/byOrder/daigou')
        // road = '/#/cont/byOrder/daigou'
        road = 'dg'
      } else if (this.state.selectOrderTypeId==3) { // 物流服务下单页面
        // this.props.history.push('/cont/byOrder/wuliu')
        // road = '/#/cont/byOrder/wuliu'
        road = 'wl'
      }
      // window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxe75752031ce1c286&redirect_uri=http://www.laikexin.cc/weixin/getWxMp?road=${road}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`
      var href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxe75752031ce1c286&redirect_uri=http://www.laikexin.cc/getWxMp&response_type=code&scope=snsapi_userinfo&state=${road}${this.props.client_id}#wechat_redirect`

      var aDom = this.refs.a

      aDom.setAttribute("href", href);
      // aDom.style.display = "none";

      // var ev = document.createEvent('HTMLEvents');
      //
      // ev.initEvent('click', false, true);
      // aDom.dispatchEvent(ev);
      // console.log('dd')

    } else {
      Modal.alert('还没有登录','去登录了在下单', [{
        text: '取消', onPress: ()=>{}
      }, {
        text: '确认', onPress: ()=>this.props.history.replace('/clientUser/login')
      }])
    }
  }

  render () {
    const sidebar=(<DrawCont count={this.props.count} history={this.props.history} />)
    return <div>
      <NavBar
        title='快递员上门服务'
        leftContent={ ()=>(<img onClick={(e)=>{this.handleDrawOpen('revers')}} src="/menu.png" style={{width: 20, height: 20}} alt=""/>
        ) }
        // rightContent={()=>(<img onClick={ ()=>{ this.props.history.push('/clientChat/1') } } style={{width: 20, height: 20}} src="/wechat1.png" alt=""/>
        // )}
        // rightContent={()=>(
        //   <img
        //     onClick={ ()=>{ this.props.history.push('/cont/ChatObjList') } }
        //        style={{width: 20, height: 20}} src="/wechat1.png" alt=""/>
        // )}
        navBarStyle={{
          height: 35,
          backgroundColor: '#108ee9', zIndex: 5, color: '#fff',
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
          <div style={{
            display: 'flex', flexDirection: 'row',
            justifyContent: 'space-between', alignItems: 'center',
            position: 'absolute', backgroundColor: '#108ee9',
            width: 290, left: document.documentElement.clientWidth/2-145,
            top: 60, padding: '0 20px', lineHeight: '80px',
            height: 60, zIndex: 1, borderRadius: 4, color: '#fff',
            fontSize: '1.1em'
          }} onTouchMove={ e=>e.preventDefault() } >
            {this.props.orderData.map( (item,i)=>(
              <div key={i} onClick={ ()=>this.handleRadio(item.id)}  >
                <input type="radio"
                       style={{verticalAlign: 'center'}}
                       onChange={ e=>this.handleRadio(e.target.value) }
                       checked={this.state.selectOrderTypeId==item.id}
                       name='orderType' value={item.id} /> {item.type}
              </div>
            ) )}
          </div>
          <a ref='a'>
            <div
              onClick={ this.handleOrderLink }
              style={{
                position: 'absolute', textAlign: 'center', lineHeight: '30px',
                width: 80, height: 30, backgroundColor: '#108ee9',
                top: '50%', left: '50%', marginLeft: -40, borderRadius: '20px'
              }} onTouchMove={ e=>e.preventDefault() } >
              <div className={styles.xuanzhuan}></div>
              <span style={{color: '#fff'}}>下单</span>
            </div>
          </a>
          {/*<a ref='a' href='#' style={{display: 'hidden'}} ></a>*/}
          {/*<ActivityIndicator text='正在确定您的位置' animating={this.state.loadMap} />*/}
          <div
            onClick={ ()=>this.props.history.push('/cont/tiaoyue') }
            style={{
            position: 'absolute', width: '100%', height: 30,
            bottom: 0, left: 0, zIndex: 199, lineHeight: '30px',
            backgroundColor: '#108ee9', textAlign: 'center', color: '#fff'
          }} >
            查看并同意<span>《快递运单契约条款》</span>
          </div>
        </Flex>
      </Drawer>
    </div>
  }
}


