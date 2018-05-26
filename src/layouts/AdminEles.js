import React, { PureComponent } from 'react'
import { Route, Redirect, Switch } from 'dva/router'
import { getRoutes } from '../utils/utils'
import { connect } from 'dva'

@connect(state=>({
  admin_status: state.admin_login.admin_status
}))
export default class AdminEles extends PureComponent {

  componentDidMount(){
    if ( this.props.admin_status!=='OK' ) {
      this.props.history.push('/admin/user/login')
    }
  }

  render(){
    const {routerData, match} = this.props
    return <div>
      <Switch>
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
  }
}
