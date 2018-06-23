import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Table, Input, Select, Popconfirm, message, Form, Modal} from 'antd';
import { adminPutProvincePrice } from '../../services/api'

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
  data: state.provincePriceList.data,
  loading: state.provincePriceList.loading,
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
      console.log(values)
      adminPutProvincePrice({
        id: val.id,
        proCode: val.proCode,
        // isActive: values.is_active
        ...values,
        comment: val.comment
      })
        .then( res=>{
          let next_data = [...this.state.data]
          next_data[index].startPrice = values.startPrice
          next_data[index].startWeight = values.startWeight
          next_data[index].weightPrice = values.weightPrice
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

  render () {
    const { getFieldDecorator } = this.props.form
    const columns = [
      {
        title: '编号',
        dataIndex: 'id',
        width:50
      },
      {
        title: '省／直辖市',
        dataIndex: 'name',
        width: 150
      },
      {
        title: '首重(公斤)',
        dataIndex: 'startWeight',
        width:150,
        render: (val, text, index) => (
          <div>
            {this.state.selectWriteKey===index?this.renderWriteInput(getFieldDecorator,val,'startWeight'): val}
          </div>
        )
      },
      {
        title: '起步价(元)',
        dataIndex: 'startPrice',
        width: 150,
        render: (val, text, index) => (
          <div>
            {this.state.selectWriteKey===index?this.renderWriteInput(getFieldDecorator,val,'startPrice'): val}
          </div>
        )
      },
      {
        title: '续重(公斤)',
        dataIndex: 'weightPrice',
        render: (val, text, index) => (
          <div>
            {this.state.selectWriteKey===index?this.renderWriteInput(getFieldDecorator,val,'weightPrice'): val}
          </div>
        )
      },
      // {
      //   title: 'commen',
      //   dataIndex: 'createTime',
      //   // width:80,
      //   // render: val => <span>{new Date(val).toLocaleDateString()}</span>
      // },
      {
        title: '操作',
        width: 150,
        render: (val, text, index) => (
          <div>
            {this.state.selectWriteKey===index?
              <div>
                <Popconfirm title='确定保存修改信息？' onConfirm={ () => { this.handleSave(val, index) } } ><a>保存</a></Popconfirm>
                <a style={{marginLeft: '5px'}} onClick={ () => { this.setState({ selectWriteKey: null }) } } >取消</a></div>:
              <div>
                <a onClick={ () => {this.handleWrite(index)} } >修改</a>
                <Popconfirm title="确定重置密码？" onConfirm={ ()=>{ this.resetPsw(val.id) } } >
                  <a style={{marginLeft: '5px'}} >重置密码</a>
                </Popconfirm>
              </div>
            }
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
        columns={columns}
        dataSource={this.state.data}
        rowKey={record => record.id }
        pagination={
          {
            // total: this.props.total,
            total: 34,
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
      />
    </div>
  }
}
