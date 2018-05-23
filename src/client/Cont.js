import React, { PureComponent } from 'react'
import { Route, Redirect, Switch } from 'dva/router'
import { getRoutes } from '../utils/utils'
import { TabBar } from 'antd-mobile'
import { connect } from 'dva'

export default class Cont extends PureComponent {

  constructor (props) {
    super(props)
    this.state = {
      selectedTab: '',
      hidden: false
    }
  }

  componentDidMount(){
    // this.refs.clientRoot.addEventListener('touchmove', function (e) {
    //   e.preventDefault()
    // })
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
    return <div ref='clientRoot' >
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
       {/*<div style={{position: 'fixed', bottom: 0, width: '100%'}} >*/}
         {/*<TabBar hidden={this.state.hidden} >*/}
           {/*<TabBar.Item*/}
             {/*icon={{ uri: '/all.png' }}*/}
             {/*selectedIcon={{ uri: '/all1.png' }}*/}
             {/*title="首页"*/}
             {/*key="首页"*/}
             {/*selected={this.state.selectedTab === 'index'}*/}
             {/*onPress={ () => { this.link('index') } }*/}
            {/*/>*/}
           {/*<TabBar.Item*/}
             {/*icon={{ uri: '/my.png' }}*/}
             {/*selectedIcon={{ uri: '/my1.png' }}*/}
             {/*title="我的"*/}
             {/*key="我的"*/}
             {/*selected={this.state.selectedTab === 'my'}*/}
             {/*onPress={ () => { this.link('my') } }*/}
           {/*/>*/}
         {/*</TabBar>*/}
       {/*</div>*/}
    </div>
  }
}
