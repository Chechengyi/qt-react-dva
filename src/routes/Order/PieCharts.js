import React, { Component } from 'react'
import { connect } from 'dva'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/toolbox'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import Pie from '../../components/Chart/Pie'
import TimePicker from '../../components/TimePicker/TimePicker'

@connect( state=>({
  loading: state.dealerOrderCount.loading,
  data: state.dealerOrderCount.data,
  adminId: state.admin_login.admin_id
}))
export default class PieCharts extends Component{

  option = {
    title: {
      text: '强通速递订单统计',
    },
    legend: {
      bottom: 0,
      data:['同城急送', '代购服务', '快递物流']
    },
    tooltip : {
      trigger: 'item',
      formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    toolbox: {
      show : true,
      feature : {
        dataView : {show: true, readOnly: false},
        saveAsImage : {show: true}
      }
    },
    series: [{
      type: 'pie',
      data: [{
        name: '同城急送',
        value: 0
      }, {
        name: '代购服务',
        value: 0
      }, {
        name: '快递物流',
        value: 0
      }]
    }]
  }

  componentDidMount(){
    // this.myChart = echarts.init(this.refs.main)
    // this.myChart.setOption(this.option)
    // 发送获取数据action
    this.props.dispatch({
      type: 'dealerOrderCount/getData',
      payload: {
        adminId: this.props.adminId==1?undefined:this.props.adminId,
      }
    })
  }

  componentWillReceiveProps(nextProps){
    if (this.props.data!=nextProps.data) {
      this.changeData(nextProps.data)
    }
  }

  //将数据转换为期望的格式
  changeData =data=> {
    console.log(data)
  }

  search =arr=>{
    this.props.dispatch({
      type: 'dealerOrderCount/getData',
      payload: {
        adminId: this.props.adminId==1?undefined:this.props.adminId,
        startTime: new Date(arr[0]),
        endTime: new Date(arr[1])
      }
    })
  }

  reset =()=> {
    this.props.dispatch({
      type: 'dealerOrderCount/getData',
      payload: {
        adminId: this.props.adminId==1?undefined:this.props.adminId
      }
    })
  }

  sum =()=> {
    // return this.props.data.reduce( (prev, next)=>(prev[0]+next[0]))
    let numArr = []
    numArr = this.props.data.map( item=>item[0])
    if (numArr.length===0) return 0
    return numArr.reduce( (prev, next)=>prev+next)
  }

  // 算出总营业额
  moneySum =()=> {
    let numArr = []
    numArr = this.props.data.map( item=>item[3] )
    if (numArr.length===0) return 0
    return numArr.reduce( (prev, next)=>prev+next )
  }

  //展示各订单类型单量，营业额
  orderType_num_money =()=> {
    let domArr = []
    let arr = [{
      name: '同城急送',
      orderNum: 0,
      money: 0
    }, {
      name: '代购服务',
      orderNum: 0,
      money: 0
    }, {
      name: '快递物流',
      orderNum: 0,
      money: 0
    }]

    this.props.data.forEach( item=>{
      // if (item[1]==1) {
      //   arr[0].orderNum = item[0]
      //   arr[0].money = item[3]
      // } else if (item[1]==2) {
      //   arr[1].orderNum = item[0]
      //   arr[1].money = item[3]
      // } else {
      //   arr[2].orderNum = item[0]
      //   arr[3].money = item[3]
      // }
      arr[item[1]-1].orderNum = item[0]
      arr[item[1]-1].money = item[3]
    })

    domArr = arr.map( (item, i)=>(
      <tr style={{textAlign: 'center'}} key={i} >
        <td>{item.name}</td>
        <td>{item.orderNum} 单</td>
        <td>{item.money.toFixed(2)} 元</td>
      </tr>
    ))
    return domArr
  }

  render(){
    return (
      <div>
        <div style={{display: 'flex', justifyContent: 'center'}} >
          <TimePicker
            search={this.search}
            reset={this.reset}
          />
        </div>
        <div style={{margin: '15px 0'}} >
          <div>
            <h3 style={{textAlign: 'center'}} >总计派出{this.sum()}单---总营业额为{this.moneySum().toFixed(2)}  元</h3>
          </div>
          <div style={{width: 250, margin: '0 auto'}} >
            <table style={{width: '100%'}} >
              <tbody>
              <tr style={{textAlign: 'center'}} >
                <th>订单类型</th>
                <th>订单数量</th>
                <th>总计金额</th>
              </tr>
              {this.orderType_num_money()}
              </tbody>
            </table>
          </div>
        </div>
        <div style={{display: 'flex', justifyContent: 'center'}} >
          <Pie
            pieStyle={{
              width: 450,
              height: 350
            }}
            data={this.props.data} />
        </div>
      </div>
    )
  }
}
