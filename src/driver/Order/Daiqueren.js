import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { ListView, PullToRefresh, ActivityIndicator } from 'antd-mobile'
import RowItem from './Daiqueren_Item'

function MyBody(props) {
  return (
    <div onTouchMove={e=>e.stopPropagation()} >
      {props.children}
    </div>
  );
}

@connect( state=>({
  loading: state.courierNoConfirm.loading,
  data: state.courierNoConfirm.data,
  orderType: state.orderType.data,
  driver_id: state.driver_login.driver_id,
}) )
export default class Daiqueren extends PureComponent {

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

  componentDidMount(){
    this.props.changeSelect('daiqueren', '待确认订单')
    if ( this.props.orderType.length===0 ) {
      this.props.dispatch({
        type: 'orderType/getData'
      })
    }
    this.props.dispatch({
      type: 'courierNoConfirm/getData',
      payload: {
        couId: this.props.driver_id
      }
    })
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

  onRefresh=e=> {
    this.setState({
      refreshing: true
    })
    this.props.dispatch({
      type: 'courierNoConfirm/refresh',
      payload: {
        couId: this.props.driver_id
      }
    })
  }

  render () {
    const row = (item)=> (
      <RowItem history={this.props.history} xitong={this.props.xitong} orderType={this.props.orderType} data={item} ></RowItem>
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
