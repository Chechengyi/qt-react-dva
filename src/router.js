import React from 'react';
import { Router, Route, Switch, Redirect } from 'dva/router';
import { LocaleProvider, Spin } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import dynamic from 'dva/dynamic';
import { getRouterData } from './common/router';

import styles from './index.less';
// import Client_User_Layout from './layouts/Client_User_Layout'

dynamic.setDefaultLoadingComponent(() => {
  return <Spin size="large" className={styles.globalSpin} />;
});

function RouterConfig({ history, app }) {
  const routerData = getRouterData(app);
  const UserLayout = routerData['/admin/user'].component;
  const BasicLayout = routerData['/admin/cont'].component;
  // const Client_User_Layout = routerData['/'].component
  // const Client_Home_Layout = routerData['/home'].component
  // const Client_Cont_Layout = routerData['/cont'].component
  // const Client_Cont_Onebuy = routerData['/onebuy'].component
  // const Driver_Layout = routerData['/driver'].component
  // const Supplier_Layout = routerData['/supplier'].component
  // // const Driver_Home = routerData['/driver/home'].componen
  // const Supplier_Home = routerData['/supplier/home'].component

  return (
    <LocaleProvider locale={zhCN}>
      <Router history={history}>
        <Switch>
          {/*<Route path='/' render={ props => <Client_User_Layout {...props} /> }  />*/}
          <Route path="/admin/user" render={props => <UserLayout {...props} />} />
          <Route path="/admin/cont" render={props => <BasicLayout {...props} />} />
          {/*<Route path='/home' render={props=><Client_Home_Layout {...props} />}  ></Route>*/}
          {/*<Route path="/cont"  render={props=> <Client_Cont_Layout {...props} /> }  />*/}
          {/*<Route path='/onebuy' render={ props => <Client_Cont_Onebuy {...props} />  }  ></Route>*/}
          {/*<Route path='/driver' render={ props => <Driver_Layout {...props} /> } />*/}
          {/*<Route path='/supplier' render={ props => <Supplier_Layout {...props} /> } />*/}
          {/*/!*<Route path='/driver/home' ></Route>*!/*/}
          {/*<Route path='/supplier/home' render={ props => <Supplier_Home {...props} /> }  ></Route>*/}
        </Switch>
      </Router>
    </LocaleProvider>
  );
}

export default RouterConfig;
