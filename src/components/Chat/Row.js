import React, { PureComponent } from 'react'

export default class Row extends PureComponent {
  render () {
    const {data} = this.props
    return <div>
      <span style={{fontSize: 30}} >{data.text}</span>
    </div>
  }
}
