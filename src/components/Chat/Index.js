import React, { PureComponent } from 'react'
import styles from './Chat.less'
import {throttle} from '../../services/utils'
import Iscroll from 'iscroll/build/iscroll'
import { ListView } from 'antd-mobile'
import Row from './Row'

function MyBody(props) {
  return (
    <div onTouchStart={props.touchStart} style={{minHeight: document.documentElement.clientHeight-44}}>
      {props.children}
    </div>
  );
}

let Scroll = null
export default class Chat extends PureComponent {

  constructor(props){
    super(props)
    const dataSource = new ListView.DataSource( {
      rowHasChanged:(r1, r2) => r1 !== r2
    } )
    this.state = {
      dataSource,
      inputText: '',
      message: [],
      height: document.documentElement.clientHeight - 44
    }
  }

  componentDidMount(){
    // Scroll = new Iscroll(this.refs.cont)
  }

  // 输入文字
  textChange = (e) => {
    this.setState({
      inputText: e.target.value
    })
  }

  focus = () => {

  }

  Inputblur = () => {
    this.refs.input.blur()
  }

  blur = () => {

  }

  send = () => {
    console.log()
    let msg = [...this.state.message,{
      text: this.state.inputText
    }]
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(msg),
    });
    this.setState({
      inputText: '',
      message: msg
    })
  }

  render () {
    const row = (rowdata, sectionId, rowId) => (
      <Row data={rowdata} />
    )
    return (
      <div>
        <ListView
          ref='cont'
          dataSource={ this.state.dataSource}
          style={{
            height: this.state.height ,
            backgroundColor: 'rgba(245,245,249,1)'
          }}
          renderBodyComponent={(props) => <MyBody touchStart={this.Inputblur} />}
          renderRow={row}
          onTouchStart={this.Inputblur}
        />
        <div className={styles.footer} >
          <input onBlur={this.blur} ref='input' value={this.state.inputText} onChange={this.textChange} type="text"/>
          <button onClick={ this.send } >发送</button>
        </div>
      </div>
    )
  }
}
