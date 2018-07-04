import React, { Component } from 'react'
import { NavBar, Icon, ListView, PullToRefresh, ActivityIndicator } from 'antd-mobile'
import { connect } from 'dva'
import NoPayItem from './NoPayItem'
import loginHoc from '../Hoc/LoginHoc'
import {Toast} from "antd-mobile/lib/index";

function MyBody(props) {
  return (
    <div onTouchMove={e=>e.stopPropagation()} >
      {props.children}
    </div>
  );
}

@connect( state=>({
  data: state.CusNoPay.data,
  loading: state.CusNoPay.loading,
  client_id: state.client_login.client_id,
  orderType: state.orderType.data,
  client_status: state.client_login.client_status
}))
@loginHoc({
  redirectPath: '/#/clientUser/login',
  propsSelector: props=>props.client_status == 'OK',
  redirectBefore: ()=> {
    Toast.fail('需要登录才能进行此操作，请先登录', 1.5)
  },
  // redirectBeforeTime: 1000
})
export default class NoPay extends Component {

  constructor(props){
    super(props)
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    })
    this.state={
      dataSource,
      refreshing: false,
      pageNo: 0,
      pageSize: 20,
      data: [],
      isOver: false
    }
    this.openid = this.props.match.params.openid
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

  componentDidMount(){
    if ( this.props.orderType.length===0 ) {
      this.props.dispatch({
        type: 'orderType/getData'
      })
    }
    this.props.dispatch({
      type: 'CusNoPay/getData',
      payload: {
        cusId: this.props.client_id,
        pageNo: this.state.pageNo + 1 ,
        pageSize: this.state.pageSize,
      }
    })
  }

  onEndReached= e=> {
    console.log('去加载把')
    if ( this.props.loading ) return
    this.props.dispatch({
      type: 'CusNoPay/getData',
      payload: {
        cusId: this.props.client_id,
        pageNo: this.state.pageNo + 1 ,
        pageSize: this.state.pageSize,
        refreshing: false,
        // isOver: false
      }
    })
  }

  // type: 'CusNoPay/refresh',
  onRefresh=e=> {
    this.data = []
    this.setState({
      // dataSource: this.state.dataSource.cloneWithRows([]),
      data: [],
      refreshing: true,
      pageNo: 0,
      pageSize: 20
    })
    this.props.dispatch({
      type: 'CusNoPay/refresh',
      payload: {
        cusId: this.props.client_id,
        pageNo: 1,
        pageSize: 20
      }
    })
  }

  render(){
    const row = (item)=>(
      <NoPayItem
        history={this.props.history}
        openid={this.openid} dispatch={this.props.dispatch}
                 orderType={this.props.orderType} data={item} />
    )
    return <div>
      <NavBar
        icon={ <Icon type='left' ></Icon> }
        onLeftClick={() => this.props.history.goBack()}
      >未付款订单</NavBar>
      <ListView
        style={{height: document.documentElement.clientHeight-45,
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
