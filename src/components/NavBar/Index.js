import React, { PureComponent } from 'react';
import styles from './Index.less'

export default class Nav extends PureComponent {
  render () {
    return <div style={{...this.props.navBarStyle}}
                 className={styles.nav}
    >
      <div>
        {this.props.leftContent&&this.props.leftContent()}
      </div>
      <div>{this.props.title?this.props.title:''}</div>
      <div>
        {this.props.rightContent&&this.props.rightContent()}
      </div>
    </div>
  }
}
