import React, { Component } from 'react'
import { getRoutes } from '../../utils/utils'
import { Route, Redirect, Switch, Router } from 'dva/router';
import { connect } from 'dva'
import Content from './Content'
import UserItem from './UserItem'
import styles from './Chat.less'

@connect( state=>({
  userList: state.socketMsg.userList,
  admin_id: state.admin_login.admin_id
}) )
export default class Index extends Component {

  componentDidMount(){

    if (Object.keys(this.props.userList).length===0) {
      this.props.dispatch({
        type: 'socketMsg/setUserList',
        payload: {
          adminId: this.props.admin_id,
          type: 'admin'
        }
      })
    }
  }

  render(){
    const {routerData, match} = this.props
    return <div style={{position: 'relative',
      height: window.screen.height-64-24-100,
      borderRadius: 10, overflow: 'hidden'
    }} >
        <div className={styles.sideBar}>
          {Object.keys(this.props.userList).map( (item,i)=>(
            <UserItem history={this.props.history} key={i} data={this.props.userList[item]} />
          ) )}
        </div>
        <div style={{marginLeft: 200, width: 700,
          position: 'relative',
          backgroundImage: 'url("/wechat1.png")',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          backgroundColor: '#d9d9d9',
          height: window.screen.height-64-24-100}} >
          <Switch>
            { getRoutes(match.path, routerData).map( item=>(
              <Route
                key={item.key}
                path={item.path}
                component={ item.component }
                exact={item.exact}
              />
            ) ) }
          </Switch>
        </div>
    </div>
  }
}
