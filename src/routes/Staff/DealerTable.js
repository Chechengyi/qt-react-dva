import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Input, Select, Popconfirm, message, Form, Modal} from 'antd';
import { updateDealer, resetDealerPsw } from '../../services/api'
import ModalDeaOrderCount from './ModalDeaOrderCount'

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
  data: state.dealer.data,
  loading: state.dealer.loading,
  // total: state.courier.total,
  admin_id: state.admin_login.admin_id,
  roleId: state.admin_login.roleId,
  total:state.dealer.total
}))
export default class FrontDesk_table extends  PureComponent {

  constructor (props) {
    super(props)
    this.state = {
      selectedRowKeys: [],
      selectWriteKey: undefined,
      data: [],
    }
  }

  componentDidMount () {
    if (this.props.total === 0) {
      this.props.dispatch({
        type: 'goods/getTotal'
      })
    }
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

  handleModal =(id, username)=> {
    this.props.dispatch({
      type: 'dealerOrderCount/setDealerInfo',
      payload: {
        dealerId: id,
        dealerName: username
      }
    })
    this.props.dispatch({
      type: 'dealerOrderCount/setModal',
      payload: true
    })
  }

  handleSave = (val, index) => {
    this.props.form.validateFields( (err,values)=>{
      updateDealer({
        id: val.id,
        isActive: values.isActive
      })
        .then( res=>{
          if (res.status==='OK') {
            let next_data = [...this.state.data]
            message.success('修改成功！', 1)
            next_data[index].isActive = values.isActive
            this.setState({
              selectWriteKey: null,
              data: next_data
            })
          } else {
            message.success('修改失败，请重新尝试', 1)
          }
        } )
        .catch( err=>{
          message.error('服务器发生错误， 请重新尝试', 1)
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
    resetDealerPsw({
      id
    })
      .then( res=>{
        if(res.status==='OK'){
          message.success('密码重置成功', 1)
        } else {
          message.error('密码重置失败，请重新尝试', 1)
        }
      } )
      .catch( err=>{
        message.error('服务器发生错误，请重新尝试', 1)
      } )
  }

  render () {
    const { getFieldDecorator } = this.props.form
    let columns = [
      {
        title: '编号',
        dataIndex: 'id',
        width:50
      },
      {
        title: '经销商账户',
        dataIndex: 'account',
        width: 150
      },
      {
        title: '姓名',
        dataIndex: 'username',
        width:150,
        // render: (val, text, index) => (
        //   <div>
        //     {this.state.selectWriteKey===index?this.renderWriteInput(getFieldDecorator,val,'username'): val}
        //   </div>
        // )
      },
      {
        title: '联系电话 ',
        dataIndex: 'tel',
        width: 150,
        // render: (val, text, index) => (
        //   <div>
        //     {this.state.selectWriteKey===index?this.renderWriteInput(getFieldDecorator,val,'tel'): val}
        //   </div>
        // )
      },
      {
        title: '状态',
        dataIndex: 'isActive',
        render: (val, text, index) => (
          <div>
            {this.state.selectWriteKey===index?this.renderSlectInput(getFieldDecorator,val,'isActive', [{id: 0, category_name: '未激活'},{id:1,category_name: '激活'}], 100): this.idToName(val, [{id: 0, category_name: '未激活'},{id:1,category_name: '激活'}], 'category_name')}
          </div>
        )
      },
      // {
      //   title: '创建时间',
      //   dataIndex: 'create_time',
      //   // width:80,
      //   render: val => <span>{new Date(val).toLocaleDateString()}</span>
      // },
      {
        title: '管辖地区',
        dataIndex: 'adminAddress'
      },
    ]
    if (this.props.roleId==0) {
      columns.push({
        title: '操作',
        width: 180,
        render: (val, text, index) => (
          <div>
            {this.state.selectWriteKey===index?
              <div>
                <Popconfirm title='确定保存修改信息？' onConfirm={ () => { this.handleSave(val, index) } } ><a>保存</a></Popconfirm>
                <a style={{marginLeft: '5px'}} onClick={ () => { this.setState({ selectWriteKey: null }) } } >取消</a></div>:
              <div>
                <a onClick={ () => {this.handleWrite(index)} } >修改</a>
                <Popconfirm title='确定重置密码？' onConfirm={ () => { this.resetPsw(val.id) } } >
                  <a style={{marginLeft: '5px'}} >重置密码</a>
                </Popconfirm>
                <a onClick={ ()=>this.handleModal(text.id, text.username) } style={{marginLeft: 5}} >订单总计</a>
              </div>
            }
          </div>
        )
      })
    }
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
      <ModalDeaOrderCount />
      <Table
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
      />
    </div>
  }
}
