import React, { PureComponent } from 'react';
import { Layout, Menu, Icon, Spin, Tag, Dropdown, Avatar, message, Divider } from 'antd';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import Debounce from 'lodash-decorators/debounce';
import { Link } from 'dva/router';
import NoticeIcon from '../../components/NoticeIcon';
import HeaderSearch from '../../components/HeaderSearch';
import logo from '../../assets/logo.svg';
import styles from './index.less';

const { Header } = Layout;

export default class GlobalHeader extends PureComponent {
  componentDidMount() {
    // this.props.dispatch({
    //   type: 'user/fetchCurrent',
    // });
  }
  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }
  getNoticeData() {
    const { notices = [] } = this.props;
    if (notices.length === 0) {
      return {};
    }
    const newNotices = notices.map((notice) => {
      const newNotice = { ...notice };
      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow();
      }
      // transform id to item key
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      if (newNotice.extra && newNotice.status) {
        const color = ({
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        })[newNotice.status];
        newNotice.extra = <Tag color={color} style={{ marginRight: 0 }}>{newNotice.extra}</Tag>;
      }
      return newNotice;
    });
    return groupBy(newNotices, 'type');
  }
  handleNoticeClear = (type) => {
    message.success(`清空了${type}`);
    this.props.dispatch({
      type: 'global/clearNotices',
      payload: type,
    });
  }
  handleNoticeVisibleChange = (visible) => {
    if (visible) {
      this.props.dispatch({
        type: 'global/fetchNotices',
      });
    }
  }
  handleMenuClick = (e) => {
      this.props.dispatch({
        type: 'login/logout',
      });
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
  render() {
    const {
      currentUser, collapsed, fetchingNotices, isMobile,
    } = this.props;
    // const menu = (
    //   <Menu className={styles.menu} selectedKeys={[]} onClick={this.handleMenuClick}>
    //     <Menu.Item disabled><Icon type="user" />个人中心</Menu.Item>
    //     <Menu.Item disabled><Icon type="setting" />设置</Menu.Item>
    //     <Menu.Divider />
    //     <Menu.Item key="logout"><Icon type="logout" />退出登录</Menu.Item>
    //   </Menu>
    // );
    const noticeData = this.getNoticeData();

    const spanStyle= {
      display: 'inline-block',
      width: '1px',
      height: '10px',
      margin: '0 5px',
      background: '#1890ff'
    }

    return (
      <Header className={styles.header}>
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
          {/*<a href="">供货商系统消息</a>*/}
          {/*<span style={spanStyle} ></span>*/}
          {/*<a href="">系统消息</a>*/}
          {/*<span style={spanStyle} ></span>*/}
          {/*<a href="">修改密码</a>*/}
          {/*<span style={spanStyle} ></span>*/}
          {/*<a href="">账号信息</a>*/}
          {/*<span style={spanStyle} ></span>*/}
          <a key='logout' onClick={ e => {this.handleMenuClick(e) } } >退出</a>
        </div>
      </Header>
    );
  }
}
