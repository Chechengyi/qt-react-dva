import React, { Component } from 'react'
import { connect } from 'dva'
import { ListView, PullToRefresh, ActivityIndicator } from 'antd-mobile'
import Daifukuan_Item from './Daifukuan_Item'

function MyBody(props) {
  return (
    <div onTouchMove={e=>e.stopPropagation()} >
      {props.children}
    </div>
  );
}

@connect( state=>({
  driver_id: state.driver_login.driver_id,
  loading: state.courierNoPay.loading,
  data: state.courierNoPay.data,
  orderType: state.orderType.data
}) )
export default class Daifukuan extends Component {

  constructor(props){
    super(props)
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });
    this.state={
      data: [],
      dataSource,
      refreshing: false
    }
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      refreshing: false
    })
    if ( nextProps.data!==this.props.data ) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(nextProps.data),
      })
    }
  }

  componentDidMount(){
    this.props.changeSelect('daifukuan', '待付款订单')
    if ( this.props.orderType.length===0 ) {
      this.props.dispatch({
        type: 'orderType/getData'
      })
    }
    // 发送获取客户未付款订单请求
    this.props.dispatch({
      type: 'courierNoPay/getData',
      payload: {
        couId: this.props.driver_id
      }
    })
  }

  onRefresh=e=> {
    this.setState({
      refreshing: true
    })
    this.props.dispatch({
      type: 'courierNoPay/refresh',
      payload: {
        couId: this.props.driver_id
      }
    })
  }

  render(){
    const row = (item)=> (
      <Daifukuan_Item
        history={this.props.history} xitong={this.props.xitong}
        orderType={this.props.orderType} data={item} ></Daifukuan_Item>
    )
    return <div>
      <ListView
        style={{height: document.documentElement.clientHeight-45-50,
          backgroundColor: '#f1f1f1',
          width: document.documentElement.clientWidth}}
        renderBodyComponent={() => <MyBody />}
        dataSource={this.state.dataSource}
        renderRow={row}
        renderHeader={ ()=> <div style={{display: 'flex',
          justifyContent: 'center', paddingTop: 10}} >
          <ActivityIndicator animating={this.props.loading} ></ActivityIndicator>
        </div> }
        pullToRefresh={
          <PullToRefresh
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
          />}
      />
    </div>
  }
}
