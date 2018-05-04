import React, { PureComponent } from 'react';
import { Layout } from 'antd'
import styles from './index.less'

export default class Header extends PureComponent {
  render () {
    return <Header className={styles.header} > 头部 </Header>
  }
}
