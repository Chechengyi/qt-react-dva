

export function getRoleMenu (roleId, menu){
  // 验证roleId必须为数字
  if (typeof roleId !== 'number') {
    new Error('roleId必须为数字！')
    return []
  }
  let roleMenu = []

  // 超级管理员
  if (roleId===0 || !roleId ) {
    roleMenu = menu
    return roleMenu
  }

  // 文员
  if (roleId<0) {
    menu.forEach( item=>{
      if (item['role']) {
        if (item['role'].indexOf('clerk')> -1) {
          if (item.children) {
            item.children = getRoleMenu(roleId, item.children)
          }
          roleMenu.push(item)
        }
      } else {
        if (item.children) {
          item.children = getRoleMenu(roleId, item.children)
        }
        roleMenu.push(item)
      }
    })
    return roleMenu
  }

  // 经销商
  if (roleId>0) {
    menu.forEach( item=>{
      if (item['role']) {
        if (item['role'].indexOf('dealer')> -1) {
          if (item.children) {
            item.children = getRoleMenu(roleId, item.children)
          }
          roleMenu.push(item)
        }
      } else {
        if (item.children) {
          item.children = getRoleMenu(roleId, item.children)
        }
        roleMenu.push(item)
      }
    })
    return roleMenu
  }
}



// function formatter(data, roleId, parentPath = '') {
//   const list = [];
//   data.forEach((item) => {
//     if (item.children) {
//       // 判断是否需要管理员权限
//       if ( item.isAdmin ) {
//         if (roleId==0) { // 如果该项需要管理员权限，验证roleId是否为0
//           list.push({
//             ...item,
//             path: `${parentPath}${item.path}`,
//             children: formatter(item.children, roleId, `${parentPath}${item.path}/`),
//           })
//         }
//       } else {
//         list.push({
//           ...item,
//           path: `${parentPath}${item.path}`,
//           children: formatter(item.children, roleId, `${parentPath}${item.path}/`),
//         })
//       }
//
//     } else {
//       if (item.isAdmin) {
//         // 验证roleId， 管理员具有的一些操作权限经销商不能看到
//         if (roleId==0){
//           list.push({
//             ...item,
//             path: `${parentPath}${item.path}`,
//           });
//         }
//       } else {
//         list.push({
//           ...item,
//           path: `${parentPath}${item.path}`,
//         });
//       }
//     }
//   });
//   return list;
// }
