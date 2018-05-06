import React from 'react';
import { Router, Route, Switch, Redirect } from 'dva/router';
import { LocaleProvider, Spin } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import dynamic from 'dva/dynamic';
import { getRouterData } from './common/router';
import styles from './index.less';
import NotFound from './routes/Exception/404'

dynamic.setDefaultLoadingComponent(() => {
  return <Spin size="large" className={styles.globalSpin} />;
});

function RouterConfig({ history, app }) {
  const routerData = getRouterData(app);
  const UserLayout = routerData['/admin/user'].component;
  const BasicLayout = routerData['/admin/cont'].component;
  const DriverLogin = routerData['/driverLogin'].component
  const DriverIndex = routerData['/driver'].component
  return (
    <LocaleProvider locale={zhCN}>
      <Router history={history}>
        <Switch>
          <Route path="/admin/user" render={props => <UserLayout {...props} />} />
          <Route path="/admin/cont" render={props => <BasicLayout {...props} />} />
          <Route path="/driver" render={ props => <DriverIndex {...props} />} ></Route>
          <Route path="/driverLogin" render={ props => <DriverLogin {...props} />   } ></Route>
          <Route path="/*" component={NotFound} ></Route>
        </Switch>
      </Router>
    </LocaleProvider>
  );
}

export default RouterConfig;
