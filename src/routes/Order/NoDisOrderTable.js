import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Input, Select, Popconfirm,
  message, Form, Modal, Tooltip} from 'antd';
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
  data: state.noDisOrder.data,
  loading: state.noDisOrder.loading,
  // total: state.courier.total,
  admin_id: state.admin_login.admin_id,
  roleId: state.admin_login.roleId,
  total: state.noDisOrder.count
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
      hiddenRowsId: [],
      cusId: null
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
    // 设置 state selectWriteKey 为空
  }

  componentWillReceiveProps ( nextProps ) {
    if (nextProps.data !== this.props.data) {
      this.setState({
        data: nextProps.data
      })
    }
  }

  handleModal = (val, index) => {
    this.setState({
      modalVisible: true,
      orderId: val.id,
      cusId: val.cusId,
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
        cusId: this.state.cusId,  // 订单客户id
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
        width:150
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
        title: '收件人(代购)姓名',
        dataIndex: 'receiverName'
      },
      {
        title: '收件人(代购)电话',
        dataIndex: 'receiverTel'
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
        title: '寄件(购货)地址',
        dataIndex: 'address',
        width: 300,
        render: (val, text, index)=>(
          <div>
            {
              text.senderAddress
            }
          </div>
        )
      },
      {
        // 快递物流订单下订单的时候只有省code， 考虑联表查出省的名字
        title: '收件地址',
        dataIndex: 'shou',
        width: 300,
        render: (val, text, index)=>(
          <div>
            {text.receiverAddr}
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
        // width:80,
        render: val => <span>
          {new Date(moment(val).toDate()).toLocaleString()}
          </span>
      },
      {
        title: '备注/清单',
        width: 100,
        dataIndex: 'comment',
        render: (val, record, index)=>(
          <div>
            {record.typeId==2?
              <Tooltip title={record.goodsType||'无'} >
                <span style={{cursor: 'pointer'}} >查看清单</span>
              </Tooltip>
              :<Tooltip title={val||'无'} >
                <span style={{cursor: 'pointer'}} >查看备注</span>
              </Tooltip>}
          </div>
        )
      },
      {
        title: '操作',
        width: 200,
        fixed: 'right',
        render: (val, text, index) => (
          <div>
            <a href={`/#/orderMap/${val.id}/${val.cusLongitude},${val.cusLatitude}`} >查看周边快递员</a>
            <a style={{color: 'red', marginLeft: 5}}
                  onClick={ ()=>{ this.handleModal(val, index) } }
            >取消订单</a>
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
              max: 100, message: '输入不能超过100个字'
            }]
          })(
            <TextArea placeholder='输入不超过100个字' rows={3} />
          )}
        </Form.Item>
      </Modal>
      <Table
        scroll={{ x: 2100 }}
        columns={columns}
        dataSource={this.state.data}
        rowKey={record => record.id }
        pagination={
          {
            // total: this.props.total,
            total: this.props.total,
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
