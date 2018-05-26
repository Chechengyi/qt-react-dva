const menuData = [
  {
    isAdmin: true, // isAdmin代表只有管理员可以看到该菜单栏， 经销商看不到
    name: '用户管理',
    icon: 'user',
    path: 'admin/cont/client'
  },
  {
    name: '平台人员管理',
    icon: 'usergroup-add',
    path: 'admin/cont/people',
    children: [
      {
        name: '经销商管理',
        path: 'admin/cont/people/dealer'
      },
      // {
      //   name: '用户管理',
      //   path: 'client'
      // },
      {
        name: '快递员管理',
        path: 'admin/cont/people/courier'
      }
    ]
  },
  {
    name: '首页',
    icon: 'dashboard',
    path:'admin/cont/home',
    children: [
      {
        name: '前台用户',
        path: 'admin/cont/home/frontdesk'
      },
      {
        name: '测试',
        path: 'admin/cont/home/getPosition'
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
        children: formatter(item.children, `${parentPath}${item.path}/`),
      });
    } else {
      if (item.isAdmin) {
        // 验证roleId， 管理员具有的一些操作权限经销商不能看到
        if (roleId===0) {
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
