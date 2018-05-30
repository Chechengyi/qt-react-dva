import React, { PureComponent } from 'react';
import { Form, Input, Row, Col, Button, message,
  Select, Divider, Spin
} from 'antd'
import { connect } from 'dva'
import { dealerReapet, getProvince, addDealer,
  getProvinceDealers, getCityDealers, getdistrictDealers
} from '../../services/api'
import { promise_ } from '../../services/utils'
const Option = Select.Option
const FormItem = Form.Item
@Form.create()
@connect( state=>({
  admin_id: state.admin_login.admin_id
}) )
export default class AddDealer extends PureComponent {
  constructor(props){
    super(props)
    this.state={
      loading: false,
      isRepeat: null,
      initProvince: [],
      provinceList: [],  // 省级下拉列表
      cityList: [],  //  市下拉列表
      districtList: [],  // 区县下拉列表
      streetList: true,
      getMore: false,
      type: 'province',
      provinceData: {
        id: null,
        name: null
      },
      cityData: {
        id: null,
        name: null
      },
      districtData: {
        id: null,
        name: null
      }
    }
  }

  componentDidMount(){
    getProvince()
      .then( res=>{
        this.setState({
          provinceList: res.data,
          getMore: true
        })
      } )
  }

  handleSubmit=()=>{
    if (this.state.isRepeat==='REPEAT'||!this.state.isRepeat) {
      return
    }
    this.props.form.validateFields(['account','tel','username','address', 'street'], (err,values)=>{
      if (/^\s*$/.test(values.street) || !values.street ){
        // 表明这是添加前三级的经销商
        if (err) {
          message.error('请完善供应商基本信息' ,1)
          return
        }
        // 添加经销商的请求
        addDealer({
          id: this.props.admin_id,
          roleId: this.state[`${this.state.type}Data`]['id'],
          account: values.account,
          username: values.username,
          tel: values.tel,
          area: this.state.type,
          Address: values.address
        })
          .then( res=>{
            console.log(res.status)  // 返回null？
            if (res.status==='OK') {
              message.success('添加成功', 1)
              this.props.history.replace('/admin/cont/people/addDealer')
            } else {
              message.error('添加失败，请重新尝试', 1)
            }
          } )
          .catch( err=>{
            message.error('服务器发生错误，请重新尝试', 1)
          } )
      } else {
        // 表明这是添加第四级经销商
      }
      // 添加经销商请求
    } )
  }

  handleChange=e=>{
    clearTimeout(this.timer)
    this.timer = setTimeout( ()=>{
      let account = this.props.form.getFieldValue('account')
      if (account.length===0){
        this.setState({
          isRepeat: null
        })
        return
      }
      dealerReapet({
        account
      })
        .then( res=>{
          if(res.status==='REPEAT'){
            this.setState({
              isRepeat: 'REPEAT'
            })
          } else {
            this.setState({
              isRepeat: 'OK'
            })
          }
        } )
    },500 )
  }

  // 联动菜单选中之后
  handleProvince= async (code, e, type)=>{
    if ( type==='province' ) {   // 省级下拉菜单选中
      const res = await promise_( getProvinceDealers, {code} )
      // 查询该省，有无经销商，若有则获取到该省所有市后赋值给state
      if (res.status==='OK') {
        this.setState({
          cityList: res.data,
          type: 'province',
          provinceData: {
            id: e.props.id,
            name: e.props.name
          }
        })
      }
    } else if (type==='city') {
      // 添加了city级别的经销商后查询报错500
      const res = await  promise_( getCityDealers, {code} )
      if(res.status==='OK'){
        this.setState({
          districtList: res.data,
          type: 'city',
          cityData: {
            id: e.props.id,
            name: e.props.name
          }
        })
      }
    } else if (type==='district') {
      const res = await promise_(getdistrictDealers, {code})
      if(res.status==='OK') {
        this.setState({
          streetList: false,
          type: 'district',
          districtData: {
            id: e.props.id,
            name: e.props.name
          }
        })
      }
    }
  }

  render(){
    const { getFieldDecorator } = this.props.form
    return <div style={{
      backgroundColor: '#fff',
      padding: '10px 20px'
    }} >
      <div>
        <a onClick={ ()=>this.props.history.goBack() } >返回</a>
      </div>
      <div style={{marginTop: 20, display: 'flex', alignItems: 'center'}} >
        <h3>选择管辖区域：</h3>
        {/*省选择框*/}
        <div>
          <span>省：</span>
          <Select
            onSelect={ (value, e)=>this.handleProvince(value,e, 'province') }
                  // mode="combobox"
                  style={{width: 150}}>
              {this.state.provinceList.map( (item,i)=>(
                <Option
                  key={item.id} id={item.id} name={item.name}
                  value={parseInt(item.code)} >{item.name}</Option>
              ) )}
          </Select>
        </div>
        {/*市选择框*/}
        <div style={{marginLeft: 10}} >
          <span>市：</span>
          <Select
            disabled={this.state.cityList?this.state.cityList.length===0:true}
            onSelect={ (value, e)=>this.handleProvince(value,e, 'city') }
            style={{width: 150}}>
            {
              this.state.cityList&&this.state.cityList.map( (item,i)=>(
                <Option id={item.id} name={item.name} key={i} value={item.code} >{item.name}</Option>
              ) )
            }
          </Select>
        </div>
        {/*区县选择框*/}
        <div style={{marginLeft: 10}} >
          <span>区：</span>
          <Select
            disabled={this.state.districtList?this.state.districtList.length===0:true}
            onSelect={ (value, e)=>this.handleProvince(value,e, 'district') }
            style={{width: 150}}>
            {
              this.state.districtList&&this.state.districtList.map( (item,i)=>(
                <Option id={item.id} name={item.name} key={i} value={item.code} >{item.name}</Option>
              ) )
            }
          </Select>
        </div>
        {/*街道*/}
      </div>
      <div style={{marginTop: 20, marginLeft: 100}} >
        <span>街道(可选，选择后为该街道添加管理员)：</span>
        {getFieldDecorator('street')(
          <Input disabled={this.state.streetList} style={{width: 400}}  />
        )}
      </div>
      <Divider></Divider>
      <div>
        <Row>
          <Col span={2} ></Col>
          <Col span={16} >
            <Form style={{marginTop: '50px'}}>
              <FormItem {...formItemLayout}
                        hasFeedback
                        label='登录账户'
                        validateStatus={this.state.isRepeat=='REPEAT'?'error':
                          this.state.isRepeat=='OK'?'success':null}
                        help={this.state.isRepeat=='REPEAT'?'该用户名已重复':
                          this.state.isRepeat=='OK'?'用户名可以使用':null}
              >
                {getFieldDecorator('account', {
                  rules: [{
                    //pattern: '\\s', message: '请输入正确的用户名'
                  }, {
                    required: true, message: '请输入用户名',
                  }],
                })(
                  <Input
                    // onChange={ debouce(3000,this.handleChange,this).bind(this) }
                    onChange={ this.handleChange }
                  />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label='用户名称' >
                {getFieldDecorator('username', {
                  rules: [{
                  }, {
                    required: true, message: '请输入用户名称',
                  }],
                })(
                  <Input />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label='地址' >
                {getFieldDecorator('address', {
                  rules: [{
                  }, {
                    // required: true, message: '请输入地址',
                  }],
                })(
                  <Input />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label='联系电话' >
                {getFieldDecorator('tel', {
                  normalize: (v, prev) => {
                    // 电话号码正则验证
                    if (v && !/^(([1-9]\d*)|0)$/.test(v)) {
                      if (v === '.') {
                        return '0';
                      }
                      return prev;
                    }
                    return v;
                  },
                  rules: [{
                    required: true, message: '请输入电话号码',
                  }],
                })(
                  <Input />
                )}
              </FormItem>
              <FormItem {...tailFormItemLayout}>
                <Button loading={this.state.loading}
                        type="primary"
                        onClick={this.handleSubmit}
                >提交</Button>
              </FormItem>
            </Form>
          </Col>
          <Col span={4} ></Col>
        </Row>
      </div>
    </div>
  }
}

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
}
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
}

