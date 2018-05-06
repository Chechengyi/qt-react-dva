import React, { PureComponent } from 'react'
import { Route, Redirect, Switch } from 'dva/router';
import { getRoutes } from '../utils/utils';
import { NavBar } from 'antd-mobile'

export default class Index extends PureComponent {

  componentDidMount () {
  }

  render () {
    const {routerData, match} = this.props
    return <div>
      <NavBar>强通物流</NavBar>
      <Switch>
        {
          getRoutes(match.path, routerData).map(item => (
            <Route
              key={item.key}
              path={item.path}
              component={item.component}
              exact={item.exact}
            />
          ))
        }
      </Switch>
    </div>
  }
}
