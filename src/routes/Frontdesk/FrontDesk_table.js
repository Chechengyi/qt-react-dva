import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { cloneDeep } from 'lodash'
import { Table, Input, Select, Popconfirm, message} from 'antd';
import { change_customer, delete_cus, admin_change_cus_psw } from '../../services/api'

const style_a = {
  marginRight: '5px'
}
const { Option } = Select
let originData = []
let changeData = []

const EditCom_input = ({val, index, text, edit, onChange}) => (
  <div>
    { edit[`s${index}`] ? <Input size='small' defaultValue={val} onChange={ e => { onChange(e.target.value, index, text )  } } /> : val}
  </div>
)

const EditCom_Select = ({val, index, edit, options, record, text, onChange, width }) => (
  <div>
    { edit[`s${index}`]? <Select size='small' defaultValue={options[record[text]]} onChange={ e => { onChange(e, index, text) }} style={{width: width}} >
      {
        options.map( (e,i) =>(
          <Option key={i} value={i} >{e}</Option>
        ) )
      }
    </Select> : options[record[text]]}
  </div>
)

@connect( state => ({
  data: state.frontdesk.data,
  loading: state.frontdesk.loading,
  driver_drop: state.global_drop.driver_list
}) )
export default class FrontDesk_table extends PureComponent {

  constructor (props) {
    super(props)
    this.state = {
      selectedRowKeys: [],
      data: this.props.data,
      editArr: {},
      driver_drop: []
    }
  }

  componentDidMount () {
    if ( this.props.driver_drop.length === 0 ) {
      this.props.dispatch({
        type: 'global_drop/get_driver'
      })
    } else {
      var obj = []
      for ( var i=0; i<this.props.driver_drop.length; i++ ) {
        obj[this.props.driver_drop[i].id] = this.props.driver_drop[i].driver_name
      }
      this.setState({
        driver_drop: obj
      })
    }
  }

  componentWillReceiveProps (nextProps) {
    if ( nextProps.data !== this.props.data ) {
      this.setState( {
        data: nextProps.data,
        selectedRowKeys: []
      } )
      this.props.onSelectRow([], [])
      originData = cloneDeep(nextProps.data)
      changeData = cloneDeep(nextProps.data)
    }
    if ( nextProps.driver_drop !== this.props.driver_drop ) {
      var obj = []
      for ( var i=0; i<nextProps.driver_drop.length; i++ ) {
        obj[nextProps.driver_drop[i].id] = nextProps.driver_drop[i].driver_name
      }
      this.setState({
        driver_drop: obj
      })
    }
  }

  renderColumns = (val, index, text) => {
    return <EditCom_input val={val} index={index} text={text} edit={this.state.editArr} onChange={ this.input_change }  />
  }

  renderColumns_select = (val, index, record, text, options, width) => {
    return <EditCom_Select width={width} val={val} record={record} text={text} onChange={this.input_change}  index={index} edit={this.state.editArr} options={options} />
  }

  change_edit = (index) => {
    if ( !this.state.editArr[`s${index}`] ) {
      var arr = { ...this.state.editArr }
      arr[`s${index}`]  =true
      this.setState( {
        editArr: arr
      } )
    } else {
      var arr = { ...this.state.editArr }
      delete arr[`s${index}`]
      this.setState( {
        editArr: arr
      } )
    }
  }

  input_change = (value, index, text) => {
    changeData[index][text] = value
  }

  handle_save = (index) => {
    this.setState({
      data: changeData
    })
    var arr = { ...this.state.editArr }
    delete arr[`s${index}`]
    this.setState({
      editArr: arr
    })
    originData = cloneDeep(changeData)
    var data = changeData[index]

    change_customer({...data})
      .then( (res) => {
      } )
  }

  handle_cancel = (index) => {
    var arr = { ...this.state.editArr }
    delete arr[`s${index}`]
    this.setState({
      editArr: arr
    })
    this.setState({
      data: originData
    })
  }

  handle_delete = (id,index) => {

    delete_cus({range: [id]})
      .then( res => {
        if ( res.status == 'ok' ) {
          message.success('删除成功', 0.5)
          this.delete_page_data(index)
        } else {
          message.warning('删除失败', 0.5)
        }
      } )
  }
  // 删除页面数据， 获得前端视觉效果删除
  delete_page_data = (index) => {
    changeData.splice(index,1)
    var new_data = cloneDeep(changeData)
    this.setState({
      data: new_data
    })
  }

  handle_reset = (id) => {
    admin_change_cus_psw( {id} )
      .then( res => {
        if (res.status === 'ok') {
          message.success('重置成功', 1)
        } else {
          message.error('重置失败', 1)
        }
      } )
  }

  render () {

    var self = this
    const {selectedRowKeys} = this.state
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
    const columns = [
      {
        title: '编号',
        dataIndex: 'id',
        key: 'id'
      },
      {
        title: '用户账号',
        dataIndex: 'username',
        key: 'username'
      },
      {
        title: '用户名称',
        dataIndex: 'cus_name',
        key: 'cus_name',
        width: 100,
        render: (val, record, index) => this.renderColumns(val, index, 'cus_name')
      },
      {
        title: '联系人',
        dataIndex: 'cus_contact',
        key: 'cus_contact',
        width: 80,
        render: (val, record, index) => this.renderColumns(val, index, 'cus_contact')
      },
      {
        title: '电话',
        dataIndex: 'cus_tel',
        key: 'cus_tel',
        width: 120,
        render: (val, record, index) => this.renderColumns(val, index, 'cus_tel')
      },
      {
        title: '地址',
        dataIndex: 'address',
        key: 'address',
        render: (val, record, index) => this.renderColumns(val, index, 'address')
      },
      // int类型 0 连锁 1 普通
      {
        title: '客户类型',
        dataIndex: 'cus_type',
        key: 'cus_type',
        width: 80,
        render: (val, record, index) => this.renderColumns_select(val, index, record, 'cus_type', [ '连锁', '普通'], 80)
      },
      // {
      //   title: 'VIP类型',
      //   dataIndex: 'vip_type',
      //   key: 'vip_type'
      // },
      // {
      //   title: '税率',
      //   dataIndex: 'shui'
      // },
      {
        title: '注册时间',
        dataIndex: 'create_time',
        key: 'create_time',
        render: (val) => <span>{new Date(val).toLocaleDateString()}</span>
      },
      // {
      //   title: '来源',
      //   dataIndex: 'from'
      // },
      // {
      //   title: '销售',
      //   dataIndex: 'xiao'
      // },
      {
        title: '司机',
        dataIndex: 'driver_id',
        width: 100,
        render: (val, record, index) => this.renderColumns_select(val, index, record, 'driver_id', this.state.driver_drop, 80 )
      },
      {
        title: '状态',
        dataIndex: 'is_active',
        render: (val, record, index) => this.renderColumns_select(val, index, record, 'is_active', ['锁定', '启用'], )
      },
      {
        title: '操作',
        width: 100,
        render: (text, record, index) => (
          <div>
            {this.state.editArr[`s${index}`]? <div>
              <a style={style_a} onClick={ () => { this.handle_save(index) } } >保存</a>
              <a onClick={ () => { this.handle_cancel(index) } } >取消</a>
            </div>:<div>
              <a style={style_a} onClick={ () => { this.change_edit(index) } } >修改</a>
              <Popconfirm title='确认删除？' onConfirm={ () => { this.handle_delete(text.id, index) } } >
                <a style={{color: 'red'}} >删除</a>
              </Popconfirm>
              <Popconfirm title='确认重置？' onConfirm={ () => { this.handle_reset(text.id, index) } } >
                <a style={{marginLeft: 5}} >重置密码</a>
              </Popconfirm>
            </div> }
          </div>
        )
      }
    ]

    return <div>
      <Table
        columns={columns}
        dataSource={this.state.data}
        rowKey={record => record.id }
        pagination={
          {
            total: 500,
            defaultCurrent: 1,
            showQuickJumper: true,
            current: this.props.page,
            onChange: this.props.onChange
          }
        }
        size='small'
        loading={this.props.loading}
        rowSelection={rowSelection}
      />
    </div>
  }
}
