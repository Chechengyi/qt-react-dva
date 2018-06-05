import React, { Component } from 'react'
// import Iscroll from 'iscroll/build/iscroll'
import Iscroll from 'iscroll/build/iscroll-probe'
import styles from './Chat.less'
import { NavBar, Modal } from 'antd-mobile'
import { getMsg } from '../../services/api'

let Scroll = null

export default class ScrollChat extends Component {

  // constructor(props){
  //   super(props)
  //   this.state = {
  //     count: 10,
  //     text: null,
  //     message: []
  //   }
  // }
  componentWillMount(){
    console.log('孩子， willmount')
  }

  componentDidMount(){
    let self = this
    this.Scroll = new Iscroll(this.refs.scrollWarp, {
      scrollbars: true,
      preventDefault: false,
      mouseWheel: true,
      probeType: 2,
      click: true
    })
    this.Scroll.on('scroll', function (e) {
      if ( this.y>50 ) {
        console.log('加载吧')
      }
    } )
    console.log('zi')
  }

  componentWillReceiveProps(){
    console.log('receiveProps')
    this.Scroll.refresh()
  }



  inputText=e=>{
    this.setState({
      text: e.target.value
    })
  }

  send=e=>{
    console.log(/^[\s]*$/.test(this.state.text))
    if (/^[\s]*$/.test(this.state.text) || !this.state.text ) {
      Modal.alert('不能输入空白消息！', '', [{
        text: '确定', onPress: ()=>{}
      }])
    }
  }

  render () {
    return <div ref='warp'
                id='warp'
                style={{position: 'relative', height: document.documentElement.clientHeight-44,
                  touchAction: 'none'
                }}
                onTouchMove={ (e)=> {
                  e.preventDefault();
                  // e.stopPropagation()
                this.refs.input.blur();} }
            >
      <div id='#scrollWarp'
           style={{backgroundColor: this.props.backgroundColor?this.props.backgroundColor:'#fff'}}
           onClick={ e=>this.refs.input.blur() } ref='scrollWarp' className={styles.warp}>
        sdaas
        <div ref='scroll'
             style={{backgroundColor: this.props.backgroundColor?this.props.backgroundColor:'#fff'}}
             className={styles.cont}>
          {this.props.message.map( (item,i)=>(
            <div key={i} style={{fontSize: 50}} >asdsadd</div>
          ) )}
        </div>
      </div>
      <div className={styles.footer} >
        <input placeholder={this.props.placeholder} className={styles.input}
               ref='input' type="text"
               onChange={this.inputText}
        />
        <button
          onClick={ this.send }
          className={styles.button} >发送</button>
      </div>
    </div>
  }
}
