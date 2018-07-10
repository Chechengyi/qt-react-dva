import React, { PureComponent } from 'react'
import { Modal, NavBar, Toast } from 'antd-mobile'
import { connect } from 'dva'

@connect()
export default class ChooseEndLocation extends PureComponent {

  componentDidMount(){
    let self = this
    this.drawMap()
    // 因是单页web结构，所以判断是否监听过选址事件，如果监听过就不在重复监听
    if ( !window.isEndLis ) {
      window.isEndLis = true
      window.addEventListener("message", function(e){
        // 判断这个message事件是否是当前页面触发的，如果是其他页面触发则不执行函数
        if (e.target.location.hash=='#/cont/chooseEndLocation') {
          self.sendPos(e.data)
        }
      }, false);
    }
  }

  componentWillUnmount(){
    Toast.hide()
  }

  // 绘制选址组件
  drawMap=()=>{
    let self = this;
    (function(){
      window.end_iframe = document.getElementById('test').contentWindow;
      document.getElementById('test').onload = function(){
        window.end_iframe.postMessage('hello','https://m.amap.com/picker/');
      }
    })()
  }

  sendPos=e=>{
    let pos = e.location.split(',')
    this.props.dispatch({
      type: 'orderAddress/setEndPos',
      payload: {
        name: e.name,
        address: e.address,
        lnt: pos[0],
        lat: pos[1]
      }
    })
    this.handleBack()
  }

  handleBack=()=>{
    this.props.history.push('/cont/endAddress')
  }

  render(){
    return <div>
      <NavBar
        leftContent={<div onClick={ this.handleBack } >返回</div>}
      >
        选择附近的建筑物
      </NavBar>
      <iframe
        id='test'
        // src={`https://m.amap.com/picker/?keywords=写字楼,小区,学校&radius=1000&total=20&key=b807bced59e4c8d89a323ae23159e562`}
        src={`https://m.amap.com/picker/?radius=1000&total=20&key=b807bced59e4c8d89a323ae23159e562`}
        style={{width: '100%',
          height: document.documentElement.clientHeight-44
        }} frameBorder="0">
      </iframe>
    </div>
  }
}
