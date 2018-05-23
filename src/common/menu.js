const menuData = [
  {
    name: '首页',
    icon: 'dashboard',
    path:'admin/cont/home',
    children: [
      {
        name: '前台用户',
        path: 'frontdesk'
      },
      {
        name: '测试',
        path: 'getPosition'
      }
    ]
  },
  {
    name: '订单定位',
    icon: 'user',
    path: 'orderMap/2'
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

export const getMenuData = () => formatter(menuData);
