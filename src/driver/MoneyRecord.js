import React, { Component } from 'react'
import { NavBar, Icon, ListView, PullToRefresh, ActivityIndicator } from 'antd-mobile'
import { connect } from 'dva'
import MoneyRecordItem from './MoneyRecordItem'
import { driverGetMoneyCash } from '../services/api'

function MyBody(props) {
  return (
    <div onTouchMove={e=>e.stopPropagation()} >
      {props.children}
    </div>
  )
}

@connect( state=>({
  driver_id: state.driver_login.driver_id,
  // orderType: state.orderType.data,
  loading: state.couMoneyRecord.loading,
  data: state.couMoneyRecord.data
}) )
export default class Done extends Component {

  constructor(props){
    super(props)
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });
    this.state={
      dataSource,
      refreshing: false,
      pageNo: 0,
      pageSize: 20,
      data: [],
      isOver: false
    }
  }

  componentDidMount(){
    // driverGetMoneyCash({
    //   couId: this.props.driver_id
    // })
    //   .then( res=>{
    //     // 返回res类型 [ 数量，订单类型id， 金额 ]
    //     console.log(res)
    //   })
    // 发送获取快递员提现记录的请求
    this.props.dispatch({
      type: 'couMoneyRecord/getData',
      payload: {
        couId: this.props.driver_id,
        pageNo: this.state.pageNo + 1 ,
        pageSize: this.state.pageSize,
        // refreshing: false
      }
    })
  }

  componentWillReceiveProps(nextProps){
    if ( this.props.data !== nextProps.data ) {
      this.setState({
        refreshing: false
      })
      if (nextProps.data.length===0) {
        this.setState({
          isOver: true
        })
      } else {
        this.setState( prevState=>({
          pageNo: prevState.pageNo + 1
        }) )
      }
      let arr = this.state.data.slice()
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(arr.concat(nextProps.data)),
        data: arr.concat(nextProps.data)
      })
    }
  }

  onEndReached= e=> {
    console.log('区加载把')
    if ( this.props.loading || this.state.isOver ) return
    this.props.dispatch({
      type: 'couMoneyRecord/getData',
      payload: {
        couId: this.props.driver_id,
        pageNo: this.state.pageNo + 1 ,
        pageSize: this.state.pageSize,
        isOver: false
      }
    })
  }

  onRefresh=e=> {
    this.setState({
      refreshing: true,
      pageNo: 0,
      pageSize: 20,
      data: []
    })
    this.props.dispatch({
      type: 'couMoneyRecord/refresh',
      payload: {
        couId: this.props.driver_id,
        pageNo: 1,
        pageSize: 20
      }
    })
  }

  shouldComponentUpdate(nextProps, nextState){
    if (this.state.data!=nextState.data) {
      return false
    }
    return true
  }

  render(){
    const row = (item)=>(
      //<DoneItem data={item} orderType={this.props.orderType} />
      <MoneyRecordItem data={item} />
    )
    return <div>
      <NavBar
        // style={{position: 'fixed', width: '100%', top: 0, bottom: 0}}
        icon={ <Icon type='left' ></Icon> }
        onLeftClick={ ()=>this.props.history.goBack() }
      >提现记录</NavBar>
      <ListView
        initialListSize={20}
        style={{height: document.documentElement.clientHeight-45,
          // marginTop: 45,
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
          {(this.state.isOver&&!this.props.loading)&&<span style={{}} >没有订单了...</span>}
          {this.props.loading&&'加载中...'}
        </div> }
        onEndReachedThreshold={200}
        onEndReached={this.onEndReached}
        pullToRefresh={
          <PullToRefresh
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
          />}
      />
    </div>
  }
}
