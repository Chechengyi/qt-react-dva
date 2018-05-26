import React, { Component } from 'react'
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Form, Input, Button, Icon, Checkbox,  Alert, Select } from 'antd';
import styles from './Login.less';

const FormItem = Form.Item;
const Option = Select.Option

@connect(state => ({
  login: state.admin_login,
}))
@Form.create()
export default class Login extends Component {
  state = {
    count: 0,
    type: 'account',
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  componentDidMount () {

  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields({ force: true },
      (err, values) => {
        if (!err) {
          this.props.dispatch({
            type: 'admin_login/login',
            payload: {
              password: values.password,
              name: values.username,
              type: values.type
            },
          });
        }
      }
    );
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

  render() {
    const { form, login } = this.props;
    const { getFieldDecorator } = form;
    const { count, type } = this.state;
    return (
      <div className={styles.main}>
        <Form onSubmit={this.handleSubmit}>
              {
                login.status === 'ERROR' && this.renderMessage('账户或密码错误')
              }
              <FormItem>
                {getFieldDecorator('username', {
                  rules: [{
                    required: type === 'account', message: '请输入账户名！',
                  }],
                })(
                  <Input
                    size="large"
                    prefix={<Icon type="user" className={styles.prefixIcon} />}
                    placeholder="admin"
                  />
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('password', {
                  rules: [{
                    required: type === 'account', message: '请输入密码！',
                  }],
                })(
                  <Input
                    size="large"
                    prefix={<Icon type="lock" className={styles.prefixIcon} />}
                    type="password"
                  />
                )}
              </FormItem>
          <FormItem className={styles.additional}>
            {getFieldDecorator('type', {
              // valuePropName: 'checked',
              initialValue: 1
            })(
              <Select style={{width: 180}} >
                <Option value={1} >超级管理员</Option>
                <Option value={2} >经销商</Option>
              </Select>
            )}
            {getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: true,
            })(
              <Checkbox style={{marginLeft: 20}} className={styles.forgot}>自动登录</Checkbox>
            )}
            {/*<a className={styles.forgot} href="">忘记密码</a>*/}
            <Button size="large" loading={login.loading} className={styles.submit} type="primary" htmlType="submit">
              登录
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}
