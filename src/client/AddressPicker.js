import React, { PureComponent } from 'react'
import { Picker, List } from 'antd-mobile'

export default class AddressPicker extends PureComponent {
  render(){
    return <Picker
      title={this.props.title}
      data={this.props.data}
      onPickerChange={ (e)=>{ this.props.onPickerChange(e) } }
      onChange={ this.props.onChange }
      cascade={this.props.cascade}
      cols={this.props.cols}
      value={this.props.value}
    >
      <List.Item>{this.props.children()}</List.Item>
    </Picker>
  }
}
