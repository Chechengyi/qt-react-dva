import React, { PureComponent } from 'react'
import { Route, Redirect, Switch } from 'dva/router'
import { getRoutes } from '../utils/utils'

export default class UserLayout extends PureComponent {
  render () {
    const {routerData, match} = this.props
    return <div>
      <Switch>
        <Route exact path="/clientUser" render={ () => (
          <Redirect to="/clientUser/login"  />
        ) } />
        {
          getRoutes(match.path, routerData).map(item => (
            <Route
              key={item.key}
              path={item.path}
              component={item.component}
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
