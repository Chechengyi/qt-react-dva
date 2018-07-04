import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Form, Input, Select, Button, Spin } from 'antd'
import TimePicker from '../../components/TimePicker/TimePicker'
import Pie from '../../components/Chart/Pie'

const FormItem = Form.Item
const Option = Select.Option

@Form.create()
@connect( state=>({
  couId: state.couOrderNum.couId,
  username: state.couOrderNum.couUsername,
  isModal: state.couOrderNum.isModal,
  loading: state.couOrderNum.loading,
  data: state.couOrderNum.data,
}))
export default class ModalCouOrderCount extends Component{

  state = {
    couId: 1
  }

  componentWillReceiveProps(nextProps){
    // 检测当快递员id
    if (this.props.couId!==nextProps.couId && nextProps.couId ) {
      this.loadingData(nextProps.couId)
      this.setState({
        couId: nextProps.couId
      })
    }
  }

  loadingData = couId=> {
    this.props.dispatch({
      type: 'couOrderNum/getData',
      payload: {
        couId
      }
    })
  }

  reset =()=> {
    this.props.dispatch({
      type: 'couOrderNum/getData',
      payload: {
        couId: this.props.couId
      }
    })
  }

  onCancel =()=> {
    this.props.dispatch({
      type: 'couOrderNum/changeModal',
      payload: false
    })
    this.props.dispatch({
      type: 'couOrderNum/changeCouId',
      payload: {
        id: null,
        username: null
      }
    })
    this.refs.time.resetTime()
  }

  search =arr=>{
    this.props.dispatch({
      type: 'couOrderNum/getData',
      payload: {
        couId: this.state.couId,
        startTime: new Date(arr[0]),
        endTime: new Date(arr[1])
      }
    })
  }

  // 算出总计多少单
  sum =()=> {
    // return this.props.data.reduce( (prev, next)=>(prev[0]+next[0]))
    let numArr = []
    numArr = this.props.data.map( item=>item[0])
    if (numArr.length===0) return 0
    return numArr.reduce( (prev, next)=>prev+next)
  }

  render(){
    return (
      <Modal
        width={700}
        title={`${this.props.username}  送单统计`}
        visible={this.props.isModal}
        onCancel={ this.onCancel }
        onOk={ this.onCancel }
      >
        <Spin
          size='large'
          tip='加载中...'
          spinning={this.props.loading}
        >
          <div>
            <h3>总计送单: {this.sum()}</h3>
          </div>
          <div style={{display: 'flex', justifyContent: 'center'}} >
            <Pie
              pieStyle={{
                width: 400,
                height: 350
              }}
              data={this.props.data} />
          </div>
          <div style={{marginTop: 20, display: 'flex', justifyContent: 'center'}} >
            <TimePicker
              ref='time'
              search={this.search}
              reset={this.reset}
            />
          </div>
        </Spin>
      </Modal>
    )
  }
}
