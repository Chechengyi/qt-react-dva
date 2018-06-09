import React, { Component } from 'react'
// import Iscroll from 'iscroll/build/iscroll'
import Iscroll from 'iscroll/build/iscroll-probe'
import styles from './Chat.less'
import { NavBar, Modal } from 'antd-mobile'
import { getMsg } from '../../services/api'
import ScrollChatItem from './ScrollChatItem'

let Scroll = null

export default class ScrollChat extends Component {

  constructor(props){
    super(props)
    this.state = {
      count: 10,
      text: '',
      // message: this.props.message
    }
    this.userInfo = this.props.userInfo
    this.clientHeight = document.documentElement.clientHeight-44
  }

  componentDidMount(){
    let self = this
    this.Scroll = new Iscroll(this.refs.scrollWarp, {
      // scrollbars: true,
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
  }

  componentWillReceiveProps(){
    this.Scroll.refresh()
  }

  componentDidUpdate(props, state){
    this.Scroll.refresh()
    if ( this.refs.scrollWarp.clientHeight-this.refs.scroll.clientHeight<0 ) {
      this.Scroll.scrollTo(0,
        this.refs.scrollWarp.clientHeight-this.refs.scroll.clientHeight,
        )
    }
  }

  inputText=e=>{
    this.setState({
      text: e.target.value
    })
  }

  send=e=>{
    if (/^[\s]*$/.test(this.refs.input.value) || !this.refs.input.value ) {
      Modal.alert('不能输入空白消息！', '', [{
        text: '确定', onPress: ()=>{}
      }])
      this.refs.input.value=''
      return
    }
    this.props.onSend({
      userId: this.userInfo.userId,
      username: this.userInfo.username,
      text: this.refs.input.value
    })
    this.refs.input.value=''
  }

  render () {
    return <div ref='warp'
                id='warp'
                style={{position: 'relative',
                  height: this.clientHeight,
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
        <div ref='scroll'
             style={{backgroundColor: this.props.backgroundColor?this.props.backgroundColor:'#fff',
                    padding: '10px 0'
             }}
             className={styles.cont}>
          {this.props.message.map( (item,i)=>(
            <ScrollChatItem key={i}
                            userInfo={this.userInfo}
                            message={item}
                            style={{fontSize: 50}} >

            </ScrollChatItem>
          ) )}
        </div>
      </div>
      <div className={styles.footer} >
        <input placeholder={this.props.placeholder} className={styles.input}
               ref='input' type="text"
               // onChange={this.inputText}
               // value={this.state.text}
        />
        <button
          onClick={ this.send }
          className={styles.button} >发送</button>
      </div>
    </div>
  }
}

