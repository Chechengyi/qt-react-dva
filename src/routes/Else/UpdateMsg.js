import React, { Component } from 'react';
import { connect } from 'dva'
import { Divider, Form, Input, Button,
  Row, Col ,message
} from 'antd'
import { getDealer, DealerUpdateInfo } from '../../services/api'

const FormItem = Form.Item
@connect(state=>({
  admin_id: state.admin_login.admin_id,
  admin_name: state.admin_login.admin_name
}))
@Form.create()
export default class UpdateMsg extends Component {

  constructor(props){
    super(props)
    this.state={
      data: {},
      loading: false
    }
  }

  componentDidMount(){
    getDealer({
      id: this.props.admin_id,
      roleId: 0,
      pageNo: 1,
      pageSize: 10
    })
      .then( res=>{
        console.log(res)
        this.setState({
          data: res.data.content[0]
        })
      } )
  }

  submit=()=>{
    this.props.form.validateFields( (err, values)=>{
      if (err) {
        message.error('表单信息错误', 1)
        return
      }
      this.setState({
        loading: true
      })
      DealerUpdateInfo({
        id: this.props.admin_id,
        ...values
      })
        .then( res=>{
          this.setState({
            loading: false
          })
          if ( res.status==='OK' ) {
            message.success('修改成功！', 1)
          } else {
            message.error('修改失败')
          }
        } )
        .catch( err=>{
          message.error('找不到路径或服务器出错了')
          this.setState({
            loading: false
          })
        } )
    } )
  }

  render () {
    const { getFieldDecorator } = this.props.form;
    return <div>
      <div style={{
        height: 60,textAlign: 'cneter',
        lineHeight: '60px', backgroundColor: '#108ee5'
      }} >
        <h1 style={{textAlign: 'center', color: '#fff'}} >修改信息</h1>
      </div>
      <div style={{
        width: 800,
        margin: '0 auto'
      }} >
        <div style={{marginTop: 50}} >
          <Form>
            <FormItem
              {...formItemLayout}
              label=" 姓名"
            >
              {getFieldDecorator('username', {
                initialValue: this.state.data.username,
                rules: [{
                  required: true, message: '姓名不能为空！',
                }],
              })(
                <Input style={{width: 300}} />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="联系电话"
            >
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
                initialValue: this.state.data.tel,
                rules: [{
                  required: true, message: '电话不能为空！',
                }],
              })(
                <Input type='phone' style={{width: 300}} />
              )}
            </FormItem>
            <FormItem {...tailFormItemLayout}>
              <Button loading={this.state.loading}
                      onClick={this.submit}
                      type="primary">修改</Button>
            </FormItem>
          </Form>
        </div>
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
