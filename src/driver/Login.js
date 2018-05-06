import React, { PureComponent } from 'react'
import { connect } from 'dva';
import { Input } from 'antd'
import { InputItem, WingBlank, List, Button, WhiteSpace, Toast } from 'antd-mobile'
import { createForm } from 'rc-form';
@createForm()
@connect()
export default class Login extends PureComponent {

  submit = () => {
    this.props.form.validateFields((err, values) => {
      if (err) {

      } else {
        if ( !values.username || !values.password ) {
          Toast.fail('用户名和密码不能为空！', 0.9)
          return
        }
        this.props.dispatch({
          type: 'driver_login/login',
          payload: {
            username: values.username,
            password: values.password
          }
        })
      }
    })
  }

  render () {
    const { getFieldProps } = this.props.form;
    return <div>
      <WingBlank>
        <div style={{height: 250, textAlign: 'center'}} >
          <span style={{fontSize: 40}} >强通快递</span>
        </div>
        <div style={{marginTop: 30}} >
          <List>
            <InputItem
              {...getFieldProps('username')}
              >用户名</InputItem>
            <InputItem
              type='password'
              {...getFieldProps('password')}
              >密码</InputItem>
          </List>
          <WhiteSpace></WhiteSpace>
          <Button type='primary' onClick={ this.submit } >登录</Button>
        </div>
      </WingBlank>
    </div>
  }
}
