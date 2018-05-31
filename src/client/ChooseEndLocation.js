import React, { PureComponent } from 'react'
import { Modal, NavBar, Toast } from 'antd-mobile'
import { connect } from 'dva'

@connect()
export default class ChooseEndLocation extends PureComponent {

  componentDidMount(){
    this.drawMap()
  }

  // 绘制选址组件
  drawMap=()=>{
    let self = this;
    (function(){
      var iframe = document.getElementById('test').contentWindow;
      document.getElementById('test').onload = function(){
        iframe.postMessage('hello','https://m.amap.com/picker/');
      };
      window.addEventListener("message", function(e){
        clearTimeout(self.timer)
        self.timer = setTimeout( function () {
          self.sendPos(e.data)
        },300 )
      }, false);
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
      <NavBar>
        <div onClick={ this.handleBack } >返回地址填写页面</div>
      </NavBar>
      <iframe
        id='test'
        src={`https://m.amap.com/picker/?keywords=写字楼,小区,学校&radius=1000&total=20&key=b807bced59e4c8d89a323ae23159e562`}
        style={{width: '100%',
          height: document.documentElement.clientHeight-44
        }} frameBorder="0">
      </iframe>
    </div>
  }
}
