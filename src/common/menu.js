
const menuData = [
  {
    name: '平台人员管理',
    icon: 'usergroup-add',
    path: 'admin/cont/people',
    children: [
      {
        isAdmin: true,
        name: '经销商管理',
        path: 'dealer'
      },
      {
        isAdmin: true, // isAdmin代表只有管理员可以看到该菜单栏， 经销商看不到
        name: '用户管理',
        // icon: 'user',
        path: 'cus'
      },
      {
        name: '快递员管理',
        path: 'courier'
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
  {
    name: '聊天信息',
    icon: 'wechat',
    path: '/admin/cont/chat'
  },
  {
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
    name: '快递员送单管理',
    path: 'admin/cont/orderTime'
  }
  ]

function formatter(data, roleId, parentPath = '') {
  const list = [];
  data.forEach((item) => {
    if (item.children) {
      // 判断是否需要管理员全县
      if ( item.isAdmin ) {
        if (roleId==0) { // 如果该项需要管理员权限，验证roleId是否为0
          list.push({
            ...item,
            path: `${parentPath}${item.path}`,
            children: formatter(item.children, roleId, `${parentPath}${item.path}/`),
          })
        }
      } else {
        list.push({
          ...item,
          path: `${parentPath}${item.path}`,
          children: formatter(item.children, roleId, `${parentPath}${item.path}/`),
        })
      }

    } else {
      if (item.isAdmin) {
        // 验证roleId， 管理员具有的一些操作权限经销商不能看到
        if (roleId==0){
          list.push({
            ...item,
            path: `${parentPath}${item.path}`,
          });
        }
      } else {
        list.push({
          ...item,
          path: `${parentPath}${item.path}`,
        });
      }
    }
  });
  return list;
}

export const getMenuData = (roleId) => formatter(menuData, roleId);
