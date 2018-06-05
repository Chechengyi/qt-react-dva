import React, { PureComponent } from 'react'

export default class Daiqueren extends PureComponent {

  componentDidMount(){
    this.props.changeSelect('daiqueren', '待确认订单')
  }

  render () {
    return <div>
      待确认
    </div>
  }
}
