import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {List, InputItem, WingBlank, WhiteSpace, Button, Toast} from 'antd-mobile'
import { Alert } from 'antd'
import { createForm } from 'rc-form';
@createForm()
@connect( state =>({
  client_status: state.client_login.client_status,
  loading: state.client_login.loading
}) )
export default class Login extends PureComponent {

  renderMessage = (message) => {
    return (
      <Alert
        style={{ marginBottom: 24 }}
        message={message}
        type="error"
        showIcon
      />
    );
  }

  submit = () => {
    const { username, password } = this.props.form.getFieldsValue()
    if ( !username || !password ) {
      Toast.fail('用户名或密码不能为空', 1)
      return
    }
    // 设置一个200毫秒的延时， 让键盘有足够的失去焦点的时间
    setTimeout( ()=>{
      this.props.dispatch({
        type: 'client_login/login',
        payload: {
          account: username,
          password
        }
      })
    }, 200)
  }

  render () {
    const { getFieldProps } = this.props.form
      return <div style={{marginTop: 30}} >
      <WingBlank>
        { this.props.client_status==='ERROR'&&this.renderMessage('用户名或密码错误') }
        <List>
          <InputItem
            // type='phone'
            {...getFieldProps('username')}
          >用户名</InputItem>
          <InputItem
            type='password'
            {...getFieldProps('password')}
          >密码</InputItem>
        </List>
        <WhiteSpace></WhiteSpace>
        <Button type='primary' loading={this.props.loading} onClick={ this.submit } >登录</Button>
        <WhiteSpace></WhiteSpace>
        <Button onClick={ () => { this.props.history.push('/clientUser/reg') } } type='ghost' >注册</Button>
        <WhiteSpace />
        <Button onClick={ ()=>this.props.history.push('/clientUser/forgetPsw') } type='warning' >忘记密码</Button>
      </WingBlank>
    </div>
  }
}
