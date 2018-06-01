import React, { PureComponent } from 'react';
import { Layout, Menu, Icon, Spin, Tag, Dropdown, Popconfirm,
  Avatar, message, Divider, Modal, Form, Input,
  Badge
} from 'antd';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import Debounce from 'lodash-decorators/debounce';
import { Link } from 'dva/router';
import NoticeIcon from '../../components/NoticeIcon';
import HeaderSearch from '../../components/HeaderSearch';
import logo from '../../assets/logo.svg';
import styles from './index.less';
import { connect } from 'dva'
import { dealerUpdatePsw } from '../../services/api'
import {routerRedux} from "dva/router";

const { Header } = Layout;
const FormItem = Form.Item

@connect(state=>({
  admin_name: state.admin_login.admin_name,
  roleId: state.admin_login.roleId,
  admin_id: state.admin_login.admin_id,
  orderCount: state.noDisOrder.count
}))
@Form.create()
export default class GlobalHeader extends PureComponent {
  constructor(props){
    super(props)
    this.state={
      modalType: false,
      loading: false
    }
  }
  componentDidMount() {
  }
  // 发送获取未分配订单个数的请求
  getOrderCount(){
    this.props.dispatch({
      type: 'noDisOrder/backGetCount',
      id: this.props.admin_id
    })
  }
  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }
  toggle = () => {
    const { collapsed } = this.props;
    this.props.dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: !collapsed,
    });
    this.triggerResizeEvent();
  }
  @Debounce(600)
  triggerResizeEvent() { // eslint-disable-line
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }
  handleModal=(e)=>{
    this.setState({
      modalType: e
    })
  }
  handleSubmit=e=>{
    // dealerUpdatePsw()
    this.props.form.validateFields( (err, values)=>{
      if(err){
        message.error('密码填写错误', 1)
        return
      }
      if( values.password!==values.rePassword ){
        message.error('两次输入密码不一致', 1)
        return
      }
      dealerUpdatePsw({
        id: this.props.admin_id,
        password: values.password
      })
        .then( res=>{
          this.setState({
            modalType: false
          })
          if ( res.status==='OK' ) {
            const modal = Modal.success({
              title: '修改密码成功',
              content: '修改密码后要重新登录',
               onOk: e=>{
                // 发送退出登录的请求 接口还没写
                this.props.dispatch(routerRedux.push('/admin/user/login'))
                 modal.destroy()
               }
            });
            // setTimeout(() => modal.destroy(), 1000);
          }
        } )
        .catch( res=>{
          this.setState({
            modalType: false
          })
        } )
    } )
  }
  render() {
    const {
      currentUser, collapsed, fetchingNotices, isMobile,
    } = this.props;
    const { getFieldDecorator } = this.props.form;
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]}>
        {this.props.roleId!==0&&<Menu.Item >
          <a style={{color: 'rgba(0, 0, 0, 0.65)'}} href='/#/admin/else/updateMsg' ><Icon type="edit" />修改信息</a>
        </Menu.Item>}
        <Menu.Item>
          <a onClick={ ()=>this.handleModal(true) } style={{color: 'rgba(0, 0, 0, 0.65)'}} ><Icon type="unlock" />修改密码</a>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout"><Icon type="logout" />退出登录</Menu.Item>
      </Menu>
    );

    const spanStyle= {
      display: 'inline-block',
      width: '1px',
      height: '10px',
      margin: '0 5px',
      background: '#1890ff'
    }

    return (
      <Header className={styles.header}>
        <Modal
          visible={this.state.modalType}
          onCancel={ ()=>this.handleModal(false)}
          onOk={ this.handleSubmit }
        >
          <h3 style={{textAlign: 'center'}} >修改密码</h3>
          <div style={{marginTop: 30}} >
            <Form>
              <FormItem
                {...formItemLayout}
                label="新密码"
              >
                {getFieldDecorator('password', {
                  rules: [{
                    required: true, message: '请输入密码',
                  }],
                })(
                  <Input type='password' style={{width: 200}} />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="重复密码"
              >
                {getFieldDecorator('rePassword', {
                  rules: [{
                    required: true, message: '请重复输入密码！',
                  }],
                })(
                  <Input type='password' style={{width: 200}} />
                )}
              </FormItem>
            </Form>
          </div>
        </Modal>
        {isMobile && (
          [(
            <Link to="/" className={styles.logo} key="logo">
              <img src={logo} alt="logo" width="32" />
            </Link>),
            <Divider type="vertical" key="line" />,
          ]
        )}
        <Icon
          className={styles.trigger}
          type={collapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={this.toggle}
        />
        <div className={styles.right}>
          <div style={{marginRight: 50}} >
            <Badge count={this.props.orderCount} >
              <a href='/#/admin/cont/order/noDisOrder' style={{paddingRight: 10, color: 'rgba(0,0,0,0.65)'}} >
                <Icon type="notification" /> 未分配订单
              </a>
            </Badge>
          </div>
          <Dropdown overlay={menu} >
            {/*{this.props.admin_name}*/}
            <div style={{width: 200, cursor: 'pointer'}} >
              <img style={{width: 25, height: 25}} src="/admin.png" alt=""/>
              <span style={{marginLeft: 10}} >{this.props.admin_name}</span>
            </div>
          </Dropdown>
        </div>
      </Header>
    );
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
