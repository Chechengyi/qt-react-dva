import React, { PureComponent } from 'react'
import { Route, Redirect, Switch } from 'dva/router'
import { getRoutes } from '../utils/utils'
import { TabBar } from 'antd-mobile'
import { connect } from 'dva'

@connect(state=>({
  client_status: state.client_login.client_status
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
