import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { List, ListView, PullToRefresh,
  ActivityIndicator, Modal
} from 'antd-mobile'
import RowItem from './Weichuli_Item'
// import ListView from '../../components/ListView/ListView'
import { cancelOrder } from '../../services/api'

function MyBody(props) {
  return (
    <div onTouchMove={e=>e.stopPropagation()} >
      {props.children}
    </div>
  );
}

const ListItem = List.Item
const Brief = List.Item.Brief
@connect( state=>({
  driver_id: state.driver_login.driver_id,
  loading: state.courierNoAccept.loading,
  data: state.courierNoAccept.data,
  orderType: state.orderType.data,
  count: state.courierNoAccept.count
}) )
export default class Weichuli extends PureComponent {

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
    if ( this.props.orderType.length===0 ) {
      this.props.dispatch({
        type: 'orderType/getData'
      })
    }
    this.props.changeSelect('weichuli', '未处理订单')
    // 发送获取未处理订单请求
    this.props.dispatch({
      type: 'courierNoAccept/getData',
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

  renderOrderType =id=> {
    for ( var i=0; i<this.props.orderType.length; i++ ) {
      if (id==this.props.orderType[i].id) {
        return this.props.orderType[i].type
      }
    }
  }

  onRefresh=e=> {
    this.setState({
      refreshing: true
    })
    this.props.dispatch({
      type: 'courierNoAccept/refresh',
      payload: {
        couId: this.props.driver_id
      }
    })
  }


  render () {
    const row = (item, i)=> (
      <RowItem orderType={this.props.orderType} data={item} wrap={true} />
    )
    return <div>
      <ListView
        style={{height: document.documentElement.clientHeight-45-50,
          width: document.documentElement.clientWidth}}
        renderBodyComponent={() => <MyBody />}
        dataSource={this.state.dataSource}
        renderRow={row}
        renderHeader={ ()=> <div style={{display: 'flex',
          justifyContent: 'center', paddingTop: 10}} >
          <ActivityIndicator animating={this.props.loading } ></ActivityIndicator>
        </div> }
        renderFooter={ (e)=><div style={{textAlign: 'center'}} >
          {this.state.isOver&&<span style={{}} >没有订单了...</span>}
        </div> }
        pullToRefresh={
          <PullToRefresh
            style={{minHeight: document.documentElement.clientHeight-45-50}}
            refreshing={this.state.refreshing}
          onRefresh={this.onRefresh}
        />}
      />
    </div>
  }
}
