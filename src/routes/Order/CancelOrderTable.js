import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Input, Select, Popconfirm, message, Form, Modal, Tooltip} from 'antd';
import { cancelOrder } from '../../services/api'
import moment from 'moment/min/moment.min'

const { TextArea } = Input;
const Option = Select.Option
const WriteInput = ({getFieldDecorator, value, text}) => (
  <div>
    {getFieldDecorator(text, {
      initialValue: value,
      rules: [{required: true}]
    })(
      <Input />
    )}
  </div>
)

const SelectInput = ({getFieldDecorator, value, text, selectArr, width}) => (
  <div>
    {getFieldDecorator(text, {
      initialValue: value,
      //rules: [{required: true}]
    })(
      <Select style={{width: width||100}} >
        {selectArr.map( (item, i)=> (
          <Option key={i} value={item.id} >{item.category_name}</Option>
        ) )}
      </Select>
    )}
  </div>
)

@Form.create()
@connect(state => ({
  data: state.cancelOrder.data,
  loading: state.cancelOrder.loading,
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
      modalVisible: false,
      orderId: null,
      orderIndex: null,
      modalLoading: false,
      hiddenRowsId: []
    }
  }

  componentDidMount () {

  }

  handleWrite = (index) => {
    this.setState({
      selectWriteKey: index
    })
  }

  renderWriteInput = ( getFieldDecorator, value, text ) => {
    return <WriteInput getFieldDecorator={getFieldDecorator} value={value} text={text} ></WriteInput>
  }

  renderSlectInput = ( getFieldDecorator, value, text, selectArr, width ) => {
    return <SelectInput getFieldDecorator={getFieldDecorator} value={value} text={text} selectArr={selectArr} width={width} ></SelectInput>
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

  handleSave = (val, index) => {
    // console.log('ok')
    this.props.form.validateFields( (err,values)=>{
      if (err) {
        Modal.error({
          title: '输入的信息不能为空！'
        })
        return
      }
      updateCourier({
        adminId: parseInt(this.props.admin_id),  // 管理员id
        id: val.id,  // 需要修改状态的快递员的id
        roleId: parseInt(this.props.roleId), //当前管理员的权限id
        // isActive: values.is_active
        ...values
      })
        .then( res=>{
          let next_data = [...this.state.data]
          next_data[index].isActive = values.isActive
          next_data[index].username = values.username
          next_data[index].tel = values.tel
          if (res.status==='OK') {
            message.success('修改成功',1)
            this.setState({
              selectWriteKey: null,
              data: next_data
            })
          } else {
            message.error('修改失败，请重新尝试',1)
            this.setState({
              selectWriteKey: null,
            })
          }
        } )
        .catch( res=>{
          message.error('修改出错',1)
          this.setState({
            selectWriteKey: null,
          })
        } )
    } )
  }

  componentWillReceiveProps ( nextProps ) {
    if (nextProps.data !== this.props.data) {
      this.setState({
        data: nextProps.data
      })
    }
  }

  gotoDetails = (val) => {
    this.props.history.push(`/admin/cont/goods/goodsDetails/${val.id}`)
  }

  resetPsw=id=>{
    resetCourierPsw({
      id
    })
      .then(res=>{
        if (res.status==="OK") {
          message.success('重置成功', 1)
        } else {
          message.error('重置失败', 1)
        }
      })
  }

  handleModal = (id, index) => {
    this.setState({
      modalVisible: true,
      orderId: id,
      orderIndex: index
    })
  }
  // 取消订单处理函数
  cancelSubmit = e=> {
    this.props.form.validateFields( (err, value)=>{
      if (err) {
        message.error('长度不能超过100字！', 1)
        return
      }
      this.setState({
        modalLoading: true
      })
      cancelOrder({
        id: this.state.orderId, // 订单id
        cancelReason: value.cancelReason,
        cancelStatus: 1,  // 管理员取消为1
        cancelId: this.props.admin_id  // 管理员的id
      })
        .then( res=>{
          this.setState({
            modalLoading: false
          })
          if (res.status==='OK') {
            // 取消订单成功， 隐藏页面中这一行
            // this.setState({
            //   modalVisible: false,
            //   hiddenRowsIndex: []
            // })
            this.setState( (prevState, props)=>({
              modalVisible: false,
              hiddenRowsId: [...prevState.hiddenRowsId, prevState.orderId]
            }) )
            message.success('取消订单成功', 1)
          } else {
            message.error('取消订单失败，重新尝试', 1)
          }
        } )
        .catch( err=>{
          this.setState({
            modalLoading: false
          })
          message.error('服务器发生错误，请重新尝试', 1)
        } )
    } )
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const columns = [
      {
        title: '订单编号',
        dataIndex: 'ono',
        width:150,
        fixed: 'left'
      },
      {
        title: '客户姓名',
        dataIndex: 'senderName',
        width: 100,
      },
      {
        title: '联系电话 ',
        dataIndex: 'senderTel',
        width: 150,
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
        title: '预计金额',
        dataIndex: 'money',
        render: (val, text, index)=>(
          <div>
            <span style={{color: '#ff6700'}} >{text.fee}</span> 元
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
        title: '寄件地址',
        dataIndex: 'address',
        width: 100,
        render: (val, text, index)=>(
          <div>
            <Tooltip title={text.senderAddress} >
              <a style={{color: 'green'}} >查看地址</a>
            </Tooltip>
          </div>
        )
      },
      {
        title: '收件地址',
        dataIndex: 'shou',
        width: 100,
        render: (val, text, index)=>(
          <div>
            <Tooltip title={text.typeId==2?text.senderAddress:text.receiverAddr} >
              <a style={{color: 'green'}} >查看地址</a>
            </Tooltip>
          </div>
        )
      },
      {
        title: '距离／省归属地',
        dataIndex: 'dis',
        render: (val, text, index)=>(
          <div>
            {text.typeId==3?
              '快递物流':
              <div>{text.distance} 公里</div>
            }
          </div>
        )
      },
      {
        title: '下单时间',
        dataIndex: 'createTime',
        render: val => <span>{new Date(moment(val).toDate()).toLocaleString()}</span>
      },
      {
        title: '客户备注',
        width: 80,
        dataIndex: 'comment',
        render: (val, record, index)=>(
          <div>
            {val&&
            <Tooltip title={val} >
              <span style={{cursor: 'pointer'}} >查看备注</span>
            </Tooltip>
            }
          </div>
        )
      },
      // {
      //   title: '操作',
      //   width: 200,
      //   fixed: 'right',
      //   render: (val, text, index) => (
      //     <div>
      //       <a href={`/#/orderMap/${val.id}/${val.cusLongitude},${val.cusLatitude}`} >查看周边快递员</a>
      //       <a style={{color: 'red', marginLeft: 5}}
      //          onClick={ ()=>{ this.handleModal(val.id, index) } }
      //       >取消订单</a>
      //     </div>
      //   )
      // }
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
      <Modal
        onOk={ this.cancelSubmit }
        confirmLoading={this.state.modalLoading}

        onCancel={ ()=>{ this.setState({
          modalVisible: false,
          orderId: null,
          orderIndex: null
        }) } }
        title='确认取消订单？'
        visible={this.state.modalVisible}
      >
        <Form.Item label='取消订单理由(选填)' >
          {getFieldDecorator('cancelReason', {
            rules: [{
              max: 10, message: '输入不能超过100个字'
            }]
          })(
            <TextArea placeholder='输入不超过100个字' rows={3} />
          )}
        </Form.Item>
      </Modal>
      <Table
        scroll={{ x: 1600 }}
        columns={columns}
        dataSource={this.state.data}
        rowKey={record => record.id }
        pagination={
          {
            // total: this.props.total,
            total: 200,
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
