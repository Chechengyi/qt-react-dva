import React, { Component } from 'react'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/pie'
// import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/toolbox'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'

export default class Pie extends Component{

  option = {
    // title: {
    //   text: '本月送单统计',
    //   subtext: `截止本月${new Date().toLocaleDateString()}`
    // },
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
    this.myChart = echarts.init(this.main);
    this.myChart.setOption(this.option);
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.data!==this.props.data) {
      this.setOption(nextProps.data)
    }
  }

  // 将data转为图表期望的格式
  changeData = data=> {
    let echarsData = [{
      name: '同城急送',
      value: 0
    }, {
      name: '代购服务',
      value: 0
    }, {
      name: '快递物流',
      value: 0
    }]
    data.forEach( item=>{
      // if (item[1]==1) {
      //   echarsData[0].value = item[0]
      // } else if (item[1]==2) {
      //   echarsData[1].value = item[0]
      // } else {
      //   echarsData[2].value = item[0]
      // }
      echarsData[item[1]-1].value = item[0]
      // arr[item[1]-1].money = item[3]
    })
    return echarsData
  }

  setOption = data=> {
    let echarsData = this.changeData(data)
    console.log(echarsData)
    this.myChart.setOption({
      ...this.option,
      series: [{
        type: 'pie',
        data: echarsData
      }]
    })
  }


  render(){
    return (
      <div
        style={this.props.pieStyle?{...this.props.pieStyle}:
          {width: 400, height: 350}
        }
        ref={ e=>this.main=e }></div>
    )
  }
}
