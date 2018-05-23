import React, { PureComponent } from 'react'

export default class My extends PureComponent {

  componentDidMount () {
    this.props.selectedTab('my')
  }

  render () {
   return  <div style={{height: 3000}} >我的页面</div>
  }
}
