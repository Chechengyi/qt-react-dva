import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { InputItem, Button, List, WingBlank, WhiteSpace, Toast, Flex } from 'antd-mobile'
import { createForm } from 'rc-form';
import { Alert } from 'antd'
import store from 'store'

@createForm()
@connect( state => ({
  driver_status: state.driver_login.driver_status,
  loading: state.driver_login.loading
}) )
export default class Login extends PureComponent {

  componentDidMount(){
    // 进入登录页面之后， 判断如果没有登录的话， 就删除掉页面的定时器s
    if ( this.props.driver_status!= 'OK' ) {
      clearInterval(window.timer)
      clearInterval(window.posTimer)
    }
  }

  submit = () => {
    const { username, password } = this.props.form.getFieldsValue()
    if ( !username || !password ) {
      Toast.fail('用户名或密码不能为空', 1)
      return
    }
    // 设置一个定时器， 让键盘有足够的失交的时间
    setTimeout( ()=>{
      this.props.dispatch({
        type: 'driver_login/login',
        payload: {
          account: username,
          password: password
        }
      })
    }, 200)
  }

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

  render () {
    const {getFieldProps} = this.props.form
    return <div style={{overflow: 'hidden'}} >
      <div style={{marginTop: 50}} >
        <WingBlank>
          { this.props.driver_status==='ERROR'&&this.renderMessage('用户名或密码错误') }
          <List>
            <InputItem
              {...getFieldProps('username')}
            >手机号码</InputItem>
          </List>
          <List>
            <InputItem
              {...getFieldProps('password')}
              type="password"
            >密码</InputItem>
          </List>
          <WhiteSpace />
          <Button loading={this.props.loading} onClick={this.submit} type='primary' >登录</Button>
        </WingBlank>
      </div>
    </div>
  }
}
