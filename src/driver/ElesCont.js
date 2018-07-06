import React, { PureComponent } from 'react'
import { Route, Redirect, Switch } from 'dva/router'
import { connect } from 'dva'
import {getRoutes} from "../utils/utils";
import loginHoc from '../Hoc/LoginHoc'
import {Modal, Toast} from "antd-mobile/lib/index";

@connect(state=>({
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
})
export default class ElesCont extends PureComponent {
  componentDidMount(){
  }

  componentWillReceiveProps(nextProps){
    if ( this.props.count < nextProps.count ) {
      this.AudioPlay()
    }
  }

  AudioPlay =()=> {
    // if (window.location.hash=='#/driverCont/weichuli') return
    if (this.refs.audio) {
      this.refs.audio.play()
    }
    // Modal.alert('您有新的订单', '', [{
    //   text: '等会再去', onPress: ()=>{}
    // }, {
    //   text: '去处理', onPress: ()=>{
    //     this.props.history.push('/driverCont/weichuli')
    //   }
    // }])
  }
  render () {
    const {routerData, match} = this.props
    return <div>
      <audio ref='audio' src="http://data.huiyi8.com/2014/lxy/05/14/10.mp3"></audio>
      <Switch>
        <Route exact path="/driverCont" render={ () => (
          <Redirect to="/driverCont/index"  />
        ) } />
        {
          getRoutes(match.path, routerData).map(item => (
            <Route
              key={item.key}
              path={item.path}
              render={ (props) => <item.component {...props} changeWritePsw={this.changeWritePsw} onOpenChange={this.onOpenChange} /> }
              exact={item.exact}
              link={this.link}
            >
            </Route>
          ))
        }
      </Switch>
    </div>
  }
}
