import mockjs from 'mockjs';
import { getRule, postRule } from './mock/rule';
import { getActivities, getNotice, getFakeList } from './mock/api';
import { getFakeChartData } from './mock/chart';
import { imgMap } from './mock/utils';
import { getProfileBasicData } from './mock/profile';
import { getProfileAdvancedData } from './mock/profile';
import { getNotices } from './mock/notices';
import { format, delay } from 'roadhog-api-doc';
import { frontdesk_talble, customer_data } from './mock/frontdesk'
import { shopcar_data } from './mock/shopcar'
import { data_cai, data_cai_search } from './mock/data_cai'
import { driver_data, driver_list } from './mock/driver_data'
import { gong_data } from './mock/gong'
import { order } from './mock/order'
import { order_data } from './mock/supplier'

// 是否禁用代理
const noProxy = process.env.NO_PROXY === 'false';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
const proxy = {
  'GET /frontdesk_table': frontdesk_talble,
  // 支持值为 Object 和 Array
  'GET /api/currentUser': {
    $desc: "获取当前用户接口",
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: {
      name: 'Serati Ma',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
      userid: '00000001',
      notifyCount: 12,
    },
  },
  // GET POST 可省略
  'GET /api/users': [{
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  }, {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  }, {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  }],
  'GET /api/project/notice': getNotice,
  'GET /api/activities': getActivities,
  'GET /api/rule': getRule,
  'POST /api/rule': {
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: postRule,
  },
  'POST /api/forms': (req, res) => {
    res.send({ message: 'Ok' });
  },
  'GET /api/tags': mockjs.mock({
    'list|100': [{ name: '@city', 'value|1-100': 150, 'type|0-2': 1 }]
  }),
  'GET /api/fake_list': getFakeList,
  'GET /api/fake_chart_data': getFakeChartData,
  'GET /api/profile/basic': getProfileBasicData,
  'GET /api/profile/advanced': getProfileAdvancedData,
  'POST /login/account': (req, res) => {
    const { password, username} = req.body;
    console.log('用户名')
    console.log(password)
    console.log(username)
    res.send({
      status: password === '888888' && username === 'admin' ? 'ok' : 'error',
      name: '管理-周',
      aid: 4
    });
  },
  //   模拟客户端
  'POST /client/register': (req, res) => {
    res.send({
      status: 'ok'
    })
  },
  //   模拟hot页面数据
  'GET /gethot': (req, res) => {
      var page = parseInt(req.query.page)
      if ( page == 2 ) {
        res.send([])
        return false
      }
      var num = parseInt(req.query.num)
      var offset = page * num
      console.log(page)
      var limit = offset + num
      var arr = []
      for ( var i=offset; i<limit; i++ ) {
        arr.push({
          id: i,
          goods_name: '云南橘子',
          goods_type: '散装',
          goods_price: i*2.5,
          goods_unit: '斤',
          goods_description: '新鲜的大橘子咯,新鲜的大橘子咯,新鲜的大橘子咯,新鲜的大橘子咯,新鲜的大橘子咯,新鲜的大橘子咯,新鲜的大橘子咯,新鲜的大橘子咯,新鲜的大橘子咯,新鲜的大橘子咯',
          goods_img: 'https://zos.alipayobjects.com/rmsportal/hfVtzEhPzTUewPm.png'
        })
      }
     res.send(JSON.stringify(arr))
  },
  // 模拟新品速递页面数据
  'GET /getnew': (req, res) => {
    var page = parseInt(req.query.page)
    if ( page == 2 ) {
      res.send([])
      return false
    }
    var num = parseInt(req.query.num)
    var offset = page * num
    console.log(page)
    var limit = offset + num
    var arr = []
    for ( var i=offset; i<limit; i++ ) {
      arr.push({
        id: i,
        goods_name: '新品速递',
        goods_type: '散装',
        goods_price: i*2.5,
        goods_unit: '斤',
        goods_description: '新鲜的大橘子咯,新鲜的大橘子咯,新鲜的大橘子咯,新鲜的大橘子咯,新鲜的大橘子咯,新鲜的大橘子咯,新鲜的大橘子咯,新鲜的大橘子咯,新鲜的大橘子咯,新鲜的大橘子咯',
        goods_img: 'https://zos.alipayobjects.com/rmsportal/hfVtzEhPzTUewPm.png'
      })
    }
    res.send(JSON.stringify(arr))
  },
  // 客户端搜索菜品请求
  'GET /search_goods': (req, res) => {
     var { page, num, search_name } = req.query
    if ( page > 1 ) {
       res.send([])
    } else if ( search_name == '枪' ) {
       res.send([])
    } else {
      res.send([{
        id: 5,
        goods_name: search_name,
        goods_type: '散装',
        goods_price: 30,
        goods_unit: '斤',
        goods_description: '新鲜的大橘子咯,新鲜的大橘子咯,新鲜的大橘子咯,新鲜的大橘子咯,新鲜的大橘子咯,新鲜的大橘子咯,新鲜的大橘子咯,新鲜的大橘子咯,新鲜的大橘子咯,新鲜的大橘子咯',
        goods_img: 'https://zos.alipayobjects.com/rmsportal/hfVtzEhPzTUewPm.png'
      },{
        id: 5,
        goods_name: search_name,
        goods_type: '散装',
        goods_price: 30,
        goods_unit: '斤',
        goods_description: '新鲜的大橘子咯,新鲜的大橘子咯,新鲜的大橘子咯,新鲜的大橘子咯,新鲜的大橘子咯,新鲜的大橘子咯,新鲜的大橘子咯,新鲜的大橘子咯,新鲜的大橘子咯,新鲜的大橘子咯',
        goods_img: 'https://zos.alipayobjects.com/rmsportal/hfVtzEhPzTUewPm.png'
      }])
    }
  },
  // 模拟获取购物车数据
  'GET /getshopcar': (req, res) => {
    var uid = req.body.uid
    res.send(shopcar_data)
  },
  // 添加购物车
  'POST /addshopcar': (req, res) => {
    var { uid, id, num, price } = req.query
    shopcar_data.push({
      id: id,
      goods_name: '云南橘子',
      goods_price: 5,
      goods_img: 'https://zos.alipayobjects.com/rmsportal/hfVtzEhPzTUewPm.png',
      num: num,
      price: price
    })
    res.send({
      status: 'ok'
    })
  },
  // 添加购物车之  购物车中以前买过此类物品
  'POST /updateshopcar': (req, res) => {
      res.send({
        status: 'ok'
      })
  },
  // 购买购物车中没有购买的所有商品  用cus_id做参数购买
  'POST /pay_all': (req, res) => {
    // var uid = req.query.uid
    var { uid, time } = req.query
    console.log('uid.......' + uid)
    console.log('time....' +time )
    res.send({
      status: 'ok'
    })
  },
  // 购买购物车中单个物品   用 购物车id购买 参数以 [id, id]形式发出
  'POST /pay_part': (req, res) => {
    res.send({
      status: 'ok'
    })
  },
  // 删除购物车中的物品， 参数为购物车id  参数以[id, id]形式发出
  'POST /delete_shopcar': (req, res) => {
    res.send({
      status: 'ok'
    })
  },

  // 客户端注册
  // 'POST /client/register': (req, res) => {
  //
  // },
  // 模拟客户端登录
  'POST /login/client':(req, res) => {
    const { password, username } = req.body
    // res.send({
    //   status: password === '888888' && username === 'zhangsan'? 'ok': 'error'
    // })
    if ( password === '888888' && username === 'zhangsan' ) {
      res.send({
        status: 'ok',
        id: 1,
        name: '张三'
      })
    } else {
      res.send({
        status: 'error'
      })
    }
  },
  // 模拟司机端登录
  'POST /driver/login': (req, res) => {
    const { password, username } = req.body
    res.send({
      status: password === '888888' && username === 'driver'? 'ok': 'error',
      name: '李玉亮',
      did: 2
    })
  },
  // 司机端获取订单列表
  'GET /driver/get_order': (req, res) => {
      const { page, num } = req.query
      if (page==20) {
        res.send([])
        return;
      }
      var arr = []
      for ( var i=page; i<page+num; i++ ) {
        arr.push({
          id: i,
          did: 1,
          goods_name: '圆白菜',
          supplier_name: 'b1-6 高红军 圆生菜专卖',
          goods_type: '叶菜类',
          goods_unit: '斤',
          purchaser_name: '阿潘达餐厅',
          goods_nums: 2,
          xiadan_time: '2017-12-30 23:01:01 ',
          songhuo_time: '2017-12-30',
          goods_specification: '散装',
          // 0为未捡， 1为已捡
          type: 0,
        })
      }
      res.send(arr)
  },
  // 司机端获取未捡货数据
  'GET /driver/get_order_pick': (req, res) => {
    res.send({
      id: 1,
      order_code: '02021721000008',
      count: 3,
      unit: '斤',
      cus_name: '张三',
      address: '软件园管委会'
    })
  },
  // 模拟供应商端登录
  'POST /supplier/login': (req, res) => {
      const {password, username} = req.body
    res.send({
      status: password === '888888' && username === 'supplier'? 'ok': 'error',
      id: 3,
      name: '林勇'
    })
  },
  // 供应商端获取未配货订单
  'GET /supplier/get_distribute': (req, res) => {
    res.send(order_data)
  },
  // 供应商配货请求
  'POST /supplier/add_distribute': (req, res) => {
    res.send({
      status: 'ok'
    })
  },
  'POST /supplier/add_goods': (req, res) => {
    res.send({
      status: 'ok'
    })
  },

  //管理员获取前台用户信息
  'GET /admin/get_customer_list': (req, res) => {
    res.send(customer_data)
  },
  // 改变前台管理员信息
  'POST /admin/change_customer': (req, res) => {
    res.send({
      status: 'ok'
    })
  },
  // 管理员获取供应商列表信息
  'GET /get_supplier_list': (req, res) => {
    // res.send(gong_data)
    if ( !req.query.page ) {
      res.send([
        {
          id: 1,
          gong_name: '正宗土鸡蛋'
        },
        {
          id: 2,
          gong_name: '火锅底料王'
        },
        {
          id: 5,
          gong_name: '专业大鹏蔬菜'
        }
      ])
    } else {
      res.send(gong_data)
    }
  },
  // 管理员添加供应商
  'POST /admin/addgong': (req, res) => {
    res.send({
      status: 'ok'
    })
  },
  // 管理员更改供应商信息
  'POST /admin/change_gong': (req, res) => {
    res.send({
      status: 'ok'
    })
  },
  // 管理员添加司机
  'POST /admin/add_driver': (req, res) => {
    res.send({
      status: 'ok'
    })
  },
  // 管理员获取司机列表
  'GET /admin/get_driver_list': (req, res) => {
    res.send(driver_list)
  },
  // 更改司机信息请求
  'POST /admin/change_driver': (req, res) => {
    res.send({
      status: 'ok'
    })
  },
  // 添加菜品
  'POST /admin/addcai': (req, res) => {
    res.send({
      status: 'ok'
    })
  },
  // 获取菜品列表
  'GET /getcai_list': (req, res) => {
    const { page, num } = req.query
    res.send(data_cai)
  },
  // 菜品列表搜索
  // 'GET /api/getcai_search': (req, res) => {
  //   res.send(data_cai_search)
  // },
  // 更改菜品信息
  'POST /admin/change_cai': (req, res) => {
    res.send({
      status: 'ok'
    })
  },
  // 获取供应商信息做下拉列表
  'GET /get_supplier': (req, res) => {
    res.send([
      {
        id: 1,
        gong_name: '正宗土鸡蛋'
      },
      {
        id: 2,
        gong_name: '火锅底料王'
      },
      {
        id: 5,
        gong_name: '专业大鹏蔬菜'
      }
    ])
  },
  // 管理员获取订单列表
  'GET /admin/get_order': (req, res) => {
    res.send(order)
  },
  // 管理员 修改分配前的订单
  'POST /admin/update_distribute_order': (req, res) => {
    res.send({
      status: 'ok'
    })
  },
  // 管理员获取 分配后的订单
  'GET /admin/get_distributed_order': (req, res) => {

  },
  // 管理员分配订单  分配或取消都在这里
  'POST /admin/handle_fenpei': (req, res) => {
    res.send({
      status: 'od'
    })
  },

  'POST /api/register': (req, res) => {
    res.send({ status: 'ok' });
  },
  'GET /api/notices': getNotices,
};

export default noProxy ? {} : delay(proxy, 1000);
