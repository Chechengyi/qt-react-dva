import React, { Component } from 'react'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/toolbox'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'

export default class Pie extends Component{

  componentDidMount(){
    this.myChart = echarts.init(this.refs.main);
    // 绘制图表
    this.option = {
      title: {
        text: '本月送单统计',
        subtext: `截止本月${new Date().toLocaleDateString()}`
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
          // mark : {show: true},
          dataView : {show: true, readOnly: false},
          // magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
          // restore : {show: true},
          saveAsImage : {show: true}
        }
      },
      series: [{
        type: 'pie',
        data: [{
          name: '同城急送',
          value: 233
        }, {
          name: '代购服务',
          value: 300
        }, {
          name: '快递物流',
          value: 333
        }]
      }]
    }
    this.myChart.setOption(this.option);
  }

  render(){
    return <div>
      <div ref='main' style={{width: 400, height: 300, margin: '0 auto'}} ></div>
    </div>
  }
}
