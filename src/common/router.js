import React from 'react';
import dynamic from 'dva/dynamic';
import { getMenuData } from './menu';
import AccountManagement from "../driver/AccountManagement";
import Ships from "../routes/Order/Ships";

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
    '/admin/else': {
      component: dynamicWrapper(app, ['admin_login'], () => import('../layouts/AdminEles')),
    },
    '/admin/else/updateMsg': {
      component: dynamicWrapper(app, ['admin_login'], () => import('../routes/Else/UpdateMsg'))
    },
    '/admin/cont': {
      component: dynamicWrapper(app, ['admin_login', 'noDisOrder'], () => import('../layouts/BasicLayout')),
    },
    '/admin/cont/order/noDisOrder': {
      component: dynamicWrapper(app, ['admin_login', 'noDisOrder', 'orderType'], () => import('../routes/Order/NoDisOrder'))
    },
    '/admin/cont/order/ships': {
      component: dynamicWrapper(app, ['admin_login', 'shipOrder', 'orderType'], () => import('../routes/Order/Ships'))
    },
    '/admin/cont/order/dones': {
      component: dynamicWrapper(app, ['admin_login', 'donesOrder', 'orderType'], () => import('../routes/Order/DoneOrder'))
    },
    '/admin/cont/order/cancel': {
      component: dynamicWrapper(app, ['admin_login', 'cancelOrder', 'orderType'], () => import('../routes/Order/CancelOrder'))
    },
    '/admin/cont/people/cus': {
      component: dynamicWrapper(app, ['admin_login', 'customer'], ()=>import('../routes/Staff/Cus'))
    },
    '/admin/cont/people/courier': {
      component: dynamicWrapper(app, ['courier','admin_login'], ()=>import('../routes/Staff/Courier'))
    },
    '/admin/cont/people/addCourier': {
      component: dynamicWrapper(app, ['admin_login'], ()=>import('../routes/Staff/AddCourier'))
    },
    '/admin/cont/people/dealer': {
      component: dynamicWrapper(app, ['dealer','admin_login'], ()=>import('../routes/Staff/Dealer'))
    },
    '/admin/cont/people/addDealer': {
      component: dynamicWrapper(app, ['admin_login'], ()=>import('../routes/Staff/AddDealer'))
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
      component: dynamicWrapper(app, ['admin_login'], () => import('../routes/User/Login')),
    },
    '/admin/user/register': {
      component: dynamicWrapper(app, ['register'], () => import('../routes/User/Register')),
    },
    '/admin/user/register-result': {
      component: dynamicWrapper(app, [], () => import('../routes/User/RegisterResult')),
    },
    '/orderMap': {
      component: dynamicWrapper(app, ['courierPos'], () => import('../routes/map/Map')),
    },
    // 客户端路由
    '/clientUser': {
      component: dynamicWrapper(app, [], () => import('../client/UserLayout')),
    },
    '/clientUser/login': {
      component: dynamicWrapper(app, ['client_login'], () => import('../client/Login')),
    },
    '/clientUser/reg': {
      component: dynamicWrapper(app, [], () => import('../client/Reg')),
    },
    '/cont': {
      component: dynamicWrapper(app, ['client_login'], () => import('../client/Cont')),
    },
    '/cont/chooseLocation/:type': {
      component: dynamicWrapper(app, ['client_login', 'orderAddress'], () => import('../client/ChooseLocation')),
    },
    '/cont/chooseEndLocation': {
      component: dynamicWrapper(app, ['client_login', 'orderAddress'], () => import('../client/ChooseEndLocation')),
    },
    '/cont/startAddress': {
      component: dynamicWrapper(app, ['pickerAddress', 'client_login', 'orderAddress'], () => import('../client/StartAddress')),
    },
    '/cont/endAddress': {
      component: dynamicWrapper(app, ['client_login', 'orderAddress'], () => import('../client/EndAddress')),
    },
    '/cont/byOrder/tongcheng': {
      component: dynamicWrapper(app, ['client_login', 'orderType', 'orderAddress'], () => import('../client/ByOrder/ByOrderTongcheng')),
    },
    '/cont/byOrder/daigou': {
      component: dynamicWrapper(app, ['client_login', 'orderType', 'orderAddress'], () => import('../client/ByOrder/ByOrderDaigou')),
    },
    '/cont/byOrder/:id': {
      component: dynamicWrapper(app, ['client_login', 'orderType', 'orderAddress'], () => import('../client/ByOrder')),
    },
    '/cont/index': {
      component: dynamicWrapper(app, ['client_login', 'orderType'], () => import('../client/Index')),
    },
    '/cont/my': {
      component: dynamicWrapper(app, ['client_login'], () => import('../client/My')),
    },
    '/clientChat': {
      component: dynamicWrapper(app, ['client_login'], () => import('../client/Chat')),
    },
    '/cont/upDatePsw': {
      component: dynamicWrapper(app, ['client_login'], () => import('../client/UpdatePsw')),
    },
    '/cont/myAdress': {
      component: dynamicWrapper(app, ['client_login', 'client_address'], () => import('../client/AdressBook'))
    },
    '/cont/addAddress': {
      component: dynamicWrapper(app, ['client_login'], () => import('../client/AddAddress'))
    },
    '/cont/updateAddress': {
      component: dynamicWrapper(app, ['client_login'], () => import('../client/UpdateAddress'))
    },
    '/cont/ceshi': {
      component: dynamicWrapper(app, ['client_login'], () => import('../client/ByOrder/Ceshi')),
    },

    // 快递员端路由
    '/driverLogin': {
      component: dynamicWrapper(app, ['driver_login'], () => import('../driver/Login')),
    },
    '/driverCont': {
      component: dynamicWrapper(app, ['driver_login', 'courierNoAccept'], () => import('../driver/Cont')),
    },
    '/driverCont/index': {
      component: dynamicWrapper(app, ['driver_login'], () => import('../driver/Index')),
    },
    '/driverCont/updatePsw': {
      component: dynamicWrapper(app, ['driver_login'], () => import('../driver/Psw')),
    },
    '/driverCont/weichuli': {
      component: dynamicWrapper(app, ['driver_login', 'courierNoAccept', 'orderType'], () => import('../driver/Order/Weichuli')),
    },
    '/driverCont/daiqueren': {
      component: dynamicWrapper(app, ['driver_login'], () => import('../driver/Order/Daiqueren')),
    },
    '/driverCont/peisongzhong': {
      component: dynamicWrapper(app, ['driver_login'], () => import('../driver/Order/Peisongzhong')),
    },
    '/driverElseCont': {
      component: dynamicWrapper(app, ['driver_login'], () => import('../driver/ElesCont')),
    },
    '/driverElseCont/money': {
      component: dynamicWrapper(app, ['driver_login'], () => import('../driver/Money')),
    },
    '/driverElseCont/account': {
      component: dynamicWrapper(app, ['driver_login'], () => import('../driver/AccountManagement')),
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
