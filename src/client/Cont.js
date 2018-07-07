import React, { PureComponent } from 'react'
import { Route, Redirect, Switch } from 'dva/router'
import { getRoutes } from '../utils/utils'
import { TabBar } from 'antd-mobile'
import { connect } from 'dva'
import { openSocket } from '../services/socket'
import { AC_receiveMsg } from '../services/api'

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

    if (this.props.client_status=='OK') {
      // this.getMsg()
      // if (!window.msg) {
      //   window.msg = setInterval( this.getMsg.bind(this), 1000*10 )
      // }
    }

  }

  // ajax轮询接受消息
  getMsg =()=> {
    AC_receiveMsg({
      cusId: this.props.client_id,
      type: 'cus'
    })
      .then( res=>{
        res.data.forEach( item=>{
          this.props.dispatch({
            type: 'socketMsg/setMsg',
            payload: {
              toUserId: item.fromId,
              msg: item
            }
          })
        })
      })
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
