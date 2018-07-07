import { getRoleMenu } from './getRoleMenu'
import clonedeep from 'lodash.clonedeep'

/*
* role代表权限， 现在系统中存在三个角色， 超级管理员， 经销商， 文员
* 超级管理员roleId为0， 经销商roleId 大于0， 文员roleId等于0
* 如果当前菜单项没有role， 则代表所有角色都可以访问
* 如果有的话， 则有  admin， dealer ， 及clerk
* */

const menuData = [
  {
    role: ['admin', 'dealer'],
    name: '平台人员管理',
    icon: 'usergroup-add',
    path: 'admin/cont/people',
    children: [
      {
        name: '经销商管理',
        path: 'dealer'
      },
      {
        role: ['admin'],
        isAdmin: true, // isAdmin代表只有管理员可以看到该菜单栏， 经销商看不到
        name: '用户管理',
        // icon: 'user',
        path: 'cus'
      },
      {
        name: '快递员管理',
        path: 'courier'
      },
      {
        name: '查看快递员位置',
        path: 'couPos'
      }
    ]
  },
  {
    name: '订单记录',
    icon: 'profile',
    path: 'admin/cont/order',
    children: [
      {
        name: '未分配订单',
        path: 'noDisOrder'
      },
      // 等待快递员确认订单
      {
        name: '待确认订单',
        path: 'noConfirm'
      },
      // 等待客户付款的订单
      {
        name: '待付款订单',
        path: 'noPay'
      },
      {
        name: '配送中订单',
        path: 'ships'
      },
      {
        name: '已完成订单',
        path: 'dones'
      },
      {
        name: '已取消订单',
        path: 'cancel'
      },
      {
        name: '送单统计',
        path: 'orderStatistical'
      }
    ]
  },
  {
    role: ['admin'],
    name: '订单管理',
    icon: 'setting',
    isAdmin: true,
    path: 'admin/cont/orderSetting',
    children: [
      {
        name: '同城急送',
        path: 'jisong'
      },
      {
        name: '代购服务',
        path: 'daigou'
      },
      {
        name: '快递物流',
        path: 'kuaidi'
      }
    ]
  },
  // {
  //   name: '订单定位',
  //   icon: 'user',
  //   path: 'orderMap/2'
  // },
  // {
  //   name: '聊天信息',
  //   icon: 'wechat',
  //   path: '/admin/cont/chat'
  // },
  {
    role: ['admin', 'clerk'],
    name: '快递员提款',
    isAdmin: true,
    icon: 'pay-circle-o',
    path: 'admin/cont/couMoney',
    children: [
      {
        name: '未处理提款申请',
        path: 'noDis'
      },
      {
        name: '已处理提款申请',
        path: 'dis'
      }
    ]
  },
  {
    role: ['admin', 'clerk'],
    name: '快递员送单管理',
    path: 'admin/cont/orderTime',
    icon: 'contacts'
  },
  {
    name: '快递员评价',
    path: 'admin/cont/rate',
    icon: 'meh-o',
    children: [
      {
        role: ['admin', 'clerk'],
        name: '订单评价',
        path: 'orderRate'
      },
      {
        role: ['admin', 'clerk', 'dealer'],
        name: '发起仲裁订单',
        path: 'arbitration'
      }
    ]
  }
  ]

function formatter(data, parentPath = '') {
  const list = [];
  data.forEach((item) => {
    if (item.children) {
      list.push({
        ...item,
        path: `${parentPath}${item.path}`,
        children: formatter(item.children, `${parentPath}${item.path}/`),
      });
    } else {
      list.push({
        ...item,
        path: `${parentPath}${item.path}`,
      });
    }
  });
  return list;
}

// export const getMenuData = (roleId) => formatter(menuData, roleId);


export const getMenuData = (roleId) => {
  const menu = getRoleMenu(roleId, clonedeep(menuData))
  return formatter(menu)
}


// "2018-06-27T07:27:50.000+0000"
// "2018-06-27T07:28:08.000+0000"
