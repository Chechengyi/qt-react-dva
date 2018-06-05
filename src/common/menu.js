
const ROLEID = window.sessionStorage.getItem('roleId')

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
    name: '订单模块',
    icon: 'profile',
    path: 'admin/cont/order',
    children: [
      {
        name: '未分配订单',
        path: 'noDisOrder'
      },
      {
        name: '配送中订单',
        path: 'ships'
      },
      {
        name: '以完成订单',
        path: 'dones'
      },
      {
        name: '以取消订单',
        path: 'cancel'
      }
    ]
  },
  {
    name: '订单定位',
    icon: 'user',
    path: 'orderMap/2'
  }
  ]

function formatter(data, roleId, parentPath = '') {
  const list = [];
  data.forEach((item) => {
    if (item.children) {
      list.push({
        ...item,
        path: `${parentPath}${item.path}`,
        children: formatter(item.children, roleId, `${parentPath}${item.path}/`),
      });
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
