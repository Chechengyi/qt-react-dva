import { stringify } from 'qs';
import request from '../utils/request';

// let api = 'http://'

// 模拟首页用户前台管理数据
export async function get_customer_list (params) {
  return request(`/admin/get_customer_list?${stringify(params)}`)
}
// 更改前台用户信息
export async function change_customer (params) {
  return request('/admin/change_customer', {
    method: 'POST',
    body: params
  })
}
// 管理员重置前台用户密码
export async function admin_change_cus_psw (params) {
  return request('/admin/reset_customer', {
    method: 'POST',
    body: params
  })
}
// 管理员删除前台用户
export async function delete_cus (params) {
  return request('/admin/deleteCus',{
    method: 'POST',
    body: params
  })
}
// 管理员增加用户
export async function add_cus (params) {
  return request('/admin/add_customer', {
    method: 'POST',
    body: params
  })
}
// 获取供应商信息
export async function get_supplier_list (params) {
  return request(`/get_supplier_list?${stringify(params)}`)
}
// 更改供应商信息
export async function change_gong (params) {
  return request('/admin/change_gong', {
    method: 'POST',
    body: params
  })
}
// 管理员导出供应商订单， 相当于供应商订单已经配货
export async function admin_daochu_gong_order (params) {
  return request('/admin/add_sdistribute_order', {
    method: 'POST',
    body: params
  })
}
// 管理员重置供应商密码
export async function reset_gong_psw (params) {
  return request('/admin/reset_supplier', {
    method: 'POST',
    body: params
  })
}
// 管理员删除供应商账户
export async function delete_gong (params) {
  return request('/admin/delete_supplier', {
    method: 'POST',
    body: params
  })
}
// 获取供应商列表做下拉框选择
export async function get_supplier_name (params) {
  return request('/get_supplier')
}
// 获取菜品列表信息
export async function get_cailist (params) {
  return request(`/getcai_list?${stringify(params)}`)
}
// 修改菜品信息
export async function change_cai (params) {
  return request('/admin/change_cai', {
      method: 'POST',
      body: params
  })
}

// 添加菜品请求
// export async function add_cai (params) {
//   return request('/admin/addcai', {
//     method: 'POST',
//     body: params
//   })
// }
// 管理员添加菜品
export async function add_cai_img (params) {
  let form = new FormData()
  for ( let i in params ) {
    if ( params. hasOwnProperty(i) ) {
      form.append(i, params[i])
    }
  }
  return fetch('/admin/addcai', {
    method: 'POST',
    body: form
  })
    .then( res => {
      return res.json()
    } )
}
// 管理员更改菜品图片
export async function update_cai_img (params) {
  let form = new FormData()
  for ( let i in params ) {
    form.append(i, params[i])
  }
  return fetch('/admin/update_product_img', {
    method: 'POST',
    body: form
  })
    .then( res => {
      return res.text()
    } )
}
// 添加司机请求
export async function add_driver (params) {
  return request('/admin/add_driver', {
    method: 'POST',
    body: params
  })
}
// 管理员重置司机密码
export async function reset_driver_psw (params) {
  return request('/admin/reset_driver', {
    method: 'POST',
    body: params
  })
}
// 管理员删除司机账户
export async function delete_driver (params) {
  return request('/admin/delete_driver', {
    method: 'POST',
    body: params
  })
}
// 管理员财务管理获取供应商结算请求
export async function admin_money_supplier (params) {
  return request(`/admin/get_need_in?${stringify(params)}`)
}
// 管理员导出客户结算， 相当于改客户结算状态
export async function admin_daochu_cus (params) {
  return request('/admin/export_cus_order', {
    method: 'POST',
    body: params
  })
}
// 管理员财务管理获取供应商结算数据
export async function admin_money_gong (params) {
  return request(`/admin/get_need_out?${stringify(params)}`)
}
// 管理员财务管理导出供应商数据
export async function admin_daochu_gong (params) {
  return request('/admin/export_sup_order', {
    method: 'POST',
    body: params
  })
}
// 更改司机信息请求
export async function change_driver (params) {
  return request('/admin/change_driver', {
    method: 'POST',
    body: params
  })
}
// 获取司机列表请求
export async function get_driver_list (params) {
  return request(`/admin/get_driver_list?${stringify(params)}`)
}
// 添加供应商请求
export async function add_gong (params) {
  return request('/admin/addgong', {
    method: 'POST',
    body: params
  })
}
// 获取菜品列表——搜索
export async function  get_cai_search (params) {
  return request(`/api/getcai_search?${stringify(params)}`)
}
// 管理员获取供应商菜品列表 传入参数id,
export async function  get_supplier_goods (params) {
  return request(`/supplier/find_goods?${stringify(params)}`)
}
// 管理员端获取历史订单
export async function get_history_order (params) {
  return request(`/admin/get_done_order?${stringify(params)}`)
}
// 管理员获取订单列表请求
export async function get_order (params) {
  return request(`/admin/get_order?${stringify(params)}`)
}
// 管理员获取分配前的订单信息
export async function get_distribute_order (params) {
  return request(`/admin/get_distribute_order?${stringify(params)}`)
}
// 管理员获取分配后的订单信息
export async function get_distributed_order (params) {
  return request(`/admin/get_distributed_order?${stringify(params)}`)
}
// 管理员修改分配前的订单的信息
export async function update_distribute_order (params) {
  return request('/admin/update_distribute_order', {
    method: 'POST',
    body: params
  })
}

// 管理员一键分配订单
export async function distribute_all (params) {
  return request('/admin/distribute_all_order', {
    method: 'POST',
    body: params
  })
}

// 获取商品个数
export async function get_goods_count (params) {
  return request('/get_goods_count')
}
// 获取未分配订单个数
export async function get_order_count_wei (params) {
  return request('/get_dorder_count')
}
// 获取已分配订单个数
export async function get_order_count_yi () {
  return request('/get_ddorder_count')
}

// 管理员删除修改分配订单前的信息
export async function delete_distribute_order (params) {
  return request('/admin/delete_distribute_order', {
    method: 'POST',
    body: params
  })
}

// 管理员分配订单， 分配或取消
export async function add_distribute_order (params) {
  return request('/admin/add_distribute_order', {
    method: 'POST',
    body: params
  })
}

// 客户端登录
export async function  client_login (params) {
  return request('/login/client', {
    method: 'POST',
    body: params
  })
}
// 客户端修改密码
export async function change_client_psw (params) {
  return request('/cus_update', {
    method: 'POST',
    body: params
  })
}
// 客户端注册
export async function client_register (params) {
  return request('/client/register', {
    method: 'POST',
    body: params
  })
}
// 客户端获取订单列表
export async function client_get_order (params) {
  return request(`/customer/get_order?${stringify(params)}`)
}
// hot 长列表
export async function  get_hot (params) {
  return request(`/gethot?${stringify(params)}`)
}
// new 长列表
export async function get_new (params) {
  return request(`/getnew?${stringify(params)}`)
}
// 客户端搜索列表
export async function search_goods (params) {
  return request(`/gethot?${stringify(params)}`)
}
// 获取购物车总价， 数量
export async function getshopcar_list (params) {
  return request(`/getshopcar?${stringify(params)}`)
}
// 添加购物车请求
export async function add_shopcar (params) {
  // return request(`/addshopcar?${stringify(params)}`)
  return request('/addshopcar', {
    method: 'POST',
    body: params
  })
}
// 添加购物车。 购物车中已经购买过此类商品
export async function update_shopcar (params) {
  // return request(`/updateshopcar?${stringify(params)}`)
  return request('/updateshopcar', {
    method: 'POST',
    body: params
  })
}
// 购买购物车里全部品
export async function buy_shopcar (params) {
  // return request(`/buy_shopcar?${stringify(params)}`)
  return request('/pay_all', {
    method: 'POST',
    body: params
  })
}
// 购买购物车里的一些商品
export async function buy_shopcar_part (params) {
  return request('/pay_part', {
    method: 'POST',
    body: params
  })
}

// 删除购物车里面的商品
export async function delete_shopcar (params) {
  return request('/delete_shopcar', {
    method: 'POST',
    body: params
  })
}

// 司机端登录
export async function driver_login (params) {
  return request('/driver/login', {
    method: 'POST',
    body: params
  })
}
// 司机端修改密码
export async function driver_change_psw (params) {
  return request('/driver/update_driver', {
    method: 'POST',
    body: params
  })
}
// 司机获取订单重量   order_num
export async function driver_get_weight (params) {
  return request(`http://wserver.gou6.cc:30204/data?${stringify(params)}`)
}
// 获取司机端订单列表
export async function get_driver_order (params) {
  return request(`/driver/get_order?${stringify(params)}`)
}
// 司机上传称重数据
export async function driver_weight (params) {
  return request('/driver/weight_order', {
    method: 'POST',
    body: params
  })
}
// 司机端获取还未捡的货的数据
export async function get_driver_order_pick (params) {
  return request(`/driver/get_order_pick?${stringify(params)}`)
}
// 司机获取已捡货的数据
export async function get_driver_picked (params) {
  return request(`/driver/get_order_picked?${stringify(params)}`)
}
// 供应商端登录
export async function supplier_login (params) {
  return request('/supplier/login', {
    method: 'POST',
    body: params
  })
}
// 供应商更改密码
export async function supplier_change_psw (params) {
  return request('/supplier/update_supplier', {
    method: 'POST',
    body: params
  })
}
// 供应商获取未配货订单
export async function supplier_get_distribute (params) {
  return request(`/supplier/get_distribute?${stringify(params)}`)
}
// 供应商获取历史订单
export async function supplier_get_history_order (params) {
  return request(`/supplier/history_order?${stringify(params)}`)
}

// 供应商配货请求
export async function supplier_add_distribute (params) {
  return request('/supplier/add_distribute', {
    method: 'POST',
    body: params
  })
}
// 供应商添加 供应商菜品
export async function supplier_add_goods (params) {
  return request('/supplier/add_goods', {
    method: 'POST',
    body: params
  })
}
// 供应商修改商品信息
export async function supplier_update_goods (params) {
  return request('/supplier/update_goods', {
    method: 'POST',
    body: params
  })
}
// 供应商删除商品
export async function supplier_delete_goods (params) {
  return request('/supplier/delete_goods', {
    method: 'POST',
    body: params
  })
}

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function fakeAccountLogin(params) {
  return request('/login/account', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}

