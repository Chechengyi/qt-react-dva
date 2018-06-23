import React, { Component } from 'react'
import { Form, Input, Button } from 'antd'
import { adminUpdateTongchengPrice } from '../../services/api'

const FormItem = Form.Item

@Form.create()
export default class Tongcheng extends Component {

  submit = ()=> {
    this.props.form.validateFields( (err, values)=>{
      if (err) return

      adminUpdateTongchengPrice({
        ...values,
        orderTypeId: 1
      })
        .then( res=>{

        })
    })
  }

  render () {
    const { getFieldDecorator } = this.props.form
    return <div style={{backgroundColor: '#fff', padding: 10}} >
      <div>
        <h3 style={{textAlign: 'center'}} >快递物流-调价</h3>
      </div>
      <div style={{smargin: '20px auto' }} >
        <Form>
          <FormItem
            {...formItemLayout}
            label="起步价"
          >
            {getFieldDecorator('startPrice', {
              normalize: (v, prev) => {  //验证金额
                if (v && !/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(v)) {
                  if (v === '.') {
                    return '0.';
                  }
                  return prev;
                }
                return v;
              },
              rules: [{
                required: true, message: '输入的价格不能为空',
              }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="起始重量"
          >
            {getFieldDecorator('startWeight', {
              normalize: (v, prev) => {  //验证重量
                if (v && !/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(v)) {
                  if (v === '.') {
                    return '0.';
                  }
                  return prev;
                }
                return v;
              },
              rules: [{
                required: true, message: '输入的首重不能为空',
              }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="超重每公斤收费"
          >
            {getFieldDecorator('weightPrice', {
              normalize: (v, prev) => {  //验证重量
                if (v && !/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(v)) {
                  if (v === '.') {
                    return '0.';
                  }
                  return prev;
                }
                return v;
              },
              rules: [{
                required: true, message: '输入的首重不能为空',
              }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="首距离"
          >
            {getFieldDecorator('startDistance', {
              normalize: (v, prev) => {  //验证距离，长度，公里
                if (v && !/^(([1-9]\d*)|0)(\.\d{0,2}?)?$/.test(v)) {
                  if (v === '.') {
                    return '0.';
                  }
                  return prev;
                }
                return v;
              },
              rules: [{
                required: true, message: '输入的首重不能为空',
              }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            <Button type="primary" onClick={ this.submit } >提交 </Button>
          </FormItem>
        </Form>
      </div>
    </div>
  }
}

const formItemLayout = {
  labelCol: {
    xs: { span: 8, offset: 3 },
    sm: { span: 6, offset: 3 },
  },
  wrapperCol: {
    xs: { span: 8 },
    sm: { span: 8 },
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
      offset: 10,
    },
  },
}
