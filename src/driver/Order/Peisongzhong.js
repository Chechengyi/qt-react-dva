import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { ListView, PullToRefresh, ActivityIndicator } from 'antd-mobile'
import Peisongzhong_Item from './Peisongzhong_Item'

function MyBody(props) {
  return (
    <div onTouchMove={e=>e.stopPropagation()} >
      {props.children}
    </div>
  );
}

@connect( state=>({
  driver_id: state.driver_login.driver_id,
  loading: state.courierDistribution.loading,
  data: state.courierDistribution.data,
  orderType: state.orderType.data
}) )
export default class Peisongzhong extends PureComponent {

  constructor(props){
    super(props)
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });
    this.state={
      data: [],
      dataSource,
      refreshing: false,
      isOver: false
    }
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      refreshing: false
    })
    if ( nextProps.data!==this.props.data ) {
      if (nextProps.data.length===0) {
        this.setState({
          isOver: true
        })
      }
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(nextProps.data),
      })
    }
  }

  componentDidMount(){
    this.props.changeSelect('peisongzhong', '配送中订单')
    if ( this.props.orderType.length===0 ) {
      this.props.dispatch({
        type: 'orderType/getData'
      })
    }
    // 发送获取客户未付款订单请求
    this.props.dispatch({
      type: 'courierDistribution/getData',
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
      type: 'courierDistribution/refresh',
      payload: {
        couId: this.props.driver_id
      }
    })
  }

  render () {
    const row = (item)=> (
      <Peisongzhong_Item
        history={this.props.history} xitong={this.props.xitong}
        orderType={this.props.orderType} data={item} ></Peisongzhong_Item>
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
        renderFooter={ (e)=><div style={{textAlign: 'center'}} >
          {this.state.isOver&&<span style={{}} >没有订单了...</span>}
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
