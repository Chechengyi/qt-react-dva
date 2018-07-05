import React, { Component } from 'react'
import { Button } from 'antd'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/toolbox'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import Pie from './Pie'
import LineCharts from './LineCharts'
import PieCharts from './PieCharts'

export default class OrderStatistical extends Component{

  componentDidMount(){
    // this.myChart = echarts.init(this.refs.main);
    // 绘制图表
    this.option = {
      title: {
        text: '强通快递送单统计'
      },
      legend: {
        top: 30,
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
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '星期天']
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
    // this.myChart.setOption(this.option);
  }

  handleClick =()=> {
    // this.option.series.data=[100,200,100,200,100]
    let option = {...this.option}
    option.series[0].data = [100,200,100,200,100,200]
    this.myChart.setOption(option)
  }

  render(){
    return <div>
      {/*<Pie />*/}
      {/*<div ref='main' style={{width: 550, height: 400}} ></div>*/}
      {/*<Button type='primary' onClick={this.handleClick} >改变数据</Button>*/}
      <div
        style={{backgroundColor: '#fff', padding: 20, borderRadius: 10}} >
        <LineCharts />
      </div>
      <div
        style={{backgroundColor: '#fff', padding: 20, borderRadius: 10, marginTop: 20}} >
        <PieCharts />
      </div>
    </div>
  }
}
