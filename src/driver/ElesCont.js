import React, { PureComponent } from 'react'
import { Route, Redirect, Switch } from 'dva/router'
import { connect } from 'dva'
import {getRoutes} from "../utils/utils";
import loginHoc from '../Hoc/LoginHoc'
import {Toast} from "antd-mobile/lib/index";

@connect(state=>({
  driver_status: state.driver_login.driver_status
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
