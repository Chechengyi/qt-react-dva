import React, { PureComponent } from 'react'
import { Route, Redirect, Switch } from 'dva/router'
import { connect } from 'dva'
import {getRoutes} from "../utils/utils";

export default class ElesCont extends PureComponent {
  componentDidMount(){
  }
  render () {
    const {routerData, match} = this.props
    return <div>
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
