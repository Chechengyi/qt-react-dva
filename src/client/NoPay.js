import React, { Component } from 'react'
import { NavBar, Icon, ListView, PullToRefresh, ActivityIndicator } from 'antd-mobile'
import { connect } from 'dva'
import NoPayItem from './NoPayItem'

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
}) )
export default class NoPay extends Component {

  constructor(props){
    super(props)
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });
    this.state = {
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
    if ( this.props.orderType.length===0 ) {
      this.props.dispatch({
        type: 'orderType/getData'
      })
    }
    this.props.dispatch({
      type: 'CusNoPay/getData',
      payload: {
        client_id: this.props.client_id
      }
    })
  }

  onRefresh=e=> {
    this.setState({
      refreshing: true
    })
    this.props.dispatch({
      type: 'CusNoPay/refresh',
      payload: {
        cusId: this.props.client_id
      }
    })
  }

  render(){
    const row = (item)=>(
      <NoPayItem dispatch={this.props.dispatch}
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
        pullToRefresh={
          <PullToRefresh
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
          />}
      />
    </div>
  }
}
