import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Input, Select, Popconfirm,
  message, Form, Modal, Tooltip, Popover} from 'antd';
import { adminSendArbitration } from '../../services/api'

const { TextArea } = Input;
const Option = Select.Option

@Form.create()
@connect(state => ({
  data: state.adminRate.data,
  loading: state.adminRate.loading,
  // total: state.courier.total,
  admin_id: state.admin_login.admin_id,
  roleId: state.admin_login.roleId,
}))

export default class FrontDesk_table extends  PureComponent {

  constructor (props) {
    super(props)
    this.state = {
      selectedRowKeys: [],
      selectWriteKey: undefined,
      data: [],
      hiddenRowsId: []
    }
  }

  //表格渲染翻译id
  idToName = ( id, arr, text ) => {
    var name = null
    for ( var i=0; i<arr.length; i++ ) {
      if ( arr[i].id === id ) {
        name = arr[i][text]
      }
    }
    return name
  }

  componentWillReceiveProps ( nextProps ) {
    if (nextProps.data !== this.props.data) {
      this.setState({
        data: nextProps.data
      })
    }
  }

  hiddenRow =id=> {
    // 把当前行的id写进hiddenRowsId中实现隐藏效果
    this.setState({
      hiddenRowsId: [...this.state.hiddenRowsId, id]
    })
  }

  sendOrder =id=> {
    adminSendArbitration({
      id
    })
      .then( res=>{
        if (res.status=='OK') {
          this.hiddenRow(id)
          console.log(res)
          message.success('发起仲裁成功！', 1)
        }
      })
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const columns = [
      {
        title: '订单编号',
        dataIndex: 'ono',
        width:150,
        // fixed: 'left'
      },
      {
        title: '星级评分',
        dataIndex: 'starLevel',
        render: val=>(
          <div>
            <span style={{color: '#ff6700', fontSize: '1.1em'}} >{val} 星</span>
          </div>
        )
      },
      {
        title: '客户评价',
        dataIndex: 'text',
        render: val=>(
          <div>
            { val?
              <Popover trigger="click" content={<div>{val}</div>} >
                <a>查看评价</a>
              </Popover>:
              <span>客户没有评价</span>
            }
          </div>
        )
      },
      {
        title: '订单类型',
        dataIndex: 'typeId',
        width: 80,
        render: (val, text, index)=>(
          this.idToName(val, [{id: 1, category_name: '同城急送'},{id:2,category_name: '代购服务'}, {id: 3,category_name: '快递物流'}], 'category_name')
        )
      },
      {
        title: '客户姓名',
        dataIndex: 'cusUsername',
        width: 100,
      },
      {
        title: '客户电话 ',
        dataIndex: 'cusTel',
        width: 120,
      },
      {
        title: '快递员姓名',
        dataIndex: 'couUsername'
      },
      {
        title: '快递员电话',
        dataIndex: 'couTel'
      },
      {
        title: '订单金额',
        dataIndex: 'actualFee',
        render: (val, text, index)=>(
          <div>
            <span style={{color: '#ff6700'}} >{text.actualFee}</span> 元
          </div>
        )
      },
      {
        title: '操作',
        render: (val, record, index)=>(
          <div>
            <Popconfirm title='确定发送给经销商？'
                        onConfirm={ ()=>this.sendOrder(record.id) }
            >
              <a>发送</a>
            </Popconfirm>
          </div>
        )
      }
    ]
    var self = this
    const rowSelection = {
      onChange (selectedRowKeys, selectedRows) {
        self.setState({
          selectedRowKeys: selectedRowKeys
        })
        self.props.onSelectRow(selectedRows, selectedRowKeys)
      },
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
      selectedRowKeys: this.state.selectedRowKeys
    };

    return <div>
      <Table
        // scroll={{ x: 1600 }}
        columns={columns}
        dataSource={this.state.data}
        rowKey={record => record.id }
        pagination={
          {
            // total: this.props.total,
            total: 500,
            defaultCurrent: 1,
            showQuickJumper: true,
            current: this.props.pageNo,
            onChange: this.props.onChange,
            pageSize: 10,
          }
        }
        size='small'
        loading={this.props.loading}
        //rowSelection={rowSelection}
        onRow={(record)=>{
          if ( this.state.hiddenRowsId.indexOf(record.id) > -1 ) {
            return {
              style: {
                display: 'none'
              }
            }
          } else {
            return {
              style: {
                display: ''
              }
            }
          }
        }}
      />
    </div>
  }
}
