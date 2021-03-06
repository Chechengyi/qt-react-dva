import React from 'react';
import { Router, Route, Switch, Redirect } from 'dva/router';
import { LocaleProvider, Spin } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import dynamic from 'dva/dynamic';
import { getRouterData } from './common/router';
import styles from './index.less';
import NotFound from './routes/Exception/404'
import NoCheck from './routes/Exception/403'

dynamic.setDefaultLoadingComponent(() => {
  return <Spin size="large" className={styles.globalSpin} />;
});

function RouterConfig({ history, app }) {
  const routerData = getRouterData(app);
  const AdminElse = routerData['/admin/else'].component
  const UserLayout = routerData['/admin/user'].component
  const BasicLayout = routerData['/admin/cont'].component
  const ClientLayout = routerData['/clientUser'].component
  const ClientCont = routerData['/cont'].component
  const OrderMap = routerData['/orderMap'].component
  const DriverLogin = routerData['/driverLogin'].component
  const DriverCont = routerData['/driverCont'].component
  const DriverElseCont = routerData['/driverElseCont'].component
  const AdminChat = routerData['/admin/cont/chat'].component
  // 客户端聊天界面
  // const ClientChat = routerData['/clientChat'].component
  return (
    <LocaleProvider locale={zhCN}>
      <Router history={history}>
        <Switch>
          <Route exact path='/' render={ ()=>(
            <Redirect to='/cont' />
          )} />
          <Route path="/admin/else" render={props => <AdminElse {...props} />} />
          <Route path="/admin/user" render={props => <UserLayout {...props} />} />
          <Route path="/admin/cont" render={props => <BasicLayout {...props} />} />
          {/*<Route path="/admin/cont/chat" exact={true} render={ props=><AdminChat {...props} /> } />*/}
          <Route path="/driverLogin" render={ props => <DriverLogin {...props} />   } />
          <Route path="/driverCont" render={ props => <DriverCont {...props} /> }  />
          <Route path="/driverElseCont" render={ props=><DriverElseCont {...props} /> } ></Route>
          <Route path='/clientUser' render={ props=><ClientLayout {...props} /> } />
          <Route path="/cont" render={ props => <ClientCont {...props} /> } />
          {/*<Route path="/clientChat/:adminId/:username" render={ props => <ClientChat {...props} /> } />*/}
          <Route path="/orderMap/:id/:location" render={ props => <OrderMap {...props} /> } />
          <Route path="/*" component={NotFound}  />
        </Switch>
      </Router>
    </LocaleProvider>
  );
}

export default RouterConfig;
