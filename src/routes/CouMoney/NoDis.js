import React, { Component } from 'react'
import { connect } from 'dva'
import { List } from 'antd'
import NoDisItem from './NoDisItem'


@connect( state=>({
  admin_id: state.admin_login.admin_id,
  loading: state.adminCouMoneyNoDis.loading,
  data: state.adminCouMoneyNoDis.data
}))
export default class NoDis extends Component {

  constructor(props){
    super(props)
    this.state = {
      pageNo: 1,
      pageSize: 10
    }
  }

  componentDidMount(){
    this.props.dispatch({
      type: 'adminCouMoneyNoDis/getData',
      payload: {
        pageNo: this.state.pageNo,
        pageSize: this.state.pageSize
      }
    })
  }

  render(){
    const row = (item)=>(
      <NoDisItem data={item} adminId={this.props.admin_id} />
    )
    return <div style={{padding: 5, backgroundColor: '#fff'}} >
      <div style={{width: 800, margin: '20px auto'}} >
        <List loading={this.props.loading}
              dataSource={this.props.data}
              renderItem={row}
              pagination={{
                onChange: (page) => {
                  // 分页请求发送
                  this.props.dispatch({
                    type: 'adminCouMoneyNoDis/getData',
                    payload: {
                      pageNo: page,
                      pageSize: this.state.pageSize
                    }
                  })
                  this.setState({
                    pageNo: page
                  })
                },
                pageSize: 10,
                total: 100,
                current: this.state.pageNo
              }}
        />
          {/*{this.props.data.map( (item,i)=>(*/}
            {/*<NoDisItem key={i} data={item} />*/}
          {/*))}*/}

      </div>
    </div>
  }
}
