import React from 'react';
import dynamic from 'dva/dynamic';
import { getMenuData } from './menu';

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => dynamic({
  app,
  models: () => models.map(m => import(`../models/${m}.js`)),
  // add routerData prop
  component: () => {
    const p = component();
    return new Promise((resolve, reject) => {
      p.then((Comp) => {
        resolve(props => <Comp {...props} routerData={getRouterData(app)} />);
      }).catch(err => reject(err));
    });
  },
});

function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach((item) => {
    if (item.children) {
      keys[item.path] = item.name;
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = item.name;
    }
  });
  return keys;
}

export const getRouterData = (app) => {
  const routerData = {
    // 后台管理路由
    '/admin/cont': {
      component: dynamicWrapper(app, ['user', 'login'], () => import('../layouts/BasicLayout')),
    },
    '/admin/cont/home/frontdesk': {
      component: dynamicWrapper(app, ['frontdesk', 'global_drop'], ()=>import('../routes/Frontdesk/TableList'))
    },
    '/admin/cont/home/ceshi': {
      component: dynamicWrapper(app, [], ()=>import('../routes/Frontdesk/Ceshi'))
    },
    '/admin/cont/home/getPosition': {
      component: dynamicWrapper(app, [], ()=>import('../routes/Frontdesk/Position'))
    },
    '/admin/user': {
      component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    },
    '/admin/user/login': {
      component: dynamicWrapper(app, ['login'], () => import('../routes/User/Login')),
    },
    '/admin/user/register': {
      component: dynamicWrapper(app, ['register'], () => import('../routes/User/Register')),
    },
    '/admin/user/register-result': {
      component: dynamicWrapper(app, [], () => import('../routes/User/RegisterResult')),
    },
    // 司机端路由
    '/driverLogin': {
      component: dynamicWrapper(app, ['driver_login'], () => import('../driver/Login')),
    },
    '/driver': {
      component: dynamicWrapper(app, ['driver_login'], () => import('../driver/Index')),
    },
    '/driver/ceshi': {
      component: dynamicWrapper(app, ['driver_login'], () => import('../driver/Ceshi')),
    }
  };
  // Get name from ./menu.js or just set it in the router data.
  const menuData = getFlatMenuData(getMenuData());
  const routerDataWithName = {};
  Object.keys(routerData).forEach((item) => {
    routerDataWithName[item] = {
      ...routerData[item],
      name: routerData[item].name || menuData[item.replace(/^\//, '')],
    };
  });
  return routerDataWithName;
};
