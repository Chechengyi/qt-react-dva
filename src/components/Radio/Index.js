import React, { Component } from 'react'
import styles from './index.less'

export default class Radio extends Component{

  handleChange =()=> {
    this.props.onChange(!this.props.checked)
  }

  render(){
    return (
      <div className={styles.flex} >
        <div
          onClick={this.handleChange}
          style={{
            backgroundImage: this.props.checked?'url("/yes.png")':null,
            backgroundPosition: 'center center',
            backgroundSize: '90% 90%'
          }}
          className={styles.radio} />
        <div>{this.props.title()}</div>
      </div>
    )
  }
}
