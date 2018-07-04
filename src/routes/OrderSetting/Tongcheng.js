import React, { Component } from 'react'
import { Form, Input, Button, message } from 'antd'
import { adminGetOrderTypePrice, adminPutOrderTypePrice } from '../../services/api'

const FormItem = Form.Item

@Form.create()
export default class Tongcheng extends Component {

  constructor(props){
    super(props)
    this.state = {
      data: {},
      loading: false
    }
  }

  componentDidMount(){
    // 获取订单计价方式信息  id为1代表同城急送
    adminGetOrderTypePrice({id: 1})
      .then( res=>{
        console.log(res.data)
        if (!res.data) return
        this.setState({
          data: res.data
        })
      })
  }

  submit = ()=> {
    if (this.state.loading) return
    this.setState({
      loading: true
    })
    this.props.form.validateFields( (err, values)=>{
      if (err) return
      // 同城急送订单的 id 和 orderTypeId 都为1
      adminPutOrderTypePrice({
        ...values,
        orderTypeId: 1,
        id: 1
      })
        .then( res=>{
          this.setState({
            loading: false
          })
          if (res.status=='OK') {
            message.success('修改成功', 1)
          }
        })
        .catch( err=>{
          this.setState({
            loading: false
          })
        })
    })
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const { data } = this.state
    return <div style={{backgroundColor: '#fff', padding: 10}} >
      <div>
        <h3 style={{textAlign: 'center'}} >同城急送-调价</h3>
      </div>
      <div style={{smargin: '20px auto' }} >
        <Form>
          <FormItem
            {...formItemLayout}
            label="起步价"
          >
            {getFieldDecorator('startPrice', {
              initialValue: data.startPrice,
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
              initialValue: data.startWeight,
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
              initialValue: data.weightPrice,
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
              initialValue: data.startDistance,
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
          <FormItem
            {...formItemLayout}
            label="超过首距离每公里收费"
          >
            {getFieldDecorator('plusPrice', {
              initialValue: data.plusPrice,
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
          <FormItem
            {...formItemLayout}
            label="夜间收费增加费用"
          >
            {getFieldDecorator('nightPrice', {
              initialValue: data.nightPrice,
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
                required: true, message: '输入的夜间加价不能为空',
              }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem {...tailFormItemLayout}>
            <Button loading={this.state.loading} type="primary" onClick={ this.submit } >提交 </Button>
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
