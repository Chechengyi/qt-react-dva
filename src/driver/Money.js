import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { NavBar, Icon } from 'antd-mobile'
import { AnimateNumber } from '../services/utils'

@connect(state=>({
  driver_id: state.driver_login.driver_id
}))
export default class Money extends PureComponent {
  constructor(props){
    super(props)
    this.state={
      num: 0,
      addNum: 1  //  每次金额增加的值
    }
  }
  componentDidMount(){
    setTimeout( ()=>{
      this.initAdd = 11245.4/50
      window.requestAnimationFrame(this.addNum)
    },300 )
  }
  addNum=()=>{
    this.initNum += this.initAdd
    this.setState({
      num: this.initNum
    })
    if (this.initNum>=11245.4) {
      this.setState({
        num: 11245.4
      })
      return
    } else {
      window.requestAnimationFrame(this.addNum)
    }
  }



  // 初始化的余额
  initNum=0
  initAdd=1 // 默认增加的金额
  render(){
    return <div>
      <NavBar
        icon={<Icon type="left" />}
        onLeftClick={()=>this.props.history.goBack()}
      >账户余额</NavBar>
      <div style={{
        height: 180, backgroundColor: '#108ee9',
        display: 'flex', justifyContent: 'center', alignItems: 'center'
      }} >
        <span style={{fontSize: '3em', color: '#fff'}} >{this.state.num.toFixed(1)}</span>
      </div>
    </div>
  }
}
