import React, { PureComponent } from 'react'
import { connect } from 'dva'
import { List, ListView, PullToRefresh } from 'antd-mobile'
// import ListView from '../../components/ListView/ListView'

function MyBody(props) {
  return (
    <div onTouchMove={e=>e.stopPropagation()} >
      {props.children}
    </div>
  );
}

const ListItem = List.Item
@connect( state=>({
  driver_id: state.driver_login.driver_id,
  loading: state.courierNoAccept.loading,
  data: state.courierNoAccept.data,
  orderType: state.orderType.data
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
    }

  }

  componentDidMount(){
    setTimeout( ()=>{
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows([1,1,1,1,1,1,1,1,1,1,1,1])
      })
    },500 )
    // console.log(this.props.data)
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

  renderOrderType =e=> {

  }

  onRefresh=e=> {
    console.log('上拉加载')
  }

  render () {
    const row = (item, i)=> (
      <div style={{fontSize: 30, height: 70}} >dsadsa</div>
    )
    return <div>
      <ListView
        // style={{height: document.documentElement.clientHeight-44-50}}
        // renderBodyComponent={() => <MyBody />}
        dataSource={this.state.dataSource}
        renderRow={row}
        useBodyScroll
        // pullToRefresh={
        //   <PullToRefresh
        //   onRefresh={this.onRefresh}
        // />}
      />
    </div>
  }
}
