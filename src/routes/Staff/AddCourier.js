import React, { Component } from 'react'
import { Form, Input, Row, Col, Button, message } from 'antd'
import { connect } from 'dva'
import { addCourier, courierIsRepeat } from '../../services/api'
import { debouce } from '../../services/utils'

const FormItem = Form.Item
@Form.create()
@connect( state=>({
  admin_id: state.admin_login.admin_id
}) )
export default class AddCourier extends Component {
  constructor(props){
    super(props)
    this.state={
      loading: false,
      isRepeat: null
    }
  }
  handleSubmit= ()=>{
    if (this.state.isRepeat) {
      return
    }
    this.props.form.validateFields( (err,values)=>{
      if(err){
        message.error('请完善所有表单的信息', 1)
        return
      }
      this.setState({
        loading: true
      })
      addCourier({
        adminId: parseInt(this.props.admin_id),
        ...values
      })
        .then(res=>{
          this.setState({
            loading: false
          })
          if(res.status==='OK'){
            message.success('添加成功！', 1)
            this.props.form.resetFields()
          } else {
            message.error('添加失败, 请重新尝试', 1)
          }
        })
        .catch(err=>{
          this.setState({
            loading: false
          })
          message.error('添加出错。。。', 1)
        })
    } )
  }
  handleChange=e=>{
    console.log(e.target.value)
  }
  handleBlur=e=>{
    return
    // this.props.form.getFieldsValue(('account',values)=>{
    //   console.log(values)
    // })
    let account = this.props.form.getFieldValue('account')
    courierIsRepeat({
      account
    })
      .then( res=>{
        if(res.status==='REPEAT'){
          this.setState({
            isRepeat: true
          })
        } else {
          this.setState({
            isRepeat: false
          })
        }
      } )
  }
  render(){
    const { getFieldDecorator } = this.props.form;
    return <div style={{
      backgroundColor: '#fff',
      padding: '10px 20px'
    }} >
      <div>
        <a onClick={ ()=>this.props.history.goBack() } >返回</a>
      </div>
      <div>
        <Row>
          <Col span={2} ></Col>
          <Col span={16} >
            <Form style={{marginTop: '50px'}}>
              <FormItem {...formItemLayout}
                        label='登录账户'
                        validateStatus={this.state.isRepeat?'error':'success'}
                        help={!this.state.isRepeat===false?'该用户名已重复！':'该用户名可以使用'}
              >
                {getFieldDecorator('account', {
                  rules: [{
                    //pattern: '\\s', message: '请输入正确的用户名'
                  }, {
                    required: true, message: '请输入用户名',
                  }],
                })(
                  <Input onChange={ e=> { debouce(300,this.handleChange,this, e.target.value) } } />
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
