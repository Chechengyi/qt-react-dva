import React, { Component } from 'react'
//#eb6487
//#67a1f4
export default class Logo extends Component{
  render(){
    return (
      <div
        style={{width: 30, height: 30,
          color: '#fff',
          borderRadius: '100%',
          backgroundColor: this.props.bgColor?this.props.bgColor:'#fff',
          textAlign: 'center', lineHeight: '30px', fontSize: '1.1em'}}
      >
        {this.props.title}
      </div>
    )
  }
}
