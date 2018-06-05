import React, { PureComponent } from 'react'
import { Drawer, NavBar, Icon, TabBar } from 'antd-mobile'
import { Route, Redirect, Switch } from 'dva/router'
import { connect } from 'dva'
import styles from './Cont.less'
import DrawCont from './DrawCont'
import { getRoutes } from '../utils/utils'
import Iscroll from 'iscroll/build/iscroll'

@connect( state=>({
  driver_id: state.driver_login.driver_id,
  count: state.courierNoAccept.count
}) )
export default class Cont extends PureComponent {

  constructor(props){
    super(props)
    this.state = {
      isOpen: false,
      writePsw: false,
      selectTab: null,
      title: '强通快递'
    }
  }

  changeWritePsw = (e)=>{
    this.setState({
      writePsw: e
    })
  }

  componentDidMount(){
    // this.refs.driverRoot.addEventListener('touchmove',function (e) {
    //   e.preventDefault()
    //   // e.stopPropagation()
    // })
    // 获取快递员未处理订单条数
    this.props.dispatch({
      type: 'courierNoAccept/getCount',
      payload: {
        id: this.props.driver_id
      }
    })
  }

  changeSelect = (select, title) => {
    this.setState({
      selectTab: select,
      title
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

  tabLink = url => {
    this.props.history.replace(`/driverCont/${url}`)
  }

  render () {
    const sidebar = (
      <DrawCont />
    )
    const {routerData, match} = this.props
    return <div ref='driverRoot' >
      <NavBar
        // onTouchMove={ e=> e.preventDefault() }
        icon={this.state.writePsw?<Icon type="left" />:<Icon type="ellipsis" />} onLeftClick={ ()=>{ this.onOpenChange('click') }}>
        {this.state.writePsw?'修改密码':this.state.title}
      </NavBar>
      <Drawer
        className={styles.myDrawer}
        style={{ minHeight: document.documentElement.clientHeight-44}}
        sidebar={sidebar}
        sidebarStyle={{
          position: 'absolute', top: 0, left: 0, zIndex: 55,
          backgroundColor: '#fff',
          width: document.documentElement.clientWidth * 0.8,
        }}
        onOpenChange={ e=>this.onOpenChange(e) }
        open={this.state.docked}
      >
        <div style={{height: document.documentElement.clientHeight-44-50}} >
          <Switch>
            <Route exact path="/driverCont" render={ () => (
              <Redirect to="/driverCont/weichuli"  />
            ) } />
            {
              getRoutes(match.path, routerData).map(item => (
                <Route
                  key={item.key}
                  path={item.path}
                  render={ (props) => <item.component {...props} changeSelect={this.changeSelect} changeWritePsw={this.changeWritePsw} onOpenChange={this.onOpenChange} /> }
                  exact={item.exact}
                  link={this.link}
                >
                </Route>
              ))
            }
          </Switch>
        </div>
      </Drawer>
      <div
        // onTouchMove={ e=> e.preventDefault() }
        style={{position: 'absolute', width: '100%', bottom: 0, left: 0}} >
        <TabBar>
          <TabBar.Item
            badge={this.props.count}
            onPress={ ()=>this.tabLink('weichuli') }
            title='未处理'
            icon={<img style={{width: 20, height: 20}} src="/weichuli.png" alt=""/> }
            key={1}
            selected={this.state.selectTab=='weichuli'}
            selectedIcon={<img style={{width: 20, height: 20}} src="/weichuli1.png" alt=""/> }
          />
          <TabBar.Item
            onPress={ ()=>this.tabLink('daiqueren') }
            title='待确认'
            selected={this.state.selectTab=='daiqueren'}
            icon={<img style={{width: 20, height: 20}} src="/daiqueren.png" alt=""/>}
            selectedIcon={<img style={{width: 20, height: 20}} src="/daiqueren1.png" alt=""/>}
            key={2}
          />
          <TabBar.Item
            onPress={ ()=>this.tabLink('peisongzhong') }
            title='配送中'
            selected={this.state.selectTab=='peisongzhong'}
            icon={<img style={{width: 20, height: 20}} src="/peisongzhong.png" alt=""/>}
            selectedIcon={<img style={{width: 20, height: 20}} src="/peisongzhong1.png" alt=""/>}
            key={3}
          />
        </TabBar>
      </div>
    </div>
  }
}



