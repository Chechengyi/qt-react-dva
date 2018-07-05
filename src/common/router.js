import React from 'react';
import dynamic from 'dva/dynamic';
import { getMenuData } from './menu';
import AccountManagement from "../driver/AccountManagement";
import Ships from "../routes/Order/Ships";
import OrderStatistical from "../routes/Order/OrderStatistical";

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
      component: dynamicWrapper(app, ['admin_login', 'noDisOrder', 'socketMsg'], () => import('../layouts/BasicLayout')),
    },
    '/admin/cont/chat': {
      // exact: true,
      component: dynamicWrapper(app, ['admin_login', 'socketMsg'], () => import('../routes/Chat/Index')),
    },
    '/admin/cont/chat/content/:cusId/:username/:roomName': {
      exact: false,
      component: dynamicWrapper(app, ['admin_login', 'socketMsg'], () => import('../routes/Chat/Content')),
    },
    '/admin/cont/couMoney/noDis': {
      component: dynamicWrapper(app, ['admin_login', 'adminCouMoneyNoDis'], () => import('../routes/CouMoney/NoDis')),
    },
    '/admin/cont/couMoney/dis': {
      component: dynamicWrapper(app, ['admin_login', 'adminCouMoneyDis', 'orderType'], () => import('../routes/CouMoney/Dis')),
    },
    '/admin/cont/orderTime': {
      component: dynamicWrapper(app, ['admin_login', 'orderType', 'orderTime'], () => import('../routes/OrderTime/OrderTime'))
    },
    '/admin/cont/cusToCou': {
      component: dynamicWrapper(app, ['admin_login', 'orderType'], () => import('../routes/OrderTime/CusToCou'))
    },
    '/admin/cont/order/noDisOrder': {
      component: dynamicWrapper(app, ['admin_login', 'noDisOrder', 'orderType'], () => import('../routes/Order/NoDisOrder'))
    },
    '/admin/cont/order/noConfirm': {
      component: dynamicWrapper(app, ['admin_login', 'admin_confirm', 'orderType'], () => import('../routes/Order/Confirm'))
    },
    '/admin/cont/order/nopay': {
      component: dynamicWrapper(app, ['admin_login', 'admin_nopay', 'orderType'], () => import('../routes/Order/Nopay'))
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
    '/admin/cont/order/orderStatistical': {
      component: dynamicWrapper(app, ['admin_login', 'orderCount', 'dealerOrderCount'], () => import('../routes/Order/OrderStatistical'))
    },
    '/admin/cont/orderSetting/jisong': {
      component: dynamicWrapper(app, ['admin_login'], () => import('../routes/OrderSetting/Tongcheng'))
    },
    '/admin/cont/orderSetting/daigou': {
      component: dynamicWrapper(app, ['admin_login'], () => import('../routes/OrderSetting/Daigou'))
    },
    '/admin/cont/orderSetting/kuaidi': {
      component: dynamicWrapper(app, ['admin_login', 'provincePriceList'], () => import('../routes/OrderSetting/Kuaidi'))
    },
    '/admin/cont/people/cus': {
      component: dynamicWrapper(app, ['admin_login', 'customer'], ()=>import('../routes/Staff/Cus'))
    },
    '/admin/cont/people/courier': {
      component: dynamicWrapper(app, ['courier','admin_login','couOrderNum'], ()=>import('../routes/Staff/Courier'))
    },
    '/admin/cont/people/addCourier': {
      component: dynamicWrapper(app, ['admin_login'], ()=>import('../routes/Staff/AddCourier'))
    },
    '/admin/cont/people/dealer': {
      component: dynamicWrapper(app, ['dealer','admin_login', 'dealerOrderCount'], ()=>import('../routes/Staff/Dealer'))
    },
    '/admin/cont/people/addDealer': {
      component: dynamicWrapper(app, ['admin_login'], ()=>import('../routes/Staff/AddDealer'))
    },
    '/admin/cont/people/couPos': {
      component: dynamicWrapper(app, ['admin_login', 'courierPos'], ()=>import('../routes/Staff/CouPos'))
    },
    '/admin/cont/rate/orderRate': {
      component: dynamicWrapper(app, ['admin_login', 'adminRate', 'orderType'], ()=>import('../routes/Rate/OrderRate'))
    },
    '/admin/cont/rate/arbitration': {
      component: dynamicWrapper(app, ['admin_login', 'adminArbitration', 'orderType'], ()=>import('../routes/Rate/Arbitration'))
    },
    // '/admin/cont/home/frontdesk': {
    //   component: dynamicWrapper(app, ['frontdesk', 'global_drop'], ()=>import('../routes/Frontdesk/TableList'))
    // },
    // '/admin/cont/home/ceshi': {
    //   component: dynamicWrapper(app, [], ()=>import('../routes/Frontdesk/Ceshi'))
    // },
    // '/admin/cont/home/getPosition': {
    //   component: dynamicWrapper(app, [], ()=>import('../routes/Frontdesk/Position'))
    // },
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
    '/clientUser/forgetPsw': {
      component: dynamicWrapper(app, ['client_login'], () => import('../client/ForgetPsw')),
    },
    '/cont': {
      component: dynamicWrapper(app, ['client_login', 'socketMsg','CusNoPay'], () => import('../client/Cont')),
    },
    '/cont/tiaoyue': {
      component: dynamicWrapper(app, [], () => import('../client/ByOrder/Tiaoyue')),
    },
    '/cont/noConfirm': {
      component: dynamicWrapper(app, ['client_login', 'socketMsg','clientNoConfirm', 'orderType'], () => import('../client/Order/NoConfirm')),
    },
    '/cont/nopay/:openid': {
      component: dynamicWrapper(app, ['client_login','CusNoPay', 'orderType', 'socketMsg'], () => import('../client/NoPay')),
    },
    '/cont/ongoing': {
      component: dynamicWrapper(app, ['client_login', 'clientOngoing', 'orderType'], () => import('../client/Order/Ongoing')),
    },
    '/cont/done': {
      component: dynamicWrapper(app, ['client_login', 'clientDone', 'orderType'], () => import('../client/Order/Done'))
    },
    '/cont/star/:id': {
      component: dynamicWrapper(app, ['client_login', 'clientDone', 'orderType'], () => import('../client/Star'))
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
    '/cont/byOrder/wuliu': {
      component: dynamicWrapper(app, ['client_login', 'orderType', 'orderAddress'], () => import('../client/ByOrder/ByOrderWuliu')),
    },
    '/cont/byOrder/:id': {
      component: dynamicWrapper(app, ['client_login', 'orderType', 'orderAddress'], () => import('../client/ByOrder')),
    },
    '/cont/index': {
      component: dynamicWrapper(app, ['client_login', 'orderType', 'CusNoPay'], () => import('../client/Index')),
    },
    '/cont/my': {
      component: dynamicWrapper(app, ['client_login'], () => import('../client/My')),
    },
    '/cont/clientChat/:adminId/:username': {
      component: dynamicWrapper(app, ['client_login', 'socketMsg'], () => import('../client/Chat')),
    },
    '/cont/ChatObjList': {
      component: dynamicWrapper(app, ['client_login', 'socketMsg'], () => import('../client/ChatObjList')),
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
      component: dynamicWrapper(app, ['driver_login', 'orderType','courierNoConfirm'], () => import('../driver/Order/Daiqueren')),
    },
    '/driverCont/daifukuan': {
      component: dynamicWrapper(app, ['driver_login', 'orderType', 'courierNoPay'], () => import('../driver/Order/Daifukuan')),
    },
    '/driverCont/peisongzhong': {
      component: dynamicWrapper(app, ['driver_login', 'orderType', 'courierDistribution'], () => import('../driver/Order/Peisongzhong')),
    },
    '/driverElseCont/done': {
      component: dynamicWrapper(app, ['driver_login', 'orderType', 'courierDone'], () => import('../driver/Order/Done')),
    },
    '/driverElseCont/confirmOrder': {
      component: dynamicWrapper(app, ['driver_login'], () => import('../driver/Order/ConfirmOrder')),
    },
    '/driverElseCont': {
      component: dynamicWrapper(app, ['driver_login'], () => import('../driver/ElesCont')),
    },
    '/driverElseCont/money': {
      component: dynamicWrapper(app, ['driver_login'], () => import('../driver/Money')),
    },
    '/driverElseCont/account': {
      component: dynamicWrapper(app, ['driver_login'], () => import('../driver/AccountManagement')),
    },
    '/driverElseCont/moneyRecord': {
      component: dynamicWrapper(app, ['driver_login', 'couMoneyRecord'], () => import('../driver/MoneyRecord')),
    },
    '/driverElseCont/moneyCount': {
      component: dynamicWrapper(app, ['driver_login', 'couOrderNum'], () => import('../driver/MoneyCount')),
    },
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
