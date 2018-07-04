import React, { PureComponent } from 'react';
import NavBar from '../components/NavBar/Index'
import { Icon, List, InputItem, WhiteSpace,
  WingBlank, Button, Flex, Toast, Modal } from 'antd-mobile'
import { clientUpdatePsw, getCode } from '../services/api'
import { createForm } from 'rc-form'
import { connect } from 'dva'

@createForm()
@connect(state=>({
  client_name: state.client_login.client_name,
  client_tel: state.client_tel
}))
export default class UpdatePsw extends PureComponent {

  constructor(props){
    super(props)
    this.state={
      sendAuthCode: false,
      time: 60,
      loading: false
    }
  }
  submit=()=>{
    if ( this.state.loading ) {
      return
    }
    const { password,rePassword,authCode } = this.props.form.getFieldsValue()
    if ( !(password&&rePassword&&authCode) ) {
      Toast.fail('请完善信息', 1)
      return
    }
    if ( password.indexOf(' ')>-1 ) {
      Toast.fail('密码中不能含有空格！', 1)
      return
    }
    if (password!==rePassword) {
      Toast.fail('两次输入密码不一致！',1)
      return
    }
    this.setState({
      loading: true
    })
    // 发送更改密码的请求
    clientUpdatePsw({
      tel: this.props.client_tel,
      password,
      authCode
    })
      .then( res=>{
        this.setState({
          loading: false
        })
        if (res.status==='OK') {
          Modal.alert('修改密码成功', '请重新登录', [{
            text: '确认',
            onPress: ()=> {
              // 密码修改成功就要重新登录
              this.props.dispatch({
                type: 'client_login/logout'
              })
              this.props.history.replace('/clientUser/login')
            }
          }])
        }
      })
  }

  getAuthCode=()=>{
    let self = this
    if (this.state.sendAuthCode) {
      return
    }
    const { password,rePassword} = this.props.form.getFieldsValue()
    if ( !(password&&rePassword)  ) {
      Toast.fail('信息未完善，不能获取验证码！', 1)
      return
    }
    if ( password!==rePassword) {
      Toast.fail('两次输入密码不一致，无法获取验证码', 1)
      return
    }
    // 发送获取验证码的请求
    getCode({
      tel: this.props.client_cel
    })
      .then( res=>{
        if (res.status==='ERROR') {
          Toast.fail('操作太频繁，请稍后在试', 1)
        } else {
          this.setTime()
          this.setState({
            sendAuthCode: true
          })
        }
      })
    this.setTime()
    this.setState({
      sendAuthCode: true
    })
  }
  setTime=()=>{
    let self = this
    setTimeout( ()=>{
      self.countdown(this.state.time)
    }, 1000 )
  }
  // 倒计时
  countdown=(time)=>{
    time--
    this.setState({
      time: time
    })
    if (time<=0) {
      this.setState({
        sendAuthCode: false,
        time: 60
      })
    } else {
      this.setTime()
    }
  }

  render () {
    const { getFieldProps } = this.props.form
    return <div style={{overflow: 'hidden'}} >
      <NavBar
        title='修改密码'
        leftContent={ ()=>(
          <Icon type='left' onClick={()=>{this.props.history.goBack()}} style={{fontSize: '1.1em', marginTop: 7}} ></Icon>
        ) }
        navBarStyle={{
          height: 40,
          color: '#fff',
          fontSize: '1.1em',
          backgroundColor: '#000', zIndex: 5,
          position: 'fixed', top: 0, width: '100%', padding: '0 16px'
        }}
      />
      <div style={{marginTop: 40}} >
        <WingBlank>
          <WhiteSpace />
          <List>
            <InputItem
              type='password'
              {...getFieldProps('password')}
            > 新密码</InputItem>
            <InputItem
              type='password'
              {...getFieldProps('rePassword')}
            >重复密码</InputItem>
            <Flex>
              <div style={{flex:4}} >
                <InputItem
                  {...getFieldProps('authCode')}
                  type='number'
                >验证码</InputItem>
              </div>
              <div style={{flex:2}} >
                <button
                  style={{border: 'none',
                    backgroundColor: this.state.sendAuthCode?'#ccc':'#108ee9',
                    height: 30, width: 85,borderRadius: '3px',
                    color: '#fff'}}
                  onClick={ this.getAuthCode } >
                  {
                    this.state.sendAuthCode?<span>{this.state.time}s 重发</span>:'发送'
                  }
                </button>
              </div>
            </Flex>
          </List>
          <WhiteSpace size='lg' />
          <WingBlank>
            <Button
              loading={this.state.loading}
              onClick={this.submit} type='primary' >确认修改</Button>
          </WingBlank>
        </WingBlank>
      </div>
    </div>
  }
}
