import React, { PureComponent } from 'react'
import { List, InputItem, Button, Toast, Modal } from 'antd-mobile'
import { createForm } from 'rc-form'
import { driverUpdatePsw } from '../services/api'
import { connect } from 'dva'

const alert = Modal.alert

@createForm()
@connect( state => ({
  id: state.driver_login.driver_id
}) )
export default class Psw extends PureComponent {

  componentDidMount(){
    this.props.onOpenChange(false)
    this.props.changeWritePsw(true)
  }

  componentWillUnmount(){
    this.props.changeWritePsw(false)
  }

  submit=()=>{
    let self = this
    const { password, rePassword } = this.props.form.getFieldsValue()
    if ( !password||!rePassword ) {
      Toast.fail('请填写密码', 0.8)
      return
    }
    if ( password.indexOf(' ')>-1 ) {
      Toast.fail('密码不能含有空格！', 0.8)
      return
    }
    if ( password!==rePassword ) {
      Toast.fail('两次输入的密码不相等！', 0.8)
      return
    }
    Toast.loading()
    driverUpdatePsw({
      id: this.props.id,
      password
    })
      .then( res=> {
        Toast.hide()
        if ( res.status === 'OK' ) {
          alert('修改密码成功', '请重新登录', [{
            text: '确认',
            onPress: ()=> {
              this.props.dispatch({
                type: 'driver_login/logout'
              })
            }
          }])
        }
      } )
  }

  render () {
    const { getFieldProps } = this.props.form
    return <div style={{
      position: 'absolute',
      top: 0,
      width: '100%',
      bottom: 0,
      backgroundColor: '#d9d9d9'
    }} >
      <List renderHeader={()=>'修改密码'} >
        <InputItem
          {...getFieldProps('password')}
          type='password'
        >密码</InputItem>
        <InputItem
          type='password'
          {...getFieldProps('rePassword')}
        >重复密码</InputItem>
        <List.Item>
          <Button onClick={this.submit} type='primary' >确认修改</Button>
        </List.Item>
      </List>
    </div>
  }
}
