import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Input, Select, Popconfirm,
  message, Form, Modal, Tooltip, Popover} from 'antd';
import { adminArbitration, dealerSendArbitration } from '../../services/api'

const { TextArea } = Input;
const Option = Select.Option

@Form.create()
@connect(state => ({
  data: state.adminArbitration.data,
  loading: state.adminArbitration.loading,
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

  renderOrderType = id=> {
    for ( let i=0; i<this.props.orderType.length; i++ ) {
      if (this.props.orderType[i].id==id) {
        return <div>{this.props.orderType[i].type}</div>
        console.log(this.props.orderType[i].type)
      }
    }
  }

  arbitration = id=> {
    Modal.confirm({
      title: '确认仲裁？',
      content: <div>
        <textarea ref={ref=>this.arbitrament=ref}
                  placeholder='仲裁意见' style={{width: '100%'}} rows="3"></textarea>
      </div>,
      onOk: ()=> {
        adminArbitration({
          id,
          arbitraStatus: 1,
          arbitrament: this.arbitrament.value
        })
          .then( res=>{
            this.arbitrament.value=''
            if (res.status==='OK') {
              message.success('仲裁成功！', 1)
              this.props.history.replace('/admin/cont/rate/arbitration')
            }
          })
      }
    })
  }

  // 经销商填写仲裁意见
  dealerSendArbitration = id=> {
    Modal.confirm({
      title: '确认仲裁？',
      content: <div>
        <textarea ref={ref=>this.arbitrament=ref}
                  placeholder='仲裁意见' style={{width: '100%'}} rows="3"></textarea>
      </div>,
      onOk: ()=> {
        dealerSendArbitration({
          id,
          disposeStatus: 1,
          adminResult: this.arbitrament.value
        })
          .then( res=>{
            this.arbitrament.value=''
            if (res.status==='OK') {
              message.success('意见填写成功！', 1)
              this.props.history.replace('/admin/cont/rate/arbitration')
            }
          })
      }
    })
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const adminColumns = [
      {
        title: '订单编号',
        dataIndex: 'ono',
        width:150,
        fixed: 'left'
      },
      {
        title: '星级评分',
        dataIndex: 'starLevel',
        render: val=>(
          <div style={{paddingLeft: 18}} >
            <span style={{color: '#ff6700', fontSize: '1.1em'}} >{val} 星</span>
          </div>
        )
      },
      {
        title: '是否处理',
        dataIndex: 'disposeStatus',
        render: val => (
          <div>
            {val===0?
              <span style={{color: 'red'}} >未处理</span>:
              <span style={{color: 'green'}} >已处理</span>}
          </div>
        )
      },
      {
        title: '是否仲裁',
        dataIndex: 'arbitraStatus',
        render: val=>(
          <div>
            {val===0?
              <span style={{color: 'red'}} >未仲裁</span>:
              <span style={{color: 'green'}} >以仲裁</span>}
          </div>
        )
      },
      {
        title: '经销商意见',
        dataIndex: 'adminResult',
        render: val=>(
          <div>
            { val?
              <Popover trigger="click" content={<div>{val}</div>} >
                <a>查看意见</a>
              </Popover>:
              <span>没有填写意见</span>
            }
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
        title: '操作',
        fixed: 'right',
        render: (val, record, index)=>(
          <div>
            {/*<Popconfirm title='确认仲裁？'*/}
                        {/*onConfirm={ ()=>this.sendOrder(record.id) }*/}
            {/*>*/}
              {/*<a>确认仲裁</a>*/}
            {/*</Popconfirm>*/}
            <a onClick={ ()=>this.arbitration(record.id) } >确认仲裁</a>
          </div>
        )
      }
    ]
    const dealerColumns = [
      {
        title: '订单编号',
        dataIndex: 'ono',
        width:150,
        fixed: 'left'
      },
      {
        title: '星级评分',
        width: 100,
        dataIndex: 'starLevel',
        render: val=>(
          <div style={{paddingLeft: 18}} >
            <span style={{color: '#ff6700', fontSize: '1.1em'}} >{val} 星</span>
          </div>
        )
      },
      {
        title: '是否处理',
        width: 120,
        dataIndex: 'disposeStatus',
        render: val => (
          <div>
            {val===0?
              <span style={{color: 'red'}} >未处理</span>:
              <span style={{color: 'green'}} >已处理</span>}
          </div>
        )
      },
      {
        title: '是否仲裁',
        dataIndex: 'arbitraStatus',
        render: val=>(
          <div>
            {val===0?
              <span style={{color: 'red'}} >未仲裁</span>:
              <span style={{color: 'green'}} >以仲裁</span>}
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
        width: 130,
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
        title: '操作',
        fixed: 'right',
        render: (val, record, index)=>(
          <div>
            {record.disposeStatus==0?
              <a onClick={ ()=>this.dealerSendArbitration(record.id) } >填写仲裁意见</a>:
              <span>已经处理了</span>
            }
          </div>
        )
      }
    ]

    const columns = parseInt(this.props.roleId)>0?dealerColumns:adminColumns

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
        scroll={{ x: 1200 }}
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
