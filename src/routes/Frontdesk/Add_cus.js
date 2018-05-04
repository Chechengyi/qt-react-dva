import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { Form, Row, Col, Input, Button, message, Select,  Icon, Modal  } from 'antd'
import { add_cus } from '../../services/api'

const FormItem = Form.Item

@Form.create()
@connect( state => ({
  driver_drop: state.global_drop.driver_list
}) )
export default class Add_cus extends PureComponent {

  constructor (props) {
    super(props)
    this.state = {
      driver_drop: [],
      exist: false
    }
  }

  componentDidMount () {
    if ( this.props.driver_drop.length === 0 ) {
      this.props.dispatch({
        type: 'global_drop/get_driver'
      })
    }
    else {
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

  handleSubmit = (e) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll( (err, values) => {
      add_cus({...values})
        .then( res => {
          if (res.status == 'exist') {
            this.setState({
              exist: true
            })
          } else if (res.status == 'ok') {
            message.success('添加成功', 0.5)
            this.setState({
              exist: false
            })

          } else {

          }
        } )
    } )
  }

  render () {

    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
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
    };
    return <div>
      <div style={{marginBottom: '10px'}} >
        <a onClick={ () => { this.props.history.goBack() } } >返回</a>
      </div>
      <div style={{background: '#fff'}} >
        <Row>
          <Col span={2} ></Col>
          <Col span={16} >
            <Form style={{marginTop: '50px'}} onSubmit={this.handleSubmit} >
              <FormItem {...formItemLayout} label='用户名'  validateStatus={this.state.exist?'error': ''}
                        help={this.state.exist?'该用户名已重复！': ''} >
                {getFieldDecorator('username', {
                  rules: [{
                  }, {
                    required: true, message: '请输入用户名',
                  }],
                })(
                  <Input />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label='密码' >
                {getFieldDecorator('password', {
                  rules: [{
                  }, {
                    required: true, message: '请输入密码',
                  }],
                })(
                  <Input />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label='用户名称' >
                {getFieldDecorator('cus_name', {
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
                    required: true, message: '请输入地址',
                  }],
                })(
                  <Input />
                )}
              </FormItem>
              <Row>
                <Col offset={6} span={6} >
                  <FormItem {...formItemLayout} label='司机' >
                    {getFieldDecorator('driver_id', {
                      rules: [{
                        required: true, message: '请输入商品名称',
                      }],
                    })(
                      <Select style={{ width: '100%' }}>
                        {
                          this.state.driver_drop.map( (e,i) => {
                            return <Select.Option key={i} value={i} >{e}</Select.Option>
                          } )
                        }
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={6} >
                  <FormItem {...formItemLayout} label='电话' >
                    {getFieldDecorator('cus_tel', {
                      normalize: (v, prev) => {
                        if (v && !/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(v)) {
                          if (v === '.') {
                            return '0.';
                          }
                          return prev;
                        }
                        return v;
                      },
                      rules: [{
                        message: 'The input is not valid E-mail!',
                      }, {
                        required: true, message: '请输入电话号码',
                      }],
                    })(
                      <Input />
                    )}
                  </FormItem>
                </Col>
                <Col span={6} >
                </Col>
              </Row>
              <Row>
                <Col offset={6} span={7} >
                  <FormItem {...formItemLayout} label='客户类型' >
                    {getFieldDecorator('cus_type', {
                      initialValue: 1
                    })(
                      <Select style={{ width: '100%' }}>
                        <Select.Option value={0}>连锁</Select.Option>
                        <Select.Option value={1}>普通</Select.Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={7} offset={1} >
                  <FormItem {...formItemLayout} label='联系人' >
                    {getFieldDecorator('cus_contact', {
                      rules: [{
                        message: 'The input is not valid E-mail!',
                      }, {
                        required: true, message: '联系人',
                      }],
                    })(
                      <Input />
                    )}
                  </FormItem>
                </Col>
                <Col span={6} >
                </Col>
              </Row>
              <FormItem {...tailFormItemLayout}>
                <Button loading={this.state.loading} type="primary" htmlType="submit">提交</Button>
              </FormItem>
            </Form>
          </Col>
          <Col span={4} ></Col>
        </Row>
      </div>
    </div>
  }
}
