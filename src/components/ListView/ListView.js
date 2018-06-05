import React, { Component } from 'react'
import Iscroll from 'iscroll/build/iscroll-probe'
import styles from './ListView.less'
import { throttle2 } from '../../services/utils'

export default class ListView extends Component {

  constructor(props){
    super(props)
  }

  componentDidMount(){
    var self = this
    this.Iscroll = new Iscroll(this.refs.scroll, {
      scrollbars: true,
      preventDefault: false,
      mouseWheel: true,
      probeType: 2,
      click: true,
      bounce: true
    })
    this.Iscroll.on('scroll', throttle2( function (e) {
      // 下拉刷新
      if ( this.y > 50 ) {
        if ( self.props.onRefresh ) {
          self.props.onRefresh()
        }
      }
      // 上拉加载
      console.log(this.y)
      if ( this.y < -this.scrollerHeight+10 ) {
        console.log('上拉加载')
      }
    },300))
  }

  componentDidUpdate(){
    this.Iscroll.refresh()
  }

  handleScroll =e=> {

  }

  render () {
    return <div ref='scroll'
            style={{...this.props.style}}
            className={styles.warp}
    >
      <div className={styles.scroll} style={{minHeight: document.documentElement.clientHeight}} >
        {this.props.data.map( (item, i)=>(
          this.props.row(item, i)
        ) )}
      </div>
    </div>
  }

}
