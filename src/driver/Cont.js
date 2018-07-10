import React, { PureComponent } from 'react'
import { Drawer, NavBar, Icon, TabBar } from 'antd-mobile'
import { Route, Redirect, Switch } from 'dva/router'
import { connect } from 'dva'
import styles from './Cont.less'
import DrawCont from './DrawCont'
import { getRoutes } from '../utils/utils'
import loginHoc from '../Hoc/LoginHoc'
import {Toast, Modal} from "antd-mobile/lib/index";
import { throttle } from '../services/utils'

@connect( state=>({
  driver_status: state.driver_login.driver_status,
  driver_id: state.driver_login.driver_id,
  count: state.courierNoAccept.count
}))
@loginHoc({
  redirectPath: '/#/driverLogin',
  propsSelector: props=>props.driver_status == 'OK',
  redirectBefore: ()=> {
    Toast.fail('需要登录才能进行此操作，请先登录', 1.5)
  },
  // redirectBeforeTime: 1000
})
export default class Cont extends PureComponent {

  constructor(props){
    super(props)
    this.state = {
      isOpen: false,
      writePsw: false,
      selectTab: null,
      title: '强通快递'
    }
  }

  changeWritePsw = (e)=>{
    this.setState({
      writePsw: e
    })
  }

  componentDidMount(){
    this.refs.audio.play()
    if (this.props.driver_status!='OK') {
      return
    }
    this.getCount()
    if (!window.timer) {
      window.timer = setInterval(throttle(this.getCount, 300, this), 1000*20)
    }
  }
  // 获取为处理订单个数action
  getCount =()=> {
    this.props.dispatch({
      type: 'courierNoAccept/getCount',
      payload: {
        id: this.props.driver_id
      }
    })
  }

  // 播放音频且弹出提示框
  AudioPlay =()=> {
    // if (window.location.hash=='#/driverCont/weichuli') return
    if (this.refs.audio) {
      this.refs.audio.play()
    }
    if (this.modal) {
      this.modal.close()
    }
    this.modal = Modal.alert('您有新的订单', '', [{
      text: '等会再去', onPress: ()=>{}
    }, {
      text: '去处理', onPress: ()=>{
        this.props.history.push('/driverCont/weichuli')
      }
    }])
  }


  componentWillReceiveProps(nextProps){
    if ( this.props.count < nextProps.count ) {
      this.AudioPlay()
    }
  }

  changeSelect = (select, title) => {
    this.setState({
      selectTab: select,
      title
    })
  }

  onOpenChange = (e) => {
    if ( this.state.writePsw ) {
      this.props.history.goBack()
    } else {
      if (e==='click') {
        this.setState((prevState,props)=>({
          docked: !prevState.docked
        }))
      } else {
        this.setState({
          docked: e
        })
      }
    }
  }

  tabLink = url => {
    this.props.history.replace(`/driverCont/${url}`)
  }

  render () {
    const sidebar = (
      <DrawCont history={this.props.history} />
    )
    const {routerData, match} = this.props
    return <div ref='driverRoot' >
      <NavBar
        onTouchMove={ e=> e.preventDefault() }
        icon={this.state.writePsw?<Icon type="left" />:<Icon type="ellipsis" />} onLeftClick={ ()=>{ this.onOpenChange('click') }}>
        {this.state.writePsw?'修改密码':this.state.title}
      </NavBar>
      <audio ref='audio' preload src="http://data.huiyi8.com/2014/lxy/05/14/10.mp3"></audio>
      <Drawer
        className={styles.myDrawer}
        style={{ minHeight: document.documentElement.clientHeight-45}}
        sidebar={sidebar}
        sidebarStyle={{
          position: 'absolute', top: 0, left: 0, zIndex: 55,
          backgroundColor: '#fff',
          width: document.documentElement.clientWidth * 0.8,
        }}
        onTouchMove={ e=>e.stopPropagation() }
        onOpenChange={ e=>this.onOpenChange(e) }
        open={this.state.docked}
      >
        <div style={{height: document.documentElement.clientHeight-45-50}} >
          <Switch>
            <Route exact path="/driverCont" render={ () => (
              <Redirect to="/driverCont/weichuli"  />
            ) } />
            {
              getRoutes(match.path, routerData).map(item => (
                <Route
                  key={item.key}
                  path={item.path}
                  render={ (props) => <item.component {...props} xitong={this.xitong} changeSelect={this.changeSelect} changeWritePsw={this.changeWritePsw} onOpenChange={this.onOpenChange} /> }
                  exact={item.exact}
                  link={this.link}
                >
                </Route>
              ))
            }
          </Switch>
        </div>
        <div
          // onTouchMove={ e=> e.preventDefault() }
          style={{position: 'absolute', width: '100%', bottom: 0, left: 0, zIndex: 1}} >
          <TabBar>
            <TabBar.Item
              badge={this.props.count}
              onPress={ ()=>this.tabLink('weichuli') }
              title='未处理'
              icon={<img style={{width: 20, height: 20}} src="/weichuli.png" alt=""/> }
              key={1}
              selected={this.state.selectTab=='weichuli'}
              selectedIcon={<img style={{width: 20, height: 20}} src="/weichuli1.png" alt=""/> }
            />
            <TabBar.Item
              onPress={ ()=>this.tabLink('daiqueren') }
              title='待确认'
              selected={this.state.selectTab=='daiqueren'}
              icon={<img style={{width: 20, height: 20}} src="/daiqueren.png" alt=""/>}
              selectedIcon={<img style={{width: 20, height: 20}} src="/daiqueren1.png" alt=""/>}
              key={2}
            />
            <TabBar.Item
              onPress={ ()=>this.tabLink('daifukuan') }
              title='待付款'
              selected={this.state.selectTab=='daifukuan'}
              icon={<img style={{width: 20, height: 20}} src="/daifukuan.png" alt=""/>}
              selectedIcon={<img style={{width: 20, height: 20}} src="/daifukuan1.png" alt=""/>}
              key={3}
            />
            <TabBar.Item
              onPress={ ()=>this.tabLink('peisongzhong') }
              title='配送中'
              selected={this.state.selectTab=='peisongzhong'}
              icon={<img style={{width: 20, height: 20}} src="/peisongzhong.png" alt=""/>}
              selectedIcon={<img style={{width: 20, height: 20}} src="/peisongzhong1.png" alt=""/>}
              key={4}
            />
          </TabBar>
        </div>
      </Drawer>
    </div>
  }
}



