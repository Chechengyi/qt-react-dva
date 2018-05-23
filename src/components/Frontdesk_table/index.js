import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Table, Alert, Badge, Divider } from 'antd';
import styles from './index.less';

const data = [
  {
    id: 1,
    username: '中铁丰台园',
    user_ming: '中铁丰台园',
    call_p: '王某',
    tel: '13888888888',
    place: '丰台市政府',
    lei: '社会-连锁',
    vip_lei: '新发地报价',
    sui: '否',
    time: '17-10-08',
    lai: '',
    xiao: '周全胜',
    si: '张三',
    zhuang: '启用'
  },
  {
    id: 2,
    username: '中铁丰台园',
    user_ming: '中铁丰台园',
    call_p: '王某',
    tel: '13888888888',
    place: '丰台市政府',
    lei: '社会-连锁',
    vip_lei: '新发地报价',
    sui: '否',
    time: '17-10-08',
    lai: '',
    xiao: '周全胜',
    si: '张三',
    zhuang: '启用'
  }
]

const columns = [{
  title: '编号',
  dataIndex: 'id',
}, {
  title: '用户账号',
  dataIndex: 'username',
}, {
  title: '用户名称',
  dataIndex: 'user_ming',
},
  {
    title: '联系人',
    dataIndex: 'call_p',
  },
  {
    title: '电话',
    dataIndex: 'tel',
  },
  {
    title: '地址',
    dataIndex: 'place',
  },
  {
    title: '客户类型',
    dataIndex: 'lei',
    key: '4'
  },
  {
    title: 'VIP类型',
    dataIndex: 'vip_lei',
  },
  {
    title: '税率',
    dataIndex: 'sui',
  },
  {
    title: '注册时间',
    dataIndex: 'time',
    key: '7'
  },
  {
    title: '来源',
    dataIndex: 'lai',
  },
  {
    title: '销售',
    dataIndex: 'xiao',
  },
  {
    title: '司机',
    dataIndex: 'si',
  },
  {
    title: '状态',
    dataIndex: 'zhuang',
  },{
    title: '操作',
    render: () => (
      <div>
        <a href="">修改</a>
        <Divider type="vertical" />
        <a href="">价格</a>
        <Divider type="vertical" />
        <a href="">支持</a>
        <a href="">登录</a>
      </div>
    )
  }
];

const statusMap = ['default', 'processing', 'success', 'error'];

class StandardTable extends PureComponent {

   componentDidMount () {
     console.log(this)
   }

   render () {
     return <Table
              dataSource={data}
              columns={columns}
              rowKey={record => record.key}
              pagination={
                {
                  total: 500,
                  defaultCurrent: 1,
                  showQuickJumper: true
                }
              }
            ></Table>
   }
}

export default StandardTable;
