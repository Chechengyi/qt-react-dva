import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { NavBar, Picker } from 'antd-mobile'

@connect(state=>({
  client_id: state.client_login.client_id,
  orderType: state.orderType.data
}))
export default class ByOrder extends PureComponent {

  componentDidMount(){
    if (this.props.orderType.length===0) {
      this.props.dispatch({
        type: 'orderType/getData'
      })
    }
    // console.log(this.props.match.params.id)
  }

  render(){
    return <div>
      <NavBar
        leftContent={<div onClick={e=>this.props.history.goBack()} >返回</div>}
      >
        {this.props.orderType.map( (item,i)=>(
          <div key={i} >{item.id==this.props.match.params.id?<span>{item.type}</span>:null}</div>
        ) )}
      </NavBar>
      <div>

      </div>
    </div>
  }
}
