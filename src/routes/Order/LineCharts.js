import React, { Component } from 'react'
import { connect } from 'dva'
import { Spin, Form, Input, Select, Button, message } from 'antd'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/toolbox'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import TimePicker from '../../components/TimePicker/TimePicker'

const FormItem = Form.Item
const Option = Select.Option
@connect( state=>({
  loading: state.orderCount.loading,
  data: state.orderCount.data,
  adminId: state.admin_login.admin_id
}))
export default class LineCharts extends Component{

  option = {
    title: {
      text: '强通快递送单统计',
      subtext: `截止 ${new Date().toLocaleString()}`,
      left: 'center'
    },
    legend: {
      top: 20,
      left: 10,
      data:['同城急送', '代购服务', '快递物流']
    },
    tooltip: {
      trigger: 'axis',
    },
    toolbox: {
      show : true,
      feature : {
        // mark : {show: true},
        dataView : {show: true, readOnly: false},
        // magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
        // restore : {show: true},
        saveAsImage : {show: true}
      }
    },
    xAxis: {
      data: ['一月', '二月', '三月', '四月', '五月',
        '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
    },
    yAxis: {
      type: 'value',
      axisLabel : {
        formatter: '{value} 单'
      }
    },
    series: [{
      name: '同城急送',
      type: 'line',
      data: [5, 20, 36, 10, 10, 20, 33]
    }, {
      name: '代购服务',
      type: 'line',
      data: [20, 10, 36, 10, 10, 20, 44]
    }, {
      name: '快递物流',
      type: 'line',
      data: [23, 25, 30, 33, 10, 4, 40]
    }]
  }

  state = {
    year: null
  }

  componentDidMount(){
    this.myChart = echarts.init(this.refs.main)
    this.myChart.setOption(this.option)
    //发送获取订单数据action
    this.props.dispatch({
      type: 'orderCount/getData',
      payload: {
        adminId: this.props.adminId
      }
    })
  }

  componentWillReceiveProps(nextProps){
    if (this.props.data!=nextProps.data) {
      this.dataToLineData(nextProps.data)
    }
  }

  // 将数据转换为需要的图表格式
  dataToLineData =data=> {
    let lineData = [{
      name: 'tongcheng',
      data: [0,0,0,0,0,0,0,0,0,0,0,0]
    }, {
      name: 'daigou',
      data: [0,0,0,0,0,0,0,0,0,0,0,0]
    }, {
      name: 'wuliu',
      data: [0,0,0,0,0,0,0,0,0,0,0,0]
    }]

    // data[0] 同城急送 data[1]代购服务  data[2] 快递物流

    data.forEach( (item, i)=>{
      item.forEach( (monthItems, t)=>{
        lineData[i].data[monthItems[2]-1] = monthItems[0]
      })
    })
    // console.log(lineData)
    this.updateCharts(lineData)
  }

  // 更新图表的数据
  updateCharts =lineData=> {
    this.myChart.setOption({
      ...this.option,
      series: [{
      name: '同城急送',
      type: 'line',
      data: lineData[0].data
    }, {
      name: '代购服务',
      type: 'line',
      data: lineData[1].data
    }, {
      name: '快递物流',
      type: 'line',
      data: lineData[2].data
    }]
    })
  }

  yearChange =value=> {
    this.setState({
      year: value
    })
  }

  yearSearch =()=> {
    if (!this.state.year) {
      message.error('查询年份不能为空！', 1)
      return
    }
    //发送获取订单数据action
    this.props.dispatch({
      type: 'orderCount/getData',
      payload: {
        adminId: this.props.adminId,
        year: this.state.year
      }
    })
  }

  yearReset =()=> {
    this.setState({
      year: null
    })
    //发送获取订单数据action
    this.props.dispatch({
      type: 'orderCount/getData',
      payload: {
        adminId: this.props.adminId
      }
    })
  }

  render(){
    return (
      <div>
        <div>
          <Form layout='inline' >
            <FormItem label='查询年份' >
              <Select
                value={this.state.year}
                style={{width: 200}}
                onChange={this.yearChange}
              >
                <Option value={2018} >2018年</Option>
                <Option value={2019} >2019年</Option>
                <Option value={2020} >2020年</Option>
                <Option value={2021} >2021年</Option>
                <Option value={2022} >2022年</Option>
              </Select>
            </FormItem>
            <FormItem>
              <Button onClick={this.yearSearch} type='primary' >查询</Button>
            </FormItem>
            <FormItem>
              <Button onClick={this.yearReset} >重置</Button>
            </FormItem>
          </Form>
        </div>
        <div>
          <Spin size='large' spinning={this.props.loading} >
            <div ref='main' style={{width: '100%', height: 400, marginTop: 40}} ></div>
          </Spin>
        </div>
      </div>
    )
  }
}
