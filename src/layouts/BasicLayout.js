import React from 'react';
import PropTypes from 'prop-types';
import { Layout, Icon } from 'antd';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { Route, Redirect, Switch } from 'dva/router';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import { enquireScreen } from 'enquire-js';
import GlobalHeader from '../components/GlobalHeader';
import GlobalFooter from '../components/GlobalFooter';
import SiderMenu from '../components/SiderMenu';
import NotFound from '../routes/Exception/404';
import { getRoutes } from '../utils/utils';
import { getMenuData } from '../common/menu';
import Header from '../components/Header'
import {openSocket} from "../services/socket";
import { AC_receiveMsg } from '../services/api'

/**
 * 根据菜单取得重定向地址.
 */
const redirectData = [];
const getRedirect = (item) => {
  if (item && item.children) {
    if (item.children[0] && item.children[0].path) {
      redirectData.push({
        from: `/${item.path}`,
        to: `/${item.children[0].path}`,
      });
      item.children.forEach((children) => {
        getRedirect(children);
      });
    }
  }
};
getMenuData().forEach(getRedirect);

const { Content } = Layout;
const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
  },
};

let isMobile;
enquireScreen((b) => {
  isMobile = b;
});

@connect( state => ({
  login: state.admin_login,
  adminId: state.admin_login.admin_id
}) )

class BasicLayout extends React.PureComponent {
  static childContextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  }

  state = {
    isMobile,
  };
  getChildContext() {
    const { location, routerData } = this.props;
    return {
      location,
      breadcrumbNameMap: routerData,
    };
  }
  componentDidMount() {
    if ( this.props.login.admin_status !== 'OK' ) {
      this.props.history.push('/admin/user/login')
      return
    }
    //轮询获取未分配订单展示
    this.getOrderCount()
    if (!window.timer) {
      window.timer = setInterval( this.getOrderCount.bind(this), 1000*15 ) //  三分钟 180，000
    }
    // 轮询获取聊天信息
    // this.getMsg()
    // if (!window.msg) {
    //   window.msg = setInterval( this.getMsg.bind(this), 1000*10 )
    // }
    enquireScreen((b) => {
      this.setState({
        isMobile: !!b,
      });
    });
  }

  getMsg =()=> {
    AC_receiveMsg({
      adminId: this.props.adminId,
      type: 'admin'
    })
      .then( res=>{
        console.log(res.data.length)
        res.data.forEach( item=>{
          console.log(item)
          this.props.dispatch({
            type: 'socketMsg/setMsg',
            payload: {
              toUserId: item.fromId,
              msg: item
            }
          })
        })
      })
  }

  // 发送获取未分配订单个数的请求
  getOrderCount(){
    if (this.props.adminId) {
      this.props.dispatch({
        type: 'noDisOrder/backGetCount',
        payload: {
          adminId: this.props.adminId
        }
      })
    }
  }
  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = '强通速递';
    if (routerData[pathname] && routerData[pathname].name) {
      title = `${routerData[pathname].name} - 强通速递`;
    }
    return title;
  }
  render() {
    const {
       collapsed, fetchingNotices, notices, routerData, match, location, dispatch,
    } = this.props;
    const layout = (
      <Layout>
        <SiderMenu
          collapsed={collapsed}
          location={location}
          dispatch={dispatch}
          isMobile={this.state.isMobile}
        />
        <Layout>
          <GlobalHeader
            // currentUser={currentUser}
            fetchingNotices={fetchingNotices}
            notices={notices}
            collapsed={collapsed}
            dispatch={dispatch}
            isMobile={this.state.isMobile}
            history={this.props.history}
          />
          {/*<Header></Header>*/}
          <Content style={{ margin: '24px 24px 0', height: '100%' }}>
            <div style={{ minHeight: 'calc(100vh - 260px)', minWidth: '900px' }}>
              <Switch>
                {
                  redirectData.map(item =>
                    <Redirect key={item.from} exact from={item.from} to={item.to} />
                  )
                }
                {
                  getRoutes(match.path, routerData).map(item => (
                    <Route
                      key={item.key}
                      path={item.path}
                      // render={ props=><item.component {...props} /> }
                      component={item.component}
                      exact={item.exact}
                    />
                  ))
                }
                {/*<Redirect exact from="/" to="/dashboard/analysis" />*/}
                <Route render={NotFound} />
              </Switch>
            </div>
            <GlobalFooter
              // links={[{
              //   title: 'walker博客',
              //   href: 'https://blog.walkerup.com',
              //   blankTarget: true,
              // }]}
              copyright={
                <div>
                  Copyright <Icon type="copyright" /> 2018 强通速递
                </div>
              }
            />
          </Content>
        </Layout>
      </Layout>
    );

    return (
      <DocumentTitle title={this.getPageTitle()}>
        <ContainerQuery query={query}>
          {params => <div className={classNames(params)}>{layout}</div>}
        </ContainerQuery>
      </DocumentTitle>
    );
  }
}

export default connect(state => ({
  // currentUser: state.user.currentUser,
  collapsed: state.global.collapsed,
  fetchingNotices: state.global.fetchingNotices,
  notices: state.global.notices,
}))(BasicLayout);
