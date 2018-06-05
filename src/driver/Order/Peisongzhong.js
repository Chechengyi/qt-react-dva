import React, { PureComponent } from 'react'

export default class Peisongzhong extends PureComponent {

  componentDidMount(){
    this.props.changeSelect('peisongzhong', '配送中订单')
  }

  render () {
    return <div>
      配送中
    </div>
  }
}
