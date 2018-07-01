import React, { Component } from 'react'
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/toolbox'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import { Modal, Form, Input, Select, Button } from 'antd'

const FormItem = Form.Item
const Option = Select.Option

@Form.create()
export default class ModalCouOrderCount extends Component{

  config = {

  }

  state = {
    day: 0,
    isRunYear: false,
    year: null
  }

  renderOptionMouth =()=> {
    let Opntios = []
    for ( var i=0; i<12; i++ ) {
      Opntios.push(
        <Option key={i} value={i+1} >{i+1}月</Option>
      )
    }
    return Opntios
  }

  // 年份选择改变
  changeYear =value=> {
    // 判断年份平年还是闰年
    var a1=value%4==0
    var a2=value%100!=0
    var a3=value%400==0
    this.setState({
      isRunYear: (a1&&a2)||a3?true:false, //三目运算符
      year: value
    })
  }
  renderOptionDay =()=> {
    let Options = []
    for ( var i=0; i<this.state.day; i++ ) {
      Options.push(
        <Option key={i} value={i} >{i+1}号</Option>
      )
    }
    return Options
  }

  mouthChange =value=> {
    console.log(value)
    // 传入月份后判断天数显示多少天，1～7月 奇数31天 8～12月偶数31天
    if ( value <= 7 ) {
      if ( value%2===0 ) { //偶数
        this.setState({
          day: 30
        })
      } else {
        this.setState({
          day: 31
        })
      }
    } else if (value==2) {
      // 平年2月份只有28天， 闰年有29天
      this.setState({
        day: this.state.isRunYear?29:28
      })
    } else {
      if ( value%2===0 ) { //偶数
        this.setState({
          day: 31
        })
      } else {
        this.setState({
          day: 30
        })
      }
    }
  }

  search =()=>{
    const {year, month, day} = this.props.form.getFieldsValue(['year', 'month', 'day'])
    console.log(year, month, day)
  }

  render(){
    const { getFieldDecorator } = this.props.form
    return (
      <Modal
        width={700}
        title='快递员送单统计  '
        visible={true}
      >
        <div>dsad</div>
        <Form layout="inline">
          <FormItem label='年' >
            {getFieldDecorator('year', {})(
              //<Input style={{width: 100}} />
              <Select
                allowClear
                style={{width: 100}}
                onChange={this.changeYear}
              >
                <Option key={2018} value={2018} >2018年</Option>
                <Option key={2019} value={2019} >2019年</Option>
                <Option key={2020} value={2020} >2020年</Option>
                <Option key={2021} value={2021} >2021年</Option>
                <Option key={2022} value={2022} >2022年</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label='月' >
            {getFieldDecorator('month', {})(
              <Select
                disabled={this.state.year?false:true}
                onChange={this.mouthChange}
                allowClear
                style={{width: 100}} >
                {this.renderOptionMouth()}
              </Select>
            )}
          </FormItem>
          <FormItem label='日' >
            {getFieldDecorator('day', {})(
              <Select
                disabled={this.state.year?false:true}
                // onChange={this.renderOptionMouth}
                allowClear
                style={{width: 100}} >
                {this.renderOptionDay()}
              </Select>
            )}
          </FormItem>
          <FormItem>
            <Button
              onClick={ this.search }
              type='primary' >查询</Button>
          </FormItem>
        </Form>
      </Modal>
    )
  }
}
