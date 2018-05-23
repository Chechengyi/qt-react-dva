import React, { PureComponent } from 'react'
import { Drawer, NavBar, Icon } from 'antd-mobile'
import { Route, Redirect, Switch } from 'dva/router'
import { connect } from 'dva'
import styles from './Cont.less'
import DrawCont from './DrawCont'
import { getRoutes } from '../utils/utils'
import Iscroll from 'iscroll/build/iscroll'

export default class Cont extends PureComponent {

  constructor(props){
    super(props)
    this.state = {
      isOpen: false,
      writePsw: false
    }
  }

  changeWritePsw = (e)=>{
    this.setState({
      writePsw: e
    })
  }

  componentDidMount(){
    this.refs.driverRoot.addEventListener('touchmove',function (e) {
      e.preventDefault()
      e.stopPropagation()
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

  render () {
    const sidebar = (
      <DrawCont />
    )
    const {routerData, match} = this.props
    return <div ref='driverRoot' >
      <NavBar icon={this.state.writePsw?<Icon type="left" />:<Icon type="ellipsis" />} onLeftClick={ ()=>{ this.onOpenChange('click') }}>
        {this.state.writePsw?'修改密码':'强通快递'}
      </NavBar>
      <Drawer
        className={styles.myDrawer}
        style={{ minHeight: document.documentElement.clientHeight-45}}
        // enableDragHandle
        // contentStyle={{ color: '#A6A6A6'}}
        sidebar={sidebar}
        // open={this.state.isOpen}
        // onOpenChange={this.onOpenChange}
        sidebarStyle={{
          backgroundColor: '#fff',
          width: document.documentElement.clientWidth * 0.8
        }}
        // touch={false}
        docked={this.state.docked}
      >
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
      </Drawer>
    </div>
  }
}



