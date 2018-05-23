import React, { PureComponent } from 'react'
import Iscroll from 'iscroll/build/iscroll'
import styles from './Chat.less'
import { NavBar } from 'antd-mobile'
import { getMsg } from '../../services/api'

let Scroll = null

export default class ScrollChat extends PureComponent {

  constructor(props){
    super(props)
    this.state = {
      focus: false,
      count: 10,
      text: [],
      ItemChange: false
    }
  }

  componentDidMount(){
    let self = this
    // this.refs.warp.addEventListener('touchmove', function(e) {
    //   e.preventDefault();
    // }, false);
    console.log(document.getElementById('#scrollWarp'))
    console.log(this.refs.scrollWarp)
    this.Scroll = new Iscroll(this.refs.scrollWarp, {
      scrollbars: true,
      tab: 'scrollClick'
    })
    // console.log(this.props)
    console.log(Scroll)
    getMsg()
      .then( res=> {
        this.setState({
          text: res
        })
      } )
  }

  componentDidUpdate(){
    this.Scroll.refresh();
  }

  stop = (e) => {
    e.preventDefault();
  }
  // 输入框获得焦点的回调
  focus = () => {
    this.setState({
      focus: true
    })
  }
  // 输入框失去焦点的回调
  blur = () => {
    this.setState({
      focus: false
    })
  }

  tap = ()=>{
    console.log(1)
    // 为兼容安卓手机，触摸iscroll输入框有焦点时视角
    this.refs.input.blur()
  }

  ceshi = ()=>{
    var arr = []
    for (var i=0; i<this.state.count; i++) {
      arr.push(<div key={i} >sdasdsada</div>)
    }
    return arr
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
      {/*<NavBar>客服1</NavBar>*/}
      <div id='#scrollWarp' ref='scrollWarp' className={styles.warp}>
        sdaas
        <div ref='scroll' className={styles.cont}>
          {this.state.text.map( (item,i)=>(
            <div key={i} >asdsadd</div>
          ) )}
        </div>
      </div>
      <div className={styles.footer} >
        <input ref='input' type="text"/>
        <button>发送</button>
      </div>
    </div>
  }
}
