import React, { PureComponent } from 'react'
import { Route, Redirect, Switch } from 'dva/router'
import { getRoutes } from '../utils/utils'
import { TabBar } from 'antd-mobile'
import { connect } from 'dva'
import { openSocket } from '../services/socket'

@connect(state=>({
  client_status: state.client_login.client_status,
  count: state.CusNoPay.count,
  client_id: state.client_login.client_id
}))
export default class Cont extends PureComponent {

  constructor (props) {
    super(props)
    this.state = {
      selectedTab: '',
      hidden: false
    }
  }

  componentDidMount(){
    // if (this.props.client_status!=='OK') {
    //   this.props.history.push('/clientUser/login')
    // }
    // 如果用户登录了就发送websocket连接请求
    if ( this.props.client_status=='OK' ) {
      this.props.dispatch({
        type: 'socketMsg/setUserList',
        payload: {
          cusId: this.props.client_id,
          type: 'cus'
        }
      })
      this.getSocket()
    }
  }

  // componentWillMount(){
  //   if (window.cusWS) {
  //     window.cusWS.onclose = function () {
  //       console.log('断开websocket连接')
  //     }
  //   }
  // }

  // 连接socket
  getSocket = async ()=> {
    let self = this

    if ( !window.cusWS ) {
      try {
        window.cusWS = await openSocket('ws://localhost:8080/wschat')
      } catch (e) {
        return
      }
    } else {
      return
    }

    window.cusWS.onmessage = e=> {
      console.log('接收')
      let obj = JSON.parse(e.data)
      console.log(obj)
      if (!obj.fromId||!obj.toId) return
      this.props.dispatch({
        type: 'socketMsg/setMsg',
        payload: {
          toUserId: obj.fromId,
          msg: obj
        }
      })
    }
  }

  link = (url) => {
    this.props.history.replace(`/cont/${url}`)
  }

  // 控制TabBar高亮
  selectedTab = (tit) => {
    this.setState({
      selectedTab: tit
    })
  }

  render () {
    const {routerData, match} = this.props
    return <div ref='clientRoot'>
      <div onClick={ () => { this.setState( (prevState, props) => ({
        hidden: !prevState.hidden
      }) ) } } >
        <Switch>
          <Route exact path="/cont" render={ () => (
            <Redirect to="/cont/index"  />
          ) } />
          {
            getRoutes(match.path, routerData).map(item => (
              <Route
                key={item.key}
                path={item.path}
                render={ (props) => <item.component {...props} selectedTab={this.selectedTab} /> }
                exact={item.exact}
                link={this.link}
              >
              </Route>
            ))
          }
        </Switch>
      </div>
    </div>
  }
}
